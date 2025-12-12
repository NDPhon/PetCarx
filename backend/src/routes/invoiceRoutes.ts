import {
  addInvoiceController,
  getInvoiceByIdController,
  getInvoiceListController,
  addInvoiceDetailsController,
  getInvoiceDetailsByIdController,
} from "../controller/invoiceController";

import { Router } from "express";

const router = Router();

/* ============================================================
   ADD INVOICE
============================================================ */
router.post("/add-invoice", addInvoiceController);
/* ============================================================
   ADD INVOICE DETAILS
============================================================ */
router.post("/add-invoice-details", addInvoiceDetailsController);

/* ============================================================
   GET INVOICE LIST
============================================================ */
router.get("/get-invoice-list", getInvoiceListController);
/* ============================================================ 
    GET INVOICE BY ID
============================================================ */
router.get("/get-invoice-by-id/:invoice_id", getInvoiceByIdController);

/* ============================================================
    GET INVOICE DETAILS BY ID
============================================================ */
router.get(
  "/get-invoice-details-by-id/:invoice_id",
  getInvoiceDetailsByIdController
);
export default router;
