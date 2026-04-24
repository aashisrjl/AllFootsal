const { User, Footsal, sequelize } = require("../../models");
const { QueryTypes } = require("sequelize");
const fs = require('fs');
const path = require('path');
const { upload } = require('../../services/multer/multerConfig');
const { uploadToCloudinary } = require('../../services/cloudinary/cloudinary.service');
const {
    normalizeTenantCode,
    haversineDistanceKm,
    extractCoordinates,
    getPublicIp,
} = require('../../utils/location/recommendationHelpers');

const resolveStoredImagePath = (storedValue) => {
    if (!storedValue) return null;

    try {
        if (storedValue.startsWith('http://') || storedValue.startsWith('https://')) {
            const parsed = new URL(storedValue);
            const fileName = path.basename(parsed.pathname);
            return path.join(__dirname, '../../uploads', fileName);
        }
    } catch (error) {
    }

    if (storedValue.includes('/uploads/') || storedValue.includes('\\uploads\\')) {
        const fileName = path.basename(storedValue);
        return path.join(__dirname, '../../uploads', fileName);
    }

    return storedValue;
};


// by futsal owner
const getAllUsers = async (req, res) => {
  const users = await User.findAll();
  if (users.length === 0) {
    return res.status(200).json({
      success: false,
      message: "user not found",
      data: [],
    });
  }

  return res.status(200).json({
    success: true,
    message: "users fetch successfully",
    data: users,
  });
};

// by user
const getUserById = async (req,res)=>{
    const {id} = req.params;
    const user = await User.findByPk(id);
    if(!user){
        return res.status(404).json({
            success: false,
            message: "user not found",
            data: null,
        });
    }

    return res.status(200).json({
        success: true,
        message: "user fetch successfully",
        data: user,
    });
}

// loggged in user
const getProfile = async (req,res)=>{
    const userId = req.userId;
    const user = await User.findByPk(userId);
    if(!user){
        return res.status(404).json({
            success: false,
            message: "user not found",
            data: null,
        });
    }

    return res.status(200).json({
        success: true,
        message: "user fetch successfully",
        data: user,
    });
}

// update profile
const updateProfile = async (req,res)=>{
    const userId = req.userId;
    const { username, email, phoneNumber } = req.body;
    const user = await User.findByPk(userId);
    if(!user){
        return res.status(404).json({
            success: false,
            message: "user not found",
            data: null,
        });
    }

    user.username = username || user.username;
    user.email = email || user.email;
    user.phoneNumber = phoneNumber || user.phoneNumber;
    await user.save();

    return res.status(200).json({
        success: true,
        message: "user updated successfully",
        data: user,
    });
}

// update profile image
const updateProfileImage = async (req,res)=>{
    try {
        const userId = req.userId;
        const user = await User.findByPk(userId);
        if(!user){
            return res.status(404).json({
                success: false,
                message: "user not found",
                data: null,
            });
        }
        if(!req.file){
            return res.status(400).json({
                success: false,
                message: "image is required",
                data: null,
            });
        }

        const cloudinaryResult = await uploadToCloudinary(req.file.path, {
            folder: 'allfutsal/profile',
            resource_type: 'image'
        });

        const existingProfileImagePath = resolveStoredImagePath(user.profileImage);
        if(existingProfileImagePath && fs.existsSync(existingProfileImagePath)){
            fs.unlinkSync(existingProfileImagePath);
        }

        user.profileImage = cloudinaryResult.secure_url;
        await user.save();

        return res.status(200).json({
            success: true,
            message: "profile image updated successfully",
            data: user,
        });
    } catch (error) {
        const errorMessage = error?.message || error?.error?.message || JSON.stringify(error);
        return res.status(500).json({
            success: false,
            message: "failed to upload profile image",
            error: errorMessage,
        });
    } finally {
        if (req.file?.path && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }
    }
}

// delete profile image
const deleteProfileImage = async (req,res)=>{
    const userId = req.userId;
    const user = await User.findByPk(userId);
    if(!user){
        return res.status(404).json({
            success: false,
            message: "user not found",
            data: null,
        });
    }

    const existingProfileImagePath = resolveStoredImagePath(user.profileImage);
    user.profileImage = null;  
    await user.save();

    if(existingProfileImagePath && fs.existsSync(existingProfileImagePath)){
        fs.unlinkSync(existingProfileImagePath);
    }

    return res.status(200).json({
        success: true,
        message: "profile image deleted successfully",
        data: null,
    });
}

