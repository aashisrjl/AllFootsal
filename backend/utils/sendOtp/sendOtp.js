const { redisClient } = require('../../config/redisConfig');
const sendEmail = require('../../services/mail/sendEmail');

const sendOtp = async (email, otp) => {
    try {
        // Store OTP in Redis with a 5-minute expiration
        await redisClient.setEx(`otp:${email}`, 300, otp);
        console.log(`OTP for ${email} is set to ${otp}`);
        
        //nodemailer to send email
        await sendEmail({
            option: {
                to: email,
                subject: 'Your OTP Code for Footsal Registration',
                text: `Your OTP code is ${otp} Expires in 5 minutes.`
            }
        });
        return true;
    } catch (error) {
        console.error('Error sending OTP:', error);
        return false;
    }
};

module.exports = sendOtp;