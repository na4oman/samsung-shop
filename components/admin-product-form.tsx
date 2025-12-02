'use client'

import type React from 'react'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { Product } from '@/lib/types'
import { createProduct } from '@/lib/product-service'

interface AdminProductFormProps {
  initialValues?: Product
  onSubmit: (product: any, resetForm: () => void) => void
  onCancel: () => void
}

const defaultValues = {
  id: '',
  name: '',
  model: '',
  category: '',
  color: '',
  description: '',
  price: 0,
  image: '',
  partNumber: '',
}

// Available options
const modelOptions = [
  'Galaxy S21',
  'Galaxy S22',
  'Galaxy S23',
  'Galaxy Note 20',
  'Galaxy A53',
]
const categoryOptions = ['LCD', 'AMOLED']
const colorOptions = ['Black', 'White', 'Blue', 'Red', 'Green']

// Update the AdminProductForm to allow adding new options
export default function AdminProductForm({
  initialValues = defaultValues,
  onSubmit,
  onCancel,
}: AdminProductFormProps) {
  const [formValues, setFormValues] = useState<
    Omit<Product, 'id'> & { id?: string }
  >({
    ...defaultValues,
    ...initialValues,
  })
  const [customModel, setCustomModel] = useState('')
  const [customCategory, setCustomCategory] = useState('')
  const [customColor, setCustomColor] = useState('')
  const [showCustomModel, setShowCustomModel] = useState(false)
  const [showCustomCategory, setShowCustomCategory] = useState(false)
  const [showCustomColor, setShowCustomColor] = useState(false)
  const [loading, setLoading] = useState(false)

  const resetForm = () => setFormValues({ ...defaultValues })

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormValues(prev => ({
      ...prev,
      [name]: name === 'price' ? Number.parseFloat(value) || 0 : value,
    }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormValues(prev => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Add partNumber if it's not provided
    if (!formValues.partNumber) {
      const modelCode = formValues.model.replace(/Galaxy /i, '').toUpperCase()
      const categoryCode = formValues.category.toUpperCase()
      const colorCode = formValues.color.substring(0, 3).toUpperCase()
      const partNumber = `SM-${modelCode}-${categoryCode}-${colorCode}`
      formValues.partNumber = partNumber
    }

    // Ensure image has a default value if not provided
    if (!formValues.image) {
      formValues.image = '/placeholder.svg?height=400&width=400'
    }

    setLoading(true)
    try {
      await onSubmit(formValues, resetForm)
    } finally {
      setLoading(false)
    }
  }

  const handleAddCustomModel = () => {
    if (customModel.trim()) {
      handleSelectChange('model', customModel.trim())
      setCustomModel('')
      setShowCustomModel(false)
    }
  }

  const handleAddCustomCategory = () => {
    if (customCategory.trim()) {
      handleSelectChange('category', customCategory.trim())
      setCustomCategory('')
      setShowCustomCategory(false)
    }
  }

  const handleAddCustomColor = () => {
    if (customColor.trim()) {
      handleSelectChange('color', customColor.trim())
      setCustomColor('')
      setShowCustomColor(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className='space-y-6'>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <div className='space-y-2'>
          <Label htmlFor='name'>Product Name</Label>
          <Input
            id='name'
            name='name'
            value={formValues.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className='space-y-2'>
          <Label htmlFor='partNumber'>Part Number</Label>
          <Input
            id='partNumber'
            name='partNumber'
            value={formValues.partNumber}
            onChange={handleChange}
            placeholder='Will be auto-generated if left empty'
          />
        </div>

        <div className='space-y-2'>
          <div className='flex justify-between items-center'>
            <Label htmlFor='model'>Model</Label>
            <Button
              type='button'
              variant='ghost'
              size='sm'
              onClick={() => setShowCustomModel(!showCustomModel)}
            >
              {showCustomModel ? 'Cancel' : 'Add New'}
            </Button>
          </div>

          {showCustomModel ? (
            <div className='flex space-x-2'>
              <Input
                value={customModel}
                onChange={e => setCustomModel(e.target.value)}
                placeholder='Enter new model'
              />
              <Button type='button' size='sm' onClick={handleAddCustomModel}>
                Add
              </Button>
            </div>
          ) : (
            <Select
              value={formValues.model}
              onValueChange={value => handleSelectChange('model', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder='Select model' />
              </SelectTrigger>
              <SelectContent>
                {modelOptions.map(model => (
                  <SelectItem key={model} value={model}>
                    {model}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>

        <div className='space-y-2'>
          <div className='flex justify-between items-center'>
            <Label htmlFor='category'>Category</Label>
            <Button
              type='button'
              variant='ghost'
              size='sm'
              onClick={() => setShowCustomCategory(!showCustomCategory)}
            >
              {showCustomCategory ? 'Cancel' : 'Add New'}
            </Button>
          </div>

          {showCustomCategory ? (
            <div className='flex space-x-2'>
              <Input
                value={customCategory}
                onChange={e => setCustomCategory(e.target.value)}
                placeholder='Enter new category'
              />
              <Button type='button' size='sm' onClick={handleAddCustomCategory}>
                Add
              </Button>
            </div>
          ) : (
            <Select
              value={formValues.category}
              onValueChange={value => handleSelectChange('category', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder='Select category' />
              </SelectTrigger>
              <SelectContent>
                {categoryOptions.map(category => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>

        <div className='space-y-2'>
          <div className='flex justify-between items-center'>
            <Label htmlFor='color'>Color</Label>
            <Button
              type='button'
              variant='ghost'
              size='sm'
              onClick={() => setShowCustomColor(!showCustomColor)}
            >
              {showCustomColor ? 'Cancel' : 'Add New'}
            </Button>
          </div>

          {showCustomColor ? (
            <div className='flex space-x-2'>
              <Input
                value={customColor}
                onChange={e => setCustomColor(e.target.value)}
                placeholder='Enter new color'
              />
              <Button type='button' size='sm' onClick={handleAddCustomColor}>
                Add
              </Button>
            </div>
          ) : (
            <Select
              value={formValues.color}
              onValueChange={value => handleSelectChange('color', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder='Select color' />
              </SelectTrigger>
              <SelectContent>
                {colorOptions.map(color => (
                  <SelectItem key={color} value={color}>
                    {color}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>

        <div className='space-y-2'>
          <Label htmlFor='price'>Price</Label>
          <Input
            id='price'
            name='price'
            type='number'
            min='0'
            step='0.01'
            value={formValues.price}
            onChange={handleChange}
            required
          />
        </div>

        <div className='space-y-2'>
          <Label htmlFor='image'>Image URL (Optional)</Label>
          <Input
            id='image'
            name='image'
            value={formValues.image}
            onChange={handleChange}
            placeholder='https://example.com/image.jpg (leave empty for default)'
          />
          <p className='text-xs text-muted-foreground'>
            Default image will be used if left empty
          </p>
        </div>

        <div className='space-y-2 md:col-span-2'>
          <Label htmlFor='description'>Description</Label>
          <Textarea
            id='description'
            name='description'
            value={formValues.description}
            onChange={handleChange}
            rows={4}
            required
          />
        </div>
      </div>

      <div className='flex justify-end space-x-4'>
        <Button type='button' variant='outline' onClick={onCancel}>
          Cancel
        </Button>
        <Button type='submit' disabled={loading}>
          {loading
            ? initialValues.id
              ? 'Updating...'
              : 'Adding...'
            : initialValues.id
            ? 'Update Product'
            : 'Add Product'}
        </Button>
      </div>
    </form>
  )
}
