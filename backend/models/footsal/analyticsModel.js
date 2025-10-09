module.exports = (sequelize, DataTypes) => {
  const Analytics = sequelize.define("footsal_analytics", {
    footsal_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'footsals',
        key: 'id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    },
    avg_rating: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },
    total_bookings: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    total_revenue: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0,
    },
    review_summary: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    last_booking_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  });

  return Analytics;
};
