const bcrypt = require("bcryptjs");
const { User } = require("../../models/index");
const generateJwt = require("../../utils/jwt/generateJwt");
const sendOtp = require("../../utils/sendOtp/sendOtp");
const { generateOTP } = require("../../utils/otpGenerator/otpGenerator");
const { redisClient } = require("../../config/redisConfig");
const { USER_PASSWORD_SALT_ROUNDS, USER_TOKEN_EXPIRATION, JWT_SECRET_USER } =
  process.env;

// register user api
module.exports = userRegister = async (req, res) => {
  const { username, email, password, confirmPassword, phoneNumber } = req.body;

  
  // basic validation
  if (!username || !email || !phoneNumber || !password || !confirmPassword) {
    return res.status(400).json({
      error: "Please provide all required fields",
    });
  }
  console.log(req.body);

  if (password !== confirmPassword) {
    return res.status(400).json({
      error: "Passwords do not match",
    });
  }

  // Check if user already exists
  const emailExists = await User.findOne({
    where: { email },
  });

  const phoneExists = await User.findOne({
    where: { phoneNumber },
  });

  const userExists = emailExists || phoneExists;

  if (userExists) {
    return res.status(400).json({
      error: "User with this email,phone already exists",
    });
  }

  const device = req.headers["user-agent"] || "Unknown device";
  const location =
    req.headers["x-forwarded-for"] ||
    req.connection.remoteAddress ||
    "Unknown location";
  // Hash password
  const hashedPassword = password
    ? await bcrypt.hash(password, parseInt(USER_PASSWORD_SALT_ROUNDS))
    : null;

  const newUser = await User.create({
    username,
    email,
    password: hashedPassword,
    phoneNumber,
    role: "user",
    device,
    location,
  });

  if (newUser) {
    // Generate otp code and send email with redis
    const otp = generateOTP(6);
    const otpData = {
      email,
      otp,
      type: "user_registration",
    };
    redisClient.setEx(`user:otp:${email}`, 300, JSON.stringify(otpData)); // 5 min
    console.log(`Generated OTP for ${email}: ${otp}`);
    sendOtp(
      email,
      otp,
      (subject = "Your OTP Code for User Registration"),
      (text = `Your OTP code is ${otp} Expires in 5 minutes.`),
    );
    console.log("mail send");

    //return data
    res.status(201).json({
      message: "User registered successfully, send otp to email for verification",
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        phoneNumber: newUser.phoneNumber,
        role: newUser.role,
        device: newUser.device,
        location: newUser.location,
        is_active: newUser.is_active,
      },
    });
  } else {
    res.status(400).json({
      error: "Invalid user data",
    });
  }
};
