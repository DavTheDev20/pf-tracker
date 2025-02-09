import express, { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user.model";

const authRouter = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;
const COOKIE_SECRET = process.env.COOKIE_SECRET;

type UserType = {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
  accounts?: Array<object>;
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
          });
          try {
            const result = await newUser.save();
            const token = jwt.sign({ email: result.email }, <string>JWT_SECRET);
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
        res.status(400).json({ success: false, bcryptErr });
        return;
      }
      if (result === false) {
        res.status(400).json({ success: false, error: "Password incorrect" });
        return;
      }

      const token = jwt.sign({ email: user.email }, <string>JWT_SECRET);
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
  .get("/auth-status", async (req, res) => {
    try {
      const token = req.headers.cookie?.split("=")[1];
      if (!token) {
        res.status(401).json({ user: null });
        return;
      }

      const decoded: any = jwt.verify(token, <string>process.env.JWT_SECRET);
      const user = await User.findOne({ email: decoded.email });
      if (!user) {
        res.status(401).json({ user: null });
        return;
      }
      res.status(200).json({
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
  });

export default authRouter;
