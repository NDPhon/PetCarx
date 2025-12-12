import { getBranchListService } from "../service/branchService";
import { Request, Response } from "express";

export const getBranchListController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const branches = await getBranchListService();
    res.status(200).json({
      code: 200,
      message: "Fetched branches successfully",
      data: branches,
    });
  } catch (error: any) {
    console.error("Error fetching branch list:", error);
    res.status(500).json({
      code: 500,
      message: error.message || "Internal Server Error",
      data: null,
    });
  }
};
