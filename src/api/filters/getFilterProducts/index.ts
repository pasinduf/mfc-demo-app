import { ENDPOINTS } from '../../endpoints';
import { apiClient } from '../..';
import { Option } from '../../../entries/options';

export const getFilterProducts = async (): Promise<Option[]> => {
  const response = await apiClient.get(`${ENDPOINTS.LOAN}/product-options`);
  return response.data;
};
