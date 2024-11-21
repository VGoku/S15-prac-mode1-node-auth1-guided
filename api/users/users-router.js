// Import necessary modules
const router = require("express").Router() // Import and create a new Express router instance
const { protect } = require("../auth/auth-middleware") // Import the protect middleware for authentication
const Users = require("./users-model.js") // Import the Users model with database functions

// Define a GET route to fetch all users
// The protect middleware is used to protect this route, ensuring only authenticated users can access it
router.get("/", protect, (req, res, next) => {
  Users.find() // Use the Users model's find function to get all users
    .then(users => {
      res.status(200).json(users) // Send a response with status 200 and the list of users in JSON format
    })
    .catch(next) // Pass any errors to the next middleware (error handler)
})

// Export the router to be used in other parts of the application
module.exports = router
