import "dotenv/config";

import express from "express";
import morgan from "morgan";
import cors from "cors";
import testRouter from "./routes/test.routes";
import authRouter from "./routes/auth.routes";
import accountRouter from "./routes/account.routes";
import mongoose from "mongoose";
import swaggerJsDoc from "swagger-jsdoc";
import swaggerUI from "swagger-ui-express";

const app = express();
const PORT = 8080;
const DB_URI = process.env.MONGODB_URI;

const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "pf-tracker",
      version: "1.0.0",
      description: "API routes for pf tracker application",
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
      },
    ],
  },
  apis: ["./routes/*.ts"],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDocs));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use("/api/test", testRouter);
app.use("/api/auth", authRouter);
app.use("/api/accounts", accountRouter);

app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}...`);
  mongoose
    .connect(<string>DB_URI)
    .then(() => {
      console.log("Connected to database");
    })
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
});
