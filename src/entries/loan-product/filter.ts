export enum LoanProductFilterField {
  Code = 'code',
}

export interface FilterInputs {
  [LoanProductFilterField.Code]: string;
}
