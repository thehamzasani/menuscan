import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { connectDB } from '@/lib/db'
import Category from '@/models/Category'
import { categorySchema } from '@/lib/validations/category'
import { ZodError } from 'zod'

// PUT - Update category
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
    const validatedData = categorySchema.parse(body)

    await connectDB()

    // Find and update category
    const category = await Category.findOneAndUpdate(
      { _id: params.id, restaurantId },
      {
        name: validatedData.name,
        nameUrdu: validatedData.nameUrdu || undefined,
        description: validatedData.description || undefined,
        icon: validatedData.icon || undefined,
        isActive: validatedData.isActive,
      },
      { new: true, runValidators: true }
    )

    if (!category) {
      return NextResponse.json(
        { success: false, error: 'Category not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Category updated successfully',
      data: category,
    })
  } catch (error) {
    console.error('Category update error:', error)

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
        error: 'Failed to update category',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// DELETE - Delete category
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    await connectDB()

    // Find and delete category
    const category = await Category.findOneAndDelete({
      _id: params.id,
      restaurantId,
    })

    if (!category) {
      return NextResponse.json(
        { success: false, error: 'Category not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Category deleted successfully',
    })
  } catch (error) {
    console.error('Category deletion error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to delete category',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}