const dbConfig = require("../config/dbConfig");
const { Sequelize, DataTypes } = require("sequelize");


// create database using sequelize
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  operatorsAliases: false,
  port: dbConfig.PORT,

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

// //relations can be defined here

// db.User = require("./user/userModel")(sequelize, DataTypes);
// db.Footsal = require("./footsal/footsalModel")(sequelize, DataTypes);
// db.Subscription = require("./footsal/subscriptionModel")(sequelize, DataTypes);
// db.Analytics = require("./footsal/analyticsModel")(sequelize, DataTypes);

// // Define relationships
// db.Footsal.hasOne(db.Subscription, {foreignKey: "footsal_id", as: "subscription"});
// db.Subscription.belongsTo(db.Footsal, {foreignKey: "footsal_id"});

// db.Footsal.hasOne(db.Analytics, {foreignKey: "footsal_id", as: "analytics"});
// db.Analytics.belongsTo(db.Footsal, {foreignKey: "footsal_id"});

// // Sync database - use 'npm run migrate' to sync schema changes




db.sequelize.sync({ alter: false, force: true }).then(() => {
  console.log("✅ Database connection established! Use 'npm run migrate' to sync schema changes.");
});

module.exports = db;