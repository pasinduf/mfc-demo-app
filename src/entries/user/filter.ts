export enum UserFilterField {
  Search = 'searchTerm',
  Role = 'role',
  Status = 'status',
}

export interface FilterInputs {
  [UserFilterField.Search]: string;
  [UserFilterField.Role]: string;
  [UserFilterField.Status]: string;
}
