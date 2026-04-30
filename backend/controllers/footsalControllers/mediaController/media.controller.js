const { sequelize, Footsal } = require("../../../models");
const { QueryTypes } = require("sequelize");
const fs = require("fs");
const { uploadToCloudinary } = require("../../../services/cloudinary/cloudinary.service");

const getUploadedMediaFiles = (req) => {
  if (Array.isArray(req.files) && req.files.length > 0) return req.files;
  if (Array.isArray(req.files?.media) && req.files.media.length > 0) return req.files.media;
  if (req.file) return [req.file];
  if (req.files?.media) return [req.files.media];
  return [];
};

const getMediaType = (mimetype = "") => {
  if (mimetype.startsWith("image/")) return "image";
  if (mimetype.startsWith("video/")) return "video";
  return null;
};

const safeDeleteLocalFile = (filePath) => {
  if (filePath && fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
};

const ensureMediaTableExists = async (code) => {
  await sequelize.query(`
    CREATE TABLE IF NOT EXISTS media_${code} (
      id INT AUTO_INCREMENT PRIMARY KEY,
      type ENUM('image','video') NOT NULL,
      category ENUM('home','pitch','facility','event','other','logo','banner') NOT NULL,
      url VARCHAR(500) NOT NULL,
      description TEXT,
      pitch_id INT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB;
  `);
};

const uploadMedia = async (req, res) => {
  try {
    const code = req.futsalCode || req.tanent?.code;
    if (!code) {
      return res.status(400).json({
        success: false,
        message: "futsal code is required",
      });
    }

    await ensureMediaTableExists(code);

    const mediaFiles = getUploadedMediaFiles(req);
    const { category, description, pitchId } = req.body || {};

    if (!mediaFiles.length) {
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

    // Only pitches should have pitch_id.
    const normalizedPitchId = pitchId || null;

    if (category === "pitch" && !normalizedPitchId) {
      // Allow null for general pitch media
    }

    const uploaded = [];

    for (const media of mediaFiles) {
      const mediaType = getMediaType(media.mimetype);
      if (!mediaType) {
        return res.status(400).json({
          success: false,
          message: "invalid media type",
        });
      }

      const cloudinaryResult = await uploadToCloudinary(media.path, {
        folder: `allfutsal/media/${code}`,
        resource_type: mediaType === "video" ? "video" : "image",
      });

      safeDeleteLocalFile(media.path);

      await sequelize.query(
        `INSERT INTO media_${code} (type, category, description, pitch_id, url)
         VALUES (:mediaType, :category, :description, :pitchId, :mediaUrl)`,
        {
          replacements: {
            mediaType,
            category,
            description: description ?? null,
            pitchId: normalizedPitchId,
            mediaUrl: cloudinaryResult.secure_url,
          },
          type: QueryTypes.INSERT,
        }
      );

      uploaded.push(cloudinaryResult.secure_url);
    }

    return res.status(200).json({
      success: true,
      message: "media uploaded successfully",
      data: {
        uploadedCount: uploaded.length,
        urls: uploaded,
      },
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

    await ensureMediaTableExists(code);

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

    await ensureMediaTableExists(code);

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

    await ensureMediaTableExists(code);

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

    await ensureMediaTableExists(code);

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

    await ensureMediaTableExists(code);
    if (!pitchId) {
      return res.status(400).json({
        success: false,
        message: "pitchId is required",
      });
    }

    const mediaFiles = getUploadedMediaFiles(req);
    const { description } = req.body || {};

    if (!mediaFiles.length) {
      return res.status(400).json({
        success: false,
        message: "media is required",
      });
    }

    const uploaded = [];

    for (const media of mediaFiles) {
      const mediaType = getMediaType(media.mimetype);
      if (!mediaType) {
        return res.status(400).json({
          success: false,
          message: "invalid media type",
        });
      }

      const cloudinaryResult = await uploadToCloudinary(media.path, {
        folder: `allfutsal/media/${code}/pitch`,
        resource_type: mediaType === "video" ? "video" : "image",
      });

      safeDeleteLocalFile(media.path);

      await sequelize.query(
        `INSERT INTO media_${code} (type, category, description, pitch_id, url)
         VALUES (:mediaType, 'pitch', :description, :pitchId, :mediaUrl)`,
        {
          replacements: {
            mediaType,
            description: description ?? null,
            pitchId,
            mediaUrl: cloudinaryResult.secure_url,
          },
          type: QueryTypes.INSERT,
        }
      );

      uploaded.push(cloudinaryResult.secure_url);
    }

    return res.status(200).json({
      success: true,
      message: "pitch media uploaded successfully",
      data: {
        uploadedCount: uploaded.length,
        urls: uploaded,
      },
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

    await ensureMediaTableExists(code);
    if (!pitchId) {
      return res.status(400).json({
        success: false,
        message: "pitchId is required",
      });
    }

    const mediaFiles = getUploadedMediaFiles(req);
    const { description } = req.body || {};

    if (!mediaFiles.length) {
      return res.status(400).json({
        success: false,
        message: "media is required",
      });
    }

    const uploaded = [];

    for (const media of mediaFiles) {
      const mediaType = getMediaType(media.mimetype);
      if (!mediaType) {
        return res.status(400).json({
          success: false,
          message: "invalid media type",
        });
      }

      const cloudinaryResult = await uploadToCloudinary(media.path, {
        folder: `allfutsal/media/${code}/facility`,
        resource_type: mediaType === "video" ? "video" : "image",
      });

      safeDeleteLocalFile(media.path);

      await sequelize.query(
        `INSERT INTO media_${code} (type, category, description, pitch_id, url)
         VALUES (:mediaType, 'facility', :description, :pitchId, :mediaUrl)`,
        {
          replacements: {
            mediaType,
            description: description ?? null,
            pitchId,
            mediaUrl: cloudinaryResult.secure_url,
          },
          type: QueryTypes.INSERT,
        }
      );

      uploaded.push(cloudinaryResult.secure_url);
    }

    return res.status(200).json({
      success: true,
      message: "facility media uploaded successfully",
      data: {
        uploadedCount: uploaded.length,
        urls: uploaded,
      },
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

    await ensureMediaTableExists(code);
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

    await ensureMediaTableExists(code);
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
const getMediaBycategory = async (req, res) => {
  try {
    const id = req.params?.futsalId;
    const futsal = await Footsal.findOne({
      where: { id },
    });
    const code = futsal?.futsalCode || req.tanent?.code;

    if (!code) {
      return res.status(400).json({
        success: false,
        message: "futsal code is required",
      });
    }

    await ensureMediaTableExists(code);

    const category = req.query?.category;
    if (!category) {
      return res.status(400).json({
        success: false,
        message: "category is required",
      });
    }

    const media = await sequelize.query(
      `SELECT * FROM media_${code} WHERE category = :category`,
      {
        replacements: { category },
        type: QueryTypes.SELECT,
      }
    );

    if (!media || media.length < 1) {
      return res.status(400).json({
        success: false,
        message: "media not found for this category",
      });
    }

    return res.status(200).json({
      success: true,
      message: "media fetch successfully",
      data: media,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
}


const uploadLogo = async (req,res)=>{
const code = req.futsalCode || req.tanent?.code;
if (!code) {
  return res.status(400).json({
    success: false,
    message: "futsal code is required",
  });
}

  await ensureMediaTableExists(code);
  const mediaFiles = getUploadedMediaFiles(req);
  if (!mediaFiles.length) {
    return res.status(400).json({
      success: false,
      message: "media is required",
    });
  }
  const media = mediaFiles[0];
  const mediaType = getMediaType(media.mimetype);
  if (!mediaType) {
    return res.status(400).json({
      success: false,
      message: "invalid media type",
    });
  }

  const cloudinaryResult = await uploadToCloudinary(media.path, {
    folder: `allfutsal/media/${code}/logo`,
    resource_type: mediaType === "video" ? "video" : "image",
  });

  safeDeleteLocalFile(media.path);

  await sequelize.query(
    `INSERT INTO media_${code} (type, category, url)
     VALUES (:mediaType, 'logo', :mediaUrl)`,
    {
      replacements: {
        mediaType,
        mediaUrl: cloudinaryResult.secure_url,
      },
      type: QueryTypes.INSERT,
    }
  );

  return res.status(200).json({
    success: true,
    message: "logo uploaded successfully",
    data: {
      url: cloudinaryResult.secure_url,
    },
  });
}

const uploadBanner = async (req,res)=>{
  const code = req.futsalCode || req.tanent?.code;
  if (!code) {
    return res.status(400).json({
      success: false,
      message: "futsal code is required",
    });
  }

    await ensureMediaTableExists(code);
    const mediaFiles = getUploadedMediaFiles(req);
    if (!mediaFiles.length) {
      return res.status(400).json({
        success: false,
        message: "media is required",
      });
    }
    const media = mediaFiles[0];
    const mediaType = getMediaType(media.mimetype);
    if (!mediaType) {
      return res.status(400).json({
        success: false,
        message: "invalid media type",
      });
    }
  
    const cloudinaryResult = await uploadToCloudinary(media.path, {
      folder: `allfutsal/media/${code}/banner`,
      resource_type: mediaType === "video" ? "video" : "image",
    });
  
    safeDeleteLocalFile(media.path);
  
    await sequelize.query(
      `INSERT INTO media_${code} (type, category, url)
       VALUES (:mediaType, 'banner', :mediaUrl)`,
      {
        replacements: { mediaType, mediaUrl: cloudinaryResult.secure_url },
        type: QueryTypes.INSERT,
      }
    );
  
    return res.status(200).json({
      success: true,
      message: "banner uploaded successfully",
      data: {
        url: cloudinaryResult.secure_url,
      },
    });
}
  
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
  getMediaBycategory
};
