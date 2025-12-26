import { Invoice } from "../model/invoice";
import pool from "../config/db";

export const addInvoiceRepo = async (
  brand_id: number,
  customer_id: number,
  employee_id: number,
  promotion_id?: number,
  payment_status: string = "Pending"
): Promise<Invoice> => {
  const query = `
      SELECT * FROM fnc_add_invoice($1, $2, $3, $4, $5)
    `;
  const values = [
    brand_id,
    customer_id,
    employee_id,
    promotion_id || null,
    payment_status,
  ];

  const res = await pool.query(query, values);
  return res.rows[0];
};

export const addInvoiceDetailsRepo = async (
  invoice_id: number,
  item_type: string,
  service_id: number | null,
  product_id: number | null,
  quantity: number
): Promise<void> => {
  const query = `
      SELECT * FROM fnc_add_invoice_detail($1, $2, $3, $4, $5)
    `;
  const values = [invoice_id, item_type, service_id, product_id, quantity];
  await pool.query(query, values);
};

export const getInvoiceListRepo = async (): Promise<Invoice[]> => {
  const query = `SELECT * FROM fnc_get_invoice_list()`;
  const res = await pool.query(query);
  return res.rows;
};

export const getInvoiceByIdRepo = async (
  invoice_id: number
): Promise<Invoice | null> => {
  const query = `
        SELECT * FROM fnc_get_invoice_by_id($1)
        `;
  const values = [invoice_id];
  const res = await pool.query(query, values);
  return res.rows[0] || null;
};

export const getInvoiceDetailsByIdRepo = async (
  invoice_id: number
): Promise<any[]> => {
  const query = `
        SELECT * FROM fnc_get_invoice_details($1)
        `;
  const values = [invoice_id];
  const res = await pool.query(query, values);
  return res.rows;
};

export const updateInvoicePaymentStatusRepo = async (
  invoice_id: number,
  payment_status: string
): Promise<Invoice | null> => {
  const query = `
        SELECT * FROM fnc_update_invoice_status($1, $2)
        `;
  const values = [invoice_id, payment_status];
  const res = await pool.query(query, values);
  return res.rows[0] || null;
};

export const getInvoicesByCustomerPhoneRepo = async (
  phone: string,
  branch_id: number
): Promise<any[]> => {
  const query = `
    SELECT * FROM fnc_get_invoices_by_customer_phone($1, $2)
  `;
  const values = [phone, branch_id];
  const res = await pool.query(query, values);
  return res.rows;
};
