import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger";
import appointmentRouter from "./controller/appointmentController";
import invoiceRouter from "./routes/invoiceRoutes";
import customerRouter from "./routes/customerRoutes";
import branchRouter from "./routes/branchRoutes";
import employeeRouter from "./routes/employeeRoutes";
import productRouter from "./routes/productRoutes";
import analyzeRouter from "./routes/analyzeRoutes";

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

// Swagger UI
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    explorer: true,
    customCss: ".swagger-ui .topbar { display: none }",
    customSiteTitle: "PetCarx API Documentation",
  })
);

// Swagger JSON endpoint
app.get("/api-docs.json", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.send(swaggerSpec);
});

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

const PORT: number = Number(process.env.BACKEND_PORT) || 8000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📚 Swagger docs available at http://localhost:${PORT}/api-docs`);
});
