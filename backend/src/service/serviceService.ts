import {
  getAllServicesRepo,
  getServicesByBranchIdRepo,
  searchServiceByNameInBranchRepo,
} from "../repo/serviceRepo";
import { Service } from "../model/service";

export const getServicesByBranchIdService = async (
  branch_id: number,
  service_type: string
): Promise<any[]> => {
  return await getServicesByBranchIdRepo(branch_id, service_type);
};

export const searchServiceByNameInBranchService = async (
  branch_id: number,
  name: string
): Promise<any[]> => {
  return await searchServiceByNameInBranchRepo(branch_id, name);
};

export const getAllServicesService = async (): Promise<any[]> => {
  return await getAllServicesRepo();
};
