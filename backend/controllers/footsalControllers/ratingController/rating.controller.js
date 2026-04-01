const { sequelize, Footsal } = require("../../../models");
const { QueryTypes } = require("sequelize");

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
      `SELECT r.id, r.rating, r.review, r.created_at AS createdAt, u.username AS reviewerName
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

    await sequelize.query(
      `INSERT INTO rating_${code} (user_id, rating, review)
       VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE rating = VALUES(rating), review = VALUES(review)`,
      {
        replacements: [userId, rating, review ?? null],
        type: QueryTypes.INSERT,
      }
    );

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

    const [_, meta] = await sequelize.query(
      `UPDATE rating_${code}
       SET rating = ?, review = ?
       WHERE user_id = ?`,
      {
        replacements: [rating, review ?? null, userId],
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
      `SELECT r.id, r.rating, r.review, r.created_at AS createdAt, u.username AS reviewerName
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
    `SELECT r.id, r.rating, r.review, r.created_at AS createdAt, u.username AS reviewerName
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
