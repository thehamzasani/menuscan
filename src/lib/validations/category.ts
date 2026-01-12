import { z } from 'zod'

// Category creation/update schema
export const categorySchema = z.object({
  name: z
    .string()
    .min(2, 'Category name must be at least 2 characters')
    .max(50, 'Category name must be less than 50 characters')
    .trim(),
  nameUrdu: z
    .string()
    .max(50, 'Urdu name must be less than 50 characters')
    .optional()
    .or(z.literal('')),
  description: z
    .string()
    .max(200, 'Description must be less than 200 characters')
    .optional()
    .or(z.literal('')),
  icon: z
    .string()
    .optional()
    .or(z.literal('')),
  isActive: z
    .boolean()
    .optional()
    .default(true),  // Make it optional with a default
})

// Schema for reordering categories
export const reorderCategoriesSchema = z.object({
  categoryIds: z
    .array(z.string())
    .min(1, 'At least one category ID is required'),
})

// Type inference
export type CategoryInput = z.infer<typeof categorySchema>
export type ReorderCategoriesInput = z.infer<typeof reorderCategoriesSchema>