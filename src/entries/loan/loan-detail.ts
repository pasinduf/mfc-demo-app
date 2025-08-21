import { Center } from '../center/center';
import { Member } from '../member/member';
import { Product } from './product';

export interface LoanDetail {
  id: number;
  enteredDate: string;
  startDate: string | null;
  endDate: string | null;
  member: Member;
  center: Center;
  product: Product;
  interestRate: number;
  repaymentTerm: string;
  documentChargeType: string;
  documentCharge: string;
  amount: string;
  totalOutstanding: number;
  terms: number;
  installmentAmount: string;
  balance: string;
  status: string;
}
