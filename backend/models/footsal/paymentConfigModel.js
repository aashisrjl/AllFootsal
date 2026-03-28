module.exports = (sequelize, DataTypes) => {
  const FutsalPaymentConfig = sequelize.define(
    "futsal_payment_config",
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true
      },
      futsalId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "futsal_id"
      },
      gateway: {
        type: DataTypes.ENUM("khalti", "esewa"),
        allowNull: false
      },
      publicKey: {
        type: DataTypes.STRING(255),
        allowNull: true,
        field: "public_key"
      },
      secretEncrypted: {
        type: DataTypes.BLOB("medium"), // encrypted bytes
        allowNull: false,
        field: "secret_encrypted"
      },
      merchantCode: {
        type: DataTypes.STRING(100),
        allowNull: true,
        field: "merchant_code"
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        field: "is_active"
      },
      isLive: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        field: "is_live"
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize.literal("CURRENT_TIMESTAMP")
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize.literal("CURRENT_TIMESTAMP")
      }
    },
    {
      tableName: "futsal_payment_config",
      timestamps: false,
      indexes: [
        { name: "uq_futsal_gateway", unique: true, fields: ["futsal_id", "gateway"] },
        { name: "idx_futsal", fields: ["futsal_id"] }
      ]
    }
  );

  return FutsalPaymentConfig;
};