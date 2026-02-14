const otpGenerator = require('otp-generator');

const generateOTP = (length) => {
    const otp = otpGenerator.generate(length, {
        lowerCaseAlphabets: false,
        upperCaseAlphabets: false,
        specialChars: false,
        digits: true
    });

    console.log("Generated OTP:", otp);
    return otp;
}

module.exports = { generateOTP };
