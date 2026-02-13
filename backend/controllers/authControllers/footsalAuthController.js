const { FOOTSAL_PASSWORD_SALT_ROUNDS } = process.env;
const { redisClient } = require("../../config/redisConfig");
const footsal = require("../../models/footsal/footsalModel");
const user = require("../../models/user/userModel");
const { generateOTP } = require("../../utils/otpGenerator/otpGenerator");
const sendOtp = require("../../utils/sendOtp/sendOtp");
const bcrypt = require("bcryptjs");

module.exports = RegisterFootsal = async (req, res) => {
  const { footsalName, ownerName, email, password, phoneNumber } = req.body;
  // basic validation
  if (!footsalName || !ownerName || !email || !password || !phoneNumber) {
    return res.status(400).json({
      error: "Please provide all required fields",
    });
  }

  // check if footsal already exists
  const footsalEmail = await footsal.findOne({
    where: { email },
  });
  const footsalPhone = await footsal.findOne({
    where: { phoneNumber },
  });

  footsalExists = footsalEmail || footsalPhone;

  if (footsalExists) {
    return res.status(400).json({
      error: "Footsal with this email or phone number already exists",
    });
  }

  // hash password
  const hashedPassword = await bcrypt.hash(
    password,
    FOOTSAL_PASSWORD_SALT_ROUNDS
  );

  // create new footsal
  const newFootsal = await footsal.create({
    footsalName,
    ownerName,
    email,
    password: hashedPassword,
    phoneNumber,
  });

  // Generate otp code
  const otp = generateOTP();
  console.log(`Generated OTP for ${email}: ${otp}`);

  // send otp to footsal email
  sendOtp(email, otp); // set for redis for 5 min also send email

  return res.status(201).json({
    message: "Footsal registered successfully",
    footsal: {
      id: newFootsal.id,
      footsalName: newFootsal.footsalName,
      ownerName: newFootsal.ownerName,
      email: newFootsal.email,
      phoneNumber: newFootsal.phoneNumber,
      isActive: newFootsal.isActive,
      isVerified: newFootsal.isVerified,
    },
  });
};
