// Import the server configuration from the 'api' folder
const server = require('./api/server.js')

// Define the port on which the server will listen
// Use the value from the environment variable PORT if available, otherwise default to 9000
const port = process.env.PORT || 9000

// Start the server and listen on the specified port
server.listen(port, () => {
  console.log(`\n** Running on port ${port} **\n`) // Log a message when the server is running
})
