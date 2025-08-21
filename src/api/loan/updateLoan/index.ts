import { apiClient } from '../..';
import { ENDPOINTS } from '../../endpoints';

export const updateLoan = async (id: number, body: any): Promise<any> => {
  const response = await apiClient.put(`${ENDPOINTS.LOAN}/update/${id}`, body);
  return response.data;
};
