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
  /**
   * @swagger
   * /api/accounts:
   *   get:
   *     summary: Get Accounts
   *     description: Returns all the accounts associated with a user
   *     responses:
   *       200:
   *         content:
   *            application/json:
   *              schema:
   *                type: object
   *                properties:
   *                  success:
   *                    type: boolean
   *                  accounts:
   *                     type: array
   *                     items:
   *                        type: object
   *                        properties:
   *                          userId:
   *                            type: string
   *                          name:
   *                            type: string
   *                          type:
   *                            type: string
   *                          balance:
   *                            type: number
   *                          createdAt:
   *                            type: string
   *                            format: date-time
   *                          updatedAt:
   *                            type: string
   *                            format: date-time
   */
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
  /**
   * @swagger
   * /api/accounts/add:
   *  post:
   *    summary: Add Account
   *    description: Adds new account for a user
   *    requestBody:
   *      required: true
   *      content:
   *        application/json:
   *          schema:
   *            type: object
   *            properties:
   *              name:
   *                type: string
   *              type:
   *                type: string
   *              balance:
   *                type: number
   *    responses:
   *      200:
   *        content:
   *          application/json:
   *            schema:
   *              type: object
   *              properties:
   *                success:
   *                  type: boolean
   *
   */
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
      }: { body: { name: string; type: string; balance: number } } = req;
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
  })
  /**
   * @swagger
   * /api/accounts/update/:accountId:
   *  put:
   *    summary: Edit Account
   *    description: Edits existing account for a user
   *    requestBody:
   *      required: true
   *      content:
   *        application/json:
   *          schema:
   *            type: object
   *            properties:
   *              name:
   *                type: string
   *              type:
   *                type: string
   *              balance:
   *                type: number
   *    responses:
   *          200:
   *            content:
   *              application/json:
   *                schema:
   *                  type: object
   *                  properties:
   *                    success:
   *                      type: boolean
   *
   */

  // @ts-ignore
  .put("/update/:accountId", verifyToken, async (req, res) => {
    const accountId = req.params["accountId"];
    const {
      body,
    }: {
      body: {
        name?: string;
        type?: string;
        balance?: number;
      };
    } = req;
    try {
      const account = await Account.findOne({ _id: accountId });
      const updateResponse = await Account.updateOne(
        { _id: account?._id },
        {
          userId: account?.userId,
          name: body.name || account?.name,
          type: body.type || account?.type,
          balance: body.balance || account?.balance,
        }
      );
      if (updateResponse.modifiedCount === 1) {
        return res.status(200).json({ success: true });
      }
      return res.status(400).json({ success: false });
    } catch (err) {
      return res.status(400).json({ success: false, error: err });
    }
  })
  /**
   * @swagger
   *  /api/accounts/balances:
   *    get:
   *      summary: Account Balances
   *      description: Retrieives balances and calculates Equity, Debt, and Net Worth amounts
   *      responses:
   *        200:
   *          content:
   *            application/json:
   *              schema:
   *                type: object
   *                properties:
   *                  equityBal:
   *                    type: number
   *                  debtBal:
   *                    type: number
   *                  netWorth:
   *                    type: number
   */

  // @ts-ignore
  .get("/balances", verifyToken, async (req: Request, res) => {
    const user = await User.findOne({ email: req.user.email });
    const accounts = await Account.find({ userId: user?._id });

    const equityBal = accounts
      .filter((acct) =>
        acct.type
          ? acct.type.toLowerCase() === "checking" ||
            acct.type.toLowerCase() === "savings"
          : null
      )
      //@ts-ignore
      .reduce((accumulator, currVal) => accumulator + currVal.balance, 0);

    const debtBal =
      accounts
        .filter(
          (acct) =>
            acct.type?.toLowerCase() === "credit card" ||
            acct.type?.toLowerCase() === "loan"
        )
        // @ts-ignore
        .reduce((accumulator, currVal) => accumulator + currVal.balance, 0) *
      -1;

    const netWorth = equityBal + debtBal;

    res.status(200).json({ equityBal, debtBal, netWorth });
  });

export default accountRouter;
