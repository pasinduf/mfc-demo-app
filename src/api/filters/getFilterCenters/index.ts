import { ENDPOINTS } from '../../endpoints';
import { apiClient } from '../..';
import { Option } from '../../../entries/options';

export const getFilterCenters = async (): Promise<Option[]> => {
  const response = await apiClient.get(`${ENDPOINTS.COMMON}/centers`);
  return response.data;
};
