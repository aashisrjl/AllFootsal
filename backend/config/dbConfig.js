require('dotenv').config({ path: 'docker-mariadb-pma/.env' });

module.exports = {
    DB:  process.env.DB_NAME,
    USER: process.env.DB_USER,
    PASSWORD: process.env.DB_PASSWORD,
    HOST:  process.env.DB_HOST,
    PORT: Number(process.env.DB_PORT || 3306),
    dialect: 'mysql',
    port: Number(process.env.DB_PORT || 3306),
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
  },
};
