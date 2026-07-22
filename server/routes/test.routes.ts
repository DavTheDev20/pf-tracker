import express from "express";
import verifyToken from "../middleware/verifyToken";
import User from "../models/user.model";
import Expense from "../models/expense.model";
import Account from "../models/account.model";

const testRouter = express.Router();

/**
 * @swagger
 * /api/test:
 *   get:
 *     summary: A test api route
 *     description: Returns a a fake user and their account information
 *     responses:
 *       200:
 *         description: A single user
 */
testRouter.get("/remaining-spending", verifyToken, async (req, res) => {
  //@ts-ignore - user object present in request
  const user = await User.findOne({ email: req.user.email });
  const accounts = await Account.find({ userId: user?._id });
  const expenses = await Expense.find({ userId: user?._id });

  const buffer = user?.spendingBuffer; // Make this a part of the user model...
  const savingsForPeriod = user?.periodSavings;

  const totalCheckingBalance = accounts
    .filter((account) => account.type?.toLowerCase() === "checking")
    .reduce((total, currentVal) => total + (currentVal?.balance ?? 0), 0);

  console.log("Total checking balance = " + totalCheckingBalance);

  const totalUnpaidExpenses = expenses
    .filter((expense) => expense.isPaid === false)
    .reduce((total, currentVal) => total + (currentVal?.amount ?? 0), 0);

  console.log("Total Expenses Remaining = " + totalUnpaidExpenses);

  const totalCreditCardBalances = accounts
    .filter((account) => account.type?.toLowerCase() === "credit card")
    .reduce((total, currentVal) => total + (currentVal?.balance ?? 0), 0);

  console.log("Total Credit Card Balances = " + totalCreditCardBalances);

  const remainingSpendingFunds =
    totalCheckingBalance -
    (buffer ?? 0) -
    totalUnpaidExpenses -
    totalCreditCardBalances -
    (savingsForPeriod ?? 0);

  res.status(200).json({ success: true, remainingSpendingFunds });
});

export default testRouter;
