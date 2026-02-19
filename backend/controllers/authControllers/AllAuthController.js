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
  USER_PASSWORD_SALT_ROUNDS,
  FUTSAL_PASSWORD_SALT_ROUNDS
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
        code: footsalUser.futsalCode,
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
  return res.status(400).json({
  error: "Invalid email/phone number or password",
});
};

//verify footsal by otp
const VerifyOtp = async (req, res) => {
  try {
    const email = req.query.email?.toLowerCase();
    const { otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ error: "Email and OTP are required" });
    }

    // Check both possible keys
    let storedData =
      await redisClient.get(`user:otp:${email}`) ||
      await redisClient.get(`footsal:otp:${email}`);

    if (!storedData) {
      return res.status(400).json({
        error: "OTP expired or not found",
      });
    }

    const parsedData = JSON.parse(storedData);

    // Correct comparison
    if (String(otp).trim() !== String(parsedData.otp).trim()) {
      return res.status(400).json({
        error: "Invalid OTP",
      });
    }

    const user = await User.findOne({ where: { email } });
    const footsal = await Footsal.findOne({ where: { email } });

    if (user) {
      user.isVerified = true;
      await user.save();
      await redisClient.del(`user:otp:${email}`);
    }

    if (footsal) {
      footsal.isVerified = true;
      await footsal.save();
      await redisClient.del(`footsal:otp:${email}`);
    }

    return res.status(200).json({
      message: "Account verified successfully",
    });

  } catch (error) {
    console.error("Verify OTP error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

//logout api
const Logout = async (req, res) => {
  try {
    const utoken = req.cookies.utoken;
    const ftoken = req.cookies.ftoken;

    const userId = req.user?.id;
    const futsalId = req.futsal?.id;

    if (utoken && userId) {
      await User.update(
        { is_active: false },
        { where: { id: userId } }
      );
      res.clearCookie("utoken");
    }

    if (ftoken && futsalId) {
      await Footsal.update(
        { is_active: false },
        { where: { id: futsalId } }
      );
      res.clearCookie("ftoken");
    }

    return res.status(200).json({
      message: "Logout successful",
    });

  } catch (error) {
    console.error("Logout error:", error);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
};

// forgot password
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        error: "Email is required",
      });
    }

    const user = await User.findOne({ where: { email } });
    const footsal = await Footsal.findOne({ where: { email } });

    // Always return success (prevent email enumeration)
    if (!user && !footsal) {
      return res.status(200).json({
        message: "If an account exists, OTP has been sent",
      });
    }

    const otp = generateOTP(6);

    await redisClient.setEx(
      `otp:reset:${email}`,
      300, // 5 minutes
      otp
    );

    await sendOtp(
      email,
      otp,
      "Your OTP Code for Password Reset - AllFutsal",
      `Your OTP code is ${otp}. It expires in 5 minutes.`
    );

    return res.status(200).json({
      message: "If an account exists, OTP has been sent",
    });

  } catch (error) {
    console.error("Forgot password error:", error);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
};

//forgot password
const changeForgotPassword = async (req, res) => {
  try {
    const { email, otp, newPassword, cNewPassword } = req.body;

    if (!email || !otp || !newPassword || !cNewPassword) {
      return res.status(400).json({
        error: "All fields are required",
      });
    }

    if (newPassword !== cNewPassword) {
      return res.status(400).json({
        error: "Passwords do not match",
      });
    }

    // Get OTP from Redis
    const storedOtp = await redisClient.get(`otp:reset:${email}`);

    if (!storedOtp) {
      return res.status(400).json({
        error: "OTP expired or invalid",
      });
    }

    if (otp !== storedOtp) {
      return res.status(400).json({
        error: "Invalid OTP",
      });
    }

    // Delete OTP after successful verification
    await redisClient.del(`otp:reset:${email}`);

    const user = await User.findOne({ where: { email } });
    const footsal = await Footsal.findOne({ where: { email } });

    if (user) {
      user.password = await bcryptjs.hash(
        newPassword,
        parseInt(USER_PASSWORD_SALT_ROUNDS)
      );
      user.is_active = false; 
      await user.save();
    } else if (footsal) {
      footsal.password = await bcryptjs.hash(
        newPassword,
        parseInt(FUTSAL_PASSWORD_SALT_ROUNDS)
      );
      footsal.is_active = false;
      await footsal.save();
    }

    return res.status(200).json({
      message: "Password changed successfully",
    });

  } catch (error) {
    console.error("Change forgot password error:", error);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
};


module.exports = AllAuthController = {
  VerifyOtp,
  Logout,
  Login,
  forgotPassword,
  changeForgotPassword
};