// get all user bookings across all tenant shards
const getMyAllBookings = async (req, res) => {
    const userId = req.userId;
    const { Footsal, sequelize } = require("../../models");
    const { QueryTypes } = require("sequelize");

    try {
        const futsals = await Footsal.findAll();
        let globalBookings = [];

        for (const futsal of futsals) {
            const code = futsal.futsalCode;
            try {
                // If the table doesn't exist, this query will throw an error and be caught
                const bookings = await sequelize.query(
                    `SELECT b.*, p.name as pitch_name, t.start_time, t.end_time 
                     FROM booking_${code} b 
                     JOIN pitch_${code} p ON b.pitch_id = p.id 
                     JOIN timeslot_${code} t ON b.timeslot_id = t.id
                     WHERE b.user_id = ?`, 
                    { replacements: [userId], type: QueryTypes.SELECT }
                );

                if (bookings && bookings.length > 0) {
                    bookings.forEach(b => {
                        b.facilityId = String(futsal.id);
                        b.futsal_name = futsal.futsalName;
                        b.pitchId = String(b.pitch_id);
                        b.date = b.booking_date;
                        b.startTime = b.start_time;
                        b.endTime = b.end_time;
                        b.totalPrice = b.amount;
                        b.status = b.status || 'pending';
                        b.pitchName = b.pitch_name;
                    });
                    globalBookings = globalBookings.concat(bookings);
                }
            } catch (err) {
                // Silently skip if table doesn't exist for a specific futsal
            }
        }

        // Sort dynamically (newest bookings first)
        globalBookings.sort((a, b) => new Date(b.booking_date) - new Date(a.booking_date));

        return res.status(200).json({
            success: true,
            message: "User booking history fetched successfully",
            data: globalBookings,
        });
    } catch (err) {
        console.error("Error fetching global user bookings:", err);
        return res.status(500).json({
            success: false,
            message: "Failed to compile booking history"
        });
    }
};

