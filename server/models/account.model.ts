import mongoose from "mongoose";

const accountSchema = new mongoose.Schema(
  {
    userId: mongoose.Types.ObjectId,
    name: String,
    type: String,
    balance: Number,
  },
  { timestamps: true }
);

const Account = mongoose.model("Account", accountSchema);

export default Account;
