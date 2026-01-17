export interface LoanPrevCollection {
  prevCollectionDate: Date;
  isEarly: boolean;
  lastCollection?: Collection;
}

export interface Collection {
  id: number;
  amount: number;
  arrears: number;
}
