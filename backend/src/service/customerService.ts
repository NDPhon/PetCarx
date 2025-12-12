import { getInfoCustomerByPhoneRepo } from "../repo/customerRepo";
import { Customer } from "../model/customer";

export const getInfoCustomerByPhoneService = async (
  phone: string
): Promise<Customer | null> => {
  return await getInfoCustomerByPhoneRepo(phone);
};
