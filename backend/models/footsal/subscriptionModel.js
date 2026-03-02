module.exports = (sequelize, DataTypes) => {
  const Subscription = sequelize.define("footsal_subscription", {
    // footsal_id: {
    //   type: DataTypes.INTEGER,
    //   allowNull: false,
    //   references: {
    //     model: 'footsals',
    //     key: 'id'
    //   },
    //   onDelete: 'CASCADE',
    //   onUpdate: 'CASCADE'
    // },
    subscription_plan: {
      type: DataTypes.ENUM("trial","monthly", "half-yearly", "yearly"),
      defaultValue: "monthly",
    },
    subscription_start: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    subscription_end: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    subscription_fee: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM("trial","pending", "active", "expired", "cancelled"),
      defaultValue: "pending",
    },
    auto_renew: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    is_trial:{
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  });

  return Subscription;
};
