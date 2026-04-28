module.exports = (sequelize, DataTypes) => {
  const UserNotification = sequelize.define("user_notification", {
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
    type: {
      type: DataTypes.ENUM(
        "booking_created",
        "booking_confirmed",
        "booking_rejected",
        "booking_cancelled",
        "payment_completed",
        "review_posted",
        "forum_reply",
        "subscription_expiring",
        "verification_required",
        "general_notification"
      ),
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    related_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    related_type: {
      type: DataTypes.ENUM(
        "booking",
        "payment",
        "review",
        "forum",
        "subscription",
        "user"
      ),
      allowNull: true,
    },
    is_read: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  });

  return UserNotification;
};
