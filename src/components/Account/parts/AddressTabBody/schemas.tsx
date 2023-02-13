import { z } from 'zod';

export const createAddressSchema = z
  .object({
    firstName: z.string().min(1, { message: 'Required' }),
    lastName: z.string().min(1, { message: 'Required' }),
    address1: z.string().min(1, { message: 'Required' }),
    address2: z.union([z.string(), z.null()]),
    city: z.string().min(1, { message: 'Required' }),
    country: z
      .string()
      .min(1, { message: 'Required. We do not ship out to this country.' }),
    zip: z.string().min(1, { message: 'Required' }),
    phone: z.union([z.string().min(9, { message: 'Required' }), z.null()])
  })
  .required();

export const updateAddressSchema = z
  .object({
    firstName: z.string().min(1, { message: 'Required' }),
    lastName: z.string().min(1, { message: 'Required' }),
    address1: z.string().min(1, { message: 'Required' }),
    address2: z.union([z.string(), z.null()]),
    city: z.string().min(1, { message: 'Required' }),
    country: z
      .string()
      .min(1, { message: 'Required. We do not ship out to this country.' }),
    zip: z.string().min(1, { message: 'Required' }),
    phone: z.union([z.string().min(9, { message: 'Required' }), z.null()])
  })
  .required();
