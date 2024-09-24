import { Router } from "express";
import {
  registration,
  login,
  ValidationConfirmation,
} from "../controllers/userController.js";
const userRouter = Router();
import asyncHandler from "../utils/AsyncHandler.js";
import userAuth from "../Middleware/tokenAuth.js";

userRouter.post("/registration", asyncHandler(registration));
userRouter.post("/verify", asyncHandler(ValidationConfirmation));
userRouter.post("/login", asyncHandler(login));

export default userRouter;
