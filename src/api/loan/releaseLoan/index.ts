import { apiClient } from '../..';
import { ENDPOINTS } from '../../endpoints';

export const releaseLoan = async (id: number, body: any): Promise<any> => {
  const response = await apiClient.put(`${ENDPOINTS.LOAN}/release/${id}`, body);
  return response.data;
};
