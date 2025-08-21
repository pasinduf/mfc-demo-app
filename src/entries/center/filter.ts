export enum CenterFilterField {
  Search = 'searchTerm',
  Branch = 'branchId',
  CollectionDay = 'collectionWeekDay',
}

export interface FilterInputs {
  [CenterFilterField.Search]: string;
  [CenterFilterField.Branch]: string;
  [CenterFilterField.CollectionDay]: string;
}
