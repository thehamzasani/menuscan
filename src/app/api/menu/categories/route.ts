import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { connectDB } from '@/lib/db'
import Category from '@/models/Category'
import { categorySchema } from '@/lib/validations/category'
import { ZodError } from 'zod'

// GET - Fetch all categories for restaurant
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

    // Fetch categories sorted by sortOrder
    const categories = await Category.find({ restaurantId })
      .sort({ sortOrder: 1, createdAt: 1 })
      .lean()

    return NextResponse.json({
      success: true,
      data: categories,
    })
  } catch (error) {
    console.error('Category fetch error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch categories',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// POST - Create new category
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
    const validatedData = categorySchema.parse(body)

    await connectDB()

    // Get the highest sortOrder to add new category at the end
    const highestCategory = await Category.findOne({ restaurantId })
      .sort({ sortOrder: -1 })
      .select('sortOrder')
      .lean()

    const sortOrder = highestCategory ? highestCategory.sortOrder + 1 : 0

    // Create category
    const category = await Category.create({
      restaurantId,
      name: validatedData.name,
      nameUrdu: validatedData.nameUrdu || undefined,
      description: validatedData.description || undefined,
      icon: validatedData.icon || undefined,
      sortOrder,
      isActive: validatedData.isActive,
    })

    return NextResponse.json(
      {
        success: true,
        message: 'Category created successfully',
        data: category,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Category creation error:', error)

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
        error: 'Failed to create category',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}