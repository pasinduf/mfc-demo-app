import { apiClient } from '../..';
import { ENDPOINTS } from '../../endpoints';

export const deleteProduct = async (id: number): Promise<any> => {
  const response = await apiClient.delete(`${ENDPOINTS.LOAN}/product/${id}`);
  return response.data;
};
