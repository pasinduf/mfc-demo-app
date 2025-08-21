import { apiClient } from '../..';
import { CenterInputs } from '../../../entries/center/center';
import { ENDPOINTS } from '../../endpoints';

export const createCenter = async (body: CenterInputs): Promise<any> => {
  const response = await apiClient.post(`${ENDPOINTS.CENTER}/create`, body);
  return response.data;
};
