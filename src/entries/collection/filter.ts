export enum CollectionFilterField {
  FromDate = 'fromDate',
  ToDate = 'toDate',
  Center = 'center',
}

export interface FilterInputs {
  [CollectionFilterField.FromDate]: string;
  [CollectionFilterField.ToDate]?: string | null;
  [CollectionFilterField.Center]?: number | null;
}
