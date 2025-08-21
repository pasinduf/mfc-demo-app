import { ENDPOINTS } from '../../endpoints';
import { apiClient } from '../..';
import { Option } from '../../../entries/options';

export const getFilterBranches = async (): Promise<Option[]> => {
  const response = await apiClient.get(`${ENDPOINTS.COMMON}/branches`);
  return response.data;
};

