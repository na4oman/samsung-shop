"use client"

import { useEffect } from 'react'
import ProductList from "@/components/product-list"
import { ProductFilters } from "@/components/product-filters"
import { useProductRefresh } from "@/components/product-refresh-provider"

import { useSearchParams } from 'next/navigation'

function ProductListWithRefresh({
  search,
  models,
  colors,
  categories,
  minPrice,
  maxPrice,
  page,
}: {
  search: string
  models?: string[]
  colors?: string[]
  categories?: string[]
  minPrice?: number
  maxPrice?: number
  page: number
}) {
  const { refreshTrigger } = useProductRefresh()

  return (
    <ProductList
      search={search}
      models={models}
      colors={colors}
      categories={categories}
      minPrice={minPrice}
      maxPrice={maxPrice}
      page={page}
      refreshTrigger={refreshTrigger}
    />
  )
}

export default function Page() {
  const searchParams = useSearchParams()

  // Helper function to parse multiple values from URL parameter
  const parseMultipleValues = (paramName: string): string[] => {
    const param = searchParams.get(paramName)
    if (!param) return []
    return param.split(',').filter(Boolean)
  }

  const search = searchParams.get('search') || ''; 
  const models = parseMultipleValues('models')
  const colors = parseMultipleValues('colors')
  const categories = parseMultipleValues('categories')
  
  const minPriceParam = searchParams.get('minPrice');
  const minPrice = minPriceParam !== null && !isNaN(Number(minPriceParam)) ? Number.parseInt(minPriceParam) : undefined;
  const maxPriceParam = searchParams.get('maxPrice');
  const maxPrice = maxPriceParam !== null && !isNaN(Number(maxPriceParam)) ? Number.parseInt(maxPriceParam) : undefined;
  
  const pageParam = searchParams.get('page'); 
  const page = pageParam && !isNaN(Number(pageParam)) ? Number(pageParam) : 1;

  // Update page metadata based on filters
  useEffect(() => {
    let title = 'Samsung Display Shop - LCD & AMOLED Displays'
    let description = 'Shop for high-quality Samsung LCD and AMOLED displays.'
    
    if (search) {
      title = `Search: ${search} | Samsung Display Shop`
      description = `Search results for "${search}" - Browse Samsung LCD and AMOLED displays.`
    } else if (categories.length > 0) {
      title = `${categories.join(', ')} Displays | Samsung Display Shop`
      description = `Browse ${categories.join(', ')} Samsung displays. High-quality LCD and AMOLED panels.`
    } else if (models.length > 0) {
      title = `${models.join(', ')} Models | Samsung Display Shop`
      description = `Shop ${models.join(', ')} Samsung display models.`
    }
    
    document.title = title
    
    const metaDescription = document.querySelector('meta[name="description"]')
    if (metaDescription) {
      metaDescription.setAttribute('content', description)
    }
  }, [search, categories, models])

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Samsung Parts</h1>
      <div className="grid grid-cols-1 lg:grid-cols-6 gap-8">
        <div className="lg:col-span-1">
          <ProductFilters />
        </div>
        <div className="lg:col-span-5">
          <ProductListWithRefresh
            search={search}
            models={models}
            colors={colors}
            categories={categories}
            minPrice={minPrice}
            maxPrice={maxPrice}
            page={page}
          />
        </div>
      </div>
    </div>
  )
}

