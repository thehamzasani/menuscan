'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { DollarSign, Plus, TrendingUp, TrendingDown, ChevronLeft, ChevronRight } from 'lucide-react'
import { GrantCreditsModal } from '@/components/admin/GrantCreditsModal'
import { formatDate } from '@/lib/utils'

interface Transaction {
  _id: string
  restaurantId: {
    _id: string
    name: string
    slug: string
  }
  type: string
  amount: number
  description: string
  grantedBy?: {
    name: string
    email: string
  }
  previousBalance: number
  newBalance: number
  createdAt: string
}

interface Restaurant {
  _id: string
  name: string
}

export default function CreditsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [restaurants, setRestaurants] = useState<Restaurant[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)
  const [typeFilter, setTypeFilter] = useState('all')
  const [modalOpen, setModalOpen] = useState(false)
  const [stats, setStats] = useState({
    totalGranted: 0,
    totalPurchased: 0,
    totalUsed: 0,
  })

  useEffect(() => {
    fetchTransactions()
    fetchRestaurants()
  }, [page, typeFilter])

  const fetchTransactions = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '20',
        type: typeFilter,
      })

      const response = await fetch(`/api/admin/credits/transactions?${params}`)
      const data = await response.json()

      if (data.success) {
        setTransactions(data.data.transactions)
        setTotalPages(data.data.pagination.totalPages)
        setTotal(data.data.pagination.total)

        // Calculate stats from aggregation
        const statsData = data.data.stats
        setStats({
          totalGranted: statsData.find((s: any) => s._id === 'admin_grant')?.total || 0,
          totalPurchased: statsData.find((s: any) => s._id === 'purchase')?.total || 0,
          totalUsed: Math.abs(statsData.find((s: any) => s._id === 'usage')?.total || 0),
        })
      }
    } catch (error) {
      console.error('Failed to fetch transactions:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchRestaurants = async () => {
    try {
      const response = await fetch('/api/admin/restaurants?limit=1000')
      const data = await response.json()
      if (data.success) {
        setRestaurants(data.data.restaurants.map((r: any) => ({
          _id: r._id,
          name: r.name,
        })))
      }
    } catch (error) {
      console.error('Failed to fetch restaurants:', error)
    }
  }

  const getTypeBadge = (type: string) => {
    const configs: Record<string, { className: string; label: string }> = {
      admin_grant: { className: 'bg-green-100 text-green-800', label: 'Admin Grant' },
      purchase: { className: 'bg-blue-100 text-blue-800', label: 'Purchase' },
      usage: { className: 'bg-orange-100 text-orange-800', label: 'Usage' },
      refund: { className: 'bg-purple-100 text-purple-800', label: 'Refund' },
    }

    const config = configs[type] || configs.admin_grant

    return <Badge className={config.className}>{config.label}</Badge>
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Credit Management</h1>
          <p className="mt-2 text-slate-600">Grant and manage restaurant credits</p>
        </div>
        <Button onClick={() => setModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Grant Credits
        </Button>
        
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-3 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <DollarSign className="h-5 w-5 text-green-600" />
              Total Credits Granted
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalGranted}</div>
            <p className="text-sm text-slate-600 mt-2">
              Free credits given by admin
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              Credits Purchased
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalPurchased}</div>
            <p className="text-sm text-slate-600 mt-2">
              Total revenue from purchases
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <TrendingDown className="h-5 w-5 text-orange-600" />
              Credits Used
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalUsed}</div>
            <p className="text-sm text-slate-600 mt-2">
              Total credits consumed
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Transaction History */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Transaction History ({total})</CardTitle>
            <Select value={typeFilter} onValueChange={(value) => {
              setTypeFilter(value)
              setPage(1)
            }}>
              <SelectTrigger className="w-45">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="admin_grant">Admin Grant</SelectItem>
                <SelectItem value="purchase">Purchase</SelectItem>
                <SelectItem value="usage">Usage</SelectItem>
                <SelectItem value="refund">Refund</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600"></div>
            </div>
          ) : transactions.length === 0 ? (
            <div className="py-12 text-center text-slate-500">
              No transactions found
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Restaurant</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Balance</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Granted By</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((transaction) => (
                    <TableRow key={transaction._id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">
                            {transaction.restaurantId?.name || 'N/A'}
                          </div>
                          <div className="text-sm text-slate-500">
                            /{transaction.restaurantId?.slug || 'N/A'}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {getTypeBadge(transaction.type)}
                      </TableCell>
                      <TableCell>
                        <span className={`font-semibold ${
                          transaction.amount > 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {transaction.amount > 0 ? '+' : ''}{transaction.amount}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div className="text-slate-600">
                            {transaction.previousBalance} → {transaction.newBalance}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm max-w-xs truncate">
                          {transaction.description}
                        </div>
                      </TableCell>
                      <TableCell>
                        {transaction.grantedBy ? (
                          <div className="text-sm">
                            <div>{transaction.grantedBy.name}</div>
                            <div className="text-slate-500 text-xs">
                              {transaction.grantedBy.email}
                            </div>
                          </div>
                        ) : (
                          <span className="text-slate-400">—</span>
                        )}
                      </TableCell>
                      <TableCell className="text-sm text-slate-500">
                        {formatDate(transaction.createdAt)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Pagination */}
              <div className="mt-6 flex items-center justify-between">
                <div className="text-sm text-slate-600">
                  Showing {(page - 1) * 20 + 1} to{' '}
                  {Math.min(page * 20, total)} of {total} transactions
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(page - 1)}
                    disabled={page === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(page + 1)}
                    disabled={page === totalPages}
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Grant Credits Modal */}
      <GrantCreditsModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        restaurants={restaurants}
        onSuccess={() => {
          fetchTransactions()
        }}
      />
    </div>
  )
}