export interface CollectionHistoryDto {
  date: string;
  collections: CollectionDto[]
}

export interface CollectionDto {
  createdDate: string;
  updatedDate: string;
  amount: string;
  loan: CollectionLoanDto;
}

export interface CollectionLoanDto {
  centerId: number;
  centerName: string;
  startDate: string;
  endDate: string;
  memberName: string;
  memberCode: string;
  amount: string;
  balance: string;
}
