export interface LoanPrevCollection {
  prevCollectionDate: Date;
  lastCollection?: Collection;
}

export interface Collection {
  id: number;
  amount: number;
  arrears: number;
}
