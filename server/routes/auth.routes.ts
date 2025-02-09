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
 *     description: Returns an auth jsonwebtoken to authenticate user
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
 *         description: A jsonwebtoken string
 *         content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                success:
 *                  type: boolean
 *                token:
 *                  type: string
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
            res.cookie(token, COOKIE_SECRET, {
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
   *     description: Returns an auth jsonwebtoken to authenticate user
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
   *         description: A jsonwebtoken string
   *         content:
   *          application/json:
   *            schema:
   *              type: object
   *              properties:
   *                success:
   *                  type: boolean
   *                token:
   *                  type: string
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
      res.cookie(token, COOKIE_SECRET, {
        httpOnly: true,
        sameSite: "strict",
        maxAge: 24 * 60 * 60 * 1000,
      });
      return res.status(200).json({ succss: true });
    });
  });

export default authRouter;
