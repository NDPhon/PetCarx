import {
  getMedicalRecordsByPetIdAndDoctorIdService,
  getMedicalDetailsByRecordIdService,
  getMedicalRecordDetailsByRecordIdService,
} from "../service/medicalService";

export const getMedicalRecordsByPetIdAndDoctorIdController = async (
  req: any,
  res: any
): Promise<void> => {
  try {
    const pet_id = parseInt(req.params.pet_id, 10);
    const doctor_id = parseInt(req.params.doctor_id, 10);
    const records = await getMedicalRecordsByPetIdAndDoctorIdService(
      pet_id,
      doctor_id
    );
    res.status(200).json({
      code: 200,
      message: "Fetched medical records successfully",
      data: records,
    });
  } catch (error: any) {
    console.error(
      "Error fetching medical records by pet ID and doctor ID:",
      error
    );
    res.status(500).json({
      code: 500,
      message: error.message || "Internal Server Error",
      data: null,
    });
  }
};

export const getMedicalDetailsByRecordIdController = async (
  req: any,
  res: any
): Promise<void> => {
  try {
    const record_id = parseInt(req.params.record_id, 10);
    const details = await getMedicalDetailsByRecordIdService(record_id);
    res.status(200).json({
      code: 200,
      message: "Fetched medical details successfully",
      data: details,
    });
  } catch (error: any) {
    console.error("Error fetching medical details by record ID:", error);
    res.status(500).json({
      code: 500,
      message: error.message || "Internal Server Error",
      data: null,
    });
  }
};

export const getMedicalRecordDetailsByRecordIdController = async (
  req: any,
  res: any
): Promise<void> => {
  try {
    const record_id = parseInt(req.params.record_id, 10);
    const recordDetails = await getMedicalRecordDetailsByRecordIdService(
      record_id
    );
    res.status(200).json({
      code: 200,
      message: "Fetched medical record details successfully",
      data: recordDetails,
    });
  } catch (error: any) {
    console.error("Error fetching medical record details by record ID:", error);
    res.status(500).json({
      code: 500,
      message: error.message || "Internal Server Error",
      data: null,
    });
  }
};
