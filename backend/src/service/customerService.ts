import {
  getInfoCustomerByPhoneRepo,
  addCustomerRepo,
} from "../repo/customerRepo";
import { Customer } from "../model/customer";

export const getInfoCustomerByPhoneService = async (
  phone: string
): Promise<Customer | null> => {
  return await getInfoCustomerByPhoneRepo(phone);
};

export const addCustomerService = async (
  full_name: string,
  gender: "M" | "F" | "O" | null,
  date_of_birth: Date | null,
  phone: string,
  email: string | null,
  national_id: string | null
): Promise<Customer> => {
  return await addCustomerRepo(
    full_name,
    gender,
    date_of_birth,
    phone,
    email,
    national_id
  );
};
