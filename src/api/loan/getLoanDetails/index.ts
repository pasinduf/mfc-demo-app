import { ENDPOINTS } from '../../endpoints';
import { apiClient } from '../..';

export const getLoanDetails = async (id: number): Promise<any> => {
  const response = await apiClient.get(`${ENDPOINTS.LOAN}/find/${id}`);
  return response.data;
};
