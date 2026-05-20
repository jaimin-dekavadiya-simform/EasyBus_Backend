export enum UserRoles {
  SUPER_ADMIN = 'SUPER_ADMIN',
  ORG_ADMIN = 'ORG_ADMIN',
  OPERATOR = 'OPERATOR',
  CONDUCTOR = 'CONDUCTOR',
  PASSENGER = 'PASSENGER',
}
export type prismaConflictError = { cause: { constraint: { fields: string[] } } };
