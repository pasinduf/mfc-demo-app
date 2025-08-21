import { Center } from '../center/center';

export interface User {
  id: number;
  username: string;
  code: string;
  firstName: string;
  lastName: string;
  nic: string;
  empNumber:string;
  dob: string;
  address: string;
  phoneNumber: string;
  role: Role;
  centers: Center[];
  access : number[];
}

export interface Role {
  id: number;
  name: string;
}

export enum UserField {
  Username = 'username',
  Password = 'password',
  FirstName = 'firstName',
  LastName = 'lastName',
  Nic = 'nic',
  Address = 'address',
  PhoneNumber = 'phoneNumber',
  Role = 'roleId',
  Centers = 'centers',
}

export interface MemberInputs {
  [UserField.Username]: string;
  [UserField.Password]: string;
  [UserField.FirstName]: string;
  [UserField.LastName]: string;
  [UserField.Nic]: string;
  [UserField.Address]: string;
  [UserField.PhoneNumber]: string;
  [UserField.Role]: number;
  [UserField.Centers]: any;
}
