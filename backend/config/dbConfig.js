module.exports = {
    HOST: process.env.DB_HOST || "db",
    USER: process.env.DB_USER || "footsal_user",
    PASSWORD: process.env.DB_PASSWORD || "root",
    DB: process.env.DB_NAME || "footsal",
    dialect: "mysql",
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  };