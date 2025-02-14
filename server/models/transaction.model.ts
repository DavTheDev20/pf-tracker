import mongoose from "mongoose";

// Add Description and Add Another Date Field (transactionDate)
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
