import { LoanFilterField } from '../../../entries/loan/filter';

export type Arguments = {
  pageSize: number;
  pageIndex: number;
  [LoanFilterField.Center]?: string;
  [LoanFilterField.Member]?: string;
  [LoanFilterField.Product]?: string;
  [LoanFilterField.Status]?: string;
  [LoanFilterField.FromDate]?: string;
  [LoanFilterField.ToDate]?: string;
};
