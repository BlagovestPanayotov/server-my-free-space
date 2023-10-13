const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: process.env.SMTP_SERVER,
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

const mailOptions = (recipient) => {
  return {
    from: process.env.SMTP_USER,
    to: recipient,
    subject: 'Hello from Mail.com!',
    text: 'This is a test email from gmail.com through Node.js.',
  };
};

// transporter.sendMail(mailOptions(email), (error, info) => {
//   if (error) {
//     console.error('Error sending email:', error);
//     res.status(500).send('Error sending verification email');
//   } else {
//     console.log('Email sent successfully:', info.response);
//     res.send('Verification email sent');
//   }
// });

module.exports = {
  transporter,
  mailOptions
};