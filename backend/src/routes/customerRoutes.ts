import { getInfoCustomerByPhoneController } from "../controller/customerController";
import { Router } from "express";
const router = Router();

/* ============================================================
    GET CUSTOMER INFO BY PHONE  
============================================================ */
router.get("/get-customer-by-phone/:phone", getInfoCustomerByPhoneController);
export default router;