const getRecommendedFutsals = async (req, res) => {
    const coordinates = extractCoordinates(req);

    if (!coordinates) {
        return res.status(400).json({
            success: false,
            message: "latitude and longitude are required. Use browser geolocation on the frontend and send them to this endpoint.",
            clientIp: getPublicIp(req),
            note: "Localhost requests usually show ::1 or 127.0.0.1, which cannot be used for real geolocation.",
        });
    }

    try {
        const futsals = await Footsal.findAll({
            attributes: ['id', 'futsalCode', 'futsalName', 'email', 'phoneNumber', 'ownerName', 'isActive', 'isVerified'],
        });

        if (!futsals.length) {
            return res.status(200).json({
                success: true,
                message: 'No futsal found',
                data: [],
            });
        }

        const scoredFutsals = await Promise.all(
            futsals.map(async (futsal) => {
                const code = normalizeTenantCode(futsal.futsalCode);

                if (!code) return null;

                const [locationRows, ratingRows, bookingRows] = await Promise.all([
                    sequelize.query(
                        `SELECT district, address, city, postal_code, latitude, longitude, full_address
                         FROM location_${code}
                         ORDER BY id DESC
                         LIMIT 1`,
                        { type: QueryTypes.SELECT }
                    ).catch(() => []),
                    sequelize.query(
                        `SELECT 
                            COUNT(*) AS totalReviews,
                            AVG(COALESCE(rating, 0)) AS avgRating,
                            SUM(CASE WHEN LOWER(COALESCE(sentiment_label, '')) = 'positive' THEN 1 ELSE 0 END) AS positiveReviews,
                            SUM(CASE WHEN LOWER(COALESCE(sentiment_label, '')) = 'negative' THEN 1 ELSE 0 END) AS negativeReviews,
                            AVG(CASE WHEN LOWER(COALESCE(sentiment_label, '')) = 'positive' THEN COALESCE(sentiment_score, 0) END) AS avgPositiveSentimentScore,
                            AVG(CASE WHEN LOWER(COALESCE(sentiment_label, '')) = 'negative' THEN COALESCE(sentiment_score, 0) END) AS avgNegativeSentimentScore
                         FROM rating_${code}`,
                        { type: QueryTypes.SELECT }
                    ).catch(() => []),
                    sequelize.query(
                        `SELECT COUNT(*) AS totalBookings
                         FROM booking_${code}`,
                        { type: QueryTypes.SELECT }
                    ).catch(() => []),
                ]);

                const location = locationRows[0];
                if (!location || location.latitude === null || location.latitude === undefined || location.longitude === null || location.longitude === undefined) {
                    return null;
                }

                const latitude = Number(location.latitude);
                const longitude = Number(location.longitude);

                if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
                    return null;
                }

                const distanceKm = haversineDistanceKm(
                    coordinates.latitude,
                    coordinates.longitude,
                    latitude,
                    longitude
                );

                const ratingStats = ratingRows[0] || {};
                const bookingStats = bookingRows[0] || {};

                const totalReviews = Number(ratingStats.totalReviews || 0);
                const avgRating = Number(ratingStats.avgRating || 0);
                const positiveReviews = Number(ratingStats.positiveReviews || 0);
                const negativeReviews = Number(ratingStats.negativeReviews || 0);
                const avgPositiveSentimentScore = Number(ratingStats.avgPositiveSentimentScore || 0);
                const avgNegativeSentimentScore = Number(ratingStats.avgNegativeSentimentScore || 0);
                const avgSentiment = totalReviews > 0 ? (positiveReviews / totalReviews) : 0;
                const totalBookings = Number(bookingStats.totalBookings || 0);

                return {
                    id: futsal.id,
                    futsalCode: futsal.futsalCode,
                    futsalName: futsal.futsalName,
                    ownerName: futsal.ownerName,
                    email: futsal.email,
                    phoneNumber: futsal.phoneNumber,
                    isActive: futsal.isActive,
                    isVerified: futsal.isVerified,
                    location: {
                        district: location.district,
                        address: location.address,
                        city: location.city,
                        postal_code: location.postal_code,
                        full_address: location.full_address,
                        latitude,
                        longitude,
                    },
                    metrics: {
                        distanceKm,
                        totalReviews,
                        avgSentiment,
                        avgRating,
                        positiveReviews,
                        negativeReviews,
                        avgPositiveSentimentScore,
                        avgNegativeSentimentScore,
                        totalBookings,
                    },
                };
            })
        );

        const validFutsals = scoredFutsals.filter(Boolean);

        if (!validFutsals.length) {
            return res.status(200).json({
                success: true,
                message: 'No futsal location data found for recommendation',
                data: [],
            });
        }

        const maxBookings = Math.max(...validFutsals.map((item) => item.metrics.totalBookings), 1);
        const maxDistance = Math.max(...validFutsals.map((item) => item.metrics.distanceKm), 1);

        const rankedFutsals = validFutsals
            .map((item) => {
                const distanceScore = 1 - Math.min(item.metrics.distanceKm / maxDistance, 1);
                const sentimentScore = Math.min(Math.max(item.metrics.avgSentiment, 0), 1);
                const bookingScore = Math.min(item.metrics.totalBookings / maxBookings, 1);

                const finalScore =
                    (distanceScore * 0.5) +
                    (sentimentScore * 0.3) +
                    (bookingScore * 0.2);

                return {
                    ...item,
                    score: Number(finalScore.toFixed(4)),
                    ranking: {
                        distanceScore: Number(distanceScore.toFixed(4)),
                        sentimentScore: Number(sentimentScore.toFixed(4)),
                        bookingScore: Number(bookingScore.toFixed(4)),
                    },
                };
            })
            .sort((a, b) => b.score - a.score);

        const limit = Math.max(1, Math.min(Number(req.query.limit || 5), 20));

        return res.status(200).json({
            success: true,
            message: 'Recommended futsals fetched successfully',
            userLocation: coordinates,
            data: rankedFutsals.slice(0, limit),
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch recommended futsals',
            error: error.message,
        });
    }
};

module.exports = {
    getAllUsers,
    getUserById,
    getProfile,
    updateProfile,
    updateProfileImage,
    deleteProfileImage,
    getMyAllBookings,
    getRecommendedFutsals,
}