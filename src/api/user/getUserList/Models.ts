import { BranchFilterField } from '../../../entries/branch/filter';

export type Arguments = {
  pageSize: number;
  pageIndex: number;
  [BranchFilterField.Search]?: string;
};
