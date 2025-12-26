import { paymentsRepo, totalRevenueRepo } from "../repo/analyzeRepo";

export const totalRevenueService = async (
  branch_id: number,
  start_date: string,
  end_date: string
): Promise<any[]> => {
  let result = await totalRevenueRepo(branch_id, start_date, end_date);
  return result;
};

export const paymentsService = async (
  branch_id: number | null,
  start_date: string,
  end_date: string,
  page: number,
  page_size: number
): Promise<any[]> => {
  return await paymentsRepo(branch_id, start_date, end_date, page, page_size);
};
