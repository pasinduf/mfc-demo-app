import { apiClient } from '../..';
import { ENDPOINTS } from '../../endpoints';

export const addCollection = async (
  loanId: number,
  body: any,
): Promise<any> => {
  const response = await apiClient.post(
    `${ENDPOINTS.LOAN}/${loanId}/collection`,
    body,
  );
  return response.data;
};
