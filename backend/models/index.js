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
    console.log("DATABASE CONNECTED!!");
  })
  .catch((err) => {
    console.log("Error" + err);
  });

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// //relations can be defined here
db.User = require("./user/userModel")(sequelize, DataTypes);

db.Footsal = require("./footsal/footsalModel")(sequelize, DataTypes);
db.Subscription = require("./footsal/subscriptionModel")(sequelize, DataTypes);
db.Analytics = require("./footsal/analyticsModel")(sequelize, DataTypes);
db.Payment = require("./footsal/paymentModel")(sequelize, DataTypes);
db.FutsalPaymentConfig = require("./footsal/paymentConfigModel")(sequelize, DataTypes);

// Futsal → Subscription
db.Footsal.hasOne(db.Subscription, {
  foreignKey: "footsal_id",
  as: "subscription"
});

db.Subscription.belongsTo(db.Footsal, {
  foreignKey: "footsal_id"
});

// Futsal → Analytics
db.Footsal.hasOne(db.Analytics, {
  foreignKey: "footsal_id",
  as: "analytics"
});

db.Analytics.belongsTo(db.Footsal, {
  foreignKey: "footsal_id"
});

// Subscription → Payment (One-to-Many)
db.Subscription.hasMany(db.Payment, {
  foreignKey: "subscription_id",
  as: "payments"
});

db.Payment.belongsTo(db.Subscription, {
  foreignKey: "subscription_id"
});

// Futsal → Payment
db.Footsal.hasMany(db.Payment, {
  foreignKey: "footsal_id",
  as: "payments"
});

db.Payment.belongsTo(db.Footsal, {
  foreignKey: "footsal_id"
});

// Futsal → Payment Config
db.Footsal.hasOne(db.FutsalPaymentConfig, {
  foreignKey: "footsal_id",
  as: "paymentConfig"
});

db.FutsalPaymentConfig.belongsTo(db.Footsal, {
  foreignKey: "footsal_id"
});


//forum
db.Forum = require("./forum/forumModel")(sequelize, DataTypes);
db.ForumReply = require("./forum/forumReplyModel")(sequelize, DataTypes);
db.ForumLike = require("./forum/forumLikeModel")(sequelize, DataTypes);

// Forum → ForumReply
db.Forum.hasMany(db.ForumReply, {
  foreignKey: "forum_id",
  as: "replies"
});

db.ForumReply.belongsTo(db.Forum, {
  foreignKey: "forum_id"
});

// Forum → ForumLike
db.Forum.hasMany(db.ForumLike, {
  foreignKey: "forum_id",
  as: "likes"
});

db.ForumLike.belongsTo(db.Forum, {
  foreignKey: "forum_id"
});

// ForumReply → ForumLike
db.ForumReply.hasMany(db.ForumLike, {
  foreignKey: "reply_id",
  as: "likes"
});

db.ForumLike.belongsTo(db.ForumReply, {
  foreignKey: "reply_id"
});

// Notifications
db.UserNotification = require("./notifications/userNotificationModel")(sequelize, DataTypes);
db.FutsalNotification = require("./notifications/futsalNotificationModel")(sequelize, DataTypes);
db.AdminNotification = require("./notifications/adminNotificationModel")(sequelize, DataTypes);

// User → UserNotification (One-to-Many)
db.User.hasMany(db.UserNotification, {
  foreignKey: "user_id",
  as: "notifications"
});

db.UserNotification.belongsTo(db.User, {
  foreignKey: "user_id"
});

// Futsal → FutsalNotification (One-to-Many)
db.Footsal.hasMany(db.FutsalNotification, {
  foreignKey: "futsal_id",
  as: "notifications"
});

db.FutsalNotification.belongsTo(db.Footsal, {
  foreignKey: "futsal_id"
});

db.sequelize.sync({ force: false }).then(() => {
  console.log("✅ Database connection established! Use 'npm run migrate' to sync schema changes.");
});

module.exports = db;