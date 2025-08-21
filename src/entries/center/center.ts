import { Branch } from '../branch/branch';

export interface Center {
  id: number;
  name: string;
  code: string;
  collectionWeekDay: number;
  branch: Branch;
}

export enum CenterField {
  Name = 'name',
  Code = 'code',
  Branch = 'branchId',
  CollectionWeekDay = 'collectionWeekDay',
}

export interface CenterInputs {
  [CenterField.Name]: string;
  [CenterField.Code]: string;
  [CenterField.Branch]: number;
  [CenterField.CollectionWeekDay]: number;
}
