const bcryptjs = require("bcryptjs");
const generateJwt = require("../../utils/jwt/generateJwt");
const { redisClient } = require("../../config/redisConfig");
const { User } = require("../../models/index");
const { Footsal } = require("../../models/index");
const { generateOTP } = require("../../utils/otpGenerator/otpGenerator");
const sendOtp = require("../../utils/sendOtp/sendOtp");
const {
  TOKEN_EXPIRATION_USER,
  JWT_SECRET_USER,
  TOKEN_EXPIRATION_FUTSAL,
  JWT_SECRET_FUTSAL,
} = process.env;

//Login user api
const Login = async (req, res) => {
  const { email, password, phoneNumber } = req.body;
  //login using email or phone number
  console.log(req.body);
  // basic validation
  if ((!email && !phoneNumber) || !password) {
    return res.status(400).json({
      error: "Please provide email or phone number and password",
    });
  }

  var userEmail, userPhone, footsalEmail, footsalPhone;
  if (email) {
    console.log(`Login attempt with email: ${email}`);

    userEmail = await User.findOne({
      where: { email },
    });

    footsalEmail = await Footsal.findOne({
      where: { email },
    });
  } else {
    console.log(`Login attempt with phone number: ${phoneNumber}`);

    userPhone = await User.findOne({
      where: { phoneNumber },
    });

    footsalPhone = await Footsal.findOne({
      where: { phoneNumber },
    });
  }

  const user = userEmail || userPhone;
  const footsalUser = footsalEmail || footsalPhone;


  if (user && !footsalUser) {
    const isVerified = user.isVerified;
    if (!isVerified) {
      return res.status(400).json({
        error: "User is not verified. Please verify your account first.",
      });
    }

    // check password
    const isMatch = await bcryptjs.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        error: "Invalid email/phone number or password",
      });
    }

    // Generate JWT
    const usertoken = generateJwt(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET_USER || "fallback-user-secret",
      TOKEN_EXPIRATION_USER || "30d",
    );
    user.is_active = true;
    await user.save();

    res.cookie("utoken", usertoken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    // Return user data and token
    return res.status(200).json({
      message: "Login successful",
      usertoken,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        phoneNumber: user.phoneNumber,
        role: user.role,
        is_active: user.is_active,
      },
    });
  }

  if (footsalUser && !user) {

    // check if footsal is verified
    const isVerified = footsalUser.isVerified;
    if (!isVerified) {
      return res.status(400).json({
        error: "Footsal is not verified. Please verify your account first.",
      });
    }
    // Check password
    const isMatch = await bcryptjs.compare(password, footsalUser.password);

    if (!isMatch) {
      return res.status(400).json({
        error: "Invalid email/phone number or password",
      });
    }

    // Generate JWT
    const futsaltoken = generateJwt(
      {
        id: footsalUser.id,
        email: footsalUser.email,
        role: footsalUser.role,
        code: footsalUser.code,
      },
      JWT_SECRET_FUTSAL || "fallback-futsal-secret",
      TOKEN_EXPIRATION_FUTSAL || "7d",
    );

    footsalUser.is_active = true;
    await footsalUser.save();

    // Set cookie
    res.cookie("ftoken", futsaltoken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    // Return footsal data and token
    return res.status(200).json({
      message: "Login successful",
      futsaltoken,
      futsal: {
        id: footsalUser.id,
        username: footsalUser.username,
        email: footsalUser.email,
        phoneNumber: footsalUser.phoneNumber,
        role: footsalUser.role,
        is_active: footsalUser.is_active,
      },
    });
  }
};

//verify footsal by otp
const VerifyOtp = async (req, res) => {
  console.log("verigyig otp:");
  const { email } = req.query;
  const { otp } = req.body;

  console.log(email);
  console.log(otp);

  // check if footsal exists
  const footsalData = await Footsal.findOne({
    where: { email },
  });

  const userData = await User.findOne({
    where: { email },
  });

  // verify otp using redis
  const isValidOtp = await redisClient.get(`otp:${email}`);
  console.log(`Retrieved OTP for ${email} from Redis: ${isValidOtp}`);

  if (otp !== isValidOtp) {
    return res.status(400).json({
      error: "Invalid OTP",
    });
  }

  if (footsalData && !userData) {
    footsalData.isVerified = true;
    await footsalData.save();
    // delete otp from redis
    await redisClient.del(`otp:${email}`);
    return res.status(200).json({
      message: "Footsal verified successfully",
    });
  }

  if (userData && !footsalData) {
    userData.isVerified = true;
    await userData.save();
    // delete otp from redis
    await redisClient.del(`otp:${email}`);
    return res.status(200).json({
      message: "User verified successfully",
    });
  }

  return res.status(404).json({
    error: "User not found",
  });
};

//Logout user and futsal api
const Logout = async (req, res) => {
  //token
  const token = req.headers.authorization?.split(" ")[1];
  userId = req.user.id;

  if (!token) {
    return res.status(400).json({
      error: "No token provided",
    });
  }
  //logout clear cookies
  res.clearCookie("token");
  await User.update({ is_active: false }, { where: { id: userId } });
  await Footsal.update({ is_active: false }, { where: { id: userId } });

  return res.status(200).json({
    message: "Logout successful",
  });
};

//forgot password api
const forgotPassword = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({
      error: "Email is required",
    });
  }

  const user = await User.findOne({
    where: { email }
  });

  const footsal = await Footsal.findOne({
    where: { email }
  });

  if (!user && !footsal) {
    return res.status(404).json({
      error: "User with this email does not exist",
    });
  }


  // Generate otp code and send email with redis
  otp = generateOTP(6);
  redisClient.setEx(`otp:${email}`, 300, otp); // 5 min
  console.log(`Generated OTP for ${email}: ${otp}`);
  sendOtp(email,
    otp,
    subject="Your OTP Code for Password Reset of AllFutsal", 
    text=`Your OTP code is ${otp} Expires in 2 minutes.`
  );
  console.log("mail send");

  res.status(200).json({
    message: "OTP sent to email for password reset",
  });
};


// change password api
const changePassword = async(req,res)=>{
  const {email , otp, newPassword, cNewPassword} = req.body;
  
  if (!email || !otp || !newPassword || !cNewPassword) {
    return res.status(400).json({
      error: "All fields are required",
    });
  }
  if (newPassword !== cNewPassword) {
    return res.status(400).json({
      error: "New password and confirm new password do not match",
    });
  }

  // verify otp using redis
  const isValidOtp = await redisClient.get(`otp:${email}`);
  console.log(`Retrieved OTP for ${email} from Redis: ${isValidOtp}`);

  if (otp !== isValidOtp) {
    return res.status(400).json({
      error: "Invalid OTP",
    });
  }

  // delete otp from redis
  await redisClient.del(`otp:${email}`);

  // update password
  const user = await User.findOne({
    where: { email }
  });

  const footsal = await Footsal.findOne({
    where: { email }
  });

  if (user) {
    user.password = await bcrypt.hash(newPassword, parseInt(USER_PASSWORD_SALT_ROUNDS));
    await user.save();
  }

  if (footsal) {
    footsal.password = await bcrypt.hash(newPassword, parseInt(FOOTSAL_PASSWORD_SALT_ROUNDS));
    await footsal.save();
  }

  res.status(200).json({
    message: "Password changed successfully",
  });
}



module.exports = AllAuthController = {
  VerifyOtp,
  Logout,
  Login,
  forgotPassword,
  changePassword
};
