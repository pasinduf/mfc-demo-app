export enum MemberFilterField {
  Status = 'status',
  Search = 'searchTerm',
  Branch = 'branchId',
  Center = 'centerId',
}

export interface FilterInputs {
  [MemberFilterField.Status]: string;
  [MemberFilterField.Search]: string;
  [MemberFilterField.Branch]: string;
  [MemberFilterField.Center]: string;
}
