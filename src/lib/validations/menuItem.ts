// import { z } from 'zod'

// // Menu item creation/update schema
// export const menuItemSchema = z.object({
//   categoryId: z
//     .string()
//     .min(1, 'Category is required'),
//   name: z
//     .string()
//     .min(2, 'Item name must be at least 2 characters')
//     .max(100, 'Item name must be less than 100 characters')
//     .trim(),
//   nameUrdu: z
//     .string()
//     .max(100, 'Urdu name must be less than 100 characters')
//     .optional()
//     .or(z.literal('')),
//   description: z
//     .string()
//     .min(10, 'Description must be at least 10 characters')
//     .max(500, 'Description must be less than 500 characters')
//     .trim(),
//   descriptionUrdu: z
//     .string()
//     .max(500, 'Urdu description must be less than 500 characters')
//     .optional()
//     .or(z.literal('')),
//   price: z
//     .number()
//     .min(0, 'Price must be 0 or greater')
//     .max(999999, 'Price is too high'),
//   images: z
//     .array(z.string().url())
//     .default([]),
//   isAvailable: z
//     .boolean()
//     .optional()
//     .default(true),
//   isPopular: z
//     .boolean()
//     .optional()
//     .default(false),
//   preparationTime: z
//     .number()
//     .min(0, 'Preparation time must be 0 or greater')
//     .max(300, 'Preparation time must be less than 300 minutes')
//     .optional()
//     .default(15),
//   dietaryInfo: z
//     .object({
//       isVegetarian: z.boolean().default(false),
//       isVegan: z.boolean().default(false),
//       isGlutenFree: z.boolean().default(false),
//       isSpicy: z.boolean().default(false),
//       spicyLevel: z.number().min(0).max(5).optional(),
//       allergens: z.array(z.string()).default([]),
//     })
//     .default({
//       isVegetarian: false,
//       isVegan: false,
//       isGlutenFree: false,
//       isSpicy: false,
//       allergens: [],
//     }),
// })

// // Type inference
// export type MenuItemInput = z.infer<typeof menuItemSchema>

import { z } from 'zod'

export const menuItemSchema = z.object({
  categoryId: z.string().min(1, 'Category is required'),

  name: z
    .string()
    .min(2, 'Item name must be at least 2 characters')
    .max(100)
    .trim(),

  nameUrdu: z.string().max(100).optional(),

  description: z
    .string()
    .min(10, 'Description must be at least 10 characters')
    .max(500)
    .trim(),

  descriptionUrdu: z.string().max(500).optional(),

  price: z.number().min(0).max(999999),

  images: z.array(z.string().url()),

  isAvailable: z.boolean(),

  isPopular: z.boolean(),

  preparationTime: z.number().min(0).max(300),

  dietaryInfo: z.object({
    isVegetarian: z.boolean(),
    isVegan: z.boolean(),
    isGlutenFree: z.boolean(),
    isSpicy: z.boolean(),
    spicyLevel: z.number().min(1).max(5).optional(),
    allergens: z.array(z.string()),
  }),
})

export type MenuItemFormData = z.infer<typeof menuItemSchema>
