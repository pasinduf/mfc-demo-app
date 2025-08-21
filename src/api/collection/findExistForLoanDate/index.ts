import { ENDPOINTS } from '../../endpoints';
import { apiClient } from '../..';

export const findExistForLoanDate = async (
  id: number,
  date: string,
): Promise<any> => {
  const response = await apiClient.get(
    `${ENDPOINTS.COLLECTION}/loan/${id}/${date}`,
  );
  return response.data;
};
