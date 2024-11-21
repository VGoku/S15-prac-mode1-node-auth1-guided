// Import required modules
const path = require('path'); // For handling and transforming file paths
const express = require('express'); // Web framework for Node.js
const session = require("express-session"); // Middleware for session management
const Store = require("connect-session-knex")(session) // Session store backed by Knex.js (SQL database)
const authRouter = require("./auth/auth-router"); // Router for authentication-related routes
const usersRouter = require('./users/users-router.js'); // Router for users-related routes

// Create an instance of an Express app
const server = express();

// Serve static files (client-side assets) from the 'client' folder
server.use(express.static(path.join(__dirname, '../client')));

// Middleware to parse incoming JSON request bodies
server.use(express.json());

// Set up session management
server.use(session({
  name: "monkey", // Name of the session cookie
  secret: "keep it secret", // Secret key used for signing the session ID cookie
  cookie: {
    maxAge: 1000 * 60 * 60, // Cookie expires in 1 hour
    secure: false, // Indicates if the cookie should only be sent over HTTPS (false means HTTP is fine)
    httpOnly: false, // If true, prevents client-side JavaScript from accessing the cookie
  },
  rolling: true, // Makes the session cookie's expiration time extend with each request
  resave: false, // Don't resave the session if it wasn't modified
  saveUninitialized: false, // Don't save uninitialized sessions
  store: new Store({
    knex: require("../database/db-config"), // Knex.js instance for database connections
    tablename: "sessions", // Name of the table in the database where sessions will be stored
    sendFilename: "sid", // The name of the session ID column in the database
    createtable: true, // Automatically create the sessions table if it doesn't exist
    clearInterval: 1000 * 60 * 60, // Clear expired sessions every hour
  })
}));

// Use the authentication routes for requests starting with '/api/auth'
server.use("/api/auth", authRouter);

// Use the user-related routes for requests starting with '/api/users'
server.use('/api/users', usersRouter);

// Serve the index.html file for the root path
server.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../client', 'index.html')); // Send the main HTML file for the frontend
});

// Middleware to handle undefined routes (404 error handler)
server.use('*', (req, res, next) => {
  next({ status: 404, message: 'not found!' }); // If the route isn't found, pass a 404 error
});

// Global error handling middleware
server.use((err, req, res, next) => { // eslint-disable-line
  res.status(err.status || 500).json({
    message: err.message, // Provide the error message
    stack: err.stack, // Provide the error stack for debugging (only in development)
  });
});

// Export the server instance so it can be used elsewhere (e.g., in tests or as the entry point)
module.exports = server;
