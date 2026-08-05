module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define("user", {
    username: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: { isEmail: true }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: true
    },
    phoneNumber:{
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
      validate: { isNumeric: true },
      len : [10,10]
    },
    googleId: {
      type: DataTypes.STRING,
      allowNull: true
    },
    facebookId: {
      type: DataTypes.STRING,
      allowNull: true
    },
    profileImage: {
      type: DataTypes.STRING,
      allowNull: true
    },
    role: {
      type: DataTypes.ENUM("user"),
      defaultValue: "user"
    },
    device:{
      type: DataTypes.STRING,
      allowNull: true
    },
    location:{
      type: DataTypes.STRING,
      allowNull: true
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    isVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },

    //settings
    notifications: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    darkMode: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },

    // For password reset
    resetPasswordToken: {
      type: DataTypes.STRING,
      allowNull: true
    },
    resetPasswordExpires: {
      type: DataTypes.DATE,
      allowNull: true
    }
  });

  return User;
};
