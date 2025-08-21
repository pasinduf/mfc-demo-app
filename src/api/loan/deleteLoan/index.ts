import { apiClient } from '../..';
import { ENDPOINTS } from '../../endpoints';

export const deleteLoan = async (id: number): Promise<any> => {
  const response = await apiClient.delete(`${ENDPOINTS.LOAN}/${id}`);
  return response.data;
};
