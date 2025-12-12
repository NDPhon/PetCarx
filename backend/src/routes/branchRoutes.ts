import { getBranchListController } from "../controller/branchController";
import { Router } from "express";

const router = Router();

/* ============================================================
   GET BRANCH LIST
============================================================ */
router.get("/get-branch-list", getBranchListController);
export default router;
