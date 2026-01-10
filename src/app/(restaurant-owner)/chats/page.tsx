'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { MessageSquare, Users, Clock } from 'lucide-react'

export default function ChatsPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Customer Chats</h1>
        <p className="mt-2 text-slate-600">Communicate with your customers in real-time</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <MessageSquare className="h-6 w-6 text-blue-600" />
              </div>
              <div className="text-2xl font-bold">0</div>
              <p className="text-sm text-slate-600">Total Chats</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <div className="text-2xl font-bold">0</div>
              <p className="text-sm text-slate-600">Active Chats</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Clock className="h-6 w-6 text-orange-600" />
              </div>
              <div className="text-2xl font-bold">0</div>
              <p className="text-sm text-slate-600">Unread</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Chat List
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="py-12 text-center">
            <MessageSquare className="mx-auto h-16 w-16 text-slate-300" />
            <p className="mt-4 text-lg font-medium text-slate-900">No active chats</p>
            <p className="mt-2 text-sm text-slate-500">
              Real-time chat system coming in Days 20-21
            </p>
            <div className="mt-6 flex gap-2 justify-center flex-wrap">
              <Badge className="bg-blue-100 text-blue-800">WhatsApp-style UI</Badge>
              <Badge className="bg-green-100 text-green-800">Real-time Messages</Badge>
              <Badge className="bg-purple-100 text-purple-800">Typing Indicators</Badge>
              <Badge className="bg-orange-100 text-orange-800">Unread Badges</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}