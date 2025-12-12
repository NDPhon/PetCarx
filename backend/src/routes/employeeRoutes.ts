import { getEmployeeReceptionistListController } from "../controller/employeeController";
import { Router } from "express";

const router = Router();
/* ============================================================
   GET EMPLOYEE RECEPTIONIST LIST
============================================================ */
router.get(
  "/get-employee-receptionist-list/:branch_id",
  getEmployeeReceptionistListController
);
export default router;
