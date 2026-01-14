'use client'

import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import MenuItemForm from '@/components/menu/MenuItemForm'

export default function NewMenuItemPage() {
  const router = useRouter()

  const handleSuccess = () => {
    router.push('/menu/items')
  }

  const handleCancel = () => {
    router.push('/menu/items')
  }

  return (
    <div>
      <div className="mb-8">
        <Link href="/menu/items">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Menu Items
          </Button>
        </Link>
        <h1 className="text-3xl font-bold text-slate-900">Add New Menu Item</h1>
        <p className="mt-2 text-slate-600">Create a new item for your menu</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Menu Item Details</CardTitle>
        </CardHeader>
        <CardContent>
          <MenuItemForm onSuccess={handleSuccess} onCancel={handleCancel} />
        </CardContent>
      </Card>
    </div>
  )
}