"use client"

import { useCart } from "./cart-provider"
import { Button } from "@/components/ui/button"
import { ShoppingCart, Check } from "lucide-react"
import { useState } from "react"
import type { Product } from "@/lib/types"
import { useToast } from "@/components/ui/use-toast"

interface AddToCartButtonProps {
  product: Product
  variant?: "default" | "secondary" | "outline"
  size?: "default" | "sm" | "lg"
  className?: string
}

export function AddToCartButton({
  product,
  variant = "default",
  size = "default",
  className = "",
}: AddToCartButtonProps) {
  const { addToCart } = useCart()
  const { toast } = useToast()
  const [isAdded, setIsAdded] = useState(false)

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    // Execute state updates immediately, only defer toast
    addToCart(product)
    setIsAdded(true)

    // Defer toast notification to avoid state update conflicts
    setTimeout(() => {
      toast({
        title: "Added to cart",
        description: `${product.name} has been added to your cart.`,
      })
    }, 0)

    setTimeout(() => {
      setIsAdded(false)
    }, 1500)
  }

  return (
    <Button onClick={handleAddToCart} variant={variant} size={size} className={className} disabled={isAdded}>
      {isAdded ? (
        <>
          <Check className="mr-2 h-4 w-4" />
          Added
        </>
      ) : (
        <>
          <ShoppingCart className="mr-2 h-4 w-4" />
          Add to Cart
        </>
      )}
    </Button>
  )
}

