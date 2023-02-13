import { z } from 'zod';

export const signupFormSchema = z
  .object({
    firstName: z.string().min(1, { message: 'Required' }),
    lastName: z.string().min(1, { message: 'Required' }),
    email: z.string().email(),
    password: z
      .string()
      .min(8, { message: 'Password must contain at least 8 characters' })
  })
  .required();

export const loginFormSchema = z
  .object({
    email: z.string().email(),
    password: z.string().min(1, { message: 'Required' })
  })
  .required();
