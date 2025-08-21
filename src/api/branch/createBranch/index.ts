import { apiClient } from '../..';
import { BranchInputs } from '../../../entries/branch/branch';
import { ENDPOINTS } from '../../endpoints';

export const createBranch = async (body: BranchInputs): Promise<any> => {
  const response = await apiClient.post(`${ENDPOINTS.BRANCH}/create`, body);
  return response.data;
};
