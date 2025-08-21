import { CenterFilterField } from '../../../entries/center/filter';

export type Arguments = {
  pageSize: number;
  pageIndex: number;
  [CenterFilterField.Search]?: string;
  [CenterFilterField.Branch]?: string;
  [CenterFilterField.CollectionDay]?: string;
};
