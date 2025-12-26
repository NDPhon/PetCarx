import pool from "../config/db";
import { Service } from "../model/service";

export const getServicesByBranchIdRepo = async (
  branch_id: number,
  service_type: string
): Promise<any[]> => {
  const query = `
    SELECT * FROM fnc_get_services_by_branch_id($1, $2)
  `;
  const values = [branch_id, service_type];
  const res = await pool.query(query, values);
  return res.rows;
};

export const searchServiceByNameInBranchRepo = async (
  branch_id: number,
  name: string
): Promise<any[]> => {
  const query = `
    SELECT * FROM fnc_search_service_by_name($1, $2)
  `;
  const values = [name, branch_id];
  const res = await pool.query(query, values);
  return res.rows;
};
export const getAllServicesRepo = async (): Promise<any[]> => {
  const query = `SELECT * FROM fnc_get_all_services_by_branch()`;
  const res = await pool.query(query);
  return res.rows;
};
