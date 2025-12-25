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

export const addCustomerRepo = async (
  full_name: string,
  gender: "M" | "F" | "O" | null,
  date_of_birth: Date | null,
  phone: string,
  email: string | null,
  national_id: string | null
): Promise<Customer> => {
  const query = `INSERT INTO customer
    (full_name, gender, date_of_birth, phone, email, national_id, join_date, total_spending, tier_id, loyalty_points)
    VALUES ($1, $2, $3, $4, $5, $6, NOW(), 0, 1, 0)
    RETURNING *`;
  const values = [full_name, gender, date_of_birth, phone, email, national_id];
  const res = await pool.query(query, values);
  return res.rows[0];
};
