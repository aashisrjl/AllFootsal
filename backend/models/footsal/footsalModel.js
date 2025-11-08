module.exports = (sequelize, DataTypes) => {
  const Footsal = sequelize.define("footsal", {
    // // Authentication & Identity
    // userId:{
    //   type: DataTypes.INTEGER,
    //   allowNull: false,
    //   references: {
    //     model: "users",
    //     key: "id",
    //   },
    //   onDelete: "CASCADE",
    //   onUpdate: "CASCADE",
    // },
    footsalCode: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: { isEmail: true },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    googleId: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    // Basic Info
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    footsalName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    images: {
      type: DataTypes.JSON,
      allowNull: true,
    },

    // Contact & Payment
    contact_phone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    contact_email: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    qr_payment_url: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    // Admin & Status
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  });

  return Footsal;
};
