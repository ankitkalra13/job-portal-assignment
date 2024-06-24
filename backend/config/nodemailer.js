const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST, // SMTP server host
    port: process.env.SMTP_PORT, // SMTP server port
    secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
    auth: {
        user: process.env.EMAIL_USER, // SMTP server username
        pass: process.env.EMAIL_PASS  // SMTP server password
    }
});

module.exports = transporter;
