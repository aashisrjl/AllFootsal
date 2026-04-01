const { User } = require("../../models");
const fs = require('fs');
const path = require('path');
const { upload } = require('../../services/multer/multerConfig');
const { uploadToCloudinary } = require('../../services/cloudinary/cloudinary.service');

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

module.exports = {
    getAllUsers,
    getUserById,
    getProfile,
    updateProfile,
    updateProfileImage,
    deleteProfileImage,
    getMyAllBookings
}