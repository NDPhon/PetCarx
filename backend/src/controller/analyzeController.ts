import {
  totalRevenueService,
  paymentsService,
  paymentsByBranchService,
  totalRevenueByBranchService,
} from "../service/analyzeService";
import { Request, Response } from "express";

/* ============================================================
    TOTAL REVENUE
============================================================ */
export const totalRevenueController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { start_date, end_date } = req.body;
    const revenue = await totalRevenueService(start_date, end_date);
    const payments = await paymentsService(start_date, end_date);
    res.status(200).json({
      code: 200,
      message: "Fetched total revenue successfully",
      data: { revenue, payments },
    });
  } catch (error: any) {
    console.error("Error fetching total revenue:", error);
    res.status(500).json({
      code: 500,
      message: error.message || "Internal Server Error",
      data: null,
    });
  }
};

/* ============================================================
    REVENUE BY BRANCH
============================================================ */
export const revenueByBranchController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { branch_id, start_date, end_date } = req.body;
    const revenue = await totalRevenueByBranchService(
      branch_id,
      start_date,
      end_date
    );
    const payments = await paymentsByBranchService(
      branch_id,
      start_date,
      end_date
    );
    res.status(200).json({
      code: 200,
      message: "Fetched revenue by branch successfully",
      data: { revenue, payments },
    });
  } catch (error: any) {
    console.error("Error fetching revenue by branch:", error);
    res.status(500).json({
      code: 500,
      message: error.message || "Internal Server Error",
      data: null,
    });
  }
};
