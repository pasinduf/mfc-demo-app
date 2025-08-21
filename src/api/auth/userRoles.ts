export const ADMIN = 'Admin';
export const COLLECTOR = 'Collector';
export const OFFICE = 'Collector';
export const ROLES = {
  ADMIN,
  COLLECTOR,
  OFFICE,
} as const;

export enum userRole {
  Admin = 1,
  Collector,
  OFFICE,
}
