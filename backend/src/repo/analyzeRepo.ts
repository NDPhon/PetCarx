import pool from "../config/db";

export const totalRevenueRepo = async (
  branch_id: number,
  start_date: string,
  end_date: string
): Promise<any> => {
  if (branch_id) {
    const query = `
      SELECT * FROM fnc_revenue_by_branch($1, $2, $3)
    `;
    const values = [branch_id, start_date, end_date];
    const res = await pool.query(query, values);
    return res.rows[0];
  }

  const query = `
        SELECT * FROM fnc_total_revenue($1, $2)
        `;
  const values = [start_date, end_date];
  const res = await pool.query(query, values);
  return res.rows[0];
};

export const paymentsRepo = async (
  branch_id: number,
  start_date: string,
  end_date: string
): Promise<any[]> => {
  if (branch_id) {
    const query = `
      SELECT * FROM fnc_get_payments_by_branch($1, $2, $3)
    `;
    const values = [branch_id, start_date, end_date];
    const res = await pool.query(query, values);
    return res.rows;
  }
  const query = `
        SELECT * FROM fnc_get_payments_by_date($1, $2)
        `;
  const values = [start_date, end_date];
  const res = await pool.query(query, values);
  return res.rows;
};
