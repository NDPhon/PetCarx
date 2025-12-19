import {
  revenueByBranchController,
  totalRevenueController,
} from "../controller/analyzeController";
import { Router } from "express";

const router = Router();
/* ============================================================
   TOTAL REVENUE
============================================================ */
router.post("/total-revenue", totalRevenueController);
/* ============================================================
   REVENUE BY BRANCH
============================================================ */
router.post("/revenue-by-branch", revenueByBranchController);
export default router;
