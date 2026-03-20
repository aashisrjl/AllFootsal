const { sequelize } = require("../../../models");
const { QueryTypes } = require("sequelize");

const uploadMedia = async (req, res) => {
  try {
    const code = req.futsalCode || req.tanent?.code;
    if (!code) {
      return res.status(400).json({
        success: false,
        message: "futsal code is required",
      });
    }

    const { media } = req.files || {};
    const { category, description, pitchId } = req.body || {};

    if (!media) {
      return res.status(400).json({
        success: false,
        message: "media is required",
      });
    }
    if (!category) {
      return res.status(400).json({
        success: false,
        message: "category is required",
      });
    }

    // validate the media type
    let mediaType = null;
    if (media.mimetype?.startsWith("image/")) {
      mediaType = "image";
    } else if (media.mimetype?.startsWith("video/")) {
      mediaType = "video";
    } else {
      return res.status(400).json({
        success: false,
        message: "invalid media type",
      });
    }

    // Only pitches should have pitch_id.
    const normalizedPitchId = category === "pitch" ? pitchId : null;

    if (category === "pitch" && !normalizedPitchId) {
      return res.status(400).json({
        success: false,
        message: "pitchId is required when category is 'pitch'",
      });
    }

    const mediaUrl = media.path;

    const newMedia = await sequelize.query(
      `INSERT INTO media_${code} (type, category, description, pitch_id, url)
       VALUES (:mediaType, :category, :description, :pitchId, :mediaUrl)`,
      {
        replacements: {
          mediaType,
          category,
          description: description ?? null,
          pitchId: normalizedPitchId,
          mediaUrl,
        },
        type: QueryTypes.INSERT,
      }
    );

    return res.status(200).json({
      success: true,
      message: "media uploaded successfully",
      data: newMedia,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

const getHomeMedia = async (req, res) => {
  try {
    const code = req.futsalCode || req.tanent?.code;
    if (!code) {
      return res.status(400).json({
        success: false,
        message: "futsal code is required",
      });
    }

    const homeMedia = await sequelize.query(
      `SELECT * FROM media_${code} WHERE category = 'home'`,
      { type: QueryTypes.SELECT }
    );

    if (!homeMedia || homeMedia.length < 1) {
      return res.status(400).json({
        success: false,
        message: "home media not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "home media fetch successfully",
      data: homeMedia,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

const getPitchMedia = async (req, res) => {
  try {
    const code = req.futsalCode || req.tanent?.code;
    if (!code) {
      return res.status(400).json({
        success: false,
        message: "futsal code is required",
      });
    }

    const pitchMedia = await sequelize.query(
      `SELECT * FROM media_${code} WHERE category = 'pitch'`,
      { type: QueryTypes.SELECT }
    );

    if (!pitchMedia || pitchMedia.length < 1) {
      return res.status(400).json({
        success: false,
        message: "pitch media not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "pitch media fetch successfully",
      data: pitchMedia,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Fetch pitch media by specific pitch id.
// Expected params:
// - req.params.pitchId
const getPitchMediaById = async (req, res) => {
  try {
    const code = req.futsalCode || req.tanent?.code;
    if (!code) {
      return res.status(400).json({
        success: false,
        message: "futsal code is required",
      });
    }

    const { pitchId } = req.params || {};
    if (!pitchId) {
      return res.status(400).json({
        success: false,
        message: "pitchId is required",
      });
    }

    const pitchMedia = await sequelize.query(
      `SELECT * FROM media_${code}
       WHERE category = 'pitch' AND pitch_id = :pitchId`,
      {
        replacements: { pitchId },
        type: QueryTypes.SELECT,
      }
    );

    if (!pitchMedia || pitchMedia.length < 1) {
      return res.status(400).json({
        success: false,
        message: "pitch media not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "pitch media fetch successfully",
      data: pitchMedia,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

const getFacilityMedia = async (req, res) => {
  try {
    const code = req.futsalCode || req.tanent?.code;
    if (!code) {
      return res.status(400).json({
        success: false,
        message: "futsal code is required",
      });
    }

    const facilityMedia = await sequelize.query(
      `SELECT * FROM media_${code} WHERE category = 'facility'`,
      { type: QueryTypes.SELECT }
    );

    if (!facilityMedia || facilityMedia.length < 1) {
      return res.status(400).json({
        success: false,
        message: "facility media not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "facility media fetch successfully",
      data: facilityMedia,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

const getEventMedia = async (req, res) => {
  try {
    const code = req.futsalCode || req.tanent?.code;
    if (!code) {
      return res.status(400).json({
        success: false,
        message: "futsal code is required",
      });
    }

    const eventMedia = await sequelize.query(
      `SELECT * FROM media_${code} WHERE category = 'event'`,
      { type: QueryTypes.SELECT }
    );

    if (!eventMedia || eventMedia.length < 1) {
      return res.status(400).json({
        success: false,
        message: "event media not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "event media fetch successfully",
      data: eventMedia,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

const getOtherMedia = async (req, res) => {
  try {
    const code = req.futsalCode || req.tanent?.code;
    if (!code) {
      return res.status(400).json({
        success: false,
        message: "futsal code is required",
      });
    }

    const otherMedia = await sequelize.query(
      `SELECT * FROM media_${code} WHERE category = 'other'`,
      { type: QueryTypes.SELECT }
    );

    if (!otherMedia || otherMedia.length < 1) {
      return res.status(400).json({
        success: false,
        message: "other media not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "other media fetch successfully",
      data: otherMedia,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};


const uploadPitchMedia = async (req, res) => {
  try {
    const code = req.futsalCode || req.tanent?.code;
    const { pitchId } = req.params || {};

    if (!code) {
      return res.status(400).json({
        success: false,
        message: "futsal code is required",
      });
    }
    if (!pitchId) {
      return res.status(400).json({
        success: false,
        message: "pitchId is required",
      });
    }

    const { media } = req.files || {};
    const { description } = req.body || {};

    if (!media) {
      return res.status(400).json({
        success: false,
        message: "media is required",
      });
    }

    let mediaType = null;
    if (media.mimetype?.startsWith("image/")) {
      mediaType = "image";
    } else if (media.mimetype?.startsWith("video/")) {
      mediaType = "video";
    } else {
      return res.status(400).json({
        success: false,
        message: "invalid media type",
      });
    }

    const mediaUrl = media.path;

    const newMedia = await sequelize.query(
      `INSERT INTO media_${code} (type, category, description, pitch_id, url)
       VALUES (:mediaType, 'pitch', :description, :pitchId, :mediaUrl)`,
      {
        replacements: {
          mediaType,
          description: description ?? null,
          pitchId,
          mediaUrl,
        },
        type: QueryTypes.INSERT,
      }
    );

    return res.status(200).json({
      success: true,
      message: "pitch media uploaded successfully",
      data: newMedia,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};


const uploadFacilitiesMediaByPitchId = async (req, res) => {
  try {
    const code = req.futsalCode || req.tanent?.code;
    const { pitchId } = req.params || {};

    if (!code) {
      return res.status(400).json({
        success: false,
        message: "futsal code is required",
      });
    }
    if (!pitchId) {
      return res.status(400).json({
        success: false,
        message: "pitchId is required",
      });
    }

    const { media } = req.files || {};
    const { description } = req.body || {};

    if (!media) {
      return res.status(400).json({
        success: false,
        message: "media is required",
      });
    }

    let mediaType = null;
    if (media.mimetype?.startsWith("image/")) {
      mediaType = "image";
    } else if (media.mimetype?.startsWith("video/")) {
      mediaType = "video";
    } else {
      return res.status(400).json({
        success: false,
        message: "invalid media type",
      });
    }

    const mediaUrl = media.path;

    const newMedia = await sequelize.query(
      `INSERT INTO media_${code} (type, category, description, pitch_id, url)
       VALUES (:mediaType, 'facility', :description, :pitchId, :mediaUrl)`,
      {
        replacements: {
          mediaType,
          description: description ?? null,
          pitchId,
          mediaUrl,
        },
        type: QueryTypes.INSERT,
      }
    );

    return res.status(200).json({
      success: true,
      message: "facility media uploaded successfully",
      data: newMedia,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};


const deleteMediaByCategory = async (req, res) => {
  try {
    const code = req.futsalCode || req.tanent?.code;
    const category =
      req.params?.category || req.query?.category || req.body?.category;
    const pitchId = req.params?.pitchId || req.query?.pitchId || null;

    if (!code) {
      return res.status(400).json({
        success: false,
        message: "futsal code is required",
      });
    }
    if (!category) {
      return res.status(400).json({
        success: false,
        message: "category is required",
      });
    }

    const whereClause = pitchId
      ? `WHERE category = :category AND pitch_id = :pitchId`
      : `WHERE category = :category`;

    const result = await sequelize.query(
      `DELETE FROM media_${code} ${whereClause}`,
      {
        replacements: pitchId ? { category, pitchId } : { category },
        type: QueryTypes.DELETE,
      }
    );

    return res.status(200).json({
      success: true,
      message: "media deleted successfully",
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

const deleteMediaById = async (req, res) => {
  try {
    const code = req.futsalCode || req.tanent?.code;
    const mediaId = req.params?.id || req.params?.mediaId;

    if (!code) {
      return res.status(400).json({
        success: false,
        message: "futsal code is required",
      });
    }
    if (!mediaId) {
      return res.status(400).json({
        success: false,
        message: "media id is required",
      });
    }

    const result = await sequelize.query(
      `DELETE FROM media_${code} WHERE id = :mediaId`,
      {
        replacements: { mediaId },
        type: QueryTypes.DELETE,
      }
    );

    return res.status(200).json({
      success: true,
      message: "media deleted successfully",
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};





module.exports = {
  uploadMedia,
  getHomeMedia,
  getPitchMedia,
  getPitchMediaById,
  getFacilityMedia,
  getEventMedia,
  getOtherMedia,
  uploadPitchMedia,
  uploadFacilitiesMediaByPitchId,
  deleteMediaByCategory,
  deleteMediaById,
};
