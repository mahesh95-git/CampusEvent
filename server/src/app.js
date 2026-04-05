import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import organizationRouter from "./routes/organization.js";
import authRouter from "./routes/auth.js";
import departmentRouter from "./routes/department.js";
import eventRouter from "./routes/event.js";
import studentRouter from "./routes/student.js";
import uploadRouter from "./routes/upload.js";
import errorMiddleware from "./middlewares/errorMiddleware.js";
import "./config/cloudinary.js"; // Initialize Cloudinary

dotenv.config();

const app = express();
app.use(
  cors({
    origin: process.env.CLIENT_URL || true,
    credentials: true,
  }),
);
app.use(express.json({ limit: "5mb" }));

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.get("/hello", (req, res) => {
  res.json({ message: "hello world" });
});

app.use("/api/organizations", organizationRouter);
app.use("/api/auth", authRouter);
app.use("/api/departments", departmentRouter);
app.use("/api/events", eventRouter);
app.use("/api/students", studentRouter);
app.use("/api/upload", uploadRouter);

app.use((req, res) => {
  res.status(404).json({ message: "Not found" });
});

app.use(errorMiddleware);

export default app;
