import { getServicesByBranchIdRepo } from "../repo/serviceRepo";
import { Service } from "../model/service";

export const getServicesByBranchIdService = async (
  branch_id: number
): Promise<any[]> => {
  return await getServicesByBranchIdRepo(branch_id);
};
