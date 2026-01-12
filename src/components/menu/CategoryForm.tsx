import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2 } from 'lucide-react'
import IconPicker from './IconPicker'

// Define schema locally without .default() to avoid optional input type
const categoryFormSchema = z.object({
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
  isActive: z.boolean(), // Required boolean, no .default()
})

type CategoryFormData = z.infer<typeof categoryFormSchema>

interface CategoryFormProps {
  initialData?: CategoryFormData & { _id?: string }
  onSuccess: () => void
  onCancel: () => void
}

export default function CategoryForm({ initialData, onSuccess, onCancel }: CategoryFormProps) {
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const isEditing = !!initialData?._id

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    formState: { errors },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      name: initialData?.name || '',
      nameUrdu: initialData?.nameUrdu || '',
      description: initialData?.description || '',
      icon: initialData?.icon || '',
      isActive: initialData?.isActive ?? true,
    },
  })

  const iconValue = watch('icon')

  const onSubmit = async (data: CategoryFormData) => {
    setIsLoading(true)
    setError('')

    try {
      const url = isEditing
        ? `/api/menu/categories/${initialData._id}`
        : '/api/menu/categories'
      
      const method = isEditing ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        if (result.details) {
          const errorMessages = result.details
            .map((detail: any) => detail.message)
            .join(', ')
          throw new Error(errorMessages)
        }
        throw new Error(result.error || 'Failed to save category')
      }

      onSuccess()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <Label htmlFor="name">Category Name (English) *</Label>
        <Input
          id="name"
          placeholder="Main Course"
          {...register('name')}
          disabled={isLoading}
        />
        {errors.name && (
          <p className="text-sm text-red-500">{errors.name.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="nameUrdu">Category Name (Urdu)</Label>
        <Input
          id="nameUrdu"
          placeholder="مین کورس"
          {...register('nameUrdu')}
          disabled={isLoading}
          dir="rtl"
        />
        {errors.nameUrdu && (
          <p className="text-sm text-red-500">{errors.nameUrdu.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          placeholder="Brief description of this category..."
          rows={3}
          {...register('description')}
          disabled={isLoading}
        />
        {errors.description && (
          <p className="text-sm text-red-500">{errors.description.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label>Icon</Label>
        <IconPicker
          value={iconValue}
          onChange={(icon) => setValue('icon', icon)}
        />
        {errors.icon && (
          <p className="text-sm text-red-500">{errors.icon.message}</p>
        )}
      </div>

      <div className="flex items-center gap-2">
        <Controller
          name="isActive"
          control={control}
          render={({ field }) => (
            <input
              type="checkbox"
              id="isActive"
              checked={field.value}
              onChange={(e) => field.onChange(e.target.checked)}
              disabled={isLoading}
              className="rounded border-slate-300"
            />
          )}
        />
        <Label htmlFor="isActive" className="cursor-pointer">
          Active (visible to customers)
        </Label>
      </div>

      <div className="flex gap-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
          className="flex-1"
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit(onSubmit)}
          disabled={isLoading}
          className="flex-1"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {isEditing ? 'Updating...' : 'Creating...'}
            </>
          ) : (
            <>{isEditing ? 'Update Category' : 'Create Category'}</>
          )}
        </Button>
      </div>
    </div>
  )
}