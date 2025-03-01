import express from "express";
import verifyToken from "../middleware/verifyToken";
import Expense from "../models/expense.model";
import User from "../models/user.model";

const expenseRouter = express.Router();

expenseRouter
  .get("/", verifyToken, async (req, res) => {
    const user = await User.findOne({ email: req.user.email });
    const expenses = await Expense.find({ userId: user?._id });

    res.status(200).json({ success: true, expenses });
  })
  .post("/add", verifyToken, async (req, res) => {
    const user = await User.findOne({ email: req.user.email });

    const {
      body,
    }: {
      body: {
        name: string;
        amount: number;
        frequency: string;
      };
    } = req;

    if (!body.name || !body.amount || !body.frequency) {
      res
        .status(400)
        .json({ success: false, error: "No element in body can be null..." });
      return;
    }

    try {
      const newExpense = new Expense({
        name: body.name,
        amount: body.amount,
        frequency: body.frequency,
        isPaid: false,
        userId: user?._id,
      });

      const result = await newExpense.save();
      if (result._id !== null) {
        res.status(200).json({ success: true });
        return;
      }
    } catch (err) {
      res.status(400).json({ success: false, error: err });
    }
  });

export default expenseRouter;
