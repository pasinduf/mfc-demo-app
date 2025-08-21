import { apiClient } from '../..';
import { BranchInputs } from '../../../entries/branch/branch';
import { ENDPOINTS } from '../../endpoints';

export const updateBranch = async (
  id: number,
  body: BranchInputs,
): Promise<any> => {
  const response = await apiClient.put(
    `${ENDPOINTS.BRANCH}/update/${id}`,
    body,
  );
  return response.data;
};
