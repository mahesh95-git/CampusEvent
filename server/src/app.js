import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import organizationRouter from "./routes/organization.js";
import errorMiddleware from "./middlewares/errorMiddleware.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: "5mb" }));

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.get("/hello", (req, res) => {
  res.json({ message: "hello world" });
});

app.use("/api/organizations", organizationRouter);

app.use((req, res) => {
  res.status(404).json({ message: "Not found" });
});

app.use(errorMiddleware);

export default app;
