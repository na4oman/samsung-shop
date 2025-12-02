'use client'

import React, { useEffect, useState, useCallback, useRef } from 'react'
import ProductCard from './product-card'
import { Pagination } from './pagination'
import type { Product } from '@/lib/types'
import { getProducts } from '@/lib/product-service'
import { mockProducts } from '@/lib/mock-data'

interface ProductListProps {
  search?: string
  models?: string[] // Changed to array for multiple selections
  colors?: string[] // Changed to array for multiple selections
  categories?: string[] // Changed to array for multiple selections
  minPrice?: number
  maxPrice?: number
  page?: number
  refreshTrigger?: number // New prop to trigger refresh from parent components
}

export default function ProductList({
  search = '',
  models = [],
  colors = [],
  categories = [],
  minPrice,
  maxPrice,
  page = 1,
  refreshTrigger,
}: ProductListProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [lastFetchTime, setLastFetchTime] = useState<number>(0)
  const [isUsingFallback, setIsUsingFallback] = useState(false)
  const ITEMS_PER_PAGE = 12
  const CACHE_DURATION = 300000 // 5 minutes cache (only for manual refresh checks)
  const abortControllerRef = useRef<AbortController | null>(null)

  // Simplified fetch function without memoization to avoid dependency issues
  const fetchProducts = async (forceRefresh = false) => {
    // Cancel any ongoing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }

    // Create new abort controller for this request
    abortControllerRef.current = new AbortController()
    
    setIsLoading(true)
    
    try {
      console.log('Fetching fresh product data...')
      const allProducts = await getProducts()
      
      // Only update if request wasn't aborted
      if (!abortControllerRef.current.signal.aborted) {
        setProducts(allProducts)
        setLastFetchTime(Date.now())
        setIsUsingFallback(false)
        console.log(`Loaded ${allProducts.length} products`)
      }
    } catch (error) {
      // Only handle error if request wasn't aborted
      if (!abortControllerRef.current.signal.aborted) {
        console.error('Error fetching products:', error)
        
        // Graceful fallback to mock data when database fails
        console.log('Database unavailable, falling back to mock products data')
        setProducts(mockProducts)
        setIsUsingFallback(true)
        setLastFetchTime(Date.now())
      }
    } finally {
      // Only update loading state if request wasn't aborted
      if (!abortControllerRef.current.signal.aborted) {
        setIsLoading(false)
      }
    }
  }

  // Initial load and refresh trigger effect
  useEffect(() => {
    fetchProducts(true) // Force refresh on mount
    
    // Cleanup function to abort ongoing requests
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [refreshTrigger]) // Re-fetch when refreshTrigger changes

  // Removed periodic refresh to prevent annoying automatic refreshes
  // Data will refresh only when:
  // 1. Component mounts
  // 2. refreshTrigger changes (from product imports/updates)
  // 3. Manual refresh is triggered

  // Manual refresh function that can be called by parent components
  const refreshProducts = () => {
    fetchProducts(true)
  }

  // Expose refresh function via ref (for future use if needed)
  useEffect(() => {
    // Store refresh function on window for debugging/testing
    if (typeof window !== 'undefined') {
      (window as any).refreshProductList = refreshProducts
    }
  }, [])

  if (isLoading) {
    return (
      <div className='text-center py-12'>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
        <p>Loading products...</p>
        {isUsingFallback && (
          <p className="text-sm text-muted-foreground mt-2">
            Database unavailable, using cached data
          </p>
        )}
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

    // Model filter (multiple selection)
    if (models.length > 0 && !models.includes(product.model)) {
      return false
    }

    // Color filter (multiple selection)
    if (colors.length > 0 && !colors.includes(product.color)) {
      return false
    }

    // Category filter (multiple selection)
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

  // Calculate pagination
  const totalItems = filteredProducts.length
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE)
  const currentPage = Math.min(Math.max(1, page), totalPages || 1)

  // Get current page items
  const currentItems = filteredProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  if (filteredProducts.length === 0) {
    return (
      <div className='text-center py-12'>
        <h2 className='text-xl font-semibold mb-2'>No products found</h2>
        <p className='text-muted-foreground mb-4'>
          Try adjusting your search or filter criteria
        </p>
        {isUsingFallback && (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 max-w-md mx-auto">
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              ⚠️ Database unavailable - showing cached data
            </p>
          </div>
        )}
      </div>
    )
  }

  return (
    <div>
      {/* Data freshness indicator */}
      {isUsingFallback && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3 mb-6">
          <div className="flex items-center justify-between">
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              ⚠️ Database unavailable - showing cached data ({products.length} products)
            </p>
            <button
              onClick={() => fetchProducts(true)}
              className="text-sm text-yellow-800 dark:text-yellow-200 underline hover:no-underline"
              disabled={isLoading}
            >
              Retry
            </button>
          </div>
        </div>
      )}

      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
        {currentItems.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Preserve pagination and filtering functionality with new data */}
      {totalPages > 1 && (
        <div className='mt-8 flex justify-center'>
          <Pagination currentPage={currentPage} totalPages={totalPages} />
        </div>
      )}
    </div>
  )
}
