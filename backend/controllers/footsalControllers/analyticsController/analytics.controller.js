const { getAnalyticsData } = require("../../../services/analytics/analytics.service");

const getAnalytics = async (req, res) => {
  try {
    const futsalCode = req.futsalCode;

    if (!/^[a-zA-Z0-9_]+$/.test(futsalCode)) {
      return res.status(400).json({
        success: false,
        message: "Invalid futsal code"
      });
    }

    const analytics = await getAnalyticsData(futsalCode);

    res.status(200).json({
      success: true,
      message: "Analytics fetched successfully",
      data: analytics
    });

  } catch (error) {
    console.error("Analytics Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch analytics"
    });
  }
};

module.exports = {
  getAnalytics
};

// const {sequelize} = require("../../../models");
// const {QueryTypes} = require("sequelize");

// const getAnalytics = async (req,res) => {
//     const futsalCode = req.futsalCode;

//     // total bookings
//     const totalBookings = await sequelize.query(
//         `SELECT COUNT(*) as total FROM booking_${futsalCode}`,
//         {
//             type: QueryTypes.SELECT,
//         }
//     );

//     // total revenue
//     const totalRevenue = await sequelize.query(
//         `SELECT SUM(price) as revenue FROM booking_${futsalCode} b JOIN timeslot_${futsalCode} t ON b.timeslot_id = t.id`,
//         {
//             type: QueryTypes.SELECT,
//         }
//     );

//     const contactedUsers = await sequelize.query(
//         `SELECT COUNT(DISTINCT user_id) as contactedUsers FROM contact_${futsalCode}`,
//         {
//             type: QueryTypes.SELECT,
//         }
//     );

//     //most booked pitch
//     const mostBookedPitch = await sequelize.query(
//         `SELECT p.name, COUNT(*) as bookings 
//          FROM booking_${futsalCode} b 
//          JOIN pitch_${futsalCode} p ON b.pitch_id = p.id 
//          GROUP BY b.pitch_id 
//          ORDER BY bookings DESC 
//          LIMIT 1`,
//         {
//             type: QueryTypes.SELECT,
//         }
//     );

//     const mostBookedTimeslot = await sequelize.query(
//         `SELECT t.start_time, t.end_time, COUNT(*) as bookings 
//          FROM booking_${futsalCode} b 
//          JOIN timeslot_${futsalCode} t ON b.timeslot_id = t.id 
//          GROUP BY b.timeslot_id 
//          ORDER BY bookings DESC 
//          LIMIT 1`,
//         {
//             type: QueryTypes.SELECT,
//         }
//     );
//     // i have bookingid in payment table so i can get the most used payment method by joining the booking and payment table and grouping by gateway of payment and ordering by count of booking id and limiting to 1
//     const mostUsedPaymentMethod = await sequelize.query(
//         `SELECT p.gateway, COUNT(*) as usage 
//          FROM booking_${futsalCode} b 
//          JOIN payment_${futsalCode} p ON b.id = p.booking_id 
//          GROUP BY p.gateway 
//          ORDER BY usage DESC 
//          LIMIT 1`,
//         {
//             type: QueryTypes.SELECT,
//         }
//     );

//     // rating and review counts
//     const ratingCounts = await sequelize.query(
//         `SELECT rating, COUNT(*) as count 
//          FROM ratings_${futsalCode} 
//          GROUP BY rating`,
//         {
//             type: QueryTypes.SELECT,
//         }
//     );

//     const reviewCounts = await sequelize.query(
//         `SELECT review, COUNT(*) as count 
//          FROM ratings_${futsalCode} 
//          WHERE review IS NOT NULL AND review != '' 
//          GROUP BY review`,
//         {
//             type: QueryTypes.SELECT,
//         }
//     );

//     const averageRating = await sequelize.query(
//         `SELECT AVG(rating) as averageRating 
//          FROM ratings_${futsalCode}`,
//         {
//             type: QueryTypes.SELECT,
//         }
//     );

//     const ratingDistribution = await sequelize.query(
//         `SELECT rating, COUNT(*) as count 
//          FROM ratings_${futsalCode} 
//          GROUP BY rating`,
//         {
//             type: QueryTypes.SELECT,
//         }
//     );

