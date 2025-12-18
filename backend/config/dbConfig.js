require('dotenv').config({ path: 'docker-mariadb-pma/.env' });

module.exports = {
    DB:  process.env.DB_NAME || process.env.MARIADB_DATABASE,
    USER: process.env.DB_USER || process.env.MARIADB_USER,
    PASSWORD: process.env.DB_PASSWORD || process.env.MARIADB_PASSWORD,
    HOST:  process.env.DB_HOST ||  process.env.MARIADB_HOST || 'mariadb' ,
    PORT: Number(process.env.DB_PORT || process.env.MARIADB_PORT  || 3306),
    dialect: 'mysql',
    port: Number(process.env.DB_PORT || process.env.MARIADB_PORT  || 3306),
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
  },
};
