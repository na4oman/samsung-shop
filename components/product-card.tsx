import Image from 'next/image'
import Link from 'next/link'
import type { Product } from '@/lib/types'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { AddToCartButton } from './add-to-cart-button'
import { FavoriteButton } from './favorite-button'
import { Badge } from './ui/badge'

interface ProductCardProps {
  product: Product
  onFavoriteToggle?: () => void
  isFavorite?: boolean
}

export default function ProductCard({
  product,
  onFavoriteToggle,
  isFavorite,
}: ProductCardProps) {
  // Use default image if not provided
  const imageUrl = product.image || '/placeholder.svg?height=400&width=400'

  return (
    <Card className='overflow-hidden h-full flex flex-col'>
      <div className='relative'>
        <Link href={`/product/${product.id}`}>
          <div className='aspect-square overflow-hidden'>
            <Image
              src={imageUrl || '/placeholder.svg'}
              alt={product.name}
              width={400}
              height={400}
              className='object-cover transition-transform hover:scale-105'
            />
          </div>
        </Link>
        <div className='absolute top-2 right-2'>
          <FavoriteButton
            productId={product.id}
            variant='default'
            size='icon'
            className='h-8 w-8'
          />
        </div>
      </div>
      <CardContent className='flex-1 p-4'>
        <div className='flex items-center justify-between mb-2'>
          <Badge variant='outline'>{product.category}</Badge>
          <span className='text-sm text-muted-foreground'>{product.model}</span>
        </div>
        <Link href={`/product/${product.id}`} className='block'>
          <h3 className='font-medium line-clamp-2 hover:underline'>
            {product.name}
          </h3>
        </Link>
        <p className='text-sm text-muted-foreground mt-1 mb-1'>
          Part #: {product.partNumber}
        </p>
        <p className='text-sm text-muted-foreground line-clamp-2'>
          {product.description}
        </p>
      </CardContent>
      <CardFooter className='p-4 pt-0 mt-auto flex items-center justify-between'>
        <span className='font-bold mr-2'>€{product.price.toFixed(2)}</span>
        <AddToCartButton product={product} variant='default' />
      </CardFooter>
    </Card>
  )
}
