import express, { Router } from "express";
import type { Request, Response } from "express";

import { insertAppointmentService } from "../service/appointmentService";
import { Appointment } from "../model/appointment";
import { IAppointmentResult } from "../repo/appointmentRepo";

const router = Router();

router.post("/add-appointment", async (req: Request, res: Response) => {
  try {
    const apptData: Appointment = req.body; // gán kiểu cho body
    const newAppt: IAppointmentResult = await insertAppointmentService(
      apptData
    );
    res.status(201).json(newAppt);
  } catch (error: any) {
    console.error("Error inserting appointment:", error);
    // Nếu error từ DB, trả về chi tiết nếu muốn
    res.status(500).json({ error: error.message || "Internal Server Error" });
  }
});

export default router;
