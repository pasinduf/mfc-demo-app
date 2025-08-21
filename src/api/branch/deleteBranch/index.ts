import { apiClient } from '../..';
import { ENDPOINTS } from '../../endpoints';

export const deleteBranch = async (id: number): Promise<any> => {
  const response = await apiClient.delete(`${ENDPOINTS.BRANCH}/${id}`);
  return response.data;
};
