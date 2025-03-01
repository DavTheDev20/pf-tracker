import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema({
  name: String,
  amount: Number,
  frequency: String,
  isPaid: Boolean,
  userId: mongoose.Types.ObjectId,
});

const Expense = mongoose.model("Expense", expenseSchema);

export default Expense;
