import {
  getEmployeeReceptionistListRepo,
  getEmployeeDoctorListRepo,
} from "../repo/employeeRepo";

export const getEmployeeReceptionistListService = async (
  branch_id: number
): Promise<any[]> => {
  return await getEmployeeReceptionistListRepo(branch_id);
};

export const getEmployeeDoctorListService = async (
  branch_id: number
): Promise<any[]> => {
  return await getEmployeeDoctorListRepo(branch_id);
};
