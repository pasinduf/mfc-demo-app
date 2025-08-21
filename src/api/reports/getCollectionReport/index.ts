import { Arguments } from './Models';
import { ENDPOINTS } from '../../endpoints';
import { apiClient } from '../..';
import { CollectionReport } from '../../../entries/reports/collection-report';

export const getDayCollectionReport = async (
  params: Arguments,
): Promise<CollectionReport[]> => {
  const response = await apiClient.get(`${ENDPOINTS.REPORTS}/date`, {
    params,
  });
  return response.data;
};
