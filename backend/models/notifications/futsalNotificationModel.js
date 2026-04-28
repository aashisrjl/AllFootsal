module.exports = (sequelize, DataTypes) => {
  const FutsalNotification = sequelize.define("futsal_notification", {
    futsal_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "footsals",
        key: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
    type: {
      type: DataTypes.ENUM(
        "booking_request",
        "booking_confirmed",
        "booking_cancelled",
        "payment_received",
        "payment_failed",
        "subscription_created",
        "subscription_activated",
        "subscription_expiring",
        "subscription_expired",
        "rating_posted",
        "forum_activity",
        "owner_verification",
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
        "rating",
        "forum",
        "subscription",
        "futsal"
      ),
      allowNull: true,
    },
    is_read: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  });

  return FutsalNotification;
};
