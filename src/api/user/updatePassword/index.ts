import { apiClient } from '../..';
import { ENDPOINTS } from '../../endpoints';

export const updatePassword = async (body: any): Promise<any> => {
  const response = await apiClient.put(
    `${ENDPOINTS.USER}/update-password`,
    body,
  );
  return response.data;
};
