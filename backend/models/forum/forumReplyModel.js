// models/reply.js
module.exports = (sequelize, DataTypes) => {
  const forumReply = sequelize.define("forumReply", {
    content: DataTypes.TEXT,

    is_solution: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },

    user_id: {
      type: DataTypes.INTEGER,
      references: {
        model: "users",
        key: "id",
      },
      allowNull: true
    },
    footsal_id: {
      type: DataTypes.INTEGER,
      references: {
        model: "footsals",
        key: "id",
      },
      allowNull: true
    },

    forum_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "forums",
        key: "id",
      }
    },
  });

  return forumReply;
};