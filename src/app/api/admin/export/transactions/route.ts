// import { NextRequest, NextResponse } from 'next/server'
// import { getServerSession } from 'next-auth'
// import { authOptions } from '@/lib/auth'
// import { connectDB } from '@/lib/db'
// import CreditTransaction from '@/models/CreditTransaction'

// export async function GET(request: NextRequest) {
//   try {
//     const session = await getServerSession(authOptions)

//     if (!session || session.user.role !== 'super_admin') {
//       return NextResponse.json(
//         { success: false, error: 'Unauthorized' },
//         { status: 401 }
//       )
//     }

//     await connectDB()

//     // Get all transactions
//     const transactions = await CreditTransaction.find()
//       .populate('restaurantId', 'name slug')
//       .populate('grantedBy', 'name email')
//       .sort({ createdAt: -1 })
//       .lean()

//     // Convert to CSV format
//     const csvRows = [
//       // Headers
//       ['Date', 'Restaurant', 'Type', 'Amount', 'Previous Balance', 'New Balance', 'Description', 'Granted By'],
//       // Data
//       ...transactions.map(t => [
//         new Date(t.createdAt).toISOString(),
//         (t.restaurantId as any)?.name || 'N/A',
//         t.type,
//         t.amount.toString(),
//         t.previousBalance.toString(),
//         t.newBalance.toString(),
//         t.description,
//         (t.grantedBy as any)?.name || 'N/A',
//       ])
//     ]

//     const csvContent = csvRows.map(row => 
//       row.map(cell => `"${cell}"`).join(',')
//     ).join('\n')

//     return new NextResponse(csvContent, {
//       status: 200,
//       headers: {
//         'Content-Type': 'text/csv',
//         'Content-Disposition': `attachment; filename="credit-transactions-${Date.now()}.csv"`,
//       },
//     })
//   } catch (error) {
//     console.error('Export error:', error)
//     return NextResponse.json(
//       { success: false, error: 'Failed to export data' },
//       { status: 500 }
//     )
//   }
// }