import { apiClient } from '../..';
import { ENDPOINTS } from '../../endpoints';

export const approveLoan = async (id: number, body: any): Promise<any> => {
  const response = await apiClient.put(`${ENDPOINTS.LOAN}/approve/${id}`, body);
  return response.data;
};
