'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { formatDate } from '@/lib/utils'

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
  createdAt: string
  updatedAt: string
}

interface Props {
  restaurant: Restaurant | null
  open: boolean
  onClose: () => void
}

export function RestaurantDetailsModal({ restaurant, open, onClose }: Props) {
  if (!restaurant) return null

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">{restaurant.name}</DialogTitle>
          <DialogDescription>Complete restaurant details</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Info */}
          <div>
            <h3 className="font-semibold text-lg mb-3 text-slate-900">Basic Information</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-slate-600">Restaurant Name</p>
                <p className="font-medium mt-1">{restaurant.name}</p>
              </div>
              <div>
                <p className="text-slate-600">Slug (URL)</p>
                <p className="font-medium mt-1 text-blue-600">/{restaurant.slug}</p>
              </div>
              <div>
                <p className="text-slate-600">Created Date</p>
                <p className="font-medium mt-1">{formatDate(restaurant.createdAt)}</p>
              </div>
              <div>
                <p className="text-slate-600">Last Updated</p>
                <p className="font-medium mt-1">{formatDate(restaurant.updatedAt)}</p>
              </div>
            </div>
            {restaurant.description && (
              <div className="mt-4">
                <p className="text-slate-600">Description</p>
                <p className="mt-1 text-sm">{restaurant.description}</p>
              </div>
            )}
          </div>

          {/* Owner Info */}
          <div>
            <h3 className="font-semibold text-lg mb-3 text-slate-900">Owner Information</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-slate-600">Owner Name</p>
                <p className="font-medium mt-1">{restaurant.ownerId?.name || 'N/A'}</p>
              </div>
              <div>
                <p className="text-slate-600">Email</p>
                <p className="font-medium mt-1">{restaurant.ownerId?.email || 'N/A'}</p>
              </div>
            </div>
          </div>

          {/* Address */}
          <div>
            <h3 className="font-semibold text-lg mb-3 text-slate-900">Address</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-slate-600">Street</p>
                <p className="font-medium mt-1">{restaurant.address.street}</p>
              </div>
              <div>
                <p className="text-slate-600">Area</p>
                <p className="font-medium mt-1">{restaurant.address.area}</p>
              </div>
              <div>
                <p className="text-slate-600">City</p>
                <p className="font-medium mt-1">{restaurant.address.city}</p>
              </div>
              <div>
                <p className="text-slate-600">Phone</p>
                <p className="font-medium mt-1">{restaurant.address.phone}</p>
              </div>
            </div>
          </div>

          {/* Subscription */}
          <div>
            <h3 className="font-semibold text-lg mb-3 text-slate-900">Subscription Details</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-slate-600">Plan</p>
                <Badge className="mt-1 bg-blue-100 text-blue-800">
                  {restaurant.subscription.plan.charAt(0).toUpperCase() + restaurant.subscription.plan.slice(1)}
                </Badge>
              </div>
              <div>
                <p className="text-slate-600">Status</p>
                <Badge 
                  className={`mt-1 ${
                    restaurant.subscription.status === 'active' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {restaurant.subscription.status.charAt(0).toUpperCase() + restaurant.subscription.status.slice(1)}
                </Badge>
              </div>
              <div>
                <p className="text-slate-600">Free Credits</p>
                <p className="font-medium mt-1 text-green-600">{restaurant.subscription.freeCredits}</p>
              </div>
              <div>
                <p className="text-slate-600">Paid Credits</p>
                <p className="font-medium mt-1 text-blue-600">{restaurant.subscription.paidCredits}</p>
              </div>
              <div>
                <p className="text-slate-600">Total Credits</p>
                <p className="font-medium mt-1 text-lg text-emerald-600">
                  {restaurant.subscription.freeCredits + restaurant.subscription.paidCredits}
                </p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}