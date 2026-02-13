const bcrypt = require("bcryptjs");
const { User } = require("../../models/index");
const generateJwt = require("../../utils/jwt/generateJwt");
const sendOtp = require("../../utils/sendOtp/sendOtp");
const {USER_PASSWORD_SALT_ROUNDS, USER_TOKEN_EXPIRATION, JWT_SECRET_USER } = process.env;

// register user api
module.exports = userRegister = async (req, res) => {
  const { username, email, password,confirmPassword, phoneNumber } = req.body;

  // basic validation
  if (!username || !email || !phoneNumber || !password || !confirmPassword) {
    return res.status(400).json({
      error: "Please provide all required fields",
    });
  }
  if(password !== confirmPassword){
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

  // Hash password
  const hashedPassword = password ? await bcrypt.hash(password,USER_PASSWORD_SALT_ROUNDS ) : null;

  const newUser = await User.create({
    username,
    email,
    password: hashedPassword,
    phoneNumber,
  });
  

  if (newUser) {
    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        phoneNumber: newUser.phoneNumber,
        role: newUser.role,
        is_active: newUser.is_active,
      },
    });

    // Generate otp code and send email with redis
    otp = generateOTP();
    redisClient.setEx(`otp:${email}`, 300, otp); // 5 min
    console.log(`Generated OTP for ${email}: ${otp}`);
    sendOtp(email=email,
      otp=otp,
      subject="Your OTP Code for User Registration", 
      text=`Your OTP code is ${otp} Expires in 5 minutes.`
    );

  } else {
    res.status(400).json({
      error: "Invalid user data",
    });
  }
};

