import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { connectDB } from '@/lib/db'
import SuperAdmin from '@/models/SuperAdmin'

export async function POST(request: NextRequest) {
  try {
    const { email, password, name, secretKey } = await request.json()

    // Secret key to prevent unauthorized super admin creation
    if (secretKey !== process.env.SUPER_ADMIN_SECRET_KEY) {
      return NextResponse.json(
        { success: false, error: 'Invalid secret key' },
        { status: 403 }
      )
    }

    await connectDB()

    // Check if super admin already exists
    const existingSuperAdmin = await SuperAdmin.findOne({ email })
    if (existingSuperAdmin) {
      return NextResponse.json(
        { success: false, error: 'Super admin with this email already exists' },
        { status: 409 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create super admin
    const superAdmin = await SuperAdmin.create({
      email,
      password: hashedPassword,
      name,
      role: 'super_admin',
    })

    return NextResponse.json({
      success: true,
      message: 'Super admin created successfully',
      data: {
        id: superAdmin._id,
        email: superAdmin.email,
        name: superAdmin.name,
      },
    })
  } catch (error) {
    console.error('Super admin creation error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to create super admin',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}