import {
  searchVaccineByNameInBranchRepo,
  getALlVaccinesRepo,
  getVaccinesByBranchRepo,
  getProductByBranchRepo,
} from "../repo/productRepo";

export const getAllVaccinesService = async (): Promise<any[]> => {
  return await getALlVaccinesRepo();
};

export const getVaccinesByBranchService = async (
  branch_id: number
): Promise<any[]> => {
  return await getVaccinesByBranchRepo(branch_id);
};

export const searchVaccineByNameInBranchService = async (
  branch_id: number,
  vaccine_name: string
): Promise<any[]> => {
  return await searchVaccineByNameInBranchRepo(branch_id, vaccine_name);
};

export const getProductsByBranchService = async (
  branch_id: number
): Promise<any[]> => {
  return await getProductByBranchRepo(branch_id);
};
