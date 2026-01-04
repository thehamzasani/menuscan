'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Search, ChevronLeft, ChevronRight, Eye, Ban, CheckCircle, AlertCircle } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import { RestaurantDetailsModal } from '@/components/admin/RestaurantDetailsModal'

interface Restaurant {
  _id: string
  name: string
  slug: string
  description?: string
  address: {
    street: string
    city: string
    area: string
    phone: string
  }
  ownerId: {
    _id: string
    name: string
    email: string
  }
  subscription: {
    plan: string
    status: string
    freeCredits: number
    paidCredits: number
    startDate?: string
    endDate?: string
  }
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export default function RestaurantsPage() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null)
  const [modalOpen, setModalOpen] = useState(false)

  useEffect(() => {
    fetchRestaurants()
  }, [page, statusFilter])

  const fetchRestaurants = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10',
        search: search,
        status: statusFilter,
      })

      const response = await fetch(`/api/admin/restaurants?${params}`)
      const data = await response.json()

      if (data.success) {
        setRestaurants(data.data.restaurants)
        setTotalPages(data.data.pagination.totalPages)
        setTotal(data.data.pagination.total)
      }
    } catch (error) {
      console.error('Failed to fetch restaurants:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = () => {
    setPage(1)
    fetchRestaurants()
  }

  const handleStatusChange = async (restaurantId: string, newStatus: string) => {
    if (!confirm(`Are you sure you want to ${newStatus === 'suspended' ? 'suspend' : 'activate'} this restaurant?`)) {
      return
    }

    try {
      const response = await fetch(`/api/admin/restaurants/${restaurantId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })

      const data = await response.json()

      if (data.success) {
        fetchRestaurants()
      } else {
        alert(data.error || 'Failed to update status')
      }
    } catch (error) {
      console.error('Failed to update status:', error)
      alert('Failed to update status')
    }
  }

  const getStatusBadge = (status: string) => {
    const configs: Record<string, { className: string; label: string }> = {
      active: { className: 'bg-green-100 text-green-800', label: 'Active' },
      suspended: { className: 'bg-red-100 text-red-800', label: 'Suspended' },
      cancelled: { className: 'bg-gray-100 text-gray-800', label: 'Cancelled' },
    }

    const config = configs[status] || configs.active

    return (
      <Badge className={config.className}>
        {config.label}
      </Badge>
    )
  }

  const getPlanBadge = (plan: string) => {
    const colors: Record<string, string> = {
      free: 'bg-slate-100 text-slate-800',
      basic: 'bg-blue-100 text-blue-800',
      pro: 'bg-purple-100 text-purple-800',
      enterprise: 'bg-orange-100 text-orange-800',
    }

    return (
      <Badge className={`${colors[plan] || colors.free}`}>
        {plan.charAt(0).toUpperCase() + plan.slice(1)}
      </Badge>
    )
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Restaurants</h1>
        <p className="mt-2 text-slate-600">Manage all registered restaurants</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>All Restaurants ({total})</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="mb-6 flex flex-col gap-4 md:flex-row">
            <div className="flex flex-1 gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  placeholder="Search by name or slug..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  className="pl-10"
                />
              </div>
              <Button onClick={handleSearch}>Search</Button>
            </div>

            <Select value={statusFilter} onValueChange={(value) => {
              setStatusFilter(value)
              setPage(1)
            }}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Table */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600"></div>
            </div>
          ) : restaurants.length === 0 ? (
            <div className="py-12 text-center">
              <AlertCircle className="mx-auto h-12 w-12 text-slate-400" />
              <p className="mt-4 text-slate-500">No restaurants found</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Restaurant</TableHead>
                      <TableHead>Owner</TableHead>
                      <TableHead>Plan</TableHead>
                      <TableHead>Credits</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {restaurants.map((restaurant) => (
                      <TableRow key={restaurant._id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{restaurant.name}</div>
                            <div className="text-sm text-slate-500">
                              /{restaurant.slug}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">
                              {restaurant.ownerId?.name || 'N/A'}
                            </div>
                            <div className="text-sm text-slate-500">
                              {restaurant.ownerId?.email || 'N/A'}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {getPlanBadge(restaurant.subscription.plan)}
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div className="flex items-center gap-1">
                              <span className="text-slate-600">Free:</span>
                              <span className="font-medium">{restaurant.subscription.freeCredits}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <span className="text-slate-600">Paid:</span>
                              <span className="font-medium">{restaurant.subscription.paidCredits}</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(restaurant.subscription.status)}
                        </TableCell>
                        <TableCell className="text-sm text-slate-500">
                          {formatDate(restaurant.createdAt)}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            {restaurant.subscription.status === 'active' ? (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  handleStatusChange(restaurant._id, 'suspended')
                                }
                              >
                                <Ban className="mr-1 h-4 w-4" />
                                Suspend
                              </Button>
                            ) : (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  handleStatusChange(restaurant._id, 'active')
                                }
                              >
                                <CheckCircle className="mr-1 h-4 w-4" />
                                Activate
                              </Button>
                            )}
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => {
                                setSelectedRestaurant(restaurant)
                                setModalOpen(true)
                              }}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              <div className="mt-6 flex flex-col items-center justify-between gap-4 md:flex-row">
                <div className="text-sm text-slate-600">
                  Showing {(page - 1) * 10 + 1} to{' '}
                  {Math.min(page * 10, total)} of {total} restaurants
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(page - 1)}
                    disabled={page === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </Button>
                  
                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum
                      if (totalPages <= 5) {
                        pageNum = i + 1
                      } else if (page <= 3) {
                        pageNum = i + 1
                      } else if (page >= totalPages - 2) {
                        pageNum = totalPages - 4 + i
                      } else {
                        pageNum = page - 2 + i
                      }
                      
                      return (
                        <Button
                          key={pageNum}
                          variant={pageNum === page ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setPage(pageNum)}
                        >
                          {pageNum}
                        </Button>
                      )
                    })}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(page + 1)}
                    disabled={page === totalPages}
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Restaurant Details Modal */}
      <RestaurantDetailsModal
        restaurant={selectedRestaurant}
        open={modalOpen}
        onClose={() => {
          setModalOpen(false)
          setSelectedRestaurant(null)
        }}
      />
    </div>
  )
}