import { apiClient } from '../..';
import { ENDPOINTS } from '../../endpoints';

export const createLoan = async (body: any): Promise<any> => {
  const response = await apiClient.post(`${ENDPOINTS.LOAN}/create`, body);
  return response.data;
};
