import { ENDPOINTS } from '../../endpoints';
import { apiClient } from '../..';

export const getCollectors = async (): Promise<any> => {
  const response = await apiClient.get(
    `${ENDPOINTS.COLLECTION}/collectors`,
  );
  return response.data;
};
