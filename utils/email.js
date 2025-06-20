const nodemailer = require("nodemailer");

// Create a transporter using SMTP or other email services (like SendGrid or Mailgun)
const transporter = nodemailer.createTransport({
    service: "gmail", // You can use Gmail, or any SMTP service like SendGrid, Mailgun, etc.
    auth: {
        user: process.env.EMAIL_USER, // Email address to send from (set this in .env)
        pass: process.env.EMAIL_PASS, // Email password (or App Password for Gmail)
    },
});

// Function to send email
exports.sendEmail = (to, subject, htmlContent) => {
    const mailOptions = {
        from: process.env.EMAIL_USER, // From which email the mail will be sent
        to, // Receiver's email address
        subject, // Email subject
        html: htmlContent, // HTML content for the email
    };

    return transporter.sendMail(mailOptions);
};
