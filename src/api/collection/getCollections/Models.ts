import { CollectionFilterField } from '../../../entries/collection/filter';

export type Arguments = {
  [CollectionFilterField.FromDate]?: string;
  [CollectionFilterField.ToDate]?: string | null;
  [CollectionFilterField.Center]?: number | null;
};
