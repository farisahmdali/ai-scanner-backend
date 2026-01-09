import { z } from 'zod';

export const RegisterUserSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const LoginUserSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export type RegisterUserSchemaType = z.infer<typeof RegisterUserSchema>;
export type LoginUserSchemaType = z.infer<typeof LoginUserSchema>;