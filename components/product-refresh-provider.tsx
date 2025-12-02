'use client'

import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react'
import { productRefreshEvents, type ProductRefreshEvent } from '@/lib/product-refresh-events'

interface ProductRefreshContextType {
  refreshTrigger: number
  triggerRefresh: () => void
  isRefreshing: boolean
  setIsRefreshing: (refreshing: boolean) => void
  lastRefreshEvent: ProductRefreshEvent | null
}

const ProductRefreshContext = createContext<ProductRefreshContextType | undefined>(undefined)

interface ProductRefreshProviderProps {
  children: ReactNode
}

export function ProductRefreshProvider({ children }: ProductRefreshProviderProps) {
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [lastRefreshEvent, setLastRefreshEvent] = useState<ProductRefreshEvent | null>(null)

  const triggerRefresh = useCallback(() => {
    console.log('Triggering product list refresh...')
    setRefreshTrigger(prev => prev + 1)
  }, [])

  // Listen for product refresh events
  useEffect(() => {
    const unsubscribe = productRefreshEvents.subscribe((event) => {
      console.log('Received product refresh event:', event)
      setLastRefreshEvent(event)
      setRefreshTrigger(prev => prev + 1)
    })

    // Check for any recent events on mount
    const recentEvent = productRefreshEvents.getLastEvent()
    if (recentEvent && productRefreshEvents.hasRecentEvent(10000)) { // 10 seconds
      console.log('Found recent product refresh event on mount:', recentEvent)
      setLastRefreshEvent(recentEvent)
      setRefreshTrigger(prev => prev + 1)
    }

    return unsubscribe
  }, [])

  const value = {
    refreshTrigger,
    triggerRefresh,
    isRefreshing,
    setIsRefreshing,
    lastRefreshEvent,
  }

  return (
    <ProductRefreshContext.Provider value={value}>
      {children}
    </ProductRefreshContext.Provider>
  )
}

export function useProductRefresh() {
  const context = useContext(ProductRefreshContext)
  if (context === undefined) {
    throw new Error('useProductRefresh must be used within a ProductRefreshProvider')
  }
  return context
}