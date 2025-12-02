"use client"

import { useCart } from "@/components/cart-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import Image from "next/image"
import Link from "next/link"
import { Trash2 } from "lucide-react"
import { useState } from "react"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/components/auth-provider"
import { useRouter } from "next/navigation"
import { CheckoutForm } from "@/components/checkout-form"
import type { Address, Order } from "@/lib/types"

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart()
  const { user } = useAuth()
  const { toast } = useToast()
  const router = useRouter()
  const [isCheckingOut, setIsCheckingOut] = useState(false)
  const [showCheckoutForm, setShowCheckoutForm] = useState(false)

  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0)

  const handleProceedToCheckout = () => {
    if (!user) {
      // Redirect to login if not logged in
      toast({
        title: "Please log in",
        description: "You need to be logged in to checkout.",
      })
      router.push("/login")
      return
    }

    setShowCheckoutForm(true)
  }

  const handleCheckoutWithAddresses = async (shippingAddress: Address, billingAddress: Address) => {
    if (!user) return

    console.log('Starting direct checkout process...')
    setIsCheckingOut(true)

    try {
      // Create order data
      const orderData: Omit<Order, "id"> = {
        userId: user.userId,
        items: cart.map(item => ({
          product: item.product,
          quantity: item.quantity,
          price: item.product.price,
        })),
        total: subtotal,
        status: "pending",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        shippingAddress: shippingAddress,
        billingAddress: billingAddress,
        paymentMethod: "Direct Order",
      }

      console.log('Creating order via API...')
      
      // Call the API route to create the order (server-side for email access)
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ order: orderData, user }),
      })

      if (!response.ok) {
        throw new Error('Failed to create order')
      }

      const { order: createdOrder } = await response.json()
      console.log('✅ Order created successfully:', createdOrder.id)

      // Clear the cart after successful order
      clearCart()

      // Redirect to success page with order ID
      router.push(`/checkout/success?order_id=${createdOrder.id}`)
    } catch (error) {
      console.error("Checkout error:", error)
      
      toast({
        title: "Order Failed",
        description: "There was an error creating your order. Please try again.",
        variant: "destructive",
      })
      setIsCheckingOut(false)
    }
  }

  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold mb-6">Your Cart</h1>
        <p className="mb-8">Your cart is empty.</p>
        <Link href="/">
          <Button>Continue Shopping</Button>
        </Link>
      </div>
    )
  }

  if (showCheckoutForm) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-6">
            <Button 
              variant="outline" 
              onClick={() => setShowCheckoutForm(false)}
              disabled={isCheckingOut}
            >
              ← Back to Cart
            </Button>
          </div>
          
          <h1 className="text-3xl font-bold mb-6">Checkout</h1>
          
          {/* Order Summary */}
          <Card className="mb-6">
            <CardContent className="pt-6">
              <h2 className="text-xl font-bold mb-4">Order Summary</h2>
              <div className="space-y-2">
                {cart.map((item) => (
                  <div key={item.product.id} className="flex justify-between text-sm">
                    <span>{item.product.name} × {item.quantity}</span>
                    <span>${(item.product.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
                <Separator className="my-2" />
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <CheckoutForm 
            onSubmit={handleCheckoutWithAddresses}
            isLoading={isCheckingOut}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Your Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item) => (
            <Card key={item.product.id} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="flex flex-col sm:flex-row">
                  <div className="relative w-full sm:w-40 h-40">
                    <Image
                      src={item.product.image || "/placeholder.svg?height=200&width=200"}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <Link href={`/product/${item.product.id}`} className="font-medium hover:underline">
                        {item.product.name}
                      </Link>
                      <p className="text-sm text-muted-foreground">Model: {item.product.model}</p>
                      <p className="text-sm text-muted-foreground">Color: {item.product.color}</p>
                      <p className="text-sm text-muted-foreground">Part #: {item.product.partNumber}</p>
                    </div>
                    <div className="flex justify-between items-center mt-4">
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => updateQuantity(item.product.id, Math.max(1, item.quantity - 1))}
                          disabled={item.quantity <= 1}
                        >
                          -
                        </Button>
                        <span>{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        >
                          +
                        </Button>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className="font-medium">€{(item.product.price * item.quantity).toFixed(2)}</span>
                        <Button variant="ghost" size="icon" onClick={() => removeFromCart(item.product.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="lg:col-span-1">
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-xl font-bold mb-4">Order Summary</h2>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>€{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span>€{subtotal.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" size="lg" onClick={handleProceedToCheckout} disabled={isCheckingOut}>
                Proceed to Checkout
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}

