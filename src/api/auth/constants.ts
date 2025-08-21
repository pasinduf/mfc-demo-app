export const RESPONSE_STATUS_400 = 400;
export const RESPONSE_STATUS_401 = 401;
export const RESPONSE_STATUS_403 = 403;
export const RESPONSE_STATUS_404 = 404;
export const RESPONSE_STATUS_500 = 500;

export const RESPONSE_NOT_FOUND = 'Not Found';
export const DEFAULT_PAGE_SIZE = 10;
export const DEFAULT_PAGE_INDEX = 0;
export const REPORT_DOWNLOAD_ERROR = 'Failed to download report';


export const enum Loan_STATUS_OPTIONS {
  PendingApproval = 'PendingApproval',
  PendingDocumentCharge = 'PendingDocumentCharge',
  InProgress = 'InProgress',
  Closed = 'Closed',
  Completed = 'Completed',
};

export const enum REPAYMENT_TERM {
  Daily = 'Daily',
  Weekly = 'Weekly',
  Biweekly = 'Biweekly',
  Monthly = 'Monthly',
}


export const enum REPORT_NAME {
  Day_Collections = 'day-collections',
}

export const PASSWORD_REGEX = /^(?=.*\d).{6,}$/;


export const XLSX_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheet.sheet';

export const XLSX_EXT = '.xlsx';

export const Collection_STATUS_OPTIONS = {
  Pending: 'Pending',
  Collected: 'Collected',
};



