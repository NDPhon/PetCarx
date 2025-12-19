import {
  getProductsByBranchController,
  getAllVaccinesController,
  getVaccinesByBranchController,
  searchVaccineByNameInBranchController,
} from "../controller/productController";

import { Router } from "express";

const router = Router();
/* ============================================================
   GET ALL VACCINES
============================================================ */
router.get("/get-all-vaccines", getAllVaccinesController);
/* ============================================================
   GET VACCINES BY BRANCH
============================================================ */
router.get("/get-vaccines-by-branch/:branch_id", getVaccinesByBranchController);
/* ============================================================
   SEARCH VACCINE BY NAME IN BRANCH
============================================================ */
router.post(
  "/search-vaccine-by-name-in-branch",
  searchVaccineByNameInBranchController
);
/* ============================================================
    GET PRODUCTS BY BRANCH
============================================================ */
router.get("/get-products-by-branch/:branch_id", getProductsByBranchController);
export default router;
