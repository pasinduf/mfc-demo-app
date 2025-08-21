import { apiClient } from "../../..";
import { ENDPOINTS } from "../../../endpoints";


export const getAccessList = async (): Promise<any> => {
  const response = await apiClient.get(`${ENDPOINTS.COMMON}/access-list`);
  return response.data;
};
