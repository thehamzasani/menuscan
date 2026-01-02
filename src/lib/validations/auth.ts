import { z } from 'zod'

// Signup validation schema
export const signupSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be less than 50 characters')
    .trim(),
  email: z
    .string()
    .email('Invalid email address')
    .toLowerCase()
    .trim(),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters')
    .max(100, 'Password is too long'),
  phone: z
    .string()
    .regex(/^(\+92|0)?3[0-9]{9}$/, 'Invalid Pakistani phone number')
    .optional()
    .or(z.literal('')), // Allow empty string
  role: z.enum(['owner', 'super_admin']).default('owner').optional(),
})

// Login validation schema
export const loginSchema = z.object({
  email: z
    .string()
    .email('Invalid email address')
    .toLowerCase()
    .trim(),
  password: z
    .string()
    .min(1, 'Password is required'),
})

// Types inferred from schemas
export type SignupInput = z.infer<typeof signupSchema>
export type LoginInput = z.infer<typeof loginSchema>