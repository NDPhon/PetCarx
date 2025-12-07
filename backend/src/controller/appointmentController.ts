import { Router } from "express";
import type { Request, Response } from "express";
import { insertAppointmentService } from "../service/appointmentService";
import { Appointment } from "../model/appointment";

const router = Router();

router.post("/add-appointment", async (req: Request, res: Response) => {
  try {
    const apptData: Appointment = req.body;
    const newAppt = await insertAppointmentService(apptData);
    res.status(201).json(newAppt);
  } catch (error: any) {
    console.error("Error inserting appointment:", error);
    res.status(500).json({ error: error.message || "Internal Server Error" });
  }
});

export default router;
