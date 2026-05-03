const { sequelize } = require('../../models');
const { QueryTypes } = require('sequelize');

const tableExists = async (tableName) => {
  const result = await sequelize.query(
    `SELECT COUNT(*) as count FROM information_schema.tables WHERE table_schema = DATABASE() AND table_name = :tableName`,
    {
      replacements: { tableName },
      type: QueryTypes.SELECT,
    }
  );
  return result[0]?.count > 0;
};

const queryOrDefault = async (tableNames, query, defaultValue, replacements = {}) => {
  const exists = await Promise.all(tableNames.map((name) => tableExists(name)));
  if (!exists.every(Boolean)) {
    return defaultValue;
  }
  try {
    return await sequelize.query(query, { replacements, type: QueryTypes.SELECT });
  } catch (error) {
    console.warn(`Analytics query failed for tables [${tableNames.join(", ")}]:`, error.message);
    return defaultValue;
  }
};

const getAnalyticsData = async (futsalCode) => {

  const [
    totalBookings,
    totalRevenue,
    contactedUsers,
    mostBookedPitch,
    mostBookedTimeslot,
    mostUsedPaymentMethod,
    ratingCounts,
    averageRating,
    sentimentAnalysis,
    topPositiveReviews,
    topNegativeReviews,
    totalVisitors
  ] = await Promise.all([

    queryOrDefault(
      [`booking_${futsalCode}`],
      `SELECT COUNT(*) as total FROM booking_${futsalCode}`,
      [{ total: 0 }]
    ),

    queryOrDefault(
      [`booking_${futsalCode}`, `timeslot_${futsalCode}`],
      `SELECT SUM(t.price) as revenue 
       FROM booking_${futsalCode} b
       JOIN timeslot_${futsalCode} t ON b.timeslot_id = t.id`,
      [{ revenue: 0 }]
    ),

    queryOrDefault(
      [`contact_${futsalCode}`],
      `SELECT COUNT(*) as contactedUsers 
       FROM contact_${futsalCode}`,
      [{ contactedUsers: 0 }]
    ),

    queryOrDefault(
      [`booking_${futsalCode}`, `pitch_${futsalCode}`],
      `SELECT p.name, COUNT(*) as bookings
       FROM booking_${futsalCode} b
       JOIN pitch_${futsalCode} p ON b.pitch_id = p.id
       GROUP BY b.pitch_id
       ORDER BY bookings DESC
       LIMIT 1`,
      []
    ),

    queryOrDefault(
      [`booking_${futsalCode}`, `timeslot_${futsalCode}`],
      `SELECT t.start_time, t.end_time, COUNT(*) as bookings
       FROM booking_${futsalCode} b
       JOIN timeslot_${futsalCode} t ON b.timeslot_id = t.id
       GROUP BY b.timeslot_id
       ORDER BY bookings DESC
       LIMIT 1`,
      []
    ),

    queryOrDefault(
      [`payment_${futsalCode}`],
      `SELECT gateway, COUNT(*) as usage
       FROM payment_${futsalCode}
       GROUP BY gateway
       ORDER BY usage DESC
       LIMIT 1`,
      []
    ),

    queryOrDefault(
      [`ratings_${futsalCode}`],
      `SELECT rating, COUNT(*) as count
       FROM ratings_${futsalCode}
       GROUP BY rating`,
      []
    ),

    queryOrDefault(
      [`ratings_${futsalCode}`],
      `SELECT AVG(rating) as averageRating
       FROM ratings_${futsalCode}`,
      [{ averageRating: 0 }]
    ),

    queryOrDefault(
      [`ratings_${futsalCode}`],
      `SELECT review,
        CASE
          WHEN sentiment_score > 0.5 THEN 'positive'
          WHEN sentiment_score < 0.5 THEN 'negative'
          ELSE 'neutral'
        END as sentiment
       FROM ratings_${futsalCode}
       WHERE review IS NOT NULL AND review != ''`,
      []
    ),

    queryOrDefault(
      [`ratings_${futsalCode}`],
      `SELECT review, sentiment_score
       FROM ratings_${futsalCode}
       WHERE sentiment_score > 0.5
       ORDER BY sentiment_score DESC
       LIMIT 5`,
      []
    ),

    queryOrDefault(
      [`ratings_${futsalCode}`],
      `SELECT review, sentiment_score
       FROM ratings_${futsalCode}
       WHERE sentiment_score < 0.5
       ORDER BY sentiment_score ASC
       LIMIT 5`,
      []
    ),

    queryOrDefault(
      [`visit_${futsalCode}`],
      `SELECT COUNT(DISTINCT user_id) as totalVisitors
       FROM visit_${futsalCode}`,
      [{ totalVisitors: 0 }]
    )
  ]);

  return {
    totalBookings: totalBookings[0]?.total || 0,
    totalRevenue: totalRevenue[0]?.revenue || 0,
    contactedUsers: contactedUsers[0]?.contactedUsers || 0,
    mostBookedPitch: mostBookedPitch[0] || null,
    mostBookedTimeslot: mostBookedTimeslot[0] || null,
    mostUsedPaymentMethod: mostUsedPaymentMethod[0] || null,
    ratingDistribution: ratingCounts || [],
    averageRating: averageRating[0]?.averageRating || 0,
    sentimentAnalysis: sentimentAnalysis || [],
    topPositiveReviews: topPositiveReviews || [],
    topNegativeReviews: topNegativeReviews || [],
    totalVisitors: totalVisitors[0]?.totalVisitors || 0
  };
};

module.exports = {
  getAnalyticsData
};