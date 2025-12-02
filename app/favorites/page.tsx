"use client"

import { useFavorites } from "@/components/favorites-provider"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import ProductCard from "@/components/product-card"
import { mockProducts } from "@/lib/mock-data"
import { getProducts } from "@/lib/product-service"
import { useEffect, useState } from "react"
import type { Product } from "@/lib/types"

export default function FavoritesPage() {
  const { favorites, toggleFavorite } = useFavorites()
  const [favoriteProducts, setFavoriteProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [allProducts, setAllProducts] = useState<Product[]>([])

  // Fetch all products from database
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true)
      try {
        console.log('Fetching products for favorites page...')
        const products = await getProducts()
        setAllProducts(products)
        console.log(`Loaded ${products.length} products from database`)
      } catch (error) {
        console.error('Error fetching products for favorites:', error)
        console.log('Falling back to mock products')
        setAllProducts(mockProducts)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProducts()
  }, [])

  // Update favorite products when favorites or allProducts change
  useEffect(() => {
    const filteredProducts = allProducts.filter((product) => favorites.includes(product.id))
    setFavoriteProducts(filteredProducts)
    console.log("Current favorites:", favorites)
    console.log("Filtered favorite products:", filteredProducts)
  }, [favorites, allProducts])

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold mb-6">Your Favorites</h1>
        <div className="animate-pulse">
          <div className="h-4 bg-muted rounded w-1/2 mx-auto mb-4"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-64 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (favoriteProducts.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold mb-6">Your Favorites</h1>
        <p className="mb-8">You haven't added any products to your favorites yet.</p>
        <Link href="/">
          <Button>Browse Products</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Your Favorites</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {favoriteProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onFavoriteToggle={() => toggleFavorite(product.id)}
            isFavorite={true}
          />
        ))}
      </div>
    </div>
  )
}

