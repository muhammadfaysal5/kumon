import JWT from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";
const userAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    throw new ApiError("User is not authorize or token is missing");
  }
  const token = authHeader.split(" ")[1];
  try {
    const payload = JWT.verify(token, process.env.JWT_SECRET);
    req.user = payload;
    next();
  } catch (error) {
    throw new ApiError(`Auth Failed:${error}`);
  }
};
export default userAuth;
