import { Arguments } from './Models';
import { ENDPOINTS } from '../../endpoints';
import { apiClient } from '../..';
import { PaginatedResponse } from '../../../entries/paginatedResponse';

export const getProductList = async (
  params: Arguments,
): Promise<PaginatedResponse> => {
  const response = await apiClient.get(`${ENDPOINTS.LOAN}/products`, {
    params,
  });
  return response.data;
};
