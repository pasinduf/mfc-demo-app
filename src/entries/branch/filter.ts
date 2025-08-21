export enum BranchFilterField {
  Search = 'searchText',
}

export interface FilterInputs {
  [BranchFilterField.Search]: string;
}
