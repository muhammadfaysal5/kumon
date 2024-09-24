import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import JWT from "jsonwebtoken";
const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, require: true },

    email: {
      type: String,
      require: [true, "Email is required"],
      unique: [true, "Email is already taken"],
    },
    password: {
      type: String,
      require: [true, "password required"],
    },
    token: {
      type: String,
    },
    randomToken: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);
userSchema.pre("save", async function () {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});
userSchema.methods.comparePassword = async function (userpassword) {
  const isMatch = await bcrypt.compare(userpassword, this.password);
  return isMatch;
};
userSchema.methods.createToken = function () {
  return JWT.sign({ user: this }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
};

export default mongoose.model("KUMON", userSchema);
