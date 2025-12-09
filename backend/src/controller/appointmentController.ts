import { Router } from "express";
import type { Request, Response } from "express";
import {
  insertAppointmentService,
  getAppointmentsService,
  updateAppointmentStatusService,
  findAppointmentByPhoneService,
} from "../service/appointmentService";
import { Appointment } from "../model/appointment";

const router = Router();

/* ============================================================
   ADD APPOINTMENT
============================================================ */
router.post("/add-appointment", async (req: Request, res: Response) => {
  try {
    const apptData: Appointment = req.body;
    const newAppt = await insertAppointmentService(apptData);

    res.status(201).json({
      code: 201,
      message: "Appointment created successfully",
      data: newAppt,
    });
  } catch (error: any) {
    console.error("Error inserting appointment:", error);

    res.status(500).json({
      code: 500,
      message: error.message || "Internal Server Error",
      data: null,
    });
  }
});

/* ============================================================
   GET APPOINTMENTS
============================================================ */
router.get("/get-appointments", async (req: Request, res: Response) => {
  try {
    const appointments = await getAppointmentsService();

    res.status(200).json({
      code: 200,
      message: "Fetched appointments successfully",
      data: appointments,
    });
  } catch (error: any) {
    console.error("Error fetching appointments:", error);

    res.status(500).json({
      code: 500,
      message: error.message || "Internal Server Error",
      data: null,
    });
  }
});

/* ============================================================
   UPDATE STATUS
============================================================ */
router.patch("/update-status", async (req: Request, res: Response) => {
  try {
    const {
      appointment_id,
      status,
    }: { appointment_id: number; status: string } = req.body;

    await updateAppointmentStatusService(appointment_id, status);

    res.status(200).json({
      code: 200,
      message: "Appointment status updated successfully",
      data: {
        appointment_id,
        status,
      },
    });
  } catch (error: any) {
    console.error("Error updating appointment status:", error);

    res.status(500).json({
      code: 500,
      message: error.message || "Internal Server Error",
      data: null,
    });
  }
});

router.post("/find-by-phone", async (req: Request, res: Response) => {
  try {
    const { phone }: { phone: string } = req.body;
    const appointments = await findAppointmentByPhoneService(phone);

    res.status(200).json({
      code: 200,
      message: "Fetched appointments successfully",
      data: appointments,
    });
  } catch (error: any) {
    console.error("Error fetching appointments by phone:", error);
    res.status(500).json({
      code: 500,
      message: error.message || "Internal Server Error",
      data: null,
    });
  }
});
export default router;
