import {
  totalRevenueController,
  paymentsController,
} from "../controller/analyzeController";
import { Router } from "express";

const router = Router();
/* ============================================================
   TOTAL REVENUE
============================================================ */
router.post("/total-revenue", totalRevenueController);
/* ============================================================
   PAYMENTS
============================================================ */
router.post("/payments", paymentsController);
export default router;
