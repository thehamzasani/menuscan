import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { connectDB } from '@/lib/db'
import Restaurant from '@/models/Restaurant'
import CreditTransaction from '@/models/CreditTransaction'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== 'super_admin') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    await connectDB()

    const { restaurantId, amount, description } = await request.json()

    // Validate input
    if (!restaurantId || !amount || amount <= 0) {
      return NextResponse.json(
        { success: false, error: 'Invalid input' },
        { status: 400 }
      )
    }

    // Get restaurant
    const restaurant = await Restaurant.findById(restaurantId)
    if (!restaurant) {
      return NextResponse.json(
        { success: false, error: 'Restaurant not found' },
        { status: 404 }
      )
    }

    // Calculate new balance
    const previousBalance = restaurant.subscription.freeCredits + restaurant.subscription.paidCredits
    const newFreeCredits = restaurant.subscription.freeCredits + amount
    const newBalance = previousBalance + amount

    // Update restaurant credits
    restaurant.subscription.freeCredits = newFreeCredits
    await restaurant.save()

    // Create transaction record
    await CreditTransaction.create({
      restaurantId,
      type: 'admin_grant',
      amount,
      description: description || `Admin granted ${amount} credits`,
      grantedBy: session.user.id,
      previousBalance,
      newBalance,
    })

    return NextResponse.json({
      success: true,
      message: `Successfully granted ${amount} credits`,
      data: {
        previousBalance,
        newBalance,
        creditGranted: amount,
      },
    })
  } catch (error) {
    console.error('Grant credits error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to grant credits',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}