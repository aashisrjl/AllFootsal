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
      allowNull: false,
      References: {
        model: "users",
        key: "id",
      },
    },
    footsal_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
         References: {
        model: "footsals",
        key: "id",
      },
    },

    forum_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
        References: {
        model: "forums",
        key: "id",
        }
    },
  });

  return forumReply;
};