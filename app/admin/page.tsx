'use client'

import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { mockProducts } from '@/lib/mock-data'
import type { Product } from '@/lib/types'
import AdminProductList from '@/components/admin-product-list'
import AdminProductForm from '@/components/admin-product-form'
import AdminOrderList from '@/components/admin-order-list'
import { useToast } from '@/components/ui/use-toast'
import { useAuth } from '@/components/auth-provider'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Upload } from 'lucide-react'
import ProductImport from '@/components/product-import'
import {
  createProduct,
  updateProduct,
  deleteProduct,
  getProducts,
  createProductBatch,
} from '@/lib/product-service'
import { productRefreshEvents } from '@/lib/product-refresh-events'

export default function AdminPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loadingProducts, setLoadingProducts] = useState(true)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [showImportModal, setShowImportModal] = useState(false)
  const { toast } = useToast()
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [formKey, setFormKey] = useState(0)

  useEffect(() => {
    const fetchProducts = async () => {
      setLoadingProducts(true)
      const dbProducts = await getProducts()
      setProducts(dbProducts)
      setLoadingProducts(false)
    }
    fetchProducts()
  }, [])

  // Redirect if not admin
  if (!isLoading && (!user || user.role !== 'admin')) {
    router.push('/')
    return null
  }

  if (isLoading || loadingProducts) {
    return (
      <div className='container mx-auto px-4 py-16 text-center'>
        <p>Loading products...</p>
      </div>
    )
  }

  const handleAddProduct = async (
    product: Omit<Product, 'id'>,
    resetForm: () => void
  ) => {
    try {
      const created = await createProduct(product)
      setProducts([...products, created])
      
      // Emit refresh event for product creation
      productRefreshEvents.emit('create', {
        count: 1,
        productIds: [created.id]
      })
      
      toast({
        title: 'Product added',
        description: `${created.name} has been added successfully.`,
      })
      resetForm() // Only reset after success
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add product.',
        variant: 'destructive',
      })
    }
  }

  const handleUpdateProduct = async (
    updatedProduct: Product,
    resetForm?: () => void
  ) => {
    try {
      const updated = await updateProduct(updatedProduct.id, updatedProduct)
      setProducts(products.map(p => (p.id === updated.id ? updated : p)))
      setEditingProduct(null)
      
      // Emit refresh event for product update
      productRefreshEvents.emit('update', {
        count: 1,
        productIds: [updated.id]
      })
      
      toast({
        title: 'Product updated',
        description: `${updated.name} has been updated successfully.`,
      })
      if (resetForm) resetForm()
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update product.',
        variant: 'destructive',
      })
    }
  }

  const handleDeleteProduct = async (productId: string) => {
    try {
      await deleteProduct(productId)
      setProducts(products.filter(p => p.id !== productId))
      if (editingProduct?.id === productId) {
        setEditingProduct(null)
      }
      
      // Emit refresh event for product deletion
      productRefreshEvents.emit('delete', {
        count: 1,
        productIds: [productId]
      })
      
      toast({
        title: 'Product deleted',
        description: 'The product has been deleted successfully.',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete product.',
        variant: 'destructive',
      })
    }
  }

  const handleImportProducts = async (importedProducts: Product[]) => {
    console.log('Starting import process with', importedProducts.length, 'products')
    
    try {
      // Prepare products for batch creation (remove IDs and ensure defaults)
      const productsForImport = importedProducts.map(product => {
        const { id, ...productWithoutId } = product
        return {
          ...productWithoutId,
          // Ensure image has a default value if not provided
          image: productWithoutId.image || '/placeholder.svg?height=400&width=400',
        }
      })

      console.log('Prepared products for import:', productsForImport)

      // Call the batch creation service
      console.log('Calling createProductBatch...')
      const importResult = await createProductBatch(productsForImport)
      
      console.log('Import result:', importResult)
      
      // Update the products list with successfully imported products
      if (importResult.successful.length > 0) {
        console.log('Updating local products list with', importResult.successful.length, 'new products')
        setProducts(prevProducts => {
          const updatedProducts = [...prevProducts, ...importResult.successful]
          console.log('Updated products list length:', updatedProducts.length)
          return updatedProducts
        })

        // Emit refresh event to notify other components/pages
        console.log('Emitting product refresh event for import')
        productRefreshEvents.emit('import', {
          count: importResult.successful.length,
          productIds: importResult.successful.map(p => p.id)
        })
      }
      
      setShowImportModal(false)

      // Show detailed success/error messages
      if (importResult.failed.length === 0) {
        // All products imported successfully
        console.log('All products imported successfully')
        toast({
          title: 'Products imported successfully',
          description: `All ${importResult.successful.length} products have been imported to the database.`,
        })
      } else if (importResult.successful.length === 0) {
        // All products failed
        console.log('All products failed to import')
        toast({
          title: 'Import failed',
          description: `Failed to import any products. ${importResult.failed.length} products had errors.`,
          variant: 'destructive',
        })
      } else {
        // Partial success
        console.log('Partial import completed')
        toast({
          title: 'Partial import completed',
          description: `${importResult.successful.length} products imported to database, ${importResult.failed.length} failed. Check the console for detailed error information.`,
        })
        
        // Log detailed error information for debugging
        console.error('Import errors:', importResult.failed.map(f => ({
          index: f.index,
          product: f.product,
          error: f.error
        })))
      }
    } catch (error) {
      console.error('Import operation failed:', error)
      setShowImportModal(false)
      
      toast({
        title: 'Import failed',
        description: 'An unexpected error occurred during import. Please try again.',
        variant: 'destructive',
      })
    }
  }

  // Filter products based on search query
  const filteredProducts = products.filter(
    product =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.partNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className='container mx-auto px-4 py-8'>
      <h1 className='text-3xl font-bold mb-6'>Admin Dashboard</h1>

      <Tabs defaultValue='products'>
        <TabsList className='mb-6'>
          <TabsTrigger value='products'>Products</TabsTrigger>
          <TabsTrigger value='orders'>Orders</TabsTrigger>
          <TabsTrigger value='add'>Add New Product</TabsTrigger>
        </TabsList>

        <TabsContent value='products'>
          <div className='flex justify-between items-center mb-6'>
            <Input
              placeholder='Search products...'
              className='max-w-md'
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
            <Button
              onClick={() => setShowImportModal(true)}
              className='flex items-center gap-2'
            >
              <Upload size={16} />
              Import Products
            </Button>
          </div>

          <AdminProductList
            products={filteredProducts}
            onEdit={setEditingProduct}
            onDelete={handleDeleteProduct}
          />

          {editingProduct && (
            <div className='fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50'>
              <div className='bg-background rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto'>
                <h2 className='text-2xl font-bold mb-4'>Edit Product</h2>
                <AdminProductForm
                  initialValues={editingProduct}
                  onSubmit={handleUpdateProduct}
                  onCancel={() => setEditingProduct(null)}
                />
              </div>
            </div>
          )}

          {showImportModal && (
            <ProductImport
              onImport={handleImportProducts}
              onCancel={() => setShowImportModal(false)}
            />
          )}
        </TabsContent>

        <TabsContent value='orders'>
          <AdminOrderList />
        </TabsContent>

        <TabsContent value='add'>
          <div className='bg-card rounded-lg p-6 border'>
            <h2 className='text-2xl font-bold mb-4'>Add New Product</h2>
            <AdminProductForm onSubmit={handleAddProduct} onCancel={() => {}} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
