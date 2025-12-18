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

// importing model files 
db.footsal = require("./footsal/footsalModel.js")(sequelize, DataTypes);
db.users = require("./user/userModel.js")(sequelize, DataTypes);
db.footsalLocation = require("./footsal/locationModel.js")(sequelize, DataTypes);
db.footsalAnalytics = require("./footsal/analyticsModel.js")(sequelize, DataTypes);
db.footsalInfo = require("./footsal/infoModel.js")(sequelize, DataTypes);
db.footsalSubscription = require("./footsal/subscriptionModel.js")(sequelize, DataTypes);
db.footsalPayment = require("./footsal/paymentModel.js")(sequelize, DataTypes);
db.footsalPitch = require("./footsal/pitchesModel.js")(sequelize, DataTypes);
db.footsalTimeSlot = require("./footsal/timeSlotModel.js")(sequelize, DataTypes);
db.footsalRating = require("./footsal/ratingModel.js")(sequelize, DataTypes);
db.footsalBooking = require("./footsal/bookingModel.js")(sequelize, DataTypes);
db.admin = require("./admin/adminModel.js")(sequelize, DataTypes);
db.footsalContact = require("./footsal/contactModel.js")(sequelize, DataTypes);
// Define associations

// Footsal one-to-one relationships
db.footsal.hasOne(db.footsalLocation, { foreignKey: 'footsal_id', as: 'location' });
db.footsalLocation.belongsTo(db.footsal, { foreignKey: 'footsal_id' });

db.footsal.hasOne(db.footsalAnalytics, { foreignKey: 'footsal_id', as: 'analytics' });
db.footsalAnalytics.belongsTo(db.footsal, { foreignKey: 'footsal_id' });

db.footsal.hasOne(db.footsalInfo, { foreignKey: 'footsal_id', as: 'info' });
db.footsalInfo.belongsTo(db.footsal, { foreignKey: 'footsal_id' });

// Footsal one-to-many relationships
db.footsal.hasMany(db.footsalSubscription, { foreignKey: 'footsal_id', as: 'subscriptions' });
db.footsalSubscription.belongsTo(db.footsal, { foreignKey: 'footsal_id' });

db.footsal.hasMany(db.footsalPayment, { foreignKey: 'footsal_id', as: 'payments' });
db.footsalPayment.belongsTo(db.footsal, { foreignKey: 'footsal_id' });

db.footsal.hasMany(db.footsalPitch, { foreignKey: 'footsal_id', as: 'pitches' });
db.footsalPitch.belongsTo(db.footsal, { foreignKey: 'footsal_id' });

db.footsal.hasMany(db.footsalRating, { foreignKey: 'footsal_id', as: 'ratings' });
db.footsalRating.belongsTo(db.footsal, { foreignKey: 'footsal_id' });

db.footsal.hasMany(db.footsalBooking, { foreignKey: 'footsal_id', as: 'bookings' });
db.footsalBooking.belongsTo(db.footsal, { foreignKey: 'footsal_id' });

// Subscription-Payment relationship
db.footsalSubscription.hasMany(db.footsalPayment, { foreignKey: 'subscription_id', as: 'payments' });
db.footsalPayment.belongsTo(db.footsalSubscription, { foreignKey: 'subscription_id' });

// Pitch relationships
db.footsalPitch.hasMany(db.footsalTimeSlot, { foreignKey: 'pitch_id', as: 'timeSlots' });
db.footsalTimeSlot.belongsTo(db.footsalPitch, { foreignKey: 'pitch_id' });

db.footsalPitch.hasMany(db.footsalBooking, { foreignKey: 'pitch_id', as: 'bookings' });
db.footsalBooking.belongsTo(db.footsalPitch, { foreignKey: 'pitch_id' });

// TimeSlot-Booking relationship
db.footsalTimeSlot.hasMany(db.footsalBooking, { foreignKey: 'time_slot_id', as: 'bookings' });
db.footsalBooking.belongsTo(db.footsalTimeSlot, { foreignKey: 'time_slot_id' });

// User relationships
db.users.hasMany(db.footsalRating, { foreignKey: 'user_id', as: 'ratings' });
db.footsalRating.belongsTo(db.users, { foreignKey: 'user_id' });

db.users.hasMany(db.footsalBooking, { foreignKey: 'user_id', as: 'bookings' });
db.footsalBooking.belongsTo(db.users, { foreignKey: 'user_id' });

// Payment-Booking relationship
db.footsalPayment.hasMany(db.footsalBooking, { foreignKey: 'payment_id', as: 'bookings' });
db.footsalBooking.belongsTo(db.footsalPayment, { foreignKey: 'payment_id' });

// Admin relationships
db.admin.hasMany(db.footsal, { foreignKey: 'admin_id', as: 'footsals' });
db.footsal.belongsTo(db.admin, { foreignKey: 'admin_id' });

// Contact relationships
db.footsal.hasOne(db.footsalContact, { foreignKey: 'footsal_id', as: 'contact' });
db.footsalContact.belongsTo(db.footsal, { foreignKey: 'footsal_id' });


db.sequelize.sync({ alter: false, force: false }).then(() => {
  console.log("✅ Database connection established! Use 'npm run migrate' to sync schema changes.");
});

module.exports = db;