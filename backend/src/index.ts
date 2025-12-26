import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import appointmentRouter from "./controller/appointmentController";
import invoiceRouter from "./routes/invoiceRoutes";
import customerRouter from "./routes/customerRoutes";
import branchRouter from "./routes/branchRoutes";
import employeeRouter from "./routes/employeeRoutes";
import productRouter from "./routes/productRoutes";
import analyzeRouter from "./routes/analyzeRoutes";
import petRoute from "./routes/petRoutes";
import serviceRoute from "./routes/serviceRoutes";
import medicalRoute from "./routes/medicalRoutes";

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
// Route cho invoice
app.use("/api/invoices", invoiceRouter);
// Route cho customer
app.use("/api/customers", customerRouter);
// Route cho branch
app.use("/api/branches", branchRouter);
// Route cho employee
app.use("/api/employees", employeeRouter);
// Route cho product
app.use("/api/products", productRouter);
// Route cho analyze
app.use("/api/analyze", analyzeRouter);
// Route cho pet
app.use("/api/pets", petRoute);
// Route cho service
app.use("/api/services", serviceRoute);
// Route cho medical records
app.use("/api/medical", medicalRoute);

const PORT: number = Number(process.env.BACKEND_PORT) || 8000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
