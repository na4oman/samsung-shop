'use client'

import type { Product } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Edit, Trash2 } from 'lucide-react'
import Image from 'next/image'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

interface AdminProductListProps {
  products: Product[]
  onEdit: (product: Product) => void
  onDelete: (productId: string) => void
}

export default function AdminProductList({
  products,
  onEdit,
  onDelete,
}: AdminProductListProps) {
  return (
    <div className='border rounded-lg overflow-hidden'>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className='w-[80px]'>Image</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Part Number</TableHead>
            <TableHead>Model</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Color</TableHead>
            <TableHead className='text-right'>Price</TableHead>
            <TableHead className='text-right'>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products
            .filter(p => p.id)
            .map(product => (
              <TableRow key={product.id}>
                <TableCell>
                  <div className='relative w-16 h-16 rounded overflow-hidden'>
                    <Image
                      src={
                        product.image || '/placeholder.svg?height=64&width=64'
                      }
                      alt={product.name}
                      fill
                      className='object-cover'
                    />
                  </div>
                </TableCell>
                <TableCell className='font-medium'>{product.name}</TableCell>
                <TableCell>{product.partNumber}</TableCell>
                <TableCell>{product.model}</TableCell>
                <TableCell>{product.category}</TableCell>
                <TableCell>{product.color}</TableCell>
                <TableCell className='text-right'>
                  ${product.price.toFixed(2)}
                </TableCell>
                <TableCell className='text-right'>
                  <div className='flex justify-end space-x-2'>
                    <Button
                      variant='ghost'
                      size='icon'
                      onClick={() => onEdit(product)}
                    >
                      <Edit className='h-4 w-4' />
                      <span className='sr-only'>Edit</span>
                    </Button>
                    <Button
                      variant='ghost'
                      size='icon'
                      onClick={() => onDelete(product.id)}
                    >
                      <Trash2 className='h-4 w-4' />
                      <span className='sr-only'>Delete</span>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </div>
  )
}
