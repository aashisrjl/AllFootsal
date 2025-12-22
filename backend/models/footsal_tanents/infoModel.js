module.exports = (sequelize, DataTypes) => {
  const Info = sequelize.define("footsal_info", {
    footsal_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: "footsals",
        key: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
    established_year: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    facilities: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    operating_hours: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    social_links: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    website_url: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    parking_info: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    additional_info: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    note: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  });
  return Info;
};
