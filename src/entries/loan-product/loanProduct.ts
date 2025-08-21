export interface LoanProduct {
  id: number;
  code: string;
  interestRate: number;
  repaymentTerm: string;
  documentCharge: number;
}

export enum LoanProductField {
  Code = 'code',
  InterestRate = 'interestRate',
  RepaymentTerm = 'repaymentTerm',
  DocumentCharge = 'documentCharge',
}

export interface LoanProductInputs {
  [LoanProductField.Code]: string;
  [LoanProductField.InterestRate]: number;
  [LoanProductField.RepaymentTerm]: string;
  [LoanProductField.DocumentCharge]: number;
}
