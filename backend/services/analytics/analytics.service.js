const { sequelize } = require('../../models');
const { QueryTypes } = require('sequelize');

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

    sequelize.query(
      `SELECT COUNT(*) as total FROM booking_${futsalCode}`,
      { type: QueryTypes.SELECT }
    ),

    sequelize.query(
      `SELECT SUM(t.price) as revenue 
       FROM booking_${futsalCode} b
       JOIN timeslot_${futsalCode} t ON b.timeslot_id = t.id`,
      { type: QueryTypes.SELECT }
    ),

    sequelize.query(
      `SELECT COUNT(DISTINCT user_id) as contactedUsers 
       FROM contact_${futsalCode}`,
      { type: QueryTypes.SELECT }
    ),

    sequelize.query(
      `SELECT p.name, COUNT(*) as bookings
       FROM booking_${futsalCode} b
       JOIN pitch_${futsalCode} p ON b.pitch_id = p.id
       GROUP BY b.pitch_id
       ORDER BY bookings DESC
       LIMIT 1`,
      { type: QueryTypes.SELECT }
    ),

    sequelize.query(
      `SELECT t.start_time, t.end_time, COUNT(*) as bookings
       FROM booking_${futsalCode} b
       JOIN timeslot_${futsalCode} t ON b.timeslot_id = t.id
       GROUP BY b.timeslot_id
       ORDER BY bookings DESC
       LIMIT 1`,
      { type: QueryTypes.SELECT }
    ),

    sequelize.query(
      `SELECT gateway, COUNT(*) as usage
       FROM payment_${futsalCode}
       GROUP BY gateway
       ORDER BY usage DESC
       LIMIT 1`,
      { type: QueryTypes.SELECT }
    ),

    sequelize.query(
      `SELECT rating, COUNT(*) as count
       FROM ratings_${futsalCode}
       GROUP BY rating`,
      { type: QueryTypes.SELECT }
    ),

    sequelize.query(
      `SELECT AVG(rating) as averageRating
       FROM ratings_${futsalCode}`,
      { type: QueryTypes.SELECT }
    ),

    sequelize.query(
      `SELECT review,
        CASE
          WHEN sentiment_score > 0.5 THEN 'positive'
          WHEN sentiment_score < 0.5 THEN 'negative'
          ELSE 'neutral'
        END as sentiment
       FROM ratings_${futsalCode}
       WHERE review IS NOT NULL AND review != ''`,
      { type: QueryTypes.SELECT }
    ),

    sequelize.query(
      `SELECT review, sentiment_score
       FROM ratings_${futsalCode}
       WHERE sentiment_score > 0.5
       ORDER BY sentiment_score DESC
       LIMIT 5`,
      { type: QueryTypes.SELECT }
    ),

    sequelize.query(
      `SELECT review, sentiment_score
       FROM ratings_${futsalCode}
       WHERE sentiment_score < 0.5
       ORDER BY sentiment_score ASC
       LIMIT 5`,
      { type: QueryTypes.SELECT }
    ),

    sequelize.query(
      `SELECT COUNT(DISTINCT user_id) as totalVisitors
       FROM visit_${futsalCode}`,
      { type: QueryTypes.SELECT }
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