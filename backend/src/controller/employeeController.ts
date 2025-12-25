import {
  getEmployeeReceptionistListService,
  getEmployeeDoctorListService,
} from "../service/employeeService";
import { Request, Response } from "express";

export const getEmployeeReceptionistListController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const branch_id = parseInt(req.params.branch_id, 10);
    const receptionists = await getEmployeeReceptionistListService(branch_id);
    res.status(200).json({
      code: 200,
      message: "Fetched receptionist list successfully",
      data: receptionists,
    });
  } catch (error: any) {
    console.error("Error fetching receptionist list:", error);
    res.status(500).json({
      code: 500,
      message: error.message || "Internal Server Error",
      data: null,
    });
  }
};

export const getEmployeeDoctorListController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const branch_id = parseInt(req.params.branch_id, 10);
    const doctors = await getEmployeeDoctorListService(branch_id);
    res.status(200).json({
      code: 200,
      message: "Fetched doctor list successfully",
      data: doctors,
    });
  } catch (error: any) {
    console.error("Error fetching doctor list:", error);
    res.status(500).json({
      code: 500,
      message: error.message || "Internal Server Error",
      data: null,
    });
  }
};
