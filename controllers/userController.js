import bcrypt from "bcryptjs";
import { Types } from "mongoose";
import User from "../Models/userModel.js";
import httpStatusCodes from "http-status-codes";
import ApiResponse from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import {
  sendEmail,
  generateRandomCode,
  generateRandomToken,
} from "../utils/methods.js";

const registration = async (req, res, next) => {
  const { firstName, email, password, confirmPassword } = req.body;
  console.log(req.body);
  if (!firstName || !email || !password) {
    throw new ApiError(
      httpStatusCodes.BAD_REQUEST,
      "All fields are required",
      httpStatusCodes.BAD_REQUEST
    );
  }
  if (password !== confirmPassword) {
    throw new ApiError(
      httpStatusCodes.BAD_REQUEST,
      "Password and Confirm Password Must be same",
      httpStatusCodes.BAD_REQUEST
    );
  }
  const isExist = await User.findOne({ email: email });
  if (isExist) {
    throw new ApiError(
      httpStatusCodes.BAD_REQUEST,
      "This User Already Exist",
      httpStatusCodes.BAD_REQUEST
    );
  }
  const confirmationToken = generateRandomCode();
  console.log(confirmationToken);
  const user = await User.create({
    firstName,

    email,
    password,

    token: confirmationToken,
  });
  console.log(user);
  sendEmail(
    email,
    "Kumon Account Creation Request",
    `
        <p>Hello ${firstName}</p>
        <br />
        <p>Thank you for signing up with us!</p>
        <p>To complete your registration, please use the following confirmation code:</p>
        <br />
        <h2 style="background-color: #f0f0f0; padding: 10px; text-align: center;">${confirmationToken}</h2>
        <br />
        <p>If you didn't sign up for our service, please ignore this email.</p>
        <br />
        <p>Best regards,<br>Kumon Team</p>
    `
  );

  ApiResponse.result(
    res,
    { status: "User Regsitered successfully" },
    httpStatusCodes.OK
  );
};

//Validation confirmation token
const ValidationConfirmation = async (req, res, next) => {
  const { email, token } = req.body;
  if (!email || !token) {
    throw new ApiError(
      httpStatusCodes.BAD_REQUEST,
      "Email and Code are Required",
      httpStatusCodes.BAD_REQUEST
    );
  }
  const user = await User.findOne({ email: email });
  if (!user) {
    throw new ApiError(
      httpStatusCodes.BAD_REQUEST,
      "User not exist with this Email",
      httpStatusCodes.BAD_REQUEST
    );
  }
  if (user.token !== token) {
    throw new ApiError(
      httpStatusCodes.BAD_REQUEST,
      "Invalid Token",
      httpStatusCodes.BAD_REQUEST
    );
  }
  await User.updateOne({ email }, { $set: { token: null } });
  ApiResponse.result(
    res,
    { status: "Email verification is Successfull" },
    httpStatusCodes.OK
  );
};

//login api
const login = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(
      httpStatusCodes.UNPROCESSABLE_ENTITY,
      "All Fields are Required",
      httpStatusCodes.UNPROCESSABLE_ENTITY
    );
  }
  const isExist = await User.findOne({ email });
  if (!isExist) {
    throw new ApiError(
      httpStatusCodes.BAD_REQUEST,
      "Invalid Email or Password",
      httpStatusCodes.BAD_REQUEST
    );
  }

  const isMatch = await isExist.comparePassword(password);
  if (!isMatch) {
    throw new ApiError(
      httpStatusCodes.BAD_REQUEST,
      "Invalid Email or Password",
      httpStatusCodes.BAD_REQUEST
    );
  }
  console.log(isExist.token);
  if (isExist.token) {
    throw new ApiError(
      httpStatusCodes.BAD_REQUEST,
      "Email verification is Pending",
      httpStatusCodes.BAD_REQUEST
    );
  }
  const token = isExist.createToken();
  ApiResponse.result(
    res,
    { status: "Login Successfully" },
    httpStatusCodes.OK,
    token
  );
};
export { registration, ValidationConfirmation, login };
