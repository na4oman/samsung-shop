"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { CheckCircle } from "lucide-react"
import { useCart } from "@/components/cart-provider"

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { clearCart } = useCart()
  const [orderNumber, setOrderNumber] = useState<string>("")

  useEffect(() => {
    // Get the order ID from the URL
    const orderId = searchParams.get("order_id")

    if (!orderId) {
      // Redirect to home if no order ID
      router.push("/")
      return
    }

    setOrderNumber(orderId)

    // Clear the cart
    clearCart()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // Run only once on mount

  if (!orderNumber) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p>Processing your order...</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-16 flex justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
          <CardTitle className="text-2xl">Order Confirmed!</CardTitle>
          <CardDescription>Thank you for your purchase</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <p className="text-muted-foreground mb-2">Your order number is:</p>
            <p className="text-xl font-bold">{orderNumber}</p>
          </div>

          <p className="text-center text-muted-foreground">
            We've sent a confirmation email with your order details and tracking information.
          </p>

          <div className="flex flex-col space-y-3">
            <Link href="/orders">
              <Button className="w-full">View My Orders</Button>
            </Link>
            <Link href="/">
              <Button variant="outline" className="w-full">
                Continue Shopping
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

