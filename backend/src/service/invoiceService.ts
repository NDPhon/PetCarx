import {
  addInvoiceRepo,
  getInvoiceByIdRepo,
  getInvoiceListRepo,
  addInvoiceDetailsRepo,
  getInvoiceDetailsByIdRepo,
} from "../repo/invoiceRepo";

import { Invoice } from "../model/invoice";

export const addInvoiceService = async (
  brand_id: number,
  customer_id: number,
  employee_id: number,
  promotion_id?: number,
  payment_status: string = "Pending"
): Promise<Invoice> => {
  return await addInvoiceRepo(
    brand_id,
    customer_id,
    employee_id,
    promotion_id,
    payment_status
  );
};

export const getInvoiceByIdService = async (
  invoice_id: number
): Promise<Invoice | null> => {
  return await getInvoiceByIdRepo(invoice_id);
};

export const getInvoiceListService = async (): Promise<Invoice[]> => {
  return await getInvoiceListRepo();
};

export const addInvoiceDetailsService = async (
  invoice_id: number,
  item_type: string,
  service_id: number | null,
  product_id: number | null,
  quantity: number
): Promise<void> => {
  return await addInvoiceDetailsRepo(
    invoice_id,
    item_type,
    service_id,
    product_id,
    quantity
  );
};

export const getInvoiceDetailsByIdService = async (
  invoice_id: number
): Promise<any[]> => {
  return await getInvoiceDetailsByIdRepo(invoice_id);
};
