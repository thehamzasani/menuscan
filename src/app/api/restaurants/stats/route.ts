import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { connectDB } from '@/lib/db'
import Restaurant from '@/models/Restaurant'
import Table from '@/models/Table'
import Order from '@/models/Order'
import Session from '@/models/Session'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || (session.user.role !== 'owner' && session.user.role !== 'staff')) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get restaurant ID from user session
    const restaurantId = session.user.restaurantId

    if (!restaurantId) {
      return NextResponse.json(
        { success: false, error: 'No restaurant associated with this account' },
        { status: 404 }
      )
    }

    await connectDB()

    // Get restaurant details
    const restaurant = await Restaurant.findById(restaurantId).lean()

    if (!restaurant) {
      return NextResponse.json(
        { success: false, error: 'Restaurant not found' },
        { status: 404 }
      )
    }

    // Get today's date range
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    // Get all stats in parallel for performance
    const [
      totalTables,
      activeTables,
      totalOrders,
      ordersToday,
      pendingOrders,
      completedOrdersToday,
      revenueToday,
      activeSessions,
    ] = await Promise.all([
      // Total tables
      Table.countDocuments({ restaurantId, isActive: true }),
      
      // Active tables (occupied or reserved)
      Table.countDocuments({ 
        restaurantId, 
        status: { $in: ['occupied', 'reserved'] },
        isActive: true 
      }),
      
      // Total orders (all time)
      Order.countDocuments({ restaurantId }),
      
      // Orders today
      Order.countDocuments({ 
        restaurantId,
        placedAt: { $gte: today, $lt: tomorrow }
      }),
      
      // Pending orders (needs action)
      Order.countDocuments({ 
        restaurantId,
        status: { $in: ['pending', 'confirmed', 'preparing'] }
      }),
      
      // Completed orders today
      Order.countDocuments({ 
        restaurantId,
        status: 'served',
        placedAt: { $gte: today, $lt: tomorrow }
      }),
      
      // Revenue today (sum of completed orders)
      Order.aggregate([
        {
          $match: {
            restaurantId: restaurant._id,
            status: 'served',
            placedAt: { $gte: today, $lt: tomorrow }
          }
        },
        {
          $group: {
            _id: null,
            total: { $sum: '$totalAmount' }
          }
        }
      ]),
      
      // Active sessions
      Session.countDocuments({ 
        restaurantId,
        status: 'active'
      }),
    ])

    // Calculate stats
    const stats = {
      // Orders
      ordersToday: ordersToday,
      totalOrders: totalOrders,
      pendingOrders: pendingOrders,
      completedOrdersToday: completedOrdersToday,
      
      // Revenue
      revenueToday: revenueToday[0]?.total || 0,
      
      // Tables
      totalTables: totalTables,
      activeTables: activeTables,
      availableTables: totalTables - activeTables,
      
      // Sessions
      activeSessions: activeSessions,
      
      // Credits
      freeCredits: restaurant.subscription.freeCredits,
      paidCredits: restaurant.subscription.paidCredits,
      totalCredits: restaurant.subscription.freeCredits + restaurant.subscription.paidCredits,
      
      // Subscription
      subscriptionPlan: restaurant.subscription.plan,
      subscriptionStatus: restaurant.subscription.status,
      
      // Restaurant info
      restaurantName: restaurant.name,
      restaurantSlug: restaurant.slug,
    }

    return NextResponse.json({
      success: true,
      data: stats,
    })
  } catch (error) {
    console.error('Stats error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch stats',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}