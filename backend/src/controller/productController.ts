import {
  searchVaccineByNameInBranchService,
  getAllVaccinesService,
  getVaccinesByBranchService,
  getProductsByBranchService,
} from "../service/productService";

import { Request, Response } from "express";

export const getAllVaccinesController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const vaccines = await getAllVaccinesService();
    res.status(200).json({
      code: 200,
      message: "Fetched all vaccines successfully",
      data: vaccines,
    });
  } catch (error: any) {
    console.error("Error fetching all vaccines:", error);
    res.status(500).json({
      code: 500,
      message: error.message || "Internal Server Error",
      data: null,
    });
  }
};

export const getVaccinesByBranchController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const branch_id = parseInt(req.params.branch_id, 10);
    const vaccines = await getVaccinesByBranchService(branch_id);
    res.status(200).json({
      code: 200,
      message: "Fetched vaccines by branch successfully",
      data: vaccines,
    });
  } catch (error: any) {
    console.error("Error fetching vaccines by branch:", error);
    res.status(500).json({
      code: 500,
      message: error.message || "Internal Server Error",
      data: null,
    });
  }
};

export const searchVaccineByNameInBranchController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { branch_id, vaccine_name } = req.body;
    const vaccines = await searchVaccineByNameInBranchService(
      branch_id,
      vaccine_name
    );
    res.status(200).json({
      code: 200,
      message: "Searched vaccines by name in branch successfully",
      data: vaccines,
    });
  } catch (error: any) {
    console.error("Error searching vaccines by name in branch:", error);
    res.status(500).json({
      code: 500,
      message: error.message || "Internal Server Error",
      data: null,
    });
  }
};

export const getProductsByBranchController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const branch_id = parseInt(req.params.branch_id, 10);
    const products = await getProductsByBranchService(branch_id);
    res.status(200).json({
      code: 200,
      message: "Fetched products by branch successfully",
      data: products,
    });
  } catch (error: any) {
    console.error("Error fetching products by branch:", error);
    res.status(500).json({
      code: 500,
      message: error.message || "Internal Server Error",
      data: null,
    });
  }
};
