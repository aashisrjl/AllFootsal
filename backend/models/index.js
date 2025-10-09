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
db.footsalLocation = require("./footsal/locationModel.js")(sequelize, DataTypes);
db.footsalAnalytics = require("./footsal/analyticsModel.js")(sequelize, DataTypes);
db.footsalSubscription = require("./footsal/subscriptionModel.js")(sequelize, DataTypes);
db.footsalPayment = require("./footsal/paymentModel.js")(sequelize, DataTypes);

// Define associations
db.footsal.hasOne(db.footsalLocation, { foreignKey: 'footsal_id', as: 'location' });
db.footsalLocation.belongsTo(db.footsal, { foreignKey: 'footsal_id' });

db.footsal.hasOne(db.footsalAnalytics, { foreignKey: 'footsal_id', as: 'analytics' });
db.footsalAnalytics.belongsTo(db.footsal, { foreignKey: 'footsal_id' });

db.footsal.hasMany(db.footsalSubscription, { foreignKey: 'footsal_id', as: 'subscriptions' });
db.footsalSubscription.belongsTo(db.footsal, { foreignKey: 'footsal_id' });

db.footsal.hasMany(db.footsalPayment, { foreignKey: 'footsal_id', as: 'payments' });
db.footsalPayment.belongsTo(db.footsal, { foreignKey: 'footsal_id' });

db.footsalSubscription.hasMany(db.footsalPayment, { foreignKey: 'subscription_id', as: 'payments' });
db.footsalPayment.belongsTo(db.footsalSubscription, { foreignKey: 'subscription_id' });

db.sequelize.sync({ force: false}).then(() => {
  console.log("CONNECTED TO DATABASE!!!😊😉");
});

module.exports = db;