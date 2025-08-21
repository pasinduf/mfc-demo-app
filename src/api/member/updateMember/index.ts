import { apiClient } from '../..';
import { ENDPOINTS } from '../../endpoints';

export const updateMember = async (id: number, body: any): Promise<any> => {
  const response = await apiClient.put(
    `${ENDPOINTS.MEMBER}/update/${id}`,
    body,
  );
  return response.data;
};
