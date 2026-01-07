// import { z } from 'zod'

// // Step 2: Restaurant Details Schema
// export const restaurantDetailsSchema = z.object({
//   name: z
//     .string()
//     .min(2, 'Restaurant name must be at least 2 characters')
//     .max(100, 'Restaurant name must be less than 100 characters')
//     .trim(),
//   description: z
//     .string()
//     .max(500, 'Description must be less than 500 characters')
//     .optional(),
//   street: z
//     .string()
//     .min(5, 'Street address must be at least 5 characters')
//     .max(200, 'Street address is too long')
//     .trim(),
//   area: z
//     .string()
//     .min(2, 'Area must be at least 2 characters')
//     .max(100, 'Area name is too long')
//     .trim(),
//   city: z
//     .string()
//     .min(2, 'City must be at least 2 characters')
//     .max(50, 'City name is too long')
//     .trim(),
//   phone: z
//     .string()
//     .regex(/^(\+92|0)?3[0-9]{9}$/, 'Invalid Pakistani phone number')
//     .trim(),
// })

// // Step 3: Settings Schema
// export const restaurantSettingsSchema = z.object({
//   currency: z.string().default('PKR'),
//   language: z.enum(['en', 'ur']).default('en'),
//   primaryColor: z
//     .string()
//     .regex(/^#[0-9A-F]{6}$/i, 'Invalid color format')
//     .default('#3b82f6'),
//   secondaryColor: z
//     .string()
//     .regex(/^#[0-9A-F]{6}$/i, 'Invalid color format')
//     .default('#8b5cf6'),
// })

// // Combined schema for complete registration
// export const completeRegistrationSchema = z.object({
//   // Owner details (from signup)
//   ownerName: z.string().min(2).max(50),
//   ownerEmail: z.string().email(),
//   ownerPassword: z.string().min(6),
  
//   // Restaurant details
//   restaurantName: z.string().min(2).max(100),
//   description: z.string().max(500).optional(),
//   street: z.string().min(5).max(200),
//   area: z.string().min(2).max(100),
//   city: z.string().min(2).max(50),
//   phone: z.string().regex(/^(\+92|0)?3[0-9]{9}$/),
  
//   // Settings
//   currency: z.string().default('PKR'),
//   language: z.enum(['en', 'ur']).default('en'),
//   primaryColor: z.string().default('#3b82f6'),
//   secondaryColor: z.string().default('#8b5cf6'),
// })

// // Type inference
// export type RestaurantDetailsInput = z.infer<typeof restaurantDetailsSchema>
// export type RestaurantSettingsInput = z.infer<typeof restaurantSettingsSchema>
// export type CompleteRegistrationInput = z.infer<typeof completeRegistrationSchema>

import { z } from 'zod'

// Step 2: Restaurant Details Schema
export const restaurantDetailsSchema = z.object({
  name: z
    .string()
    .min(2, 'Restaurant name must be at least 2 characters')
    .max(100, 'Restaurant name must be less than 100 characters')
    .trim(),
  description: z
    .string()
    .max(500, 'Description must be less than 500 characters')
    .optional(),
  street: z
    .string()
    .min(5, 'Street address must be at least 5 characters')
    .max(200, 'Street address is too long')
    .trim(),
  area: z
    .string()
    .min(2, 'Area must be at least 2 characters')
    .max(100, 'Area name is too long')
    .trim(),
  city: z
    .string()
    .min(2, 'City must be at least 2 characters')
    .max(50, 'City name is too long')
    .trim(),
  phone: z
    .string()
    .regex(/^(\+92|0)?3[0-9]{9}$/, 'Invalid Pakistani phone number')
    .trim(),
})

// Step 3: Settings Schema
export const restaurantSettingsSchema = z.object({
  currency: z.string(),
  language: z.enum(['en', 'ur']),
  primaryColor: z
    .string()
    .regex(/^#[0-9A-F]{6}$/i, 'Invalid color format'),
  secondaryColor: z
    .string()
    .regex(/^#[0-9A-F]{6}$/i, 'Invalid color format'),
})

// Combined schema for complete registration
export const completeRegistrationSchema = z.object({
  // Owner details (from signup)
  ownerName: z.string().min(2).max(50),
  ownerEmail: z.string().email(),
  ownerPassword: z.string().min(6),
  
  // Restaurant details
  restaurantName: z.string().min(2).max(100),
  description: z.string().max(500).optional(),
  street: z.string().min(5).max(200),
  area: z.string().min(2).max(100),
  city: z.string().min(2).max(50),
  phone: z.string().regex(/^(\+92|0)?3[0-9]{9}$/),
  
  // Settings - NO .default() here, just required strings
  currency: z.string(),
  language: z.enum(['en', 'ur']),
  primaryColor: z.string(),
  secondaryColor: z.string(),
})

// Type inference
export type RestaurantDetailsInput = z.infer<typeof restaurantDetailsSchema>
export type RestaurantSettingsInput = z.infer<typeof restaurantSettingsSchema>
export type CompleteRegistrationInput = z.infer<typeof completeRegistrationSchema>