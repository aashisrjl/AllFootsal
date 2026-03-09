module.exports = (sequelize, DataTypes) => {
  const Payment = sequelize.define("footsal_payment", {
    footsal_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'footsals',
        key: 'id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    },
    subscription_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'footsal_subscriptions', // ensure this matches the tableName of subscription
        key: 'id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    payment_method: {
      type: DataTypes.ENUM("esewa", "khalti", "cash", "bank_transfer"),
      allowNull: false,
    },
    payment_status: {
      type: DataTypes.ENUM("pending", "completed", "failed", "refunded"),
      defaultValue: "pending",
    },
    transaction_id: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    remarks: {
      type: DataTypes.STRING,
      allowNull: true,
    }
  });

  return Payment;
};
