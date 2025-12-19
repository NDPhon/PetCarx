import {
  paymentsByBranchRepo,
  paymentsRepo,
  totalRevenueRepo,
  totalRevenueByBranchRepo,
} from "../repo/analyzeRepo";

export const totalRevenueService = async (
  start_date: string,
  end_date: string
): Promise<any> => {
  return await totalRevenueRepo(start_date, end_date);
};
export const paymentsService = async (
  start_date: string,
  end_date: string
): Promise<any[]> => {
  return await paymentsRepo(start_date, end_date);
};
export const totalRevenueByBranchService = async (
  branch_id: number,
  start_date: string,
  end_date: string
): Promise<any[]> => {
  return await totalRevenueByBranchRepo(branch_id, start_date, end_date);
};
export const paymentsByBranchService = async (
  branch_id: number,
  start_date: string,
  end_date: string
): Promise<any[]> => {
  return await paymentsByBranchRepo(branch_id, start_date, end_date);
};
