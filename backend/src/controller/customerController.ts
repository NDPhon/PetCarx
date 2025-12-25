import {
  getInfoCustomerByPhoneService,
  addCustomerService,
} from "../service/customerService";
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

export const addCustomerController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      full_name,
      gender,
      date_of_birth,
      phone,
      email,
      national_id,
    }: {
      full_name: string;
      gender: "M" | "F" | "O" | null;
      date_of_birth: Date | null;
      phone: string;
      email: string | null;
      national_id: string | null;
    } = req.body;
    const newCustomer = await addCustomerService(
      full_name,
      gender,
      date_of_birth,
      phone,
      email,
      national_id
    );
    res.status(201).json({
      code: 201,
      message: "Customer added successfully",
      data: newCustomer,
    });
  } catch (error: any) {
    console.error("Error adding new customer:", error);
    res.status(500).json({
      code: 500,
      message: error.message || "Internal Server Error",
      data: null,
    });
  }
};
