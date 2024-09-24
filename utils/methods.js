import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";

export const sendEmail = (recipient, subject, content) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.SIGNUP_EMAIL,
      pass: process.env.SIGNUP_EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.SIGNUP_EMAIL,
    to: recipient,
    subject: subject,
    html: content,
  };

  transporter.sendMail(mailOptions);
};

export const generateRandomCode = () => {
  return Math.floor(1000 + Math.random() * 9000);
};
export const generateRandomToken = (length) => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let token = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    token += characters.charAt(randomIndex);
  }

  return token;
};
