'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import { Loader2, Leaf, Flame } from 'lucide-react'
import { menuItemSchema } from '@/lib/validations/menuItem'
import ImageUpload from './ImageUpload'
import { z } from 'zod'

type MenuItemFormData = z.infer<typeof menuItemSchema>

interface Category {
  _id: string
  name: string
  nameUrdu?: string
}

interface MenuItemFormProps {
  initialData?: MenuItemFormData & { _id?: string }
  onSuccess: () => void
  onCancel: () => void
}

export default function MenuItemForm({ initialData, onSuccess, onCancel }: MenuItemFormProps) {
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const isEditing = !!initialData?._id

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<MenuItemFormData>({
    resolver: zodResolver(menuItemSchema),
    defaultValues: initialData || {
      categoryId: '',
      name: '',
      nameUrdu: '',
      description: '',
      descriptionUrdu: '',
      price: 0,
      images: [],
      isAvailable: true,
      isPopular: false,
      preparationTime: 15,
      dietaryInfo: {
        isVegetarian: false,
        isVegan: false,
        isGlutenFree: false,
        isSpicy: false,
        allergens: [],
      },
    },
  })

  const images = watch('images')
  const isSpicy = watch('dietaryInfo.isSpicy')
  const spicyLevel = watch('dietaryInfo.spicyLevel')

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/menu/categories')
      const data = await response.json()
      if (data.success) {
        setCategories(data.data.filter((cat: any) => cat.isActive))
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error)
    }
  }

  const onSubmit = async (data: MenuItemFormData) => {
    setIsLoading(true)
    setError('')

    try {
      const url = isEditing
        ? `/api/menu/items/${initialData._id}`
        : '/api/menu/items'
      
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
        throw new Error(result.error || 'Failed to save menu item')
      }

      onSuccess()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Basic Information */}
      <div className="space-y-4">
        <h3 className="font-semibold">Basic Information</h3>
        
        <div className="space-y-2">
          <Label htmlFor="categoryId">Category *</Label>
          <select
            id="categoryId"
            {...register('categoryId')}
            disabled={isLoading}
            className="w-full px-3 py-2 border rounded-md"
          >
            <option value="">Select Category</option>
            {categories.map((category) => (
              <option key={category._id} value={category._id}>
                {category.name}
                {category.nameUrdu && ` (${category.nameUrdu})`}
              </option>
            ))}
          </select>
          {errors.categoryId && (
            <p className="text-sm text-red-500">{errors.categoryId.message}</p>
          )}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="name">Item Name (English) *</Label>
            <Input
              id="name"
              placeholder="Chicken Biryani"
              {...register('name')}
              disabled={isLoading}
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="nameUrdu">Item Name (Urdu)</Label>
            <Input
              id="nameUrdu"
              placeholder="چکن بریانی"
              {...register('nameUrdu')}
              disabled={isLoading}
              dir="rtl"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description (English) *</Label>
          <Textarea
            id="description"
            placeholder="Aromatic basmati rice cooked with tender chicken pieces and traditional spices..."
            rows={3}
            {...register('description')}
            disabled={isLoading}
          />
          {errors.description && (
            <p className="text-sm text-red-500">{errors.description.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="descriptionUrdu">Description (Urdu)</Label>
          <Textarea
            id="descriptionUrdu"
            placeholder="خوشبودار بسمتی چاول..."
            rows={3}
            {...register('descriptionUrdu')}
            disabled={isLoading}
            dir="rtl"
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="price">Price (PKR) *</Label>
            <Input
              id="price"
              type="number"
              min="0"
              placeholder="450"
              {...register('price', { valueAsNumber: true })}
              disabled={isLoading}
            />
            {errors.price && (
              <p className="text-sm text-red-500">{errors.price.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="preparationTime">Preparation Time (minutes)</Label>
            <Input
              id="preparationTime"
              type="number"
              min="0"
              placeholder="15"
              {...register('preparationTime', { valueAsNumber: true })}
              disabled={isLoading}
            />
          </div>
        </div>
      </div>

      <Separator />

      {/* Images */}
      <div className="space-y-4">
        <h3 className="font-semibold">Images</h3>
        <ImageUpload
          images={images}
          onChange={(newImages) => setValue('images', newImages)}
        />
      </div>

      <Separator />

      {/* Dietary Information */}
      <div className="space-y-4">
        <h3 className="font-semibold flex items-center gap-2">
          <Leaf className="h-5 w-5 text-green-600" />
          Dietary Information
        </h3>
        
        <div className="grid gap-4 md:grid-cols-2">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isVegetarian"
              {...register('dietaryInfo.isVegetarian')}
              disabled={isLoading}
              className="rounded border-slate-300"
            />
            <Label htmlFor="isVegetarian" className="cursor-pointer">
              Vegetarian
            </Label>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isVegan"
              {...register('dietaryInfo.isVegan')}
              disabled={isLoading}
              className="rounded border-slate-300"
            />
            <Label htmlFor="isVegan" className="cursor-pointer">
              Vegan
            </Label>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isGlutenFree"
              {...register('dietaryInfo.isGlutenFree')}
              disabled={isLoading}
              className="rounded border-slate-300"
            />
            <Label htmlFor="isGlutenFree" className="cursor-pointer">
              Gluten Free
            </Label>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isSpicy"
              {...register('dietaryInfo.isSpicy')}
              disabled={isLoading}
              className="rounded border-slate-300"
            />
            <Label htmlFor="isSpicy" className="cursor-pointer flex items-center gap-1">
              <Flame className="h-4 w-4 text-red-500" />
              Spicy
            </Label>
          </div>
        </div>

        {isSpicy && (
          <div className="space-y-2">
            <Label htmlFor="spicyLevel">Spicy Level (1-5)</Label>
            <Input
              id="spicyLevel"
              type="number"
              min="1"
              max="5"
              value={spicyLevel || 1}
              {...register('dietaryInfo.spicyLevel', { valueAsNumber: true })}
              disabled={isLoading}
            />
          </div>
        )}
      </div>

      <Separator />

      {/* Availability */}
      <div className="space-y-4">
        <h3 className="font-semibold">Availability & Settings</h3>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isAvailable"
              {...register('isAvailable')}
              disabled={isLoading}
              className="rounded border-slate-300"
            />
            <Label htmlFor="isAvailable" className="cursor-pointer">
              Available (in stock)
            </Label>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isPopular"
              {...register('isPopular')}
              disabled={isLoading}
              className="rounded border-slate-300"
            />
            <Label htmlFor="isPopular" className="cursor-pointer">
              Mark as Popular
            </Label>
          </div>
        </div>
      </div>

      {/* Actions */}
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
            <>{isEditing ? 'Update Menu Item' : 'Create Menu Item'}</>
          )}
        </Button>
      </div>
    </div>
  )
}