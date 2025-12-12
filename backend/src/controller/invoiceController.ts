import {
  addInvoiceService,
  getInvoiceByIdService,
  getInvoiceListService,
  addInvoiceDetailsService,
  getInvoiceDetailsByIdService,
} from "../service/invoiceService";

import { Request, Response } from "express";

/* ============================================================
    ADD INVOICE
============================================================ */
export const addInvoiceController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { brand_id, customer_id, employee_id, promotion_id, payment_status } =
      req.body;
    const invoice = await addInvoiceService(
      brand_id,
      customer_id,
      employee_id,
      promotion_id,
      payment_status
    );
    res.status(200).json({
      code: 200,
      message: "Invoice added successfully",
      data: invoice,
    });
  } catch (error: any) {
    console.error("Error adding invoice:", error);
    res.status(500).json({
      code: 500,
      message: error.message || "Internal Server Error",
      data: null,
    });
  }
};

export const getInvoiceByIdController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const invoice_id = parseInt(req.params.invoice_id, 10);
    const invoice = await getInvoiceByIdService(invoice_id);
    res.status(200).json({
      code: 200,
      message: "Fetched invoice successfully",
      data: invoice,
    });
  } catch (error: any) {
    console.error("Error fetching invoice by ID:", error);
    res.status(500).json({
      code: 500,
      message: error.message || "Internal Server Error",
      data: null,
    });
  }
};

export const getInvoiceListController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const invoices = await getInvoiceListService();
    res.status(200).json({
      code: 200,
      message: "Fetched invoices successfully",
      data: invoices,
    });
  } catch (error: any) {
    console.error("Error fetching invoice list:", error);
    res.status(500).json({
      code: 500,
      message: error.message || "Internal Server Error",
      data: null,
    });
  }
};

export const addInvoiceDetailsController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      invoice_id,
      item_type,
      service_id,
      product_id,
      quantity,
    }: {
      invoice_id: number;
      item_type: string;
      service_id: number | null;
      product_id: number | null;
      quantity: number;
    } = req.body;
    await addInvoiceDetailsService(
      invoice_id,
      item_type,
      service_id,
      product_id,
      quantity
    );
    res.status(200).json({
      code: 200,
      message: "Invoice details added successfully",
      data: null,
    });
  } catch (error: any) {
    console.error("Error adding invoice details:", error);
    res.status(500).json({
      code: 500,
      message: error.message || "Internal Server Error",
      data: null,
    });
  }
};

export const getInvoiceDetailsByIdController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const invoice_id = parseInt(req.params.invoice_id, 10);
    const invoiceDetails = await getInvoiceDetailsByIdService(invoice_id);
    res.status(200).json({
      code: 200,
      message: "Fetched invoice details successfully",
      data: invoiceDetails,
    });
  } catch (error: any) {
    console.error("Error fetching invoice details by ID:", error);
    res.status(500).json({
      code: 500,
      message: error.message || "Internal Server Error",
      data: null,
    });
  }
};
