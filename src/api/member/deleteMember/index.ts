import { apiClient } from '../..';
import { ENDPOINTS } from '../../endpoints';

export const deleteMember = async (id: number): Promise<any> => {
  const response = await apiClient.delete(`${ENDPOINTS.MEMBER}/${id}`);
  return response.data;
};
