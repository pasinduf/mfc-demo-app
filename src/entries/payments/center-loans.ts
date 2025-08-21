export interface CenterLoans {
  id: number;
  code: string;
  centerName: string;
  memberName: string;
  memberCode: string;
  amount: string;
  balance: number;
  terms: number;
  installmentAmount: number;
  arrears: number;
  repaymentTerm: string;
  prevCollectionDate: string;
  isEditable: boolean;
  collection: number;
  lastCollection?: Collection;
}

export interface Collection {
  id: number;
  amount: number;
  arrears: number;
  collectorId?: number;
}
