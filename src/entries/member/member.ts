import { Center } from '../center/center';
import { Guarantor } from './guarantor';

export interface Member {
  id: number;
  code: string;
  firstName: string;
  lastName: string;
  nic: string;
  dob: string;
  address: string;
  phoneNumber: string;
  businessType: string;
  guarantor: Guarantor;
  center: Center;
}

export enum MemberField {
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

export interface MemberInputs {
  [MemberField.FirstName]: string;
  [MemberField.LastName]: string;
  [MemberField.Code]: string;
  [MemberField.Nic]: string;
  [MemberField.Address]: string;
  [MemberField.PhoneNumber]: string;
  [MemberField.BusinessType]: string;
  [MemberField.Center]: string;
  [MemberField.GarantorFirstName]: string;
  [MemberField.GarantorLastName]: string;
  [MemberField.GarantorNic]: string;
  [MemberField.GarantorPhoneNumber]: string;
  [MemberField.GarantorRelationShip]: string;
}
