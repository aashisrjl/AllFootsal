const { sequelize, Footsal } = require("../../../models");
const { QueryTypes } = require("sequelize");
const { ML_URL } = process.env;
const axios = require("axios");
const { createFutsalNotification } = require("../../../services/notifications/notificationService");

const resolveRatingTenantCode = async (req) => {
  const codeFromReq = req.futsalCode || req.tenant?.code || req.tanent?.code;
  if (codeFromReq) return codeFromReq;

  const futsalId = req.params?.futsalId;
  if (!futsalId) return null;

  const futsal = await Footsal.findOne({ where: { id: futsalId } });
  if (futsal?.futsalCode) return futsal.futsalCode;

  const futsalByCode = await Footsal.findOne({ where: { futsalCode: futsalId } });
  return futsalByCode?.futsalCode || null;
};

// futsal side ratings and review controller
const getRatings = async (req, res) => {
  try {
    const futsalCode = req.futsalCode;
    const ratings = await sequelize.query(
      `SELECT r.id, r.rating, r.review, r.sentiment_score, r.sentiment_label, r.created_at AS createdAt, u.username AS reviewerName
       FROM rating_${futsalCode} r
       JOIN users u ON r.user_id = u.id
       ORDER BY r.created_at DESC`,
      {
        type: QueryTypes.SELECT,
      }
    );

    if (!ratings[0]) {
      return res.status(200).json({
        success: true,
        message: "No ratings found for this futsal",
        data: [],
      });
    }

    return res.status(200).json({
      success: true,
      message: "Ratings fetched successfully",
      data: ratings,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// by user side, post rating and review for a futsal
const postRating = async (req, res) => {
  try {
    const code = await resolveRatingTenantCode(req);
    const userId = req.userId;
    const { rating, review } = req.body;

    if (!code) {
      return res.status(404).json({
        success: false,
        message: "Futsal not found",
      });
    }

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: "Rating must be between 1 and 5",
      });
    }

    if (!review || !String(review).trim()) {
      return res.status(400).json({
        success: false,
        message: "Review text is required before sentiment analysis",
      });
    }

    // check the sentiment of the review
    const sentiment = await axios.get(ML_URL + "/api/sentiment/predict", {
      params: { text: review },
    });
    console.log(sentiment.data);

    await sequelize.query(
      `INSERT INTO rating_${code} (user_id, rating, review,sentiment_score,sentiment_label)
       VALUES (?, ?, ?,? ,?)
       ON DUPLICATE KEY UPDATE rating = VALUES(rating), review = VALUES(review),sentiment_score = VALUES(sentiment_score),sentiment_label = VALUES(sentiment_label)`,
      {
        replacements: [userId, rating, review ?? null, sentiment.data.confidence, sentiment.data.sentiment],
        type: QueryTypes.INSERT,
      }
    );

    // Notify the futsal owner about the new review - fire and forget
    setImmediate(async () => {
      try {
        const futsalRecord = await Footsal.findOne({ where: { futsalCode: code } });
        if (futsalRecord) {
          const stars = '⭐'.repeat(Math.min(rating, 5));
          const reviewPreview = review ? `"${review.substring(0, 80)}${review.length > 80 ? '...' : ''}"` : 'No text.';
          await createFutsalNotification({
            futsalId: futsalRecord.id,
            type: "new_review",
            title: `New Review Received ${stars}`,
            message: `A user left a ${rating}-star review: ${reviewPreview}`,
            relatedType: "review",
          });
        }
      } catch (e) { /* silent */ }
    });

    return res.status(201).json({
      success: true,
      message: "Rating and review posted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

const updateRating = async (req, res) => {
  try {
    const code = await resolveRatingTenantCode(req);
    const userId = req.userId;
    const { rating, review } = req.body;

    if (!code) {
      return res.status(404).json({
        success: false,
        message: "Futsal not found",
      });
    }

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: "Rating must be between 1 and 5",
      });
    }

    if (!review || !String(review).trim()) {
      return res.status(400).json({
        success: false,
        message: "Review text is required before sentiment analysis",
      });
    }
    // check the sentiment of the review
    const sentiment = await axios.get(ML_URL + "/api/sentiment/predict", {
      params: { text: review },
    });
    console.log(sentiment.data);

    const [_, meta] = await sequelize.query(
      `UPDATE rating_${code}
       SET rating = ?, review = ?,sentiment_score = ?,sentiment_label = ?
       WHERE user_id = ?`,
      {
        replacements: [rating, review ?? null, sentiment.data.confidence, sentiment.data.sentiment, userId],
        type: QueryTypes.UPDATE,
      }
    );

    const affectedRows = typeof meta === "number" ? meta : meta?.affectedRows;
    if (!affectedRows) {
      return res.status(404).json({
        success: false,
        message: "No rating found for this user",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Rating and review updated successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

const deleteRating = async (req, res) => {
  try {
    const code = await resolveRatingTenantCode(req);
    const userId = req.userId;

    if (!code) {
      return res.status(404).json({
        success: false,
        message: "Futsal not found",
      });
    }

    await sequelize.query(
      `DELETE FROM rating_${code}
       WHERE user_id = ?`,
      {
        replacements: [userId],
        type: QueryTypes.DELETE,
      }
    );

    return res.status(200).json({
      success: true,
      message: "Rating and review deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

const deleteRatingByAdmin = async (req, res) => {
  try {
    const futsalCode = req.futsalCode;
    const ratingId = req.params.ratingId;

    await sequelize.query(
      `DELETE FROM rating_${futsalCode}
       WHERE id = ?`,
      {
        replacements: [ratingId],
        type: QueryTypes.DELETE,
      }
    );

    return res.status(200).json({
      success: true,
      message: "Rating and review deleted successfully by admin",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// get own rating by user
const getRatingByUser = async (req, res) => {
  try {
    const code = await resolveRatingTenantCode(req);
    const userId = req.userId;

    if (!code) {
      return res.status(404).json({
        success: false,
        message: "Futsal not found",
      });
    }

    const rating = await sequelize.query(
      `SELECT r.id, r.rating, r.review, r.sentiment_score, r.sentiment_label, r.created_at AS createdAt, u.username AS reviewerName
       FROM rating_${code} r
       JOIN users u ON r.user_id = u.id
       WHERE r.user_id = ?
       ORDER BY r.created_at DESC`,
      {
        replacements: [userId],
        type: QueryTypes.SELECT,
      }
    );

    if (!rating[0]) {
      return res.status(200).json({
        success: true,
        message: "No rating found for this user",
        data: null,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Rating fetched successfully",
      data: rating[0],
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
const getRatingByfutsalId = async (req, res) => {
  const futsalId = req.params.futsalId;
  const futsal = await Footsal.findByPk(futsalId);
  if (!futsal) {
    return res.status(404).json({
      success: false,
      message: "Futsal not found",
      data: null,
    });
  }
  const code = futsal.futsalCode;
  const ratings = await sequelize.query(
    `SELECT r.id, r.rating, r.review, r.sentiment_score, r.sentiment_label, r.created_at AS createdAt, u.username AS reviewerName
     FROM rating_${code} r
     JOIN users u ON r.user_id = u.id
     ORDER BY r.created_at DESC`,
    {
      type: QueryTypes.SELECT,
    }
  );

  if (!ratings[0]) {
    return res.status(200).json({
      success: true,
      message: "No ratings found for this futsal",
      data: [],
    });
  }

  return res.status(200).json({
    success: true,
    message: "Ratings fetched successfully",
    data: ratings,
  });
}

module.exports = {
  getRatings,
  getRatingByUser,
  postRating,
  updateRating,
  deleteRating,
  deleteRatingByAdmin,
  getRatingByfutsalId
};
