const { getRandomUrl } = require("../valuesGenerator");
const { emailVerificationHTML } = require("./emailVerificationMessage");
const { transporter } = require("./nodemailerConfig");

function mailOptions(recipient, url) {
  return {
    from: process.env.SMTP_USER,
    to: recipient,
    subject: 'Hello from Mail.com!',
    html: emailVerificationHTML(url),
  };
};

function sendVerificationEmail(recipient,url) {
  transporter.sendMail(mailOptions(recipient, url), (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
      res.status(500).send('Error sending verification email');
    } else {
      console.log('Email sent successfully:', info.response);
      res.send('Verification email sent');
    }
  });
};

module.exports = {
  sendVerificationEmail
};