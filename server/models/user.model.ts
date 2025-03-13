import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firstName: String,
    lastName: String,
    email: {
      type: String,
      unique: true,
    },
    password: String,
    spendingBuffer: Number,
    periodSavings: Number,
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
