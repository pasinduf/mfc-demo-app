import { apiClient } from "../../..";
import { ENDPOINTS } from "../../../endpoints";


export const getAccessListWithCategory = async (): Promise<any> => {
  const response = await apiClient.get(`${ENDPOINTS.COMMON}/access-list-with-category`);
  return response.data;
};
