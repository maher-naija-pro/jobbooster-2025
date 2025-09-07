import { z } from 'zod'
import { DEFAULT_PASSWORD_CONSTRAINTS } from '@/components/auth/password-constraints'

// Create a reusable password validation schema
const passwordSchema = z.string()
  .min(DEFAULT_PASSWORD_CONSTRAINTS.minLength, `Password must be at least ${DEFAULT_PASSWORD_CONSTRAINTS.minLength} characters`)
  .max(DEFAULT_PASSWORD_CONSTRAINTS.maxLength || 128, `Password must be no more than ${DEFAULT_PASSWORD_CONSTRAINTS.maxLength || 128} characters`)

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: passwordSchema,
})

export const registerSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: passwordSchema,
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

export const resetPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
})

export const updatePasswordSchema = z.object({
  password: passwordSchema,
  confirmPassword: z.string(),
  token: z.string().nullable().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})



export const updateProfileSchema = z.object({
  fullName: z.string().min(1, 'Full name is required').max(100, 'Full name must be less than 100 characters'),
  username: z.string().min(3, 'Username must be at least 3 characters').max(30, 'Username must be less than 30 characters').regex(/^[a-zA-Z0-9_-]+$/, 'Username can only contain letters, numbers, underscores, and hyphens'),
})

export const updatePreferencesSchema = z.object({
  language: z.string().min(2, 'Language is required'),
  timezone: z.string().min(1, 'Timezone is required'),
  emailNotifications: z.boolean(),
  marketingNotifications: z.boolean(),
  profileVisibility: z.enum(['public', 'private']),
  dataRetention: z.number().min(30, 'Data retention must be at least 30 days').max(3650, 'Data retention must be less than 10 years'),
})

export type LoginFormData = z.infer<typeof loginSchema>
export type RegisterFormData = z.infer<typeof registerSchema>
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>
export type UpdatePasswordFormData = z.infer<typeof updatePasswordSchema>
export type UpdateProfileFormData = z.infer<typeof updateProfileSchema>
export type UpdatePreferencesFormData = z.infer<typeof updatePreferencesSchema>
