import {
  addPetService,
  getPetsByCustomerIdService,
  getPetsExaminedByDoctorService,
} from "../service/petService";
import { Request, Response } from "express";

export const addPetController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      name,
      species,
      breed,
      date_of_birth,
      gender,
      health_status,
      customer_id,
    }: {
      name: string;
      species: string;
      breed: string;
      date_of_birth: Date;
      gender: "M" | "F" | "O";
      health_status: string;
      customer_id: number;
    } = req.body;
    const newPet = await addPetService(
      customer_id,
      name,
      species,
      breed,
      date_of_birth,
      gender,
      health_status
    );
    res.status(201).json({
      code: 201,
      message: "Pet added successfully",
      data: newPet,
    });
  } catch (error: any) {
    console.error("Error adding new pet:", error);
    res.status(500).json({
      code: 500,
      message: error.message || "Internal Server Error",
      data: null,
    });
  }
};

export const getPetsByCustomerIdController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const customer_id: number = parseInt(req.params.customer_id, 10);
    const pets = await getPetsByCustomerIdService(customer_id);
    res.status(200).json({
      code: 200,
      message: "Fetched pets successfully",
      data: pets,
    });
  } catch (error: any) {
    console.error("Error fetching pets by customer ID:", error);
    res.status(500).json({
      code: 500,
      message: error.message || "Internal Server Error",
      data: null,
    });
  }
};

export const getPetsExaminedByDoctorController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const doctor_id: number = parseInt(req.params.doctor_id, 10);
    const pets = await getPetsExaminedByDoctorService(doctor_id);
    res.status(200).json({
      code: 200,
      message: "Fetched pets successfully",
      data: pets,
    });
  } catch (error: any) {
    console.error("Error fetching pets examined by doctor ID:", error);
    res.status(500).json({
      code: 500,
      message: error.message || "Internal Server Error",
      data: null,
    });
  }
};
