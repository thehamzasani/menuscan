import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2 } from 'lucide-react'
import { categorySchema } from '@/lib/validations/category'
import IconPicker from './IconPicker'

// Define the form data type explicitly
interface CategoryFormData {
  name: string
  nameUrdu?: string
  description?: string
  icon?: string
  isActive: boolean
}

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
    formState: { errors },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: initialData?.name || '',
      nameUrdu: initialData?.nameUrdu || '',
      description: initialData?.description || '',
      icon: initialData?.icon || '',
      isActive: initialData?.isActive !== undefined ? initialData.isActive : true,
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
        <input
          type="checkbox"
          id="isActive"
          {...register('isActive')}
          disabled={isLoading}
          className="rounded border-slate-300"
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