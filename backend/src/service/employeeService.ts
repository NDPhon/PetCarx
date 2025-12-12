import { getEmployeeReceptionistListRepo } from "../repo/employeeRepo";

export const getEmployeeReceptionistListService = async (
  branch_id: number
): Promise<any[]> => {
  return await getEmployeeReceptionistListRepo(branch_id);
};
