import { apiClient } from '../..';
import { ENDPOINTS } from '../../endpoints';

export const deleteUser = async (id: number): Promise<any> => {
  const response = await apiClient.delete(`${ENDPOINTS.USER}/${id}`);
  return response.data;
};
