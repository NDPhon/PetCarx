import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import appointmentRouter from "./controller/appointmentController";
import mockRoutes from "./mockRoutes";

dotenv.config();
console.log("DATABASE_URL:", process.env.DATABASE_URL);

const app = express();

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(express.json());

// Route cho appointment
app.use("/api/appointments", appointmentRouter);

// Mock routes for other APIs during local testing
app.use('/api', mockRoutes);

const PORT: number = Number(process.env.BACKEND_PORT) || 8000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
