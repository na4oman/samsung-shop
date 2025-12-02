"use client"

import { useFavorites } from "./favorites-provider"
import { Button } from "@/components/ui/button"
import { Heart } from "lucide-react"
import { cn } from "@/lib/utils"

interface FavoriteButtonProps {
  productId: string
  variant?: "default" | "secondary" | "outline" | "ghost"
  size?: "default" | "sm" | "lg" | "icon"
  className?: string
}

export function FavoriteButton({
  productId,
  variant = "default",
  size = "default",
  className = "",
}: FavoriteButtonProps) {
  const { favorites, toggleFavorite } = useFavorites()
  const isFavorite = favorites.includes(productId)

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    // Call toggleFavorite immediately - only toast is deferred in the provider
    toggleFavorite(productId)
  }

  return (
    <Button
      onClick={handleClick}
      variant={variant}
      size={size}
      className={cn(className, isFavorite && "text-red-500 hover:text-red-500/90")}
      aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
    >
      <Heart className={cn("h-4 w-4", isFavorite && "fill-current")} />
      {size !== "icon" && <span className="ml-2">{isFavorite ? "Favorited" : "Favorite"}</span>}
    </Button>
  )
}

