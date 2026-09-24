import { z } from 'zod';
import { USER_ROLES } from '../constants';

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});
export type LoginInput = z.infer<typeof LoginSchema>;

export const RegisterSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(USER_ROLES).default('EDITOR'),
});
export type RegisterInput = z.infer<typeof RegisterSchema>;
