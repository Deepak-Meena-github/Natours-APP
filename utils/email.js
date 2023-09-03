const nodemailer = require('nodemailer');

const sendEmail = async options => {
  // 1) Create a transporter
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD
    }
  });

  try {
    // Verify the transporter
    await transporter.verify();
    console.log('Transporter verified successfully');

    // Define the email options
    const mailOptions = {
      from: 'Deepak Meena <admin@deepak.io>',
      to: options.email,
      subject: options.subject,
      text: options.message
      // html:
    };

    // Actually send the email
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error:', error);
    console.log(error);
  }
};

console.log('Creating transporter');

// Example usage: Call the sendEmail function to send an email
// sendEmail({
//   email: 'recipient@example.com',
//   subject: 'Test Email',
//   message: 'This is a test email.'
// });

// console.log('Sending email');

module.exports = sendEmail;
