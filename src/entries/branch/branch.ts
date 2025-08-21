import { Center } from '../center/center';

export interface Branch {
  id: number;
  name: string;
  code: string;
  centers?: Center[];
}

export enum BranchField {
  Name = 'name',
  Code = 'code',
}

export interface BranchInputs {
  [BranchField.Name]: string;
  [BranchField.Code]: string;
}
