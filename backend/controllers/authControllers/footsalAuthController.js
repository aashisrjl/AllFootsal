const { FOOTSAL_PASSWORD_SALT_ROUNDS } = process.env;
const { redisClient } = require("../../config/redisConfig");
const { Footsal, User } = require("../../models");
const { createTenantTables } = require("../../models/footsal_tanents/createTenantTables");
const { generateOTP } = require("../../utils/otpGenerator/otpGenerator");
const sendOtp = require("../../utils/sendOtp/sendOtp");
const { sendNotificationEmail } = require("../../utils/notifications/emailNotification");
const bcrypt = require("bcryptjs");

module.exports = RegisterFootsal = async (req, res) => {
  const { footsalName, ownerName, email, password, phoneNumber } = req.body;
  // basic validation
  if (!footsalName || !ownerName || !email || !password || !phoneNumber) {
    return res.status(400).json({
      error: "Please provide all required fields",
    });
  }

  const user = await User.findOne({
    where:{email}
  })
  if(user){
    return res.status(400).json({
      error: "User with this email already exists",
    });
  }

  // check if footsal already exists
  const footsalEmail = await Footsal.findOne({
    where: { email },
  });
  const footsalPhone = await Footsal.findOne({
    where: { phoneNumber },
  });

  footsalExists = footsalEmail || footsalPhone;

  if (footsalExists) {
    return res.status(400).json({
      error: "Footsal with this email or phone number already exists",
    });
  }

  futsal_code = Number(generateOTP(6));
  console.log("Generated Futsal Code:", futsal_code);

  // hash password
  const hashedPassword = await bcrypt.hash(
    password,
    parseInt(FOOTSAL_PASSWORD_SALT_ROUNDS)
  );

  // create new footsal
  const newFootsal = await Footsal.create({
    futsalCode: futsal_code,
    futsalName: footsalName,
    ownerName,
    email,
    password: hashedPassword,
    phoneNumber,
  });

  // await createTenantTables(newFootsal.futsalCode);

  // Generate otp code
  const otp = generateOTP(6);
  const otpData={
    email,
    otp,
    type:"footsal_registration"
  }
  redisClient.setEx(`footsal:otp:${email}`, 300, JSON.stringify(otpData)); // 5 min
  console.log(`Generated OTP for ${email}: ${otp}`);

  // send otp to footsal email
  sendOtp(email,
     otp, 
     subject="Your OTP Code for Footsal Registration", 
     text=`Your OTP code is ${otp} Expires in 5 minutes.`
    );

  await sendNotificationEmail({
    to: email,
    subject: "Welcome to AllFootsal Owner Portal",
    intro: `Hi ${ownerName}, your futsal registration has been created successfully.`,
    details: [
      ["Futsal Name", footsalName],
      ["Owner Name", ownerName],
      ["Email", email],
      ["Phone", phoneNumber],
      ["Futsal Code", futsal_code],
      ["Verification", "Pending OTP confirmation"],
    ],
    closing: "Please verify your OTP to activate the owner account.\n\nRegards,\nAllFootsal Team",
  });

  return res.status(201).json({
    message: "Owner registered successfully",
    footsal: {
      id: newFootsal.id,
      futsalCode: newFootsal.footsalCode,
      futsalName: newFootsal.footsalName,
      ownerName: newFootsal.ownerName,
      email: newFootsal.email,
      phoneNumber: newFootsal.phoneNumber,
      isActive: newFootsal.isActive,
      isVerified: newFootsal.isVerified,
    },
  });
};
