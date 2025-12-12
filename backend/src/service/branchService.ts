import { getBranchListRepo } from "../repo/branchRepo";

import { Branch } from "../model/branch";

export const getBranchListService = async (): Promise<any[]> => {
  return await getBranchListRepo();
};
