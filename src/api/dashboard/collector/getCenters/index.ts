
import { apiClient } from '../../..';
import { CollectorCenterDto } from '../../../../entries/center/collector-center';
import { ENDPOINTS } from '../../../endpoints';
import { Arguments } from './Models';

export const getCenters = async (params: Arguments): Promise<CollectorCenterDto[]> => {
  const response = await apiClient.get(`${ENDPOINTS.COLLECTION}/centers`, {
    params,
  });
  return response.data;
};
