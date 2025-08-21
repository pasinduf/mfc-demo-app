import { MemberFilterField } from '../../../entries/member/filter';

export type Arguments = {
  pageSize: number;
  pageIndex: number;
  [MemberFilterField.Status]: string;
  [MemberFilterField.Search]?: string;
  [MemberFilterField.Branch]?: string;
  [MemberFilterField.Center]?: string;
};
