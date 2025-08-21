import { apiClient } from '../..';
import { ENDPOINTS } from '../../endpoints';

export const updateCollection = async (id: number, body: any): Promise<any> => {
  const response = await apiClient.put(
    `${ENDPOINTS.LOAN}/collection/${id}`,
    body,
  );
  return response.data;
};
