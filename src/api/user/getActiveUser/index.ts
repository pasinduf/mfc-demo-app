import { ENDPOINTS } from '../../endpoints';
import { apiClient } from '../..';

export const getActiveUser = async (): Promise<any> => {
  const response = await apiClient.get(`${ENDPOINTS.USER}/active`);
  return response.data;
};
