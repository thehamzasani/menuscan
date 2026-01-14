import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { connectDB } from '@/lib/db'
import MenuItem from '@/models/MenuItem'
import { menuItemSchema } from '@/lib/validations/menuItem'
import { ZodError } from 'zod'

// PUT - Update menu item
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
    const validatedData = menuItemSchema.parse(body)

    await connectDB()

    // Find and update menu item
    const menuItem = await MenuItem.findOneAndUpdate(
      { _id: params.id, restaurantId },
      {
        categoryId: validatedData.categoryId,
        name: validatedData.name,
        nameUrdu: validatedData.nameUrdu || undefined,
        description: validatedData.description,
        descriptionUrdu: validatedData.descriptionUrdu || undefined,
        price: validatedData.price,
        images: validatedData.images || [],
        isAvailable: validatedData.isAvailable ?? true,
        isPopular: validatedData.isPopular ?? false,
        preparationTime: validatedData.preparationTime ?? 15,
        dietaryInfo: validatedData.dietaryInfo,
      },
      { new: true, runValidators: true }
    ).populate('categoryId', 'name nameUrdu icon')

    if (!menuItem) {
      return NextResponse.json(
        { success: false, error: 'Menu item not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Menu item updated successfully',
      data: menuItem,
    })
  } catch (error) {
    console.error('Menu item update error:', error)

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
        error: 'Failed to update menu item',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

// DELETE - Delete menu item
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

    // Find and delete menu item
    const menuItem = await MenuItem.findOneAndDelete({
      _id: params.id,
      restaurantId,
    })

    if (!menuItem) {
      return NextResponse.json(
        { success: false, error: 'Menu item not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Menu item deleted successfully',
    })
  } catch (error) {
    console.error('Menu item deletion error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to delete menu item',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}