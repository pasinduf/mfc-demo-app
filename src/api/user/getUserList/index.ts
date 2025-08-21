import { Arguments } from './Models';
import { ENDPOINTS } from '../../endpoints';
import { apiClient } from '../..';
import { PaginatedResponse } from '../../../entries/paginatedResponse';

export const getUserList = async (
  params?: Arguments,
): Promise<PaginatedResponse> => {
  const response = await apiClient.get(ENDPOINTS.USER, { params });
  return response.data;
};
