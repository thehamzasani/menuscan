import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import { Restaurant, Table, Category, MenuItem } from '@/models'
import bcrypt from 'bcryptjs'
import User from '@/models/User'

export async function POST() {
  try {
    await connectDB()

    // 1. Create a test owner
    const hashedPassword = await bcrypt.hash('test123', 10)
    const owner = await User.create({
      name: 'Test Owner',
      email: `test-${Date.now()}@example.com`,
      password: hashedPassword,
      role: 'owner',
    })

    // 2. Create a restaurant
    const restaurant = await Restaurant.create({
      ownerId: owner._id,
      name: 'Test Restaurant',
      slug: `test-restaurant-${Date.now()}`,
      description: 'A test restaurant',
      address: {
        street: '123 Test Street',
        city: 'Lahore',
        area: 'DHA',
        phone: '03001234567',
      },
      settings: {
        currency: 'PKR',
        language: 'en',
        openingHours: [
          {
            day: 'monday',
            open: '09:00',
            close: '22:00',
            closed: false,
          },
        ],
      },
    })

    // 3. Create tables
    const table = await Table.create({
      restaurantId: restaurant._id,
      tableNumber: 'T1',
      qrCodeUrl: 'https://example.com/qr/t1',
      qrCodeData: 'test-qr-data',
      location: 'indoor',
      capacity: 4,
    })

    // 4. Create category
    const category = await Category.create({
      restaurantId: restaurant._id,
      name: 'Main Course',
      sortOrder: 1,
    })

    // 5. Create menu item
    const menuItem = await MenuItem.create({
      restaurantId: restaurant._id,
      categoryId: category._id,
      name: 'Chicken Biryani',
      description: 'Delicious chicken biryani',
      price: 450,
      images: [],
      preparationTime: 20,
    })

    return NextResponse.json({
      success: true,
      message: 'Test data created successfully!',
      data: {
        owner: {
          id: owner._id,
          name: owner.name,
          email: owner.email,
        },
        restaurant: {
          id: restaurant._id,
          name: restaurant.name,
          slug: restaurant.slug,
        },
        table: {
          id: table._id,
          tableNumber: table.tableNumber,
        },
        category: {
          id: category._id,
          name: category.name,
        },
        menuItem: {
          id: menuItem._id,
          name: menuItem.name,
          price: menuItem.price,
        },
      },
    })
  } catch (error) {
    console.error('Test error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create test data',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}