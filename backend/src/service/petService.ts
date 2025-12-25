import { addPetRepo, getPetsByCustomerIdRepo } from "../repo/petRepo";
import { Pet } from "../model/pet";
export const addPetService = async (
  customer_id: number,
  pet_name: string,
  species: string,
  breed: string,
  date_of_birth: Date,
  gender: "M" | "F" | "O",
  health_status: string
): Promise<Pet> => {
  return await addPetRepo(
    customer_id,
    pet_name,
    species,
    breed,
    date_of_birth,
    gender,
    health_status
  );
};

export const getPetsByCustomerIdService = async (
  customer_id: number
): Promise<Pet[]> => {
  return await getPetsByCustomerIdRepo(customer_id);
};
