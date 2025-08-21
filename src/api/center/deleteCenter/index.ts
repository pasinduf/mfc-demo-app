import { apiClient } from '../..';
import { ENDPOINTS } from '../../endpoints';

export const deleteCenter = async (id: number): Promise<any> => {
  const response = await apiClient.delete(`${ENDPOINTS.CENTER}/${id}`);
  return response.data;
};
