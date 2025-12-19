import { Product } from "../model/product";
import pool from "../config/db";

export const getALlVaccinesRepo = async (): Promise<any[]> => {
  const query = `SELECT * FROM fnc_get_all_vaccine_by_branch()`;
  const res = await pool.query(query);
  return res.rows;
};

export const getVaccinesByBranchRepo = async (
  branch_id: number
): Promise<any[]> => {
  const query = `SELECT * FROM fnc_get_vaccine_by_branch($1)`;
  const values = [branch_id];
  const res = await pool.query(query, values);
  return res.rows;
};

export const searchVaccineByNameInBranchRepo = async (
  branch_id: number,
  vaccine_name: string
): Promise<any[]> => {
  const query = `SELECT * FROM fnc_search_vaccine_by_name_in_branch($1, $2)`;
  const values = [branch_id, vaccine_name];
  const res = await pool.query(query, values);
  return res.rows;
};

export const getProductByBranchRepo = async (
  branch_id: number
): Promise<Product[]> => {
  const query = `SELECT * FROM fnc_get_products_by_branch($1)`;
  const values = [branch_id];
  const res = await pool.query(query, values);
  return res.rows;
};
