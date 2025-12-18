require('dotenv').config({ path: 'docker-mariadb-pma/.env' });

module.exports = {
  development: {
    client: 'mysql2',
    connection: {
     host: process.env.DB_HOST || process.env.MARIADB_HOST,
     user: process.env.DB_USER || process.env.MARIADB_USER,
     password: process.env.DB_PASSWORD || process.env.MARIADB_PASSWORD,
     database: process.env.DB_NAME || process.env.MARIADB_DATABASE,
     port: Number(process.env.DB_PORT || process.env.MARIADB_PORT || 3306)
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
      host: process.env.DB_HOST || process.env.MARIADB_HOST,
      user: process.env.DB_USER || process.env.MARIADB_USER,
      password: process.env.DB_PASSWORD || process.env.MARIADB_PASSWORD,
      database: process.env.DB_NAME || process.env.MARIADB_DATABASE,
      port: Number(process.env.DB_PORT || process.env.MARIADB_PORT || 3306)
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
