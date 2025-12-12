import { Customer } from "../model/customer";
import pool from "../config/db";

export const getInfoCustomerByPhoneRepo = async (
  phone: string
): Promise<Customer | null> => {
  const query = ` 
    SELECT * FROM fnc_get_customer_by_phone($1)
  `;
  const values = [phone];
  const res = await pool.query(query, values);
  return res.rows[0] || null;
};
