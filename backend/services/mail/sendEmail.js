//nodemailer send email service
const nodemailer = require('nodemailer');
const { EMAIL_HOST_USER, EMAIL_HOST_PASSWORD, EMAIL_HOST , EMAIL_PORT, EMAIL_SECURE, EMAIL_DEFAULT_FROM} = process.env;

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: EMAIL_HOST_USER,
        pass: EMAIL_HOST_PASSWORD
    }
});

const sendEmail = async ({option})=>{
    const mailOptions = {
        from: EMAIL_DEFAULT_FROM || EMAIL_HOST_USER,
        to: option.to,
        subject: option.subject,
        text: option.text
    }
    try {
        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully');
    } catch (error) {
        console.error('Error sending email:', error);
    }
}

module.exports = sendEmail;

