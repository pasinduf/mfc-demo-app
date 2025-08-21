import { apiClient } from '../..';
import { LoanProductInputs } from '../../../entries/loan-product/loanProduct';
import { ENDPOINTS } from '../../endpoints';

export const createProduct = async (body: LoanProductInputs): Promise<any> => {
  const response = await apiClient.post(
    `${ENDPOINTS.LOAN}/product-create`,
    body,
  );
  return response.data;
};
