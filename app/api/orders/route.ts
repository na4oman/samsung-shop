import { NextRequest, NextResponse } from 'next/server'
import { createOrderServer } from '@/lib/order-service-server'
import type { Order, User } from '@/lib/types'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { order, user } = body as { order: Omit<Order, 'id'>, user: User }

    if (!order || !user) {
      return NextResponse.json(
        { error: 'Missing order or user data' },
        { status: 400 }
      )
    }

    console.log('API Route: Creating order for user:', user.email)
    console.log('API Route: Order total:', order.total)

    // Create the order using server-side service with API key (this will also send emails)
    const createdOrder = await createOrderServer(order, user)

    console.log('API Route: Order created successfully:', createdOrder.id)

    return NextResponse.json({ order: createdOrder }, { status: 201 })
  } catch (error) {
    console.error('API Route Error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to create order', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    )
  }
}
