import { appwrite, appwriteConfig } from "./appwrite"
import type { Order, User } from "./types"
import { mockOrders } from "./mock-orders"
import { sendOrderNotificationEmail, sendCustomerConfirmationEmail } from "./email-service"

// Add these helper functions at the top of the file
function stringifyOrderItems(items: any[]): string {
  return JSON.stringify(items)
}

function parseOrderItems(itemsString: string): any[] {
  try {
    return JSON.parse(itemsString)
  } catch (error) {
    console.error("Error parsing order items:", error)
    return []
  }
}

function stringifyAddress(address: any): string {
  return JSON.stringify(address)
}

function parseAddress(addressString: string): any {
  try {
    return JSON.parse(addressString)
  } catch (error) {
    console.error("Error parsing address:", error)
    return null
  }
}

// Update the getOrders function to parse items and addresses
export async function getOrders(userId?: string): Promise<Order[]> {
  try {
    const queries = userId ? [`userId=${userId}`] : []

    const response = await appwrite.database.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.ordersCollectionId,
      queries,
    )

    // Parse the items and addresses strings to JSON for each order
    return response.documents.map((order: any) => ({
      ...order,
      items: typeof order.items === "string" ? parseOrderItems(order.items) : order.items,
      shippingAddress: typeof order.shippingAddress === "string" ? parseAddress(order.shippingAddress) : order.shippingAddress,
      billingAddress: typeof order.billingAddress === "string" ? parseAddress(order.billingAddress) : order.billingAddress,
    })) as Order[]
  } catch (error) {
    console.error("Error fetching orders:", error)
    // Fallback to mock data
    console.log("Falling back to mock orders data")
    if (userId) {
      return mockOrders.filter((order) => order.userId === userId)
    }
    return mockOrders
  }
}

// Update the getOrder function to parse items and addresses
export async function getOrder(id: string): Promise<Order> {
  try {
    const order: any = await appwrite.database.getDocument(appwriteConfig.databaseId, appwriteConfig.ordersCollectionId, id)

    // Parse the items and addresses strings to JSON
    return {
      ...order,
      items: typeof order.items === "string" ? parseOrderItems(order.items) : order.items,
      shippingAddress: typeof order.shippingAddress === "string" ? parseAddress(order.shippingAddress) : order.shippingAddress,
      billingAddress: typeof order.billingAddress === "string" ? parseAddress(order.billingAddress) : order.billingAddress,
    } as Order
  } catch (error) {
    console.error(`Error fetching order ${id}:`, error)
    // Fallback to mock data
    const mockOrder = mockOrders.find((o) => o.id === id)
    if (mockOrder) return mockOrder
    throw error
  }
}

// Update the createOrder function to stringify items and send email notifications
export async function createOrder(order: Omit<Order, "id">, user: User): Promise<Order> {
  try {
    // Stringify the items array and addresses before saving
    const orderToSave = {
      ...order,
      items: Array.isArray(order.items) ? stringifyOrderItems(order.items) : order.items,
      shippingAddress: typeof order.shippingAddress === 'object' ? stringifyAddress(order.shippingAddress) : order.shippingAddress,
      billingAddress: typeof order.billingAddress === 'object' ? stringifyAddress(order.billingAddress) : order.billingAddress,
    }

    const response = await appwrite.database.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.ordersCollectionId,
      orderToSave,
    )

    // Create the complete order object
    const createdOrder: Order = {
      ...order,
      id: response.$id,
    }

    // Log order creation success
    console.log(`✅ Order created successfully in database: ${createdOrder.id}`)
    console.log(`Order total: $${createdOrder.total.toFixed(2)}`)
    console.log(`Customer: ${user.email}`)
    
    // Send email notifications (don't block order creation if emails fail)
    try {
      console.log('📧 Attempting to send email notifications...')
      
      // Send admin notification email
      await sendOrderNotificationEmail({ order: createdOrder, user })
      console.log(`✅ Admin notification email sent for order ${createdOrder.id}`)
      
      // Send customer confirmation email
      await sendCustomerConfirmationEmail({ order: createdOrder, user })
      console.log(`✅ Customer confirmation email sent for order ${createdOrder.id}`)
    } catch (emailError) {
      console.error("❌ Email notification failed:", emailError)
      // Don't throw error - order creation should succeed even if emails fail
    }

    return createdOrder
  } catch (error) {
    console.error("Error creating order:", error)
    throw error
  }
}

// Update the updateOrder function to handle items and addresses properly
export async function updateOrder(id: string, order: Partial<Order>): Promise<Order> {
  try {
    // If items or addresses are included in the update, stringify them
    const orderToUpdate: any = { ...order }
    if (orderToUpdate.items && Array.isArray(orderToUpdate.items)) {
      orderToUpdate.items = stringifyOrderItems(orderToUpdate.items)
    }
    if (orderToUpdate.shippingAddress && typeof orderToUpdate.shippingAddress === 'object') {
      orderToUpdate.shippingAddress = stringifyAddress(orderToUpdate.shippingAddress)
    }
    if (orderToUpdate.billingAddress && typeof orderToUpdate.billingAddress === 'object') {
      orderToUpdate.billingAddress = stringifyAddress(orderToUpdate.billingAddress)
    }

    const response: any = await appwrite.database.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.ordersCollectionId,
      id,
      orderToUpdate,
    )

    // Parse the items and addresses in the response
    return {
      ...response,
      items: typeof response.items === "string" ? parseOrderItems(response.items) : response.items,
      shippingAddress: typeof response.shippingAddress === "string" ? parseAddress(response.shippingAddress) : response.shippingAddress,
      billingAddress: typeof response.billingAddress === "string" ? parseAddress(response.billingAddress) : response.billingAddress,
    } as Order
  } catch (error) {
    console.error(`Error updating order ${id}:`, error)
    throw error
  }
}

