export interface CollectorLoanDto {
  id: number;
  interestRate: number;
  repaymentTerm: string;
  documentChargeType: string;
  documentCharge: string;
  amount: string;
  totalOutstanding: string;
  terms: number;
  installmentAmount: string;
  balance: string;
  status: string;
  startDate: string;
  endDate: string;
  approvedDate: string;
  isDailyCollected: boolean;
  collectionDay: string;
  member: MemberDto;
  center: string;
  isDayEnd: boolean;
  collection?: CollectionDto;
  expanded: boolean;
}
export interface MemberDto {
  code: string;
  firstName: string;
  lastName: string;
  nic: string;
  address: string;
  phoneNumber: string;
}
export interface CollectionDto {
  id: number;
  date: string;
  amount: number;
  arrears:number;
}
