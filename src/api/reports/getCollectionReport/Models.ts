import { CollectionReportFilterField } from "../../../entries/reports/collection-report-filter";

export type Arguments = {
  [CollectionReportFilterField.FromDate]?: string;
  [CollectionReportFilterField.ToDate]?: string | null;
  [CollectionReportFilterField.Center]?: number | null;
};
