import pool from "../config/db";

export const totalRevenueRepo = async (
  branch_id: number,
  start_date: string,
  end_date: string
): Promise<any[]> => {
  const query = `
      SELECT * FROM fnc_revenue_by_branch($1, $2, $3)
    `;
  const values = [start_date, end_date, branch_id];
  const res = await pool.query(query, values);
  return res.rows;

  return res.rows[0].fnc_total_revenue;
};

export const paymentsRepo = async (
  branch_id: number | null,
  start_date: string,
  end_date: string,
  page: number = 1,
  page_size: number = 10
): Promise<any[]> => {
  const query = `
    SELECT *
    FROM fnc_get_payments_by_branch($1, $2, $3, $4, $5)
  `;
  const values = [branch_id, start_date, end_date, page, page_size];

  const res = await pool.query(query, values);
  return res.rows;
};
