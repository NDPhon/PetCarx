import {
  addPetController,
  getPetsByCustomerIdController,
} from "../controller/petController";
import { Router } from "express";
const router = Router();
/* ============================================================
   ADD NEW PET
============================================================ */
router.post("/add-pet", addPetController);
/* ============================================================
   GET PETS BY CUSTOMER ID
============================================================ */
router.get(
  "/get-pets-by-customer-id/:customer_id",
  getPetsByCustomerIdController
);

export default router;
