import { appwrite, appwriteConfig } from './appwrite'
import type { Product, ImportResult } from './types'
import { mockProducts } from './mock-data'

export async function getProducts(): Promise<Product[]> {
  try {
    const response = await appwrite.database.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.productsCollectionId
    )

    return response.documents.map((doc: any) => ({
      id: doc.$id,
      name: doc.name,
      model: doc.model,
      category: doc.category,
      color: doc.color,
      description: doc.description,
      price: doc.price,
      image: doc.image,
      partNumber: doc.partNumber,
    }))
  } catch (error) {
    console.error('Error fetching products:', error)
    console.log('Falling back to mock products data')
    return mockProducts
  }
}

export async function getProduct(id: string): Promise<Product> {
  try {
    const product = await appwrite.database.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.productsCollectionId,
      id
    )
    const doc = product as any
    return {
      id: doc.$id,
      name: doc.name,
      model: doc.model,
      category: doc.category,
      color: doc.color,
      description: doc.description,
      price: doc.price,
      image: doc.image,
      partNumber: doc.partNumber,
    } as Product
  } catch (error) {
    console.error(`Error fetching product ${id}:`, error)
    // Fallback to mock data
    const mockProduct = mockProducts.find(p => p.id === id)
    if (mockProduct) return mockProduct
    throw error
  }
}

export async function createProduct(
  product: Omit<Product, 'id'> | Product
): Promise<Product> {
  try {
    const productData = { ...product }
    delete (productData as any).id
    
    console.log('Creating product in database:', productData)
    
    const response = await appwrite.database.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.productsCollectionId,
      productData
    )
    
    console.log('Database response:', response)
    
    const doc = response as any
    const createdProduct = {
      id: doc.$id,
      name: doc.name,
      model: doc.model,
      category: doc.category,
      color: doc.color,
      description: doc.description,
      price: doc.price,
      image: doc.image,
      partNumber: doc.partNumber,
    } as Product
    
    console.log('Created product:', createdProduct)
    
    return createdProduct
  } catch (error) {
    console.error('Error creating product:', error)
    throw error
  }
}

export async function updateProduct(
  id: string,
  product: Partial<Product>
): Promise<Product> {
  try {
    const response = await appwrite.database.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.productsCollectionId,
      id,
      product
    )
    const doc = response as any
    return {
      id: doc.$id,
      name: doc.name,
      model: doc.model,
      category: doc.category,
      color: doc.color,
      description: doc.description,
      price: doc.price,
      image: doc.image,
      partNumber: doc.partNumber,
    } as Product
  } catch (error) {
    console.error(`Error updating product ${id}:`, error)
    throw error
  }
}

export async function deleteProduct(id: string): Promise<void> {
  try {
    await appwrite.database.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.productsCollectionId,
      id
    )
  } catch (error) {
    console.error(`Error deleting product ${id}:`, error)
    throw error
  }
}

/**
 * Validates individual product data before database operations
 * Provides comprehensive field validation with specific error messages
 */
export function validateProductData(product: Partial<Product>): { isValid: boolean; errors: string[] } {
  const errors: string[] = []

  // Required field validation with specific messages
  if (!product.name || typeof product.name !== 'string' || product.name.trim() === '') {
    if (typeof product.name !== 'string' && product.name !== undefined && product.name !== null) {
      errors.push('Product name must be a text value')
    } else {
      errors.push('Product name is required and cannot be empty')
    }
  } else if (product.name.length > 200) {
    errors.push('Product name must be 200 characters or less')
  } else if (product.name.length < 2) {
    errors.push('Product name must be at least 2 characters long')
  }

  if (!product.model || typeof product.model !== 'string' || product.model.trim() === '') {
    if (typeof product.model !== 'string' && product.model !== undefined && product.model !== null) {
      errors.push('Product model must be a text value')
    } else {
      errors.push('Product model is required and cannot be empty')
    }
  } else if (product.model.length > 100) {
    errors.push('Product model must be 100 characters or less')
  } else if (product.model.length < 1) {
    errors.push('Product model must be at least 1 character long')
  }

  if (!product.category || typeof product.category !== 'string' || product.category.trim() === '') {
    if (typeof product.category !== 'string' && product.category !== undefined && product.category !== null) {
      errors.push('Product category must be a text value')
    } else {
      errors.push('Product category is required and cannot be empty')
    }
  } else if (!['LCD', 'AMOLED', 'OLED', 'E-Paper', 'TFT'].includes(product.category)) {
    errors.push('Product category must be one of: LCD, AMOLED, OLED, E-Paper, TFT')
  }

  if (!product.color || typeof product.color !== 'string' || product.color.trim() === '') {
    if (typeof product.color !== 'string' && product.color !== undefined && product.color !== null) {
      errors.push('Product color must be a text value')
    } else {
      errors.push('Product color is required and cannot be empty')
    }
  } else if (product.color.length > 50) {
    errors.push('Product color must be 50 characters or less')
  }

  if (!product.partNumber || typeof product.partNumber !== 'string' || product.partNumber.trim() === '') {
    if (typeof product.partNumber !== 'string' && product.partNumber !== undefined && product.partNumber !== null) {
      errors.push('Product part number must be a text value')
    } else {
      errors.push('Product part number is required and cannot be empty')
    }
  } else if (product.partNumber.length > 50) {
    errors.push('Product part number must be 50 characters or less')
  } else if (!/^[A-Z0-9\-_]+$/i.test(product.partNumber)) {
    errors.push('Product part number can only contain letters, numbers, hyphens, and underscores')
  }

  // Price validation with specific error messages
  if (product.price === undefined || product.price === null) {
    errors.push('Product price is required')
  } else if (typeof product.price !== 'number') {
    errors.push('Product price must be a numeric value')
  } else if (isNaN(product.price)) {
    errors.push('Product price must be a valid number')
  } else if (product.price <= 0) {
    errors.push('Product price must be greater than zero')
  } else if (product.price > 999999.99) {
    errors.push('Product price cannot exceed $999,999.99')
  } else if (!Number.isFinite(product.price)) {
    errors.push('Product price must be a finite number')
  }

  // Optional field validation
  if (product.description !== undefined && product.description !== null) {
    if (typeof product.description !== 'string') {
      errors.push('Product description must be a text value')
    } else if (product.description.length > 1000) {
      errors.push('Product description must be 1000 characters or less')
    }
  }

  if (product.image !== undefined && product.image !== null) {
    if (typeof product.image !== 'string') {
      errors.push('Product image must be a text value (URL)')
    } else if (product.image.length > 500) {
      errors.push('Product image URL must be 500 characters or less')
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}

/**
 * Checks for duplicate products based on part number
 * Enhanced duplicate detection with specific error messages
 */
export async function checkForDuplicates(product: Partial<Product>, existingProducts?: Product[]): Promise<string[]> {
  const duplicateErrors: string[] = []
  
  try {
    // Get existing products if not provided
    const products = existingProducts || await getProducts()
    
    // Check for duplicate part number (primary duplicate detection)
    if (product.partNumber) {
      const duplicatePartNumber = products.find(p => 
        p.partNumber.toLowerCase().trim() === product.partNumber!.toLowerCase().trim()
      )
      if (duplicatePartNumber) {
        duplicateErrors.push(`Duplicate part number detected: "${product.partNumber}" already exists in the database (Product ID: ${duplicatePartNumber.id})`)
      }
    }
    
    // Additional check for name+model combination as secondary duplicate detection
    if (product.name && product.model) {
      const duplicateNameModel = products.find(p => 
        p.name.toLowerCase().trim() === product.name!.toLowerCase().trim() && 
        p.model.toLowerCase().trim() === product.model!.toLowerCase().trim()
      )
      if (duplicateNameModel && duplicateNameModel.partNumber !== product.partNumber) {
        duplicateErrors.push(`Duplicate product detected: A product with name "${product.name}" and model "${product.model}" already exists (Part Number: ${duplicateNameModel.partNumber})`)
      }
    }
  } catch (error) {
    console.error('Error checking for duplicates:', error)
    // Add a specific error message for duplicate check failure
    duplicateErrors.push('Unable to verify duplicates due to database connectivity issues. Product may be a duplicate.')
  }
  
  return duplicateErrors
}

/**
 * Retry function with exponential backoff for network operations
 */
async function retryOperation<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> {
  let lastError: Error
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await operation()
    } catch (error) {
      lastError = error as Error
      
      // Don't retry on validation errors or client errors
      if (error && typeof error === 'object' && 'code' in error) {
        const errorCode = (error as any).code
        if (errorCode >= 400 && errorCode < 500) {
          throw error
        }
      }
      
      if (attempt === maxRetries) {
        break
      }
      
      // Exponential backoff with jitter
      const delay = baseDelay * Math.pow(2, attempt) + Math.random() * 1000
      await new Promise(resolve => setTimeout(resolve, delay))
    }
  }
  
  throw lastError!
}

/**
 * Creates multiple products in batch with validation and error handling
 */
export async function createProductBatch(products: Omit<Product, 'id'>[]): Promise<ImportResult> {
  console.log('createProductBatch called with', products.length, 'products')
  
  const result: ImportResult = {
    successful: [],
    failed: [],
    totalProcessed: products.length
  }

  // Get existing products once for duplicate checking
  let existingProducts: Product[] = []
  try {
    console.log('Fetching existing products for duplicate checking...')
    existingProducts = await getProducts()
    console.log('Found', existingProducts.length, 'existing products')
  } catch (error) {
    console.warn('Could not fetch existing products for duplicate checking:', error)
  }

  // Process each product individually
  for (let i = 0; i < products.length; i++) {
    const product = products[i]
    console.log(`Processing product ${i + 1}/${products.length}:`, product.name)
    
    try {
      // Validate product data
      console.log('Validating product data...')
      const validation = validateProductData(product)
      if (!validation.isValid) {
        console.log('Validation failed:', validation.errors)
        result.failed.push({
          product,
          error: validation.errors.join('; '),
          index: i
        })
        continue
      }

      // Check for duplicates
      console.log('Checking for duplicates...')
      const duplicateErrors = await checkForDuplicates(product, existingProducts)
      if (duplicateErrors.length > 0) {
        console.log('Duplicate detected:', duplicateErrors)
        result.failed.push({
          product,
          error: duplicateErrors.join('; '),
          index: i
        })
        continue
      }

      // Create product with retry logic
      console.log('Creating product in database...')
      const createdProduct = await retryOperation(async () => {
        return await createProduct(product)
      })

      console.log('Product created successfully:', createdProduct.id)
      result.successful.push(createdProduct)
      
      // Add to existing products list to prevent duplicates within the batch
      existingProducts.push(createdProduct)
      
    } catch (error) {
      console.error(`Error creating product at index ${i}:`, error)
      result.failed.push({
        product,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        index: i
      })
    }
  }

  console.log('Batch creation completed. Successful:', result.successful.length, 'Failed:', result.failed.length)
  return result
}
