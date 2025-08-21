export enum LoanFilterField {
  Center = 'centerId',
  Member = 'memberId',
  Product = 'productId',
  Status = 'status',
  Search = 'searchTerm',
  FromDate = 'dateFrom',
  ToDate = 'dateTo',
  Branch = 'branchId',
}

export interface FilterInputs {
  [LoanFilterField.Center]: string;
  [LoanFilterField.Member]: string;
  [LoanFilterField.Product]: string;
  [LoanFilterField.Status]: string;
  [LoanFilterField.Search]: string;
  [LoanFilterField.FromDate]: string;
  [LoanFilterField.ToDate]: string;
  [LoanFilterField.Branch]?: string;
}
