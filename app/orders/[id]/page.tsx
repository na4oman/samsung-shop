"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/components/auth-provider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { mockOrders } from "@/lib/mock-orders"
import type { Order } from "@/lib/types"
import { formatDate } from "@/lib/utils"
import { Separator } from "@/components/ui/separator"
import Image from "next/image"
import { ArrowLeft, Package, Truck } from "lucide-react"

export default function OrderDetailPage({ params }: { params: { id: string } }) {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [order, setOrder] = useState<Order | null>(null)
  const [isLoadingOrder, setIsLoadingOrder] = useState(true)

  // Redirect if not logged in
  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    }
  }, [user, isLoading, router])

  useEffect(() => {
    let isMounted = true

    const fetchOrder = async () => {
      try {
        // In a real app, this would call your backend API
        await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate API call

        const foundOrder = mockOrders.find((o) => o.id === params.id)

        // Check if order belongs to user or user is admin
        if (isMounted && foundOrder && (foundOrder.userId === user?.id || user?.role === "admin")) {
          setOrder(foundOrder)
        } else if (isMounted) {
          // Order not found or doesn't belong to user
          router.push("/orders")
        }
      } catch (error) {
        console.error("Error fetching order:", error)
      } finally {
        if (isMounted) {
          setIsLoadingOrder(false)
        }
      }
    }

    if (user) {
      fetchOrder()
    }

    return () => {
      isMounted = false
    }
  }, [user, params.id, router])

  if (isLoading || isLoadingOrder) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p>Loading...</p>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p>Order not found</p>
        <Link href="/orders">
          <Button className="mt-4">Back to Orders</Button>
        </Link>
      </div>
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500"
      case "processing":
        return "bg-blue-500"
      case "shipped":
        return "bg-purple-500"
      case "delivered":
        return "bg-green-500"
      case "cancelled":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/orders" className="inline-flex items-center text-sm font-medium text-primary hover:underline">
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back to Orders
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="pb-4">
              <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                <div>
                  <CardTitle>Order #{order.id}</CardTitle>
                  <CardDescription>Placed on {formatDate(order.createdAt)}</CardDescription>
                </div>
                <Badge className={`${getStatusColor(order.status)} text-white`}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              {order.status === "shipped" && (
                <div className="mb-6 p-4 bg-muted rounded-lg flex items-center">
                  <Truck className="h-5 w-5 mr-2 text-primary" />
                  <div>
                    <p className="font-medium">Your order has been shipped!</p>
                    <p className="text-sm text-muted-foreground">Tracking Number: {order.trackingNumber}</p>
                    <p className="text-sm text-muted-foreground">Shipped on: {formatDate(order.shippedAt || "")}</p>
                  </div>
                </div>
              )}

              {order.status === "delivered" && (
                <div className="mb-6 p-4 bg-muted rounded-lg flex items-center">
                  <Package className="h-5 w-5 mr-2 text-primary" />
                  <div>
                    <p className="font-medium">Your order has been delivered!</p>
                    <p className="text-sm text-muted-foreground">Delivered on: {formatDate(order.deliveredAt || "")}</p>
                  </div>
                </div>
              )}

              <h3 className="font-medium mb-4">Items</h3>
              <div className="space-y-4">
                {order.items.map((item, index) => (
                  <div key={index} className="flex items-center space-x-4">
                    <div className="relative h-16 w-16 rounded overflow-hidden flex-shrink-0">
                      <Image
                        src={item.product.image || "/placeholder.svg?height=64&width=64"}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{item.product.name}</p>
                      <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                      <p className="text-sm text-muted-foreground">${item.price.toFixed(2)} each</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Shipping Address</CardTitle>
              </CardHeader>
              <CardContent>
                <address className="not-italic">
                  <p>{order.shippingAddress.fullName}</p>
                  <p>{order.shippingAddress.addressLine1}</p>
                  {order.shippingAddress.addressLine2 && <p>{order.shippingAddress.addressLine2}</p>}
                  <p>
                    {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}
                  </p>
                  <p>{order.shippingAddress.country}</p>
                  <p className="mt-2">{order.shippingAddress.phone}</p>
                </address>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Billing Address</CardTitle>
              </CardHeader>
              <CardContent>
                <address className="not-italic">
                  <p>{order.billingAddress.fullName}</p>
                  <p>{order.billingAddress.addressLine1}</p>
                  {order.billingAddress.addressLine2 && <p>{order.billingAddress.addressLine2}</p>}
                  <p>
                    {order.billingAddress.city}, {order.billingAddress.state} {order.billingAddress.postalCode}
                  </p>
                  <p>{order.billingAddress.country}</p>
                  <p className="mt-2">{order.billingAddress.phone}</p>
                </address>
              </CardContent>
            </Card>
          </div>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${order.total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span>${order.total.toFixed(2)}</span>
                </div>
              </div>

              <div className="mt-6 space-y-2">
                <h4 className="font-medium">Payment Method</h4>
                <p>{order.paymentMethod}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

