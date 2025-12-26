import { Product } from "../model/product";
import pool from "../config/db";

export const getProductsByBranchIdRepo = async (
  branch_id: number,
  product_type: string
): Promise<any[]> => {
  const query = `
    SELECT * FROM fnc_get_product_by_branch($1, $2)
  `;
  const values = [branch_id, product_type];
  const res = await pool.query(query, values);
  return res.rows;
};

export const searchProductByNameInBranchRepo = async (
  branch_id: number,
  name: string
): Promise<Product[]> => {
  const query = `
    SELECT * FROM fnc_search_product_by_name($1, $2)
  `;
  const values = [name, branch_id];
  const res = await pool.query(query, values);
  return res.rows;
};

export const getALlProductsRepo = async (): Promise<Product[]> => {
  const query = `SELECT * FROM fnc_get_all_by_branch()`;
  const res = await pool.query(query);
  return res.rows;
};
