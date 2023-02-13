import { z } from 'zod';

export const editNameFormSchema = z
  .object({
    firstName: z.string().min(1, { message: 'Required' }),
    lastName: z.string().min(1, { message: 'Required' })
  })
  .required();

export const editEmailFormSchema = z
  .object({
    email: z.string().email()
  })
  .required();

export const editPasswordFormSchema = z
  .object({
    password: z
      .string()
      .min(8, { message: 'Password must contain at least 8 characters' })
  })
  .required();

export const updateCustomerFormSchema = z
  .object({
    firstName: z.string().min(1, { message: 'Required' }),
    lastName: z.string().min(1, { message: 'Required' }),
    email: z.string().email(),
    password: z.union([
      z
        .string()
        .min(8, { message: 'Password must contain at least 8 characters' }),
      z.null()
    ]),
    phone: z.union([z.string().min(9, { message: 'Required' }), z.null()]),
    acceptsMarketing: z.boolean().default(false)
  })
  .required();
