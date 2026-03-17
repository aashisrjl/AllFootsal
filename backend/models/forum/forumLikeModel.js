// models/like.js
module.exports = (sequelize, DataTypes) => {
  const ForumLike = sequelize.define("forumLike", {
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    futsal_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },

    forum_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },

    reply_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    
  });

  return ForumLike;
};