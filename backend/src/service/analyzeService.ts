import { paymentsRepo, totalRevenueRepo } from "../repo/analyzeRepo";

export const totalRevenueService = async (
  branch_id: number,
  start_date: string,
  end_date: string
): Promise<any> => {
  return await totalRevenueRepo(branch_id, start_date, end_date);
};
export const paymentsService = async (
  branch_id: number,
  start_date: string,
  end_date: string
): Promise<any[]> => {
  return await paymentsRepo(branch_id, start_date, end_date);
};
