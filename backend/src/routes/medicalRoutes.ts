import {
  getMedicalDetailsByRecordIdController,
  getMedicalRecordsByPetIdAndDoctorIdController,
  getMedicalRecordDetailsByRecordIdController,
} from "../controller/medicalController";
import { Router } from "express";

const router = Router();
/* ============================================================
   GET MEDICAL RECORDS BY PET ID AND DOCTOR ID
============================================================ */
router.get(
  "/get-medical-records-by-pet-id-and-doctor-id/:pet_id/:doctor_id",
  getMedicalRecordsByPetIdAndDoctorIdController
);
/* ============================================================
   GET MEDICAL DETAILS BY RECORD ID
============================================================ */
router.get(
  "/get-medical-details-by-record-id/:record_id",
  getMedicalDetailsByRecordIdController
);

/* ============================================================
   GET MEDICAL RECORD DETAILS BY RECORD ID
============================================================ */
router.get(
  "/get-medical-record-details-by-record-id/:record_id",
  getMedicalRecordDetailsByRecordIdController
);

export default router;
