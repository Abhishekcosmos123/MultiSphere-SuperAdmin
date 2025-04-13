import { z } from 'zod';

/**
 * Login form validation schema
 * Validates:
 * - Email: Must be a valid email format
 * - Password: Must be at least 6 characters long
 */
export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

/**
 * Registration form validation schema
 * Validates:
 * - First Name: Required
 * - Last Name: Required
 * - Email: Must be a valid email format
 * - Password: Must be at least 6 characters long
 * - Confirm Password: Must match password
 */
export const registerSchema = z.object({
  firstName: z.string().min(1, "First Name is required."),
  lastName: z.string().min(1, "Last Name is required."),
  email: z.string().email("Invalid email address."),
  password: z.string().min(6, "Password must be at least 6 characters long."),
  confirmPassword: z.string().min(1, "Please confirm your password."),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords must match.",
  path: ["confirmPassword"],
});

// TypeScript type definitions derived from Zod schemas
export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
