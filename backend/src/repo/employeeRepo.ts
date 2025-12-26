import { Employee } from "../model/employee";
import pool from "../config/db";

export const getEmployeeReceptionistListRepo = async (
  branch_id: number
): Promise<any[]> => {
  const query = `SELECT e.employee_id, e.full_name FROM employee e WHERE (e.position = 'Receptionist' OR e.position = 'Sales' OR e.position = 'BranchManager') and e.branch_id = $1`;
  const values = [branch_id];
  const res = await pool.query(query, values);
  return res.rows;
};

export const getEmployeeDoctorListRepo = async (
  branch_id: number
): Promise<any[]> => {
  const query = `SELECT e.employee_id, e.full_name FROM employee e WHERE e.position = 'Doctor' and e.branch_id = $1`;
  const values = [branch_id];
  const res = await pool.query(query, values);
  return res.rows;
};
