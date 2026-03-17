// models/forum.js
module.exports = (sequelize, DataTypes) => {
  const Forum = sequelize.define("forum", {
    title: DataTypes.STRING,
    slug: DataTypes.STRING,
    content: DataTypes.TEXT,

    category: {
      type: DataTypes.ENUM("Announcement", "General", "Help"),
      defaultValue: "General"
    },

    user_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },

    futsal_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },

    is_locked: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },

    is_pinned: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },

    views_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  });

  return Forum;
};