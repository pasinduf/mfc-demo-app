import { ENDPOINTS } from '../../endpoints';
import { apiClient } from '../..';
import { LoanPrevCollection } from '../../../entries/payments/loan-prev-collection';

export const getLoanPrevCollection = async (
  loanId:number,
  date:string,
): Promise<LoanPrevCollection> => {
  const response = await apiClient.get(`${ENDPOINTS.LOAN}/prev-collection/${loanId}/${date}`);
  return response.data;
};
