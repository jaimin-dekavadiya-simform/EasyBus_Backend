import z from 'zod';

export const createOrganizationSchema = z.object({
  tenantId: z.string().min(1, 'TenantId is required'),
  name: z.string().min(1, 'Name is required'),
  contactEmail: z.email('Invalid Email'),
});

export type CreateOrganizationInput = z.infer<typeof createOrganizationSchema>;
