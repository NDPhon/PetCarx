import {
  getEmployeeReceptionistListController,
  getEmployeeDoctorListController,
} from "../controller/employeeController";
import { Router } from "express";

const router = Router();
/* ============================================================
   GET EMPLOYEE RECEPTIONIST LIST
============================================================ */
router.get(
  "/get-employee-receptionist-list/:branch_id",
  getEmployeeReceptionistListController
);

router.get(
  "/get-employee-doctor-list/:branch_id",
  getEmployeeDoctorListController
);
export default router;
