import { Arguments } from './Models';
import { ENDPOINTS } from '../../endpoints';
import { apiClient } from '../..';
import { PaginatedResponse } from '../../../entries/paginatedResponse';

export const getLoanList = async (
  params: Arguments,
): Promise<PaginatedResponse> => {
  const response = await apiClient.get(ENDPOINTS.LOAN, { params });
  return response.data;
};
