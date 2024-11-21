// Import necessary modules
const express = require("express"); // Express.js web framework
const bcrypt = require("bcryptjs"); // Password hashing library for securely storing passwords
const router = express.Router(); // Create an instance of an Express Router for route handling
const User = require("../users/users-model"); // User model for interacting with the database

// POST route for user registration
router.post("/register", async (req, res, next) => {
   try {
      // Destructure username and password from the request body
      const { username, password } = req.body;
      
      // Hash the password with bcrypt (8 rounds of salting and hashing)
      const hash = bcrypt.hashSync(password, 8); // 2 ^ 8 => 256 possible hashes

      // Prepare the new user object with the hashed password
      const newUser = { username, password: hash };
      
      // Add the new user to the database (using the `add` method from the User model)
      const result = await User.add(newUser);

      // Send a success response with a personalized message
      res.status(201).json({
         message: `nice to have you, ${result.username}`,
         //  You could log something to test connections here if needed, e.g.,
         //  res.json({ message: "register working" }) for checking.
      });
   } catch (err) {
      // If any error occurs, pass it to the next middleware (error handler)
      next(err);
   }
});

// POST route for user login
router.post("/login", async (req, res, next) => {
   try {
      // Destructure username and password from the request body
      const { username, password } = req.body;
      
      // Find the user by username from the database (returns an array, so destructure the first element)
      const [user] = await User.findBy({ username });
      
      // Check if the user exists and if the provided password matches the hashed password in the database
      if (user && bcrypt.compareSync(password, user.password)) {
         // If valid, store the user object in the session
         req.session.user = user;
         
         // Send a success response with a personalized message
         res.json({ message: `The great ${user.username}, is back!` });
         // You could also log something for testing, e.g., console.log("we should start a session for you")
      } else {
         // If the credentials are incorrect, pass an error to the next middleware
         next({ status: 401, message: "bad credentials" });
      }
   } catch (err) {
      // If any error occurs, pass it to the next middleware (error handler)
      next(err);
   }
});

// GET route for logging out the user
router.get("/logout", async (req, res, next) => { // eslint-disable-line
   // Check if the user is logged in (if session exists)
   if (req.session.user) {
      const { username } = req.session.user; // Get the logged-in user's username
      
      // Destroy the session to log the user out
      req.session.destroy(err => {
         if (err) {
            // If there's an error while destroying the session, send an error response
            res.json({ message: `You are stuck in hell!, ${username}` });
         } else {
            // Set the cookie expiration date to the past to remove the cookie from the browser
            res.set('Set-Cookie', 'monkey=; SameSite=Strict; Path=/; Expires=Thu, 01 Jan 1970 00:00:00');
            
            // Send a success response with a personalized logout message
            res.json({ message: `You may leave, ${username}` });
         }
      });
   } else {
      // If no user is logged in (no session), send a message saying the user is unknown
      res.json({ message: "I don't know you." });
   }
});

// Uncomment this line for testing logout working:
// res.json({ message: "logout working" });

// Export the router to use in the main server file
module.exports = router;
