const { User } = require("../../models");
const fs = require('fs');
const path = require('path');
const { upload } = require('../../services/multer/multerConfig');


// by futsal owner
const getAllUsers = async (req, res) => {
  const users = await User.find();
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
    const userId = req.userId;
    const user = await User.findByPk(userId);
    if(!user){
        return res.status(404).json({
            success: false,
            message: "user not found",
            data: null,
        });
    }
    if(user.profileImage){
        fs.unlinkSync(user.profileImage);
        fs.rmdirSync('./uploads');
    }

    const { image } = req.files;
    if(!image){
        return res.status(400).json({
            success: false,
            message: "image is required",
            data: null,
        });
    }

    user.profileImage = image.path;
    await user.save();

    return res.status(200).json({
        success: true,
        message: "profile image updated successfully",
        data: user,
    });
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

    user.profileImage = null;  
    await user.save();
    fs.unlinkSync(user.profileImage);
    fs.rmdirSync('./uploads');
    return res.status(200).json({
        success: true,
        message: "profile image deleted successfully",
        data: null,
    });
}

module.exports = {
    getAllUsers,
    getUserById,
    getProfile,
    updateProfile,
    updateProfileImage,
    deleteProfileImage
}