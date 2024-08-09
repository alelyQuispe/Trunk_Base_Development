import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import { EmailData } from '../models/EmailData';

dotenv.config();

const EMAIL_USER = process.env.EMAIL_USER || '';
const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD || '';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASSWORD,
  },
});

async function sendEmailWithAttachment(emailData: EmailData) {
  const mailOptions: nodemailer.SendMailOptions = {
    from: EMAIL_USER,
    to: emailData.to,
    subject: emailData.subject,
    text: emailData.text,
    attachments: emailData.filename ? [
      {
        filename: emailData.filename,
        content: emailData.attachment,
      },
    ] : [],
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
    } else {
      console.log('Email sent:', info.response);
    }
  });
}

export { sendEmailWithAttachment };
