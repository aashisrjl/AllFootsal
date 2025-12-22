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
      allowNull: true // Google login
    },

    googleId: {
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

    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },

    isVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  });

  return User;
};
