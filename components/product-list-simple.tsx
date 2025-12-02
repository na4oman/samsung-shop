'use client'

import React, { useEffect, useState } from 'react'
import ProductCard from './product-card'
import type { Product } from '@/lib/types'
import { mockProducts } from '@/lib/mock-data'

interface ProductListProps {
  search?: string
  models?: string[]
  colors?: string[]
  categories?: string[]
  minPrice?: number
  maxPrice?: number
  page?: number
  refreshTrigger?: number
}

export default function ProductListSimple({
  search = '',
  models = [],
  colors = [],
  categories = [],
  minPrice,
  maxPrice,
  page = 1,
}: ProductListProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    console.log('Loading products...')
    // Load products immediately to avoid hydration issues
    setProducts(mockProducts)
    setIsLoading(false)
    console.log('Products loaded:', mockProducts.length)
  }, [])

  if (isLoading) {
    return (
      <div className='text-center py-12'>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
        <p>Loading products...</p>
      </div>
    )
  }

  // Filter products based on search and filter criteria
  const filteredProducts = products.filter(product => {
    // Search filter
    if (
      search &&
      !product.name.toLowerCase().includes(search.toLowerCase()) &&
      !product.description.toLowerCase().includes(search.toLowerCase()) &&
      !product.model.toLowerCase().includes(search.toLowerCase()) &&
      !product.partNumber.toLowerCase().includes(search.toLowerCase())
    ) {
      return false
    }

    // Model filter
    if (models.length > 0 && !models.includes(product.model)) {
      return false
    }

    // Color filter
    if (colors.length > 0 && !colors.includes(product.color)) {
      return false
    }

    // Category filter
    if (categories.length > 0 && !categories.includes(product.category)) {
      return false
    }

    // Price range filter
    if (minPrice && product.price < minPrice) {
      return false
    }

    if (maxPrice && product.price > maxPrice) {
      return false
    }

    return true
  })

  if (filteredProducts.length === 0) {
    return (
      <div className='text-center py-12'>
        <h2 className='text-xl font-semibold mb-2'>No products found</h2>
        <p className='text-muted-foreground mb-4'>
          Try adjusting your search or filter criteria
        </p>
      </div>
    )
  }

  return (
    <div>
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
        {filteredProducts.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  )
}