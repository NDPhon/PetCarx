import pool from "../config/db";
import { Branch } from "../model/branch";

export const getBranchListRepo = async (): Promise<any[]> => {
  const query = `SELECT b.branch_id, b.name FROM branch b`;
  const res = await pool.query(query);
  return res.rows;
};
