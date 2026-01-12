import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { connectDB } from '@/lib/db'
import Category from '@/models/Category'
import { reorderCategoriesSchema } from '@/lib/validations/category'
import { ZodError } from 'zod'

// POST - Reorder categories
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || (session.user.role !== 'owner' && session.user.role !== 'staff')) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const restaurantId = session.user.restaurantId

    if (!restaurantId) {
      return NextResponse.json(
        { success: false, error: 'No restaurant associated with this account' },
        { status: 404 }
      )
    }

    const body = await request.json()
    const { categoryIds } = reorderCategoriesSchema.parse(body)

    await connectDB()

    // Update sortOrder for each category
    const updatePromises = categoryIds.map((categoryId, index) =>
      Category.findOneAndUpdate(
        { _id: categoryId, restaurantId },
        { sortOrder: index },
        { new: true }
      )
    )

    await Promise.all(updatePromises)

    return NextResponse.json({
      success: true,
      message: 'Categories reordered successfully',
    })
  } catch (error) {
    console.error('Category reorder error:', error)

    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation error',
          details: error.issues.map((err) => ({
            field: err.path.join('.'),
            message: err.message,
          })),
        },
        { status: 400 }
      )
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to reorder categories',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}