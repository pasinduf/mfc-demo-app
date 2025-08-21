import { apiClient } from '../..';
import { ENDPOINTS } from '../../endpoints';

export const saveBulkCollection = async (body: any): Promise<any> => {
  const response = await apiClient.post(
    `${ENDPOINTS.COLLECTION}/save-bulk`,
    body,
  );
  return response.data;
};
