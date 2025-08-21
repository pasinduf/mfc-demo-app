export interface Loan {
  id: number;
  enteredDate: string;
  centerName: string;
  memberName: string;
  memberCode: string;
  amount: string;
  balance: string;
  repaymentTerm: string;
  terms: number;
  documentCharge: string;
  documentChargePercentage : string
  status: string;
}

export enum LoanField {
  FirstName = 'lastName',
  LastName = 'lastName',
  Code = 'code',
  Nic = 'nic',
  Address = 'address',
  PhoneNumber = 'phoneNumber',
  BusinessType = 'businessType',
  GarantorFirstName = 'garantorFirstName',
  GarantorLastName = 'garantorLastName',
  GarantorNic = 'garantorNic',
  GarantorPhoneNumber = 'garantorPhoneNumber',
  GarantorRelationShip = 'garantorRelationShip',
  Center = 'centerId',
}

export interface LoanInputs {
  [LoanField.FirstName]: string;
  [LoanField.LastName]: string;
  [LoanField.Code]: string;
  [LoanField.Nic]: string;
  [LoanField.Address]: string;
  [LoanField.PhoneNumber]: string;
  [LoanField.BusinessType]: string;
  [LoanField.Center]: string;
  [LoanField.GarantorFirstName]: string;
  [LoanField.GarantorLastName]: string;
  [LoanField.GarantorNic]: string;
  [LoanField.GarantorPhoneNumber]: string;
  [LoanField.GarantorRelationShip]: string;
}
