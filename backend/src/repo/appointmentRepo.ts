import pool from "../config/db";
import { Appointment } from "../model/appointment";

// Nếu muốn, có thể tạo interface cho dữ liệu trả về
export interface IAppointmentResult {
  fnc_insert_appointment: number; // appointment_id trả về từ DB
}

export const insertAppointmentRepo = async (
  appt: Appointment
): Promise<IAppointmentResult> => {
  const query = `
    SELECT * FROM fnc_insert_appointment(
      $1, $2, $3, $4, $5, $6, $7, $8
    )
  `;
  const values = [
    appt.customer_id,
    appt.pet_id,
    appt.branch_id,
    appt.employee_id,
    appt.appointment_time,
    appt.status,
    appt.channel,
    appt.service_ids,
  ];

  const res = await pool.query<IAppointmentResult>(query, values);
  return res.rows[0];
};
