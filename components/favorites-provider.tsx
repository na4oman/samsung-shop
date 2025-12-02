"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"
import { useToast } from "@/components/ui/use-toast"

interface FavoritesContextType {
  favorites: string[]
  toggleFavorite: (productId: string) => void
  isFavorite: (productId: string) => boolean
}

const FavoritesContext = createContext<FavoritesContextType>({
  favorites: [],
  toggleFavorite: () => {},
  isFavorite: () => false,
})

export function useFavorites() {
  return useContext(FavoritesContext)
}

export default function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<string[]>([])
  const { toast } = useToast()

  // Load favorites from localStorage on initial render
  useEffect(() => {
    const savedFavorites = localStorage.getItem("favorites")
    if (savedFavorites) {
      try {
        const parsedFavorites = JSON.parse(savedFavorites)
        if (Array.isArray(parsedFavorites)) {
          setFavorites(parsedFavorites)
        } else {
          console.error("Saved favorites is not an array:", parsedFavorites)
          localStorage.removeItem("favorites")
        }
      } catch (error) {
        console.error("Failed to parse favorites from localStorage:", error)
        localStorage.removeItem("favorites")
      }
    }
  }, [])

  // Save favorites to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites))
    console.log("Favorites saved:", favorites)
  }, [favorites])

  const toggleFavorite = (productId: string) => {
    setFavorites((prevFavorites) => {
      const isCurrentlyFavorite = prevFavorites.includes(productId)
      
      // Defer toast notifications to avoid state update conflicts
      setTimeout(() => {
        if (isCurrentlyFavorite) {
          toast({
            title: "Removed from favorites",
            description: "The product has been removed from your favorites.",
          })
        } else {
          toast({
            title: "Added to favorites",
            description: "The product has been added to your favorites.",
          })
        }
      }, 0)

      if (isCurrentlyFavorite) {
        return prevFavorites.filter((id) => id !== productId)
      } else {
        return [...prevFavorites, productId]
      }
    })
  }

  const isFavorite = (productId: string) => {
    return favorites.includes(productId)
  }

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite, isFavorite }}>{children}</FavoritesContext.Provider>
  )
}

