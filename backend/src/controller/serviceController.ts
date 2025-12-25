import { getServicesByBranchIdService } from "../service/serviceService";
import { Request, Response, Router } from "express";

export const getServicesByBranchIdController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const branch_id: number = parseInt(req.params.branch_id, 10);
    const services = await getServicesByBranchIdService(branch_id);
    res.status(200).json({
      code: 200,
      message: "Fetched services successfully",
      data: services,
    });
  } catch (error: any) {
    console.error("Error fetching services by branch ID:", error);
    res.status(500).json({
      code: 500,
      message: error.message || "Internal Server Error",
      data: null,
    });
  }
};
