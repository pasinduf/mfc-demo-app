import { ENDPOINTS } from '../../endpoints';
import { apiClient } from '../..';

export const getCentersByBranch = async (
  id: number | undefined,
): Promise<any> => {
  const response = await apiClient.get(`${ENDPOINTS.CENTER}/branch/${id}`);
  return response.data;
};
