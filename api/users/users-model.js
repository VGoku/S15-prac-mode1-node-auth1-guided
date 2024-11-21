// Import the database configuration
const db = require('../../database/db-config.js')

// Export the functions add, find, findBy, and findById for use in other modules
module.exports = {
  add,
  find,
  findBy,
  findById,
}

// Function to find all users, returning their id and username
function find() {
  return db('users').select('id', 'username')
}

// Function to find users based on a given filter
function findBy(filter) {
  return db('users').where(filter)
}

// Function to add a new user to the database
// Returns the newly added user by their id
async function add(user) {
  const [id] = await db('users').insert(user)
  return findById(id)
}

// Function to find a user by their id, returning the first matching user
function findById(id) {
  return db('users')
    .where({ id })
    .first()
}
