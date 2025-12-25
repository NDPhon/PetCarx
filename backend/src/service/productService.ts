import {
  getProductsByBranchIdRepo,
  searchProductByNameInBranchRepo,
  getALlProductsRepo,
} from "../repo/productRepo";

export const getProductsByBranchIdService = async (
  branch_id: number,
  product_type: string
): Promise<any[]> => {
  return await getProductsByBranchIdRepo(branch_id, product_type);
};

export const searchProductByNameInBranchService = async (
  branch_id: number,
  name: string
): Promise<any[]> => {
  return await searchProductByNameInBranchRepo(branch_id, name);
};
export const getALlProductsService = async (): Promise<any[]> => {
  return await getALlProductsRepo();
};
