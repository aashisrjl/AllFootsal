module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define("user", {
    // Basic Info
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
      allowNull: true // null when using Google login
    },
    googleId: {
      type: DataTypes.STRING,
      allowNull: true
    },

    // Optional fields
    profile_image: {
      type: DataTypes.STRING,
      allowNull: true // for storing Cloudinary URL or profile picture
    },

    // Booking and System Info
    currentOrgNumber: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },

    // Roles
    role: {
      type: DataTypes.ENUM("user"),
      defaultValue: "user"
    },

    // Account Status
    is_active: {
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
