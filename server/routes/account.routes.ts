import express, { Request as ExpressRequest, Response } from "express";
import verifyToken from "../middleware/verifyToken";
import User from "../models/user.model";
import Account from "../models/account.model";

const accountRouter = express.Router();

type Request = ExpressRequest & {
  user: {
    email: string;
    iat: Date;
  };
};

accountRouter
  // @ts-ignore
  //Retrieve Accounts
  .get("/", verifyToken, async (req: Request, res) => {
    const user = await User.findOne({ email: req.user.email });
    if (!user) {
      return res.status(400).json({ success: false, error: "No user exists" });
    }
    try {
      const userAccounts = await Account.find({ userId: user._id });
      return res.status(200).json({ success: true, accounts: userAccounts });
    } catch (err) {
      res.status(400).json({ success: false });
    }

    res.json({ message: "This is a protected route..." });
  })
  // @ts-ignore
  // Add Account
  .post("/add", verifyToken, async (req: Request, res) => {
    const user = await User.findOne({ email: req.user.email });
    if (!user) {
      return res.status(400).json({ success: false, error: "No user exists" });
    }
    try {
      const {
        body,
      }: { body: { name: string; type: string; balance: string } } = req;
      if (!body.name || !body.type || !body.balance) {
        return res.status(400).json({
          success: false,
          error: "Body must contain all required data",
        });
      }
      const newAccount = new Account({
        userId: user._id,
        name: body.name,
        type: body.type,
        balance: body.balance,
      });
      const result = await newAccount.save();
      return res.status(200).json({ success: true });
    } catch (err) {
      return res.status(400).json({ success: false, err });
    }
  });

// TODO: Create an endpoint to get the balances for debt and equity
// Return an object with debt and equity fields

export default accountRouter;
