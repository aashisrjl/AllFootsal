const { User } = require("../../models");
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
    const user = await User.findById(id);
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
    const user = await User.findById(userId);
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

module.exports = {
    getAllUsers,
    getUserById,
    getProfile
}