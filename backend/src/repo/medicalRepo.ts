import pool from "../config/db";

export const getMedicalRecordsByPetIdAndDoctorIdRepo = async (
  pet_id: number,
  doctor_id: number
): Promise<any[]> => {
  const query = `
    SELECT * FROM fnc_get_medical_history_by_pet_and_doctor($1, $2)
    `;
  const values = [pet_id, doctor_id];
  const res = await pool.query(query, values);
  return res.rows;
};

export const getMedicalDetailsByRecordIdRepo = async (
  record_id: number
): Promise<any[]> => {
  const query = `
    SELECT * FROM fnc_get_medical_record_detail($1)
    `;
  const values = [record_id];
  const res = await pool.query(query, values);
  return res.rows;
};

export const getMedicalRecordDetailsByRecordIdRepo = async (
  record_id: number
): Promise<any[]> => {
  const query = `
    SELECT * FROM fnc_get_prescription_by_medical_record($1)
    `;
  const values = [record_id];
  const res = await pool.query(query, values);
  return res.rows;
};
