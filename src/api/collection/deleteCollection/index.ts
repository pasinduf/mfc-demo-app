import { apiClient } from '../..';
import { ENDPOINTS } from '../../endpoints';

export const deleteCollection = async (id: number): Promise<any> => {
  const response = await apiClient.delete(`${ENDPOINTS.COLLECTION}/${id}`);
  return response.data;
};
