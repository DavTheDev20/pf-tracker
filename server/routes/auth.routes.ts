import express, { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user.model";
import verifyToken from "../middleware/verifyToken";

const authRouter = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;
const COOKIE_SECRET = process.env.COOKIE_SECRET;

type UserType = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: User Registration
 *     description: Creates a new user and sets the JWT as an HTTP Only cookie to authenticate the user
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              firstName:
 *                type: string
 *              lastName:
 *                type: string
 *              username:
 *                type: string
 *              email:
 *                type: string
 *              password:
 *                type: string
 *     responses:
 *       200:
 *         content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                success:
 *                  type: boolean
 */
authRouter
  // @ts-ignore
  .post("/register", (req, res) => {
    if (Object.keys(req.body).length === 0) {
      res.status(400).json({ success: false, error: `Body cannot be empty` });
      return;
    }
    try {
      const { body }: { body: UserType } = req;
      const saltRounds = 10;
      bcrypt.genSalt(saltRounds, (saltErr, salt) => {
        if (saltErr) {
          console.log(saltErr);
          return res.status(500).end("Salt error, please try again");
        }
        bcrypt.hash(body.password, salt, async (genErr, hash) => {
          if (genErr) {
            console.log(genErr);
            return res.status(500).end("Hashing error, please try again");
          }
          const newUser = new User({
            firstName: body.firstName,
            lastName: body.lastName,
            email: body.email,
            password: hash,
            spendingBuffer: 0,
            periodSavings: 0,
          });
          try {
            const result = await newUser.save();
            const token = jwt.sign(
              {
                email: result.email,
                firstName: result.firstName,
                lastName: result.lastName,
              },
              <string>JWT_SECRET
            );
            res.cookie("token", token, {
              httpOnly: true,
              sameSite: "strict",
              maxAge: 24 * 60 * 60 * 1000,
            });
            return res.status(200).json({ success: true });
          } catch (error) {
            return res.status(400).json({ success: false, error });
          }
        });
      });
    } catch (err) {
      return res.status(400).json({ success: false, err });
    }
  })
  /**
   * @swagger
   * /api/auth/login:
   *   post:
   *     summary: User Login
   *     description: Sets the JWT as an HTTP Only cookie to authenticate the user
   *     requestBody:
   *      required: true
   *      content:
   *        application/json:
   *          schema:
   *            type: object
   *            properties:
   *              username:
   *                type: string
   *              password:
   *                type: string
   *     responses:
   *       200:
   *         content:
   *          application/json:
   *            schema:
   *              type: object
   *              properties:
   *                success:
   *                  type: boolean
   */
  .post("/login", async (req, res) => {
    const { body }: { body: { email: string; password: string } } = req;
    const user = await User.findOne({ email: body.email });
    if (user == null) {
      res.status(400).json({ success: false, error: "No user found" });
      return;
    }
    //@ts-ignore
    bcrypt.compare(body.password, user.password, (bcryptErr, result) => {
      if (bcryptErr) {
        res.status(500).json({ success: false, bcryptErr });
        return;
      }
      if (result === false) {
        res.status(400).json({ success: false, error: "Password incorrect" });
        return;
      }

      const token = jwt.sign(
        {
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
        },
        <string>JWT_SECRET
      );
      res.cookie("token", token, {
        httpOnly: true,
        sameSite: "strict",
        maxAge: 24 * 60 * 60 * 1000,
      });
      return res.status(200).json({ succss: true });
    });
  })
  /**
   * @swagger
   * /api/auth/logout:
   *   post:
   *     summary: User Logout
   *     description: Removes the JWT token for the user
   *     responses:
   *       200:
   *         content:
   *          application/json:
   *            schema:
   *              type: object
   *              properties:
   *                success:
   *                  type: boolean
   */
  .post("/logout", (req, res) => {
    res.clearCookie("token", { path: "/" });
    res.status(200).json({ success: true });
  })
  /**
   * @swagger
   * paths:
   *  /api/auth/auth-status:
   *   get:
   *     summary: Auth Status
   *     description: Gets the status of the currently logged in user and returns the details of the user if successful
   *     responses:
   *       200:
   *         content:
   *            application/json:
   *              schema:
   *                type: object
   *                properties:
   *                  success:
   *                    type: boolean
   *                  user:
   *                    type: object
   *                    properties:
   *                      email:
   *                        type: string
   *                      firstName:
   *                        type: string
   *                      lastName:
   *                        type: string
   */
  .get("/auth-status", async (req, res) => {
    try {
      const token = req.headers.cookie?.split("=")[1];
      if (!token) {
        res.status(401).json({ user: null });
        return;
      }

      const decoded: Partial<{
        email: string;
        firstName: string;
        lastName: string;
        iat: Date;
      }> = <object>jwt.verify(token, <string>process.env.JWT_SECRET);
      let user = decoded;
      if (!user) {
        res.status(401).json({ user: null });
        return;
      }
      res.status(200).json({
        success: true,
        user: {
          email: user?.email,
          firstName: user?.firstName,
          lastName: user?.lastName,
        },
      });
      return;
    } catch (err) {
      res.status(500).json({ success: false, err });
      return;
    }
  })
  .get("/user-info", verifyToken, async (req, res) => {
    const user = await User.findOne({ email: req.user.email });

    res.status(200).json({
      success: true,
      userInfo: {
        spendingBuffer: user?.spendingBuffer,
        periodSavings: user?.periodSavings,
      },
    });
  })
  .put("/update/user-info", verifyToken, async (req, res) => {
    if (req.body.spendingBuffer === null && req.body.periodSavings === null) {
      res.status(400).json({
        success: false,
        error: "Both elements in request body cannot be null",
      });
      return;
    }

    let editSpendBufferResult;
    let editPeriodSavingsResult;

    if (req.body.spendingBuffer) {
      editSpendBufferResult = await User.updateOne(
        { email: req.user.email },
        {
          spendingBuffer: req.body.spendingBuffer,
        }
      );
    }

    if (req.body.periodSavings) {
      editPeriodSavingsResult = await User.updateOne(
        { email: req.user.email },
        {
          periodSavings: req.body.periodSavings,
        }
      );
    }

    if (editSpendBufferResult || editPeriodSavingsResult) {
      res.status(200).json({ success: true });
      return;
    }

    res.status(500).json({ success: false });
  });

export default authRouter;
