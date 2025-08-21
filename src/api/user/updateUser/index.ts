import { apiClient } from '../..';
import { ENDPOINTS } from '../../endpoints';

export const updateUser = async (id: number, body: any): Promise<any> => {
  const response = await apiClient.put(`${ENDPOINTS.USER}/update/${id}`, body);
  return response.data;
};
