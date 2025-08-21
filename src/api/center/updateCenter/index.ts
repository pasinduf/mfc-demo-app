import { apiClient } from '../..';
import { CenterInputs } from '../../../entries/center/center';
import { ENDPOINTS } from '../../endpoints';

export const updateCenter = async (
  id: number,
  body: CenterInputs,
): Promise<any> => {
  const response = await apiClient.put(
    `${ENDPOINTS.CENTER}/update/${id}`,
    body,
  );
  return response.data;
};
