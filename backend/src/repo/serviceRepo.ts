import pool from "../config/db";
import { Service } from "../model/service";

export const getServicesByBranchIdRepo = async (
  branch_id: number
): Promise<any[]> => {
  const query = `
    SELECT * FROM fnc_get_services_by_branch_id($1)
  `;
  const values = [branch_id];
  const res = await pool.query(query, values);
  return res.rows;
};
