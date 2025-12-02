import { describe, it, expect, vi, beforeEach } from 'vitest'
import * as fc from 'fast-check'
import { validateProductData, checkForDuplicates } from './product-service'
import type { Product } from './types'

// Mock the appwrite module
vi.mock('./appwrite', () => ({
  appwrite: {
    database: {
      listDocuments: vi.fn(),
    }
  },
  appwriteConfig: {
    databaseId: 'test-db',
    productsCollectionId: 'test-products'
  }
}))

// Mock the mock-data module
vi.mock('./mock-data', () => ({
  mockProducts: []
}))

describe('Product Validation', () => {
  describe('validateProductData', () => {
    it('should validate a complete valid product', () => {
      const validProduct = {
        name: 'Samsung Display',
        model: 'S24F350',
        category: 'LCD',
        color: 'Black',
        partNumber: 'SAM-S24F350-BLK',
        price: 299.99,
        description: 'High quality LCD display',
        image: 'https://example.com/image.jpg'
      }

      const result = validateProductData(validProduct)
      expect(result.isValid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })

    it('should reject product with missing required fields', () => {
      const invalidProduct = {}

      const result = validateProductData(invalidProduct)
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('Product name is required and cannot be empty')
      expect(result.errors).toContain('Product model is required and cannot be empty')
      expect(result.errors).toContain('Product category is required and cannot be empty')
      expect(result.errors).toContain('Product color is required and cannot be empty')
      expect(result.errors).toContain('Product part number is required and cannot be empty')
      expect(result.errors).toContain('Product price is required')
    })

    it('should reject product with invalid price', () => {
      const invalidProduct = {
        name: 'Test Product',
        model: 'TEST-001',
        category: 'LCD',
        color: 'Black',
        partNumber: 'TEST-001',
        price: -10
      }

      const result = validateProductData(invalidProduct)
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('Product price must be greater than zero')
    })

    it('should reject product with invalid category', () => {
      const invalidProduct = {
        name: 'Test Product',
        model: 'TEST-001',
        category: 'INVALID_CATEGORY',
        color: 'Black',
        partNumber: 'TEST-001',
        price: 100
      }

      const result = validateProductData(invalidProduct)
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('Product category must be one of: LCD, AMOLED, OLED, E-Paper, TFT')
    })

    it('should reject product with invalid part number format', () => {
      const invalidProduct = {
        name: 'Test Product',
        model: 'TEST-001',
        category: 'LCD',
        color: 'Black',
        partNumber: 'invalid part number!',
        price: 100
      }

      const result = validateProductData(invalidProduct)
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('Product part number can only contain letters, numbers, hyphens, and underscores')
    })

    // **Feature: product-import-db-integration, Property 11: Validation error specificity**
    // **Validates: Requirements 3.2**
    it('should provide specific error messages for each validation failure', () => {
      fc.assert(fc.property(
        fc.record({
          name: fc.oneof(fc.constant(''), fc.constant(null), fc.constant(undefined), fc.integer()),
          model: fc.oneof(fc.constant(''), fc.constant(null), fc.constant(undefined), fc.integer()),
          category: fc.oneof(fc.constant('INVALID'), fc.constant(''), fc.constant(null)),
          color: fc.oneof(fc.constant(''), fc.string({ minLength: 51 })),
          partNumber: fc.oneof(fc.constant(''), fc.string().filter(s => /[^A-Z0-9\-_]/i.test(s))),
          price: fc.oneof(fc.constant(-1), fc.constant(0), fc.constant('invalid'), fc.constant(null))
        }),
        (invalidProduct) => {
          const result = validateProductData(invalidProduct as any)
          
          // Should be invalid
          expect(result.isValid).toBe(false)
          
          // Should have specific error messages
          expect(result.errors.length).toBeGreaterThan(0)
          
          // Each error should be descriptive and specific
          result.errors.forEach(error => {
            expect(error).toMatch(/^Product \w+/)
            expect(error.length).toBeGreaterThan(10) // Ensure errors are descriptive
          })
        }
      ), { numRuns: 100 })
    })
  })

  describe('checkForDuplicates', () => {
    const existingProducts: Product[] = [
      {
        id: '1',
        name: 'Existing Product',
        model: 'EX-001',
        category: 'LCD',
        color: 'Black',
        partNumber: 'EXISTING-001',
        price: 100,
        description: 'An existing product',
        image: 'https://example.com/existing.jpg'
      }
    ]

    it('should detect duplicate part numbers', async () => {
      const duplicateProduct = {
        name: 'New Product',
        model: 'NEW-001',
        category: 'AMOLED',
        color: 'White',
        partNumber: 'EXISTING-001', // Same part number
        price: 200
      }

      const errors = await checkForDuplicates(duplicateProduct, existingProducts)
      expect(errors).toHaveLength(1)
      expect(errors[0]).toContain('Duplicate part number detected')
      expect(errors[0]).toContain('EXISTING-001')
    })

    it('should detect duplicate name+model combinations', async () => {
      const duplicateProduct = {
        name: 'Existing Product', // Same name
        model: 'EX-001', // Same model
        category: 'AMOLED',
        color: 'White',
        partNumber: 'NEW-PART-001', // Different part number
        price: 200
      }

      const errors = await checkForDuplicates(duplicateProduct, existingProducts)
      expect(errors).toHaveLength(1)
      expect(errors[0]).toContain('Duplicate product detected')
      expect(errors[0]).toContain('Existing Product')
      expect(errors[0]).toContain('EX-001')
    })

    it('should allow unique products', async () => {
      const uniqueProduct = {
        name: 'Unique Product',
        model: 'UNQ-001',
        category: 'OLED',
        color: 'Silver',
        partNumber: 'UNIQUE-001',
        price: 300
      }

      const errors = await checkForDuplicates(uniqueProduct, existingProducts)
      expect(errors).toHaveLength(0)
    })

    // **Feature: product-import-db-integration, Property 10: Duplicate prevention**
    // **Validates: Requirements 3.1**
    it('should prevent duplicate entries for any product with existing part numbers', async () => {
      await fc.assert(fc.asyncProperty(
        fc.constantFrom('EXISTING-001', 'existing-001', 'EXISTING-001 '), // Various forms of existing part number
        async (duplicatePartNumber) => {
          // Create a valid product with the duplicate part number
          const productWithDuplicatePartNumber = {
            name: 'Test Product',
            model: 'TEST-MODEL',
            category: 'LCD' as const,
            color: 'Black',
            partNumber: duplicatePartNumber,
            price: 100
          }
          
          const errors = await checkForDuplicates(productWithDuplicatePartNumber, existingProducts)
          
          // Should detect duplicate
          expect(errors.length).toBeGreaterThan(0)
          
          // Should mention part number in error
          const partNumberError = errors.find(error => error.toLowerCase().includes('part number'))
          expect(partNumberError).toBeDefined()
          expect(partNumberError!.toUpperCase()).toContain('EXISTING-001')
        }
      ), { numRuns: 100 })
    })
  })
})