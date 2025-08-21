import { apiClient } from '../../..';
import { CollectorLoanDto } from '../../../../entries/loan/collector-loan';
import { ENDPOINTS } from '../../../endpoints';
import { Arguments } from './Models';

export const getLoans = async (params: Arguments): Promise<CollectorLoanDto[]> => {
  const response = await apiClient.get(`${ENDPOINTS.COLLECTION}/loans`, {
    params,
  });
  return response.data;
};
