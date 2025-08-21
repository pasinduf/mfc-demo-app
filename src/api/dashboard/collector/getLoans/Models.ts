import { LoanFilterField } from '../../../entries/loan/filter';

export type Arguments = {
  [LoanFilterField.Type]?: string;
  [LoanFilterField.Date]?: string | null;
  [LoanFilterField.Center]?: number | null;
};
