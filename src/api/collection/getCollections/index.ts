import { Arguments } from './Models';
import { ENDPOINTS } from '../../endpoints';
import { apiClient } from '../..';
import { CollectionHistoryDto } from '../../../entries/collection/collection';

export const getCollections = async (
  params: Arguments,
): Promise<CollectionHistoryDto[]> => {
  const response = await apiClient.get(`${ENDPOINTS.COLLECTION}/history`, {
    params,
  });
  return response.data;
};
