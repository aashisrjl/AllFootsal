module.exports = (sequelize, DataTypes) => {
  const AdminNotification = sequelize.define("admin_notification", {
    type: {
      type: DataTypes.ENUM(
        "payment_failed",
        "subscription_issue",
        "user_report",
        "platform_alert",
        "system_error",
        "security_alert",
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
    severity: {
      type: DataTypes.ENUM("info", "warning", "critical"),
      defaultValue: "info",
    },
    related_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    related_type: {
      type: DataTypes.ENUM(
        "payment",
        "futsal",
        "user",
        "booking",
        "system"
      ),
      allowNull: true,
    },
    is_read: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  });

  return AdminNotification;
};
