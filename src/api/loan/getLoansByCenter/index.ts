import { Arguments } from './Models';
import { ENDPOINTS } from '../../endpoints';
import { apiClient } from '../..';
import { CenterLoans } from '../../../entries/payments/center-loans';

export const getLoansByCenter = async (params: Arguments): Promise<CenterLoans[]> => {
  const response = await apiClient.get(`${ENDPOINTS.LOAN}/with-center`, {
    params,
  });
  return response.data;
};
