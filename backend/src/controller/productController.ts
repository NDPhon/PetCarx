import {
  getProductsByBranchIdService,
  searchProductByNameInBranchService,
  getALlProductsService,
} from "../service/productService";

import { Request, Response } from "express";

export const getProductsByBranchIdController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const branch_id: number = parseInt(req.params.branch_id, 10);
    const product_type: string = req.query.product_type as string;
    const products = await getProductsByBranchIdService(
      branch_id,
      product_type
    );
    res.status(200).json({
      code: 200,
      message: "Fetched products successfully",
      data: products,
    });
  } catch (error: any) {
    console.error("Error fetching products by branch ID:", error);
    res.status(500).json({
      code: 500,
      message: error.message || "Internal Server Error",
      data: null,
    });
  }
};

export const searchProductByNameInBranchController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { branch_id, name }: { branch_id: number; name: string } = req.body;
    const products = await searchProductByNameInBranchService(branch_id, name);
    res.status(200).json({
      code: 200,
      message: "Searched products successfully",
      data: products,
    });
  } catch (error: any) {
    console.error("Error searching products by name in branch:", error);
    res.status(500).json({
      code: 500,
      message: error.message || "Internal Server Error",
      data: null,
    });
  }
};

export const getALlProductsController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const products = await getALlProductsService();
    res.status(200).json({
      code: 200,
      message: "Fetched all products successfully",
      data: products,
    });
  } catch (error: any) {
    console.error("Error fetching all products:", error);
    res.status(500).json({
      code: 500,
      message: error.message || "Internal Server Error",
      data: null,
    });
  }
};
