import { Collection_STATUS_OPTIONS, Loan_STATUS_OPTIONS } from '../api/auth/constants';
import { AVAILABLE_STATUSES } from '../components/Badge';

export const getStatusType = (status: string): any => {
  switch (status) {
    case Loan_STATUS_OPTIONS.Completed:
      return AVAILABLE_STATUSES.success;
    case Loan_STATUS_OPTIONS.PendingApproval:
      return AVAILABLE_STATUSES.warning;
    case Loan_STATUS_OPTIONS.PendingDocumentCharge:
      return AVAILABLE_STATUSES.warning;
    case Loan_STATUS_OPTIONS.InProgress:
      return AVAILABLE_STATUSES.default;
    case Loan_STATUS_OPTIONS.Closed:
      return AVAILABLE_STATUSES.error;
    default:
      return '';
  }
};


export const getCollectionStatusType = (status: string): any => {
  switch (status) {
    case Collection_STATUS_OPTIONS.Pending:
      return AVAILABLE_STATUSES.warning;
    case Collection_STATUS_OPTIONS.Collected:
      return AVAILABLE_STATUSES.success;
    default:
      return '';
  }
};
