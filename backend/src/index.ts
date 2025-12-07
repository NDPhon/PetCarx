import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pool from "./config/db";
import appointmentRouter from "./controller/appointmentController";

dotenv.config();
console.log("DATABASE_URL:", process.env.DATABASE_URL);

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

app.use(express.json());

// Route cho appointment
app.use("/api/appointments", appointmentRouter);

const PORT: number = Number(process.env.BACKEND_PORT) || 8000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
