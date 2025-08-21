import { LoanProductFilterField } from '../../../entries/loan-product/filter';

export type Arguments = {
  pageSize: number;
  pageIndex: number;
  [LoanProductFilterField.Code]?: string;
};
