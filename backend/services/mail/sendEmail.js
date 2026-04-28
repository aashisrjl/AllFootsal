//nodemailer send email service
const nodemailer = require('nodemailer');
const { EMAIL_HOST_USER, EMAIL_HOST_PASSWORD, EMAIL_DEFAULT_FROM } = process.env;

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: EMAIL_HOST_USER,
        pass: EMAIL_HOST_PASSWORD
    }
});

const sendEmail = async (payload = {}) => {
    const option = payload.option || payload;

    const mailOptions = {
        from: option.from || EMAIL_DEFAULT_FROM || EMAIL_HOST_USER,
        to: option.to,
        subject: option.subject,
        text: option.text,
        html: option.html
    }
    try {
        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully');
        return true;
    } catch (error) {
        console.error('Error sending email:', error);
        return false;
    }
}

module.exports = sendEmail;

