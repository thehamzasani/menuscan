import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { connectDB } from '@/lib/db'
import MenuItem from '@/models/MenuItem'
import { menuItemSchema } from '@/lib/validations/menuItem'
import { ZodError } from 'zod'

// GET - Fetch all menu items for restaurant
export async function GET(request: NextRequest) {
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

    // Get query parameters
    const searchParams = request.nextUrl.searchParams
    const categoryId = searchParams.get('categoryId')
    const isAvailable = searchParams.get('isAvailable')
    const search = searchParams.get('search')

    // Build query
    const query: any = { restaurantId }

    if (categoryId) {
      query.categoryId = categoryId
    }

    if (isAvailable !== null) {
      query.isAvailable = isAvailable === 'true'
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ]
    }

    // Fetch menu items
    const menuItems = await MenuItem.find(query)
      .populate('categoryId', 'name nameUrdu icon')
      .sort({ categoryId: 1, sortOrder: 1, createdAt: -1 })
      .lean()

    return NextResponse.json({
      success: true,
      data: menuItems,
    })
  } catch (error) {
    console.error('Menu items fetch error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch menu items',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

// POST - Create new menu item
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
    const validatedData = menuItemSchema.parse(body)

    await connectDB()

    // Get the highest sortOrder for this category
    const highestItem = await MenuItem.findOne({
      restaurantId,
      categoryId: validatedData.categoryId,
    })
      .sort({ sortOrder: -1 })
      .select('sortOrder')
      .lean()

    const sortOrder = highestItem ? highestItem.sortOrder + 1 : 0

    // Create menu item
    const menuItem = await MenuItem.create({
      restaurantId,
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
      sortOrder,
    })

    // Populate category info
    await menuItem.populate('categoryId', 'name nameUrdu icon')

    return NextResponse.json(
      {
        success: true,
        message: 'Menu item created successfully',
        data: menuItem,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Menu item creation error:', error)

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
        error: 'Failed to create menu item',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}