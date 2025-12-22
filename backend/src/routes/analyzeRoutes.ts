import { totalRevenueController } from "../controller/analyzeController";
import { Router } from "express";

const router = Router();
/* ============================================================
   TOTAL REVENUE
============================================================ */
router.post("/total-revenue", totalRevenueController);

export default router;
