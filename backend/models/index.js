const dbConfig = require("../config/dbConfig");
const { Sequelize, DataTypes } = require("sequelize");


// create database using sequelize
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  operatorsAliases: false,
  port: 3306,

  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle,
  },
});

sequelize
  .authenticate()
  .then(() => {
    console.log("CONNECTED!!");
  })
  .catch((err) => {
    console.log("Error" + err);
  });

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// importing model files 
db.footsal = require("./footsal/footsalModel.js")(sequelize, DataTypes);
db.users = require("./user/userModel.js")(sequelize, DataTypes);

db.sequelize.sync({ force: false}).then(() => {
  console.log("CONNECTED TO DATABASE!!!😊😉");
});

module.exports = db;