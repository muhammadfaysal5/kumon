import dotenv from "dotenv";
dotenv.config();
import express from "express";
import connectDB from "./config/dbconnection.js";
import * as ErrorHandler from "./Middleware/errorHandler.js";
const app = express();
//routes
import userRoutes from "./Routes/userRoutes.js";

app.use(express.json());
app.use("/api", userRoutes);
//error handler
app.use(ErrorHandler.notFoundErrorHandler);
app.use(ErrorHandler.errorHandler);

const PORT = process.env.PORT || 7000;
connectDB();
app.listen(PORT, () => {
  console.log("------------------------------------------------");
  console.log(`Status: Running`);
  console.log(`Listening to Port: ${PORT}`);
  console.log("-----------------------------------------------");
});
