export enum CenterLoanstFilterField {
  Center = 'centerId',
  Date = 'date',
}

  export interface FilterInputs {
    [CenterLoanstFilterField.Date]: string;
    [CenterLoanstFilterField.Center]:  number | null;
  }
