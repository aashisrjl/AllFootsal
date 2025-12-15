require('dotenv').config();

module.exports = {
  development: {
    client: 'mysql2',
    connection: {
      host: process.env.MARIADB_HOST || process.env.DB_HOST || 'mariadb',
      user: process.env.MARIADB_USER || process.env.DB_USER || 'footsal_user',
      password: process.env.MARIADB_PASSWORD || process.env.DB_PASSWORD || 'root',
      database: process.env.MARIADB_DATABASE || process.env.DB_NAME || 'footsal',
      port: Number(process.env.MARIADB_PORT || process.env.DB_PORT || 3306)
    },
    migrations: {
      directory: './migrations',
      tableName: 'knex_migrations'
    },
    seeds: {
      directory: './seeds'
    }
  },

  production: {
    client: 'mysql2',
    connection: {
      host: process.env.MARIADB_HOST || process.env.DB_HOST,
      user: process.env.MARIADB_USER || process.env.DB_USER,
      password: process.env.MARIADB_PASSWORD || process.env.DB_PASSWORD,
      database: process.env.MARIADB_DATABASE || process.env.DB_NAME,
      port: Number(process.env.MARIADB_PORT || process.env.DB_PORT || 3306)
    },
    migrations: {
      directory: './migrations',
      tableName: 'knex_migrations'
    },
    pool: {
      min: 2,
      max: 10
    }
  }
};
