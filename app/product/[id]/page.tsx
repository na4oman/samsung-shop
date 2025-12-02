'use client'
import { useEffect, useState } from 'react'
import { useParams, notFound } from 'next/navigation'
import Image from 'next/image'
import Head from 'next/head'
import { AddToCartButton } from '@/components/add-to-cart-button'
import { FavoriteButton } from '@/components/favorite-button'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { getProduct } from '@/lib/product-service'
import { Product } from '@/lib/types'

export default function ProductPage() {
  const params = useParams() as { id: string }
  const id = params.id
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getProduct(id).then(p => {
      setProduct(p)
      setLoading(false)
      
      // Update page metadata dynamically
      if (p) {
        document.title = `${p.name} - ${p.model} | Samsung Display Shop`
        
        // Update meta description
        const metaDescription = document.querySelector('meta[name="description"]')
        if (metaDescription) {
          metaDescription.setAttribute('content', 
            `${p.name} ${p.model} - ${p.description}. Part Number: ${p.partNumber}. Category: ${p.category}. Color: ${p.color}. Price: €${p.price.toFixed(2)}`
          )
        }
        
        // Update Open Graph tags
        const ogTitle = document.querySelector('meta[property="og:title"]')
        if (ogTitle) ogTitle.setAttribute('content', `${p.name} - ${p.model}`)
        
        const ogDescription = document.querySelector('meta[property="og:description"]')
        if (ogDescription) ogDescription.setAttribute('content', p.description)
        
        const ogImage = document.querySelector('meta[property="og:image"]')
        if (ogImage && p.image) ogImage.setAttribute('content', p.image)
      }
    })
  }, [id])

  if (loading) return <div>Loading...</div>
  if (!product) return notFound()

  // Use default image if not provided
  const imageUrl = product.image || '/placeholder.svg?height=600&width=600'

  // Structured data for SEO (JSON-LD)
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.image || imageUrl,
    brand: {
      '@type': 'Brand',
      name: 'Samsung'
    },
    model: product.model,
    category: product.category,
    color: product.color,
    sku: product.partNumber,
    mpn: product.partNumber,
    offers: {
      '@type': 'Offer',
      url: typeof window !== 'undefined' ? window.location.href : '',
      priceCurrency: 'EUR',
      price: product.price,
      availability: 'https://schema.org/InStock',
      seller: {
        '@type': 'Organization',
        name: 'Samsung Display Shop'
      }
    },
    additionalProperty: [
      {
        '@type': 'PropertyValue',
        name: 'Part Number',
        value: product.partNumber
      },
      {
        '@type': 'PropertyValue',
        name: 'Model',
        value: product.model
      },
      {
        '@type': 'PropertyValue',
        name: 'Color',
        value: product.color
      }
    ]
  }

  return (
    <>
      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      
      <div className='container mx-auto px-4 py-8'>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
        <div className='relative aspect-square overflow-hidden rounded-lg bg-gray-100'>
          <Image
            src={imageUrl || '/placeholder.svg'}
            alt={product.name}
            fill
            className='object-cover'
            sizes='(max-width: 768px) 100vw, 50vw'
            priority
          />
        </div>
        <div className='flex flex-col space-y-4'>
          <div>
            <h1 className='text-3xl font-bold'>{product.name}</h1>
            <p className='text-muted-foreground'>Model: {product.model}</p>
            <p className='text-muted-foreground'>
              Part Number: {product.partNumber}
            </p>
          </div>

          <div className='flex items-center space-x-2'>
            <Badge>{product.category}</Badge>
            <Badge variant='outline'>{product.color}</Badge>
          </div>

          <Separator />

          <div className='text-2xl font-bold'>€{product.price.toFixed(2)}</div>

          <p className='text-muted-foreground'>{product.description}</p>

          <div className='flex flex-col sm:flex-row gap-4 mt-4'>
            <AddToCartButton product={product} className='flex-1' />
            <FavoriteButton
              productId={product.id}
              variant='outline'
              size='icon'
            />
          </div>
        </div>
      </div>
    </div>
    </>
  )
}
