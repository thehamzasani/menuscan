import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { connectDB } from '@/lib/db'
import Restaurant from '@/models/Restaurant'
import User from '@/models/User'
import Order from '@/models/Order'
import CreditTransaction from '@/models/CreditTransaction'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    // Check authentication
    if (!session || session.user.role !== 'super_admin') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    await connectDB()

    // Get all stats in parallel for performance
    const [
      totalRestaurants,
      activeRestaurants,
      suspendedRestaurants,
      totalUsers,
      totalOrders,
      totalRevenue,
    ] = await Promise.all([
      Restaurant.countDocuments(),
      Restaurant.countDocuments({ 'subscription.status': 'active' }),
      Restaurant.countDocuments({ 'subscription.status': 'suspended' }),
      User.countDocuments({ role: 'owner' }),
      Order.countDocuments(),
      CreditTransaction.aggregate([
        { $match: { type: 'purchase' } },
        { $group: { _id: null, total: { $sum: '$amount' } } },
      ]),
    ])

    // Get recent restaurants (last 7 days)
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

    const recentRestaurants = await Restaurant.countDocuments({
      createdAt: { $gte: sevenDaysAgo },
    })

    return NextResponse.json({
      success: true,
      data: {
        totalRestaurants,
        activeRestaurants,
        suspendedRestaurants,
        totalUsers,
        totalOrders,
        totalRevenue: totalRevenue[0]?.total || 0,
        recentRestaurants,
      },
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