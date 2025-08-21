import { apiClient } from '../..';
import { ENDPOINTS } from '../../endpoints';

export const createMember = async (body: any): Promise<any> => {
  const response = await apiClient.post(`${ENDPOINTS.MEMBER}/create`, body);
  return response.data;
};
