import {
  getMedicalDetailsByRecordIdRepo,
  getMedicalRecordsByPetIdAndDoctorIdRepo,
  getMedicalRecordDetailsByRecordIdRepo,
} from "../repo/medicalRepo";

export const getMedicalRecordsByPetIdAndDoctorIdService = async (
  pet_id: number,
  doctor_id: number
): Promise<any[]> => {
  return await getMedicalRecordsByPetIdAndDoctorIdRepo(pet_id, doctor_id);
};

export const getMedicalDetailsByRecordIdService = async (
  record_id: number
): Promise<any[]> => {
  return await getMedicalDetailsByRecordIdRepo(record_id);
};

export const getMedicalRecordDetailsByRecordIdService = async (
  record_id: number
): Promise<any[]> => {
  return await getMedicalRecordDetailsByRecordIdRepo(record_id);
};
