import { RequestHandler } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

// @ts-ignore
const verifyToken: RequestHandler = (req, res, next) => {
  const cookies = req.headers.cookie;
  if (!cookies) {
    return res.status(403).end("No cookie");
  }
  const token = cookies.split("=")[1];
  if (!token) {
    return res
      .status(401)
      .json({ message: "Access denied, no token provided." });
  }

  jwt.verify(token, <string>JWT_SECRET, (err, user) => {
    if (err) {
      console.log(err);
      return res.status(403).json({ message: "Invalid or expired token" });
    }
    // @ts-ignore
    req.user = user;
    next();
  });
};

export default verifyToken;
