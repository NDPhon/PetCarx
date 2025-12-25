import { getServicesByBranchIdController } from "../controller/serviceController";
import { Router } from "express";

const router = Router();
/* ============================================================
   GET SERVICES BY BRANCH ID
============================================================ */
router.get(
  "/get-services-by-branch/:branch_id",
  getServicesByBranchIdController
);
export default router;
