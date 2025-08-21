import { apiClient } from '../..';
import { ENDPOINTS } from '../../endpoints';

export const dayEnd = async (date: string): Promise<any> => {
  const response = await apiClient.post(
    `${ENDPOINTS.COLLECTION}/day-end/${date}`,
  );
  return response.data;
};
