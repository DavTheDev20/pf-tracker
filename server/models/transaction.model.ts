import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    accountId: mongoose.Types.ObjectId,
    amount: Number,
    type: String,
    category: String,
  },
  { timestamps: true }
);

const Transaction = mongoose.model("Transaction", transactionSchema);

export default Transaction;
