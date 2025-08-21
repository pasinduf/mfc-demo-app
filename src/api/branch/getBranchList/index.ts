import { Arguments } from './Models';
import { ENDPOINTS } from '../../endpoints';
import { Branch } from '../../../entries/branch/branch';
import { apiClient } from '../..';

export const getBranchList = async (params?: Arguments): Promise<Branch[]> => {
  const response = await apiClient.get(ENDPOINTS.BRANCH, { params });
  return response.data;
};
