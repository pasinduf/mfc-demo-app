import { ENDPOINTS } from '../../endpoints';
import { apiClient } from '../..';

export const getMembersByCenter = async (
  ids: string | undefined,
): Promise<any> => {
  const response = await apiClient.get(`${ENDPOINTS.MEMBER}/centers`, {
    params: { ids },
  });
  return response.data;
};
