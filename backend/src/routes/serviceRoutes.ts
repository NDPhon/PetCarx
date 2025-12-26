import {
  getAllServicesController,
  getServicesByBranchIdController,
  searchServiceByNameInBranchController,
} from "../controller/serviceController";
import { Router } from "express";

const router = Router();
/* ============================================================
   GET SERVICES BY BRANCH ID
============================================================ */
router.get(
  "/get-services-by-branch-id/:branch_id",
  getServicesByBranchIdController
);
/* ============================================================
   SEARCH SERVICE BY NAME IN BRANCH
============================================================ */
router.post(
  "/search-service-by-name-in-branch",
  searchServiceByNameInBranchController
);
/* ============================================================
   GET ALL SERVICES
============================================================ */
router.get("/get-all-services", getAllServicesController);

export default router;
