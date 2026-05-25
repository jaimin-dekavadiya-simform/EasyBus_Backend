export enum UserRoles {
  SUPER_ADMIN = 'SUPER_ADMIN',
  ORG_ADMIN = 'ORG_ADMIN',
  OPERATOR = 'OPERATOR',
  CONDUCTOR = 'CONDUCTOR',
  PASSENGER = 'PASSENGER',
}
export const RoleWeights: Record<UserRoles, number> = {
  [UserRoles.PASSENGER]: 10,
  [UserRoles.CONDUCTOR]: 20,
  [UserRoles.OPERATOR]: 30,
  [UserRoles.ORG_ADMIN]: 40,
  [UserRoles.SUPER_ADMIN]: 50,
};
export type prismaConflictError = { cause: { constraint: { fields: string[] } } };
