import {
  searchServiceByNameInBranchService,
  getServicesByBranchIdService,
  getAllServicesService,
} from "../service/serviceService";
import { Request, Response, Router } from "express";

export const searchServiceByNameInBranchController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { branch_id, name }: { branch_id: number; name: string } = req.body;
    const services = await searchServiceByNameInBranchService(branch_id, name);
    res.status(200).json({
      code: 200,
      message: "Fetched services successfully",
      data: services,
    });
  } catch (error: any) {
    console.error("Error searching service by name in branch:", error);
    res.status(500).json({
      code: 500,
      message: error.message || "Internal Server Error",
      data: null,
    });
  }
};

export const getServicesByBranchIdController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const branch_id = parseInt(req.params.branch_id, 10);
    const service_type = req.query.service_type as string;
    const services = await getServicesByBranchIdService(
      branch_id,
      service_type
    );
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

export const getAllServicesController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const services = await getAllServicesService();
    res.status(200).json({
      code: 200,
      message: "Fetched all services successfully",
      data: services,
    });
  } catch (error: any) {
    console.error("Error fetching all services:", error);
    res.status(500).json({
      code: 500,
      message: error.message || "Internal Server Error",
      data: null,
    });
  }
};
