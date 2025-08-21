import { ENDPOINTS } from '../../endpoints';
import { apiClient } from '../..';

export const getCentersByDate = async (date: string): Promise<any> => {
  const response = await apiClient.get(`${ENDPOINTS.CENTER}/date/${date}`);
  return response.data;
};
