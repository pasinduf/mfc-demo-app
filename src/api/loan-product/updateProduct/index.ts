import { apiClient } from '../..';
import { LoanProductInputs } from '../../../entries/loan-product/loanProduct';
import { ENDPOINTS } from '../../endpoints';

export const updateProduct = async (
  id: number,
  body: LoanProductInputs,
): Promise<any> => {
  const response = await apiClient.put(
    `${ENDPOINTS.LOAN}/product-update/${id}`,
    body,
  );
  return response.data;
};
