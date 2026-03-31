module.exports = (sequelize, DataTypes) => {
  const Footsal = sequelize.define("footsal", {
    futsalCode: {
      type: DataTypes.INTEGER,
      unique: true,
      allowNull: false
    },

    futsalName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      // validate: { isEmail: true }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: true
    },

    googleId: {
      type: DataTypes.STRING,
      allowNull: true
    },

    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: false
    },

    role: {
      type: DataTypes.ENUM("futsal"),
      defaultValue: "futsal"
    },

    ownerName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    ownerEmail:{
      type: DataTypes.STRING,
      allowNull: true,
      unique: false,
      // validate: { isEmail: true }
    },
    // logo:{
    //   type: DataTypes.STRING,
    //   allowNull: true
    // },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },

    isVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  });

  return Footsal;
};
