require('dotenv').config();
const fs = require('fs');

const dialectOptions = {};

// Enable SSL if explicitly configured, or when connecting to TiDB Cloud
const isSSL = process.env.DB_SSL === 'true' || (process.env.DB_HOST && process.env.DB_HOST.includes('tidbcloud.com'));

if (isSSL) {
  dialectOptions.ssl = {
    minVersion: 'TLSv1.2',
    rejectUnauthorized: true,
  };
  if (process.env.DB_CA_PATH && process.env.DB_CA_PATH !== '<CA_PATH>' && fs.existsSync(process.env.DB_CA_PATH)) {
    dialectOptions.ssl.ca = fs.readFileSync(process.env.DB_CA_PATH);
  }
}

module.exports = {
    DB:  process.env.DB_NAME,
    USER: process.env.DB_USER,
    PASSWORD: process.env.DB_PASSWORD,
    HOST:  process.env.DB_HOST,
    PORT: Number(process.env.DB_PORT || 3306),
    dialect: 'mysql',
    port: Number(process.env.DB_PORT || 3306),
    dialectOptions,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
  },
};