//     // i have sentiment score where the sentiment alalysis is done through logistic regression by and add into this column in rating table so i can get the sentiment analysis of the reviews by grouping the sentiment score into positive, negative based on the value of sentiment score where if the sentiment score is greater than 0.5 then it is positive if it is less than 0.5 then it is negative
//     const sentimentAnalysis = await sequelize.query(
//         `SELECT review, 
//                 CASE
//                     WHEN sentiment_score > 0.5 THEN 'positive'
//                     WHEN sentiment_score < 0.5 THEN 'negative'
//                     ELSE 'neutral'
//                 END as sentiment
//          FROM ratings_${futsalCode} 
//          WHERE review IS NOT NULL AND review != ''`,
//         {
//             type: QueryTypes.SELECT,
//         }
//     );

//     const topPositiveReviews = await sequelize.query(
//         `SELECT review, sentiment_score 
//          FROM ratings_${futsalCode} 
//          WHERE sentiment_score > 0.5 
//          ORDER BY sentiment_score DESC 
//          LIMIT 5`,
//         {
//             type: QueryTypes.SELECT,
//         }
//     );

//     const topNegativeReviews = await sequelize.query(
//         `SELECT review, sentiment_score 
//          FROM ratings_${futsalCode} 
//          WHERE sentiment_score < 0.5 
//          ORDER BY sentiment_score ASC 
//          LIMIT 5`,
//         {
//             type: QueryTypes.SELECT,
//         }
//     );

//     const getVisitors = await sequelize.query(
//         `SELECT COUNT(DISTINCT user_id) as totalVisitors FROM visit_${futsalCode}`,
//         {
//             type: QueryTypes.SELECT,
//         }
//     );

//     const getVisitorAnalytics = await sequelize.query(
//         `SELECT 
//             (SELECT COUNT(*) FROM booking_${futsalCode}) as totalBookings,
//             (SELECT SUM(price) FROM booking_${futsalCode} b JOIN timeslot_${futsalCode} t ON b.timeslot_id = t.id) as totalRevenue,
//             (SELECT COUNT(DISTINCT user_id) FROM contact_${futsalCode}) as contactedUsers,
//             (SELECT p.name FROM booking_${futsalCode} b JOIN pitch_${futsalCode} p ON b.pitch_id = p.id GROUP BY b.pitch_id ORDER BY COUNT(*) DESC LIMIT 1) as mostBookedPitch,
//             (SELECT CONCAT(t.start_time, ' - ', t.end_time) FROM booking_${futsalCode} b JOIN timeslot_${futsalCode} t ON b.timeslot_id = t.id GROUP BY b.timeslot_id ORDER BY COUNT(*) DESC LIMIT 1) as mostBookedTimeslot,
//             (SELECT p.gateway FROM booking_${futsalCode} b JOIN payment_${futsalCode} p ON b.id = p.booking_id GROUP BY p.gateway ORDER BY COUNT(*) DESC LIMIT 1) as mostUsedPaymentMethod,
//             (SELECT AVG(rating) FROM ratings_${futsalCode}) as averageRating
//         `,
//         {
//             type: QueryTypes.SELECT,
//         }
//     );

//     res.status(200).json({
//         success:true,
//         message:"Analytics fetched successfully",
//         data:{
//             totalBookings: totalBookings[0].total || 0,
//             totalRevenue: totalRevenue[0].revenue || 0,
//             contactedUsers: contactedUsers[0].contactedUsers || 0,
//             mostBookedPitch: mostBookedPitch[0] || null,
//             mostBookedTimeslot: mostBookedTimeslot[0] || null,
//             mostUsedPaymentMethod: mostUsedPaymentMethod[0] || null,
//             ratingCounts: ratingCounts || [],
//             reviewCounts: reviewCounts || [],
//             averageRating: averageRating[0].averageRating || 0,
//             ratingDistribution: ratingDistribution || [],
//             sentimentAnalysis: sentimentAnalysis || [],
//             topPositiveReviews: topPositiveReviews || [],
//             topNegativeReviews: topNegativeReviews || [],
//             totalVisitors: getVisitors[0].totalVisitors || 0,
//             visitorAnalytics: getVisitorAnalytics[0] || null,
//         }
//     })
// }

// module.exports = {
//     getAnalytics
// }
