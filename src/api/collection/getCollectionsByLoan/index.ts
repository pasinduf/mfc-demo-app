import { ENDPOINTS } from '../../endpoints';
import { apiClient } from '../..';

export const getCollectionsByLoan = async (id: number): Promise<any> => {
  const response = await apiClient.get(`${ENDPOINTS.COLLECTION}/loan/${id}`);
  return response.data;
};
