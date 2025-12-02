"use client"

import React, { useState, useTransition, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { getProducts } from "@/lib/product-service"
import { mockProducts } from "@/lib/mock-data"
import { useProductRefresh } from "@/components/product-refresh-provider"
import type { Product } from "@/lib/types"

interface FilterData {
  models: string[]
  colors: string[]
  categories: string[]
  priceRange: {
    min: number
    max: number
  }
}

// Helper function to extract filter data from products
function extractFilterData(products: Product[]): FilterData {
  if (products.length === 0) {
    // Fallback to mock data if no products available
    return {
      models: Array.from(new Set(mockProducts.map((p) => p.model))),
      colors: Array.from(new Set(mockProducts.map((p) => p.color))),
      categories: Array.from(new Set(mockProducts.map((p) => p.category))),
      priceRange: {
        min: Math.min(...mockProducts.map((p) => p.price)),
        max: Math.max(...mockProducts.map((p) => p.price)),
      }
    }
  }

  return {
    models: Array.from(new Set(products.map((p) => p.model))).sort(),
    colors: Array.from(new Set(products.map((p) => p.color))).sort(),
    categories: Array.from(new Set(products.map((p) => p.category))).sort(),
    priceRange: {
      min: Math.min(...products.map((p) => p.price)),
      max: Math.max(...products.map((p) => p.price)),
    }
  }
}

export function ProductFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()
  const [isLoading, setIsLoading] = useState(true)
  const [filterData, setFilterData] = useState<FilterData>(() => extractFilterData([]))
  const { refreshTrigger } = useProductRefresh()

  // Helper function to parse multiple values from URL parameter
  const parseMultipleValues = (paramName: string): string[] => {
    const param = searchParams.get(paramName)
    if (!param) return []
    return param.split(',').filter(Boolean)
  }

  // Get current filter values from URL (now supporting multiple selections)
  const currentModels = parseMultipleValues("models")
  const currentColors = parseMultipleValues("colors") 
  const currentCategories = parseMultipleValues("categories")
  // Initialize with fallback values to ensure we always have a valid range
  const getInitialPriceRange = (): [number, number] => {
    const minPrice = searchParams.get("minPrice") ? Number(searchParams.get("minPrice")) : filterData.priceRange.min
    const maxPrice = searchParams.get("maxPrice") ? Number(searchParams.get("maxPrice")) : filterData.priceRange.max
    
    // Ensure we always have valid numbers
    const safeMin = isNaN(minPrice) ? 0 : minPrice
    const safeMax = isNaN(maxPrice) ? 1000 : maxPrice
    
    return [safeMin, safeMax]
  }

  const [priceValues, setPriceValues] = useState<[number, number]>(getInitialPriceRange)

  // Fetch products and extract filter data
  useEffect(() => {
    const fetchFilterData = async () => {
      setIsLoading(true)
      try {
        console.log('Fetching products for filter data...')
        const products = await getProducts()
        const newFilterData = extractFilterData(products)
        setFilterData(newFilterData)
        
        // Update price values if they haven't been set by URL params
        if (!searchParams.get("minPrice") && !searchParams.get("maxPrice")) {
          setPriceValues([newFilterData.priceRange.min, newFilterData.priceRange.max])
        }
        
        console.log(`Filter data loaded: ${products.length} products, ${newFilterData.categories.length} categories, ${newFilterData.models.length} models, ${newFilterData.colors.length} colors`)
      } catch (error) {
        console.error('Error fetching products for filters:', error)
        console.log('Using fallback filter data from mock products')
        // Filter data will already be set to mock data from initial state
      } finally {
        setIsLoading(false)
      }
    }

    fetchFilterData()
  }, [searchParams, refreshTrigger]) // Re-fetch when products are refreshed

  // Update price values when filter data changes
  useEffect(() => {
    const minPrice = searchParams.get("minPrice") ? Number(searchParams.get("minPrice")) : filterData.priceRange.min
    const maxPrice = searchParams.get("maxPrice") ? Number(searchParams.get("maxPrice")) : filterData.priceRange.max
    setPriceValues([minPrice, maxPrice])
  }, [filterData, searchParams])

  const createQueryString = (params: Record<string, string | null>) => {
    const newSearchParams = new URLSearchParams(searchParams.toString())

    Object.entries(params).forEach(([key, value]) => {
      if (value === null) {
        newSearchParams.delete(key)
      } else {
        newSearchParams.set(key, value)
      }
    })

    return newSearchParams.toString()
  }

  const handleModelChange = (model: string) => {
    startTransition(() => {
      const newModels = currentModels.includes(model)
        ? currentModels.filter(m => m !== model) // Remove if already selected
        : [...currentModels, model] // Add if not selected
      
      router.push(
        `/?${createQueryString({
          models: newModels.length > 0 ? newModels.join(',') : null,
          page: "1",
        })}`,
      )
    })
  }

  const handleColorChange = (color: string) => {
    startTransition(() => {
      const newColors = currentColors.includes(color)
        ? currentColors.filter(c => c !== color) // Remove if already selected
        : [...currentColors, color] // Add if not selected
      
      router.push(
        `/?${createQueryString({
          colors: newColors.length > 0 ? newColors.join(',') : null,
          page: "1",
        })}`,
      )
    })
  }

  const handleCategoryChange = (category: string) => {
    startTransition(() => {
      const newCategories = currentCategories.includes(category)
        ? currentCategories.filter(c => c !== category) // Remove if already selected
        : [...currentCategories, category] // Add if not selected
      
      router.push(
        `/?${createQueryString({
          categories: newCategories.length > 0 ? newCategories.join(',') : null,
          page: "1",
        })}`,
      )
    })
  }

  const handlePriceChange = () => {
    startTransition(() => {
      router.push(
        `/?${createQueryString({
          minPrice: priceValues[0].toString(),
          maxPrice: priceValues[1].toString(),
          page: "1",
        })}`,
      )
    })
  }

  const handleReset = () => {
    startTransition(() => {
      router.push("/")
      setPriceValues([filterData.priceRange.min, filterData.priceRange.max])
    })
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Filters</h2>
          <Button variant="ghost" size="sm" disabled>
            Reset
          </Button>
        </div>
        <div className="space-y-4">
          <div className="animate-pulse">
            <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
            <div className="h-8 bg-muted rounded"></div>
          </div>
          <div className="animate-pulse">
            <div className="h-4 bg-muted rounded w-1/2 mb-2"></div>
            <div className="h-8 bg-muted rounded"></div>
          </div>
          <div className="animate-pulse">
            <div className="h-4 bg-muted rounded w-2/3 mb-2"></div>
            <div className="h-8 bg-muted rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Filters</h2>
        <Button variant="ghost" size="sm" onClick={handleReset} disabled={isPending}>
          Reset
        </Button>
      </div>

      <Accordion type="multiple" defaultValue={["category", "model", "color", "price"]} className="w-full">
        <AccordionItem value="category">
          <AccordionTrigger>
            Category {currentCategories.length > 0 && (
              <span className="ml-2 text-xs bg-primary text-primary-foreground px-2 py-1 rounded-full">
                {currentCategories.length}
              </span>
            )}
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {currentCategories.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    startTransition(() => {
                      router.push(
                        `/?${createQueryString({
                          categories: null,
                          page: "1",
                        })}`,
                      )
                    })
                  }}
                  disabled={isPending}
                  className="text-xs h-6 px-2"
                >
                  Clear All Categories
                </Button>
              )}
              {filterData.categories.map((category) => (
                <div key={category} className="flex items-center space-x-2">
                  <Checkbox
                    id={`category-${category}`}
                    checked={currentCategories.includes(category)}
                    onCheckedChange={() => handleCategoryChange(category)}
                    disabled={isPending}
                  />
                  <Label htmlFor={`category-${category}`}>{category}</Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="model">
          <AccordionTrigger>
            Model {currentModels.length > 0 && (
              <span className="ml-2 text-xs bg-primary text-primary-foreground px-2 py-1 rounded-full">
                {currentModels.length}
              </span>
            )}
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {currentModels.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    startTransition(() => {
                      router.push(
                        `/?${createQueryString({
                          models: null,
                          page: "1",
                        })}`,
                      )
                    })
                  }}
                  disabled={isPending}
                  className="text-xs h-6 px-2"
                >
                  Clear All Models
                </Button>
              )}
              {filterData.models.map((model) => (
                <div key={model} className="flex items-center space-x-2">
                  <Checkbox
                    id={`model-${model}`}
                    checked={currentModels.includes(model)}
                    onCheckedChange={() => handleModelChange(model)}
                    disabled={isPending}
                  />
                  <Label htmlFor={`model-${model}`}>{model}</Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="color">
          <AccordionTrigger>
            Color {currentColors.length > 0 && (
              <span className="ml-2 text-xs bg-primary text-primary-foreground px-2 py-1 rounded-full">
                {currentColors.length}
              </span>
            )}
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {currentColors.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    startTransition(() => {
                      router.push(
                        `/?${createQueryString({
                          colors: null,
                          page: "1",
                        })}`,
                      )
                    })
                  }}
                  disabled={isPending}
                  className="text-xs h-6 px-2"
                >
                  Clear All Colors
                </Button>
              )}
              {filterData.colors.map((color) => (
                <div key={color} className="flex items-center space-x-2">
                  <Checkbox
                    id={`color-${color}`}
                    checked={currentColors.includes(color)}
                    onCheckedChange={() => handleColorChange(color)}
                    disabled={isPending}
                  />
                  <Label htmlFor={`color-${color}`}>{color}</Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="price">
          <AccordionTrigger>Price Range</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              <div className="px-2 py-4">
                <Slider
                  defaultValue={[filterData.priceRange.min, filterData.priceRange.max]}
                  min={filterData.priceRange.min}
                  max={filterData.priceRange.max}
                  step={10}
                  value={priceValues}
                  onValueChange={(value) => setPriceValues(value as [number, number])}
                  disabled={isPending}
                  className="w-full"
                />
              </div>
              <div className="flex items-center justify-between">
                <span>${priceValues[0].toFixed(2)}</span>
                <span>${priceValues[1].toFixed(2)}</span>
              </div>
              <Button size="sm" onClick={handlePriceChange} disabled={isPending}>
                Apply
              </Button>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}

