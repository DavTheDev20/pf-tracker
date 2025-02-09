import express from "express";

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
testRouter.get("", (req, res) => {
  res.status(200).json({
    accountNum: "2049812",
    accountHolder: "Nina Goldfarb",
    accountBal: 12492.34,
    transactions: [
      {
        id: 492,
        type: "credit",
        category: "shopping",
        pending: false,
        name: "Ulta Beauty",
        amount: 32.49,
      },
    ],
  });
  return;
});

export default testRouter;
