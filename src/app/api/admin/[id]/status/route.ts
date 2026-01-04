import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { connectDB } from '@/lib/db'
import Restaurant from '@/models/Restaurant'

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== 'super_admin') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    await connectDB()

    const { status } = await request.json()

    // Validate status
    if (!['active', 'suspended', 'cancelled'].includes(status)) {
      return NextResponse.json(
        { success: false, error: 'Invalid status' },
        { status: 400 }
      )
    }

    // Update restaurant status
    const restaurant = await Restaurant.findByIdAndUpdate(
      params.id,
      { 'subscription.status': status },
      { new: true }
    ).populate('ownerId', 'name email')

    if (!restaurant) {
      return NextResponse.json(
        { success: false, error: 'Restaurant not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: `Restaurant status updated to ${status}`,
      data: restaurant,
    })
  } catch (error) {
    console.error('Status update error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to update status',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}