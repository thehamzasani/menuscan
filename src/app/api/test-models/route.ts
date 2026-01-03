import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import User from '@/models/User'
import Restaurant from '@/models/Restaurant'
import Table from '@/models/Table'
import Category from '@/models/Category'
import MenuItem from '@/models/MenuItem'
import Session from '@/models/Session'
import Order from '@/models/Order'
import Message from '@/models/Message'
import WaiterCall from '@/models/WaiterCall'
import CreditTransaction from '@/models/CreditTransaction'

export async function GET() {
  try {
    await connectDB()

    // Test that all models are registered
    const models = {
      User: User.modelName,
      Restaurant: Restaurant.modelName,
      Table: Table.modelName,
      Category: Category.modelName,
      MenuItem: MenuItem.modelName,
      Session: Session.modelName,
      Order: Order.modelName,
      Message: Message.modelName,
      WaiterCall: WaiterCall.modelName,
      CreditTransaction: CreditTransaction.modelName,
    }

    // Get collection names
    const collections = await Promise.all([
      User.collection.countDocuments(),
      Restaurant.collection.countDocuments(),
      Table.collection.countDocuments(),
      Category.collection.countDocuments(),
      MenuItem.collection.countDocuments(),
      Session.collection.countDocuments(),
      Order.collection.countDocuments(),
      Message.collection.countDocuments(),
      WaiterCall.collection.countDocuments(),
      CreditTransaction.collection.countDocuments(),
    ])

    return NextResponse.json({
      success: true,
      message: 'All models loaded successfully!',
      models,
      documentCounts: {
        users: collections[0],
        restaurants: collections[1],
        tables: collections[2],
        categories: collections[3],
        menuItems: collections[4],
        sessions: collections[5],
        orders: collections[6],
        messages: collections[7],
        waiterCalls: collections[8],
        creditTransactions: collections[9],
      },
    })
  } catch (error) {
    console.error('Model test error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to load models',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}