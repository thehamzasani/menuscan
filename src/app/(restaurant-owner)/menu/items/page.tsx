'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Alert, AlertDescription } from '@/components/ui/alert'
import Link from 'next/link'
import { 
  Plus, 
  Edit, 
  Trash2, 
  Search,
  AlertCircle,
  Leaf,
  Flame 
} from 'lucide-react'
import { formatPrice } from '@/lib/utils'

interface MenuItem {
  _id: string
  name: string
  nameUrdu?: string
  description: string
  price: number
  images: string[]
  isAvailable: boolean
  isPopular: boolean
  categoryId: {
    _id: string
    name: string
    nameUrdu?: string
  }
  dietaryInfo: {
    isVegetarian: boolean
    isVegan: boolean
    isGlutenFree: boolean
    isSpicy: boolean
    spicyLevel?: number
  }
}

export default function MenuItemsPage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<string>('')

  useEffect(() => {
    fetchMenuItems()
  }, [categoryFilter])

  const fetchMenuItems = async () => {
    try {
      let url = '/api/menu/items'
      const params = new URLSearchParams()
      
      if (categoryFilter) {
        params.append('categoryId', categoryFilter)
      }
      
      if (params.toString()) {
        url += `?${params.toString()}`
      }

      const response = await fetch(url)
      const data = await response.json()

      if (data.success) {
        setMenuItems(data.data)
      } else {
        setError(data.error || 'Failed to load menu items')
      }
    } catch (error) {
      console.error('Failed to fetch menu items:', error)
      setError('Failed to load menu items')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this menu item?')) {
      return
    }

    try {
      const response = await fetch(`/api/menu/items/${id}`, {
        method: 'DELETE',
      })

      const data = await response.json()

      if (data.success) {
        fetchMenuItems()
      } else {
        alert(data.error || 'Failed to delete menu item')
      }
    } catch (error) {
      console.error('Failed to delete menu item:', error)
      alert('Failed to delete menu item')
    }
  }

  const filteredItems = menuItems.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase()) ||
    item.description.toLowerCase().includes(search.toLowerCase())
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600 mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading menu items...</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Menu Items</h1>
          <p className="mt-2 text-slate-600">Manage your menu items</p>
        </div>
        <Link href="/menu/items/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Menu Item
          </Button>
        </Link>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder="Search menu items..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Menu Items ({filteredItems.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredItems.length === 0 ? (
            <div className="py-12 text-center">
              <Plus className="mx-auto h-16 w-16 text-slate-300" />
              <p className="mt-4 text-lg font-medium text-slate-900">No menu items yet</p>
              <p className="mt-2 text-sm text-slate-500">
                Create your first menu item to start taking orders
              </p>
              <Link href="/menu/items/new">
                <Button className="mt-6">
                  <Plus className="mr-2 h-4 w-4" />
                  Create First Item
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredItems.map((item) => (
                <div
                  key={item._id}
                  className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                >
                  {/* Image */}
                  {item.images[0] ? (
                    <img
                      src={item.images[0]}
                      alt={item.name}
                      className="w-full h-48 object-cover"
                    />
                  ) : (
                    <div className="w-full h-48 bg-slate-100 flex items-center justify-center">
                      <Plus className="h-12 w-12 text-slate-300" />
                    </div>
                  )}

                  {/* Content */}
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h3 className="font-semibold truncate">{item.name}</h3>
                        <p className="text-sm text-slate-600 mb-2">
                          {item.categoryId.name}
                        </p>
                      </div>
                      <div className="text-lg font-bold text-blue-600">
                        {formatPrice(item.price)}
                      </div>
                    </div>

                    <p className="text-sm text-slate-600 line-clamp-2 mb-3">
                      {item.description}
                    </p>

                    {/* Badges */}
                    <div className="flex flex-wrap gap-1 mb-3">
                      {item.isPopular && (
                        <Badge className="bg-yellow-100 text-yellow-800 text-xs">
                          Popular
                        </Badge>
                      )}
                      {item.dietaryInfo.isVegetarian && (
                        <Badge className="bg-green-100 text-green-800 text-xs">
                          <Leaf className="h-3 w-3 mr-1" />
                          Veg
                        </Badge>
                      )}
                      {item.dietaryInfo.isSpicy && (
                        <Badge className="bg-red-100 text-red-800 text-xs">
                          <Flame className="h-3 w-3 mr-1" />
                          Spicy
                        </Badge>
                      )}
                      {!item.isAvailable && (
                        <Badge className="bg-gray-100 text-gray-800 text-xs">
                          Out of Stock
                        </Badge>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Link href={`/menu/items/${item._id}/edit`} className="flex-1">
                        <Button variant="outline" size="sm" className="w-full">
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(item._id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}