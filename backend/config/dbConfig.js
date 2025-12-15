require('dotenv').config({ path: 'docker-mariadb-pma/.env' });

module.exports = {
  development: {
    username: process.env.MARIADB_USER,
    password: process.env.MARIADB_PASSWORD,
    database: process.env.MARIADB_DATABASE,
    host: process.env.MARIADB_HOST || 'mariadb',
    dialect: 'mysql',
   
  },
};
