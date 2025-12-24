const otpGenerator  = require('otp-generator');

const generateOTP = (length) => {
    return otpGenerator.generate(length, {
         upperCase: false,
         specialChars: false,
         alphabets: false
    });
}

module.exports = { generateOTP };
