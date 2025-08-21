import { Arguments } from './Models';
import { ENDPOINTS } from '../../endpoints';
import { apiClient } from '../..';
import { PaginatedResponse } from '../../../entries/paginatedResponse';

export const getMemberList = async (
  params: Arguments,
): Promise<PaginatedResponse> => {
  const response = await apiClient.get(ENDPOINTS.MEMBER, { params });
  return response.data;
};
