export enum CollectorLoanFilterField {
  Type = 'type',
  Date = 'date',
  Center = 'center',
}

export interface FilterInputs {
  [CollectorLoanFilterField.Type]: string;
  [CollectorLoanFilterField.Date]: string | null;
  [CollectorLoanFilterField.Center]?: number | null;
}
