// Import the knex library, which is used for SQL query building
const knex = require('knex')

// Import the database configuration settings from knexfile.js
const configs = require('../knexfile.js')

// Determine the current environment (development, production, etc.)
// If NODE_ENV is not set, default to 'development'
const env = process.env.NODE_ENV || 'development'

// Export a configured instance of knex, using the configuration settings
// for the current environment
module.exports = knex(configs[env])
