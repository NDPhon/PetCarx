import { getInfoCustomerByPhoneService } from "../service/customerService";
import { Request, Response } from "express";

export const getInfoCustomerByPhoneController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const phone = req.params.phone;
    const customer = await getInfoCustomerByPhoneService(phone);

    res.status(200).json({
      code: 200,
      message: "Fetched customer info successfully",
      data: customer,
    });
  } catch (error: any) {
    console.error("Error fetching customer info by phone:", error);
    res.status(500).json({
      code: 500,
      message: error.message || "Internal Server Error",
      data: null,
    });
  }
};
