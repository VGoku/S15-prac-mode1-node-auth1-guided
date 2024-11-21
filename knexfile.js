module.exports = {
  development: {
    client: 'sqlite3', // Specify the database client to use (SQLite3 in this case)
    useNullAsDefault: true, // Use NULL as the default value for unspecified columns
    connection: {
      filename: './database/auth.db3', // Path to the SQLite database file
    },
    pool: {
      afterCreate: (conn, done) => {
        conn.run('PRAGMA foreign_keys = ON', done) // Enable foreign key support after creating a connection
      },
    },
    migrations: {
      directory: './database/migrations', // Directory to store database migration files
    },
    seeds: {
      directory: './database/seeds', // Directory to store database seed files
    },
  },
}
