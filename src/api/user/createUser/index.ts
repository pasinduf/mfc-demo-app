import { apiClient } from '../..';
import { ENDPOINTS } from '../../endpoints';

export const createUser = async (body: any): Promise<any> => {
  const response = await apiClient.post(`${ENDPOINTS.USER}/create`, body);
  return response.data;
};
