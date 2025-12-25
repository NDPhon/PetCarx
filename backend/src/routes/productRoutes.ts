import {
  getProductsByBranchIdController,
  searchProductByNameInBranchController,
  getALlProductsController,
} from "../controller/productController";

import { Router } from "express";

const router = Router();

/* ============================================================
   GET PRODUCTS BY BRANCH ID
============================================================ */
router.get(
  "/get-products-by-branch-id/:branch_id",
  getProductsByBranchIdController
);
/* ============================================================
   SEARCH PRODUCT BY NAME IN BRANCH
============================================================ */
router.get(
  "/search-product-by-name-in-branch/:branch_id",
  searchProductByNameInBranchController
);
/* ============================================================
   GET ALL PRODUCTS
============================================================ */
router.get("/get-all-products", getALlProductsController);

export default router;
