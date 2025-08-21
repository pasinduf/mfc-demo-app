import { PERMISSIONS } from './userPermissions';
import { ROLES } from './userRoles';

export type USER_ROLE = keyof typeof ROLES;
export type USER_ROLES = (typeof ROLES)[USER_ROLE];
export type PERMISSION = keyof typeof PERMISSIONS;
export type USER_PERMISSIONS = (typeof PERMISSIONS)[PERMISSION];
