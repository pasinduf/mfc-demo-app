import { ENDPOINTS } from '../../endpoints';
import { apiClient } from '../..';

export const generateMemberCode = async (centerId: number): Promise<any> => {
  const response = await apiClient.get(
    `${ENDPOINTS.MEMBER}/generate-code/${centerId}`,
  );
  return response.data;
};
