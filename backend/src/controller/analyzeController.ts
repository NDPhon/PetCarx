import {
  totalRevenueService,
  paymentsService,
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
    const { branch_id, start_date, end_date } = req.body;
    const revenue = await totalRevenueService(branch_id, start_date, end_date);
    res.status(200).json({
      code: 200,
      message: "Fetched total revenue successfully",
      data: { revenue: revenue },
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
    PAYMENTS
============================================================ */
export const paymentsController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { branch_id, start_date, end_date, page, page_size } = req.body;
    const payments = await paymentsService(
      branch_id,
      start_date,
      end_date,
      page,
      page_size
    );
    res.status(200).json({
      code: 200,
      message: "Fetched payments successfully",
      data: payments,
    });
  } catch (error: any) {
    console.error("Error fetching payments:", error);
    res.status(500).json({
      code: 500,
      message: error.message || "Internal Server Error",
      data: null,
    });
  }
};
