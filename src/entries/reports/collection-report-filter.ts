export enum CollectionReportFilterField {
  FromDate = 'fromDate',
  ToDate = 'toDate',
  Center = 'center',
}


  export interface FilterInputs {
    [CollectionReportFilterField.FromDate]: string;
    [CollectionReportFilterField.ToDate]?: string | null;
    [CollectionReportFilterField.Center]?: number | null;
  }
