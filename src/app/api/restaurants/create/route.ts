import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { connectDB } from '@/lib/db'
import User from '@/models/User'
import Restaurant from '@/models/Restaurant'
import { completeRegistrationSchema } from '@/lib/validations/restaurant'
import { ZodError } from 'zod'

// Helper function to create slug
function createSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/--+/g, '-')
    .trim()
}

// Helper function to ensure unique slug
async function generateUniqueSlug(baseName: string): Promise<string> {
  let slug = createSlug(baseName)
  let counter = 1
  
  while (await Restaurant.findOne({ slug })) {
    slug = `${createSlug(baseName)}-${counter}`
    counter++
  }
  
  return slug
}

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json()

    // Validate input
    const validatedData = completeRegistrationSchema.parse(body)

    // Connect to database
    await connectDB()

    // Check if user already exists
    const existingUser = await User.findOne({ email: validatedData.ownerEmail })
    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          error: 'User with this email already exists',
        },
        { status: 409 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(validatedData.ownerPassword, 10)

    // Create user
    const newUser = await User.create({
      name: validatedData.ownerName,
      email: validatedData.ownerEmail,
      password: hashedPassword,
      role: 'owner',
    })

    // Generate unique slug
    const slug = await generateUniqueSlug(validatedData.restaurantName)

    // Create restaurant with default free plan and 100 credits
    const newRestaurant = await Restaurant.create({
      ownerId: newUser._id,
      name: validatedData.restaurantName,
      slug,
      description: validatedData.description || '',
      address: {
        street: validatedData.street,
        city: validatedData.city,
        area: validatedData.area,
        phone: validatedData.phone,
      },
      settings: {
        currency: validatedData.currency || 'PKR',
        language: validatedData.language || 'en',
        theme: {
          primaryColor: validatedData.primaryColor || '#3b82f6',
          secondaryColor: validatedData.secondaryColor || '#8b5cf6',
        },
        openingHours: [
          { day: 'monday', open: '09:00', close: '22:00', closed: false },
          { day: 'tuesday', open: '09:00', close: '22:00', closed: false },
          { day: 'wednesday', open: '09:00', close: '22:00', closed: false },
          { day: 'thursday', open: '09:00', close: '22:00', closed: false },
          { day: 'friday', open: '09:00', close: '22:00', closed: false },
          { day: 'saturday', open: '09:00', close: '22:00', closed: false },
          { day: 'sunday', open: '09:00', close: '22:00', closed: false },
        ],
      },
      subscription: {
        plan: 'free',
        status: 'active',
        freeCredits: 100, // Initial free credits
        paidCredits: 0,
        startDate: new Date(),
        autoRenew: false,
      },
      isActive: true,
    })

    // Update user with restaurant ID
    await User.findByIdAndUpdate(newUser._id, {
      restaurantId: newRestaurant._id,
    })

    // Return success response
    return NextResponse.json(
      {
        success: true,
        message: 'Restaurant created successfully',
        data: {
          user: {
            id: newUser._id.toString(),
            name: newUser.name,
            email: newUser.email,
            role: newUser.role,
          },
          restaurant: {
            id: newRestaurant._id.toString(),
            name: newRestaurant.name,
            slug: newRestaurant.slug,
            freeCredits: newRestaurant.subscription.freeCredits,
          },
        },
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Restaurant creation error:', error)

    // Handle validation errors
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

    // Handle duplicate key error
    if ((error as any).code === 11000) {
      return NextResponse.json(
        {
          success: false,
          error: 'A restaurant or user with this information already exists',
        },
        { status: 409 }
      )
    }

    // Generic error
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create restaurant. Please try again.',
      },
      { status: 500 }
    )
  }
}