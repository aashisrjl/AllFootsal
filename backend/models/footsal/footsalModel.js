module.exports = (sequelize, DataTypes) => {
  const Footsal = sequelize.define("footsal", {
    // Authentication & Identity
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
      allowNull: true, // null if using Google/Facebook login
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
    // Array of images
    images: {
      type: DataTypes.JSON, // Store array of image URLs
      allowNull: true,
    },
    // Location Info
    district: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    latitude: {
      type: DataTypes.DECIMAL(10, 7),
      allowNull: true,
    },
    longitude: {
      type: DataTypes.DECIMAL(10, 7),
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
      defaultValue: false, // admin approval required
    },
    subscription_status: {
      type: DataTypes.STRING, // e.g., 'active', 'expired', 'pending'
      defaultValue: "pending",
    },

    // AI & Analytics Fields (optional, for future use)
    avg_rating: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },
    review_summary: {
      type: DataTypes.TEXT, // summarized by AI later
      allowNull: true,
    },

    //subscription details
    subscription_plan: {
      type: DataTypes.ENUM("monthly", "half-yearly", "yearly"),
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
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    payment_status: {
      type: DataTypes.ENUM("pending", "paid", "expired"),
      defaultValue: "pending",
    },
  });

  return Footsal;
};
