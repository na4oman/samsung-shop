/**
 * Global product refresh event system
 * Allows communication between different pages/components about product updates
 */

export type ProductRefreshEventType = 'import' | 'create' | 'update' | 'delete'

export interface ProductRefreshEvent {
  type: ProductRefreshEventType
  timestamp: number
  count?: number // Number of products affected
  productIds?: string[] // IDs of affected products
}

class ProductRefreshEventManager {
  private listeners: Set<(event: ProductRefreshEvent) => void> = new Set()
  private lastEvent: ProductRefreshEvent | null = null

  /**
   * Subscribe to product refresh events
   */
  subscribe(callback: (event: ProductRefreshEvent) => void): () => void {
    this.listeners.add(callback)
    
    // Return unsubscribe function
    return () => {
      this.listeners.delete(callback)
    }
  }

  /**
   * Emit a product refresh event
   */
  emit(type: ProductRefreshEventType, options?: { count?: number; productIds?: string[] }) {
    const event: ProductRefreshEvent = {
      type,
      timestamp: Date.now(),
      count: options?.count,
      productIds: options?.productIds,
    }

    this.lastEvent = event
    
    // Store in localStorage for cross-tab communication
    if (typeof window !== 'undefined') {
      localStorage.setItem('product-refresh-event', JSON.stringify(event))
      
      // Dispatch custom event for same-tab communication
      window.dispatchEvent(new CustomEvent('product-refresh', { detail: event }))
    }

    // Notify all listeners
    this.listeners.forEach(callback => {
      try {
        callback(event)
      } catch (error) {
        console.error('Error in product refresh event listener:', error)
      }
    })
  }

  /**
   * Get the last refresh event
   */
  getLastEvent(): ProductRefreshEvent | null {
    return this.lastEvent
  }

  /**
   * Check if there's been a recent refresh event
   */
  hasRecentEvent(maxAge: number = 5000): boolean {
    if (!this.lastEvent) return false
    return Date.now() - this.lastEvent.timestamp < maxAge
  }

  /**
   * Initialize cross-tab communication
   */
  initializeCrossTabCommunication() {
    if (typeof window === 'undefined') return

    // Listen for localStorage changes (cross-tab communication)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'product-refresh-event' && e.newValue) {
        try {
          const event: ProductRefreshEvent = JSON.parse(e.newValue)
          this.lastEvent = event
          
          // Notify listeners about cross-tab event
          this.listeners.forEach(callback => {
            try {
              callback(event)
            } catch (error) {
              console.error('Error in cross-tab product refresh event listener:', error)
            }
          })
        } catch (error) {
          console.error('Error parsing cross-tab product refresh event:', error)
        }
      }
    }

    window.addEventListener('storage', handleStorageChange)

    // Also listen for same-tab custom events
    const handleCustomEvent = (e: CustomEvent<ProductRefreshEvent>) => {
      // Don't double-process events we emitted ourselves
      if (this.lastEvent && this.lastEvent.timestamp === e.detail.timestamp) {
        return
      }
      
      this.lastEvent = e.detail
      this.listeners.forEach(callback => {
        try {
          callback(e.detail)
        } catch (error) {
          console.error('Error in same-tab product refresh event listener:', error)
        }
      })
    }

    window.addEventListener('product-refresh', handleCustomEvent as EventListener)

    // Return cleanup function
    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('product-refresh', handleCustomEvent as EventListener)
    }
  }
}

// Global instance
export const productRefreshEvents = new ProductRefreshEventManager()

// Initialize cross-tab communication when module loads
if (typeof window !== 'undefined') {
  productRefreshEvents.initializeCrossTabCommunication()
}