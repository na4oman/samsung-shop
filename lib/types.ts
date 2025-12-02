export interface Product {
  id: string
  name: string
  model: string
  category: string
  color: string
  description: string
  price: number
  image: string
  partNumber: string
}

export interface CartItem {
  product: Product
  quantity: number
}

export interface OrderItem {
  product: Product
  quantity: number
  price: number
}

export type OrderStatus =
  | 'pending'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'

export interface Order {
  id: string
  userId: string
  items: OrderItem[]
  total: number
  status: OrderStatus
  createdAt: string
  updatedAt: string
  shippingAddress: Address
  billingAddress: Address
  paymentMethod: string
  trackingNumber?: string
  shippedAt?: string
  deliveredAt?: string
}

export interface Address {
  fullName: string
  addressLine1: string
  addressLine2?: string
  city: string
  state: string
  postalCode: string
  country: string
  phone: string
}

export interface User {
  userId: string
  // id: string
  email: string
  name: string
  role: 'user' | 'admin'
  createdAt: string
  orders: Order[]
}

export interface UserDocument extends Omit<User, 'id'> {
  userId: string
  createdAt: string
}

export interface ImportError {
  product: Partial<Product>
  error: string
  index: number
}

export interface ImportResult {
  successful: Product[]
  failed: ImportError[]
  totalProcessed: number
}
