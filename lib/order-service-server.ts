import { appwriteServer } from "./appwrite-server"
import { appwriteConfig } from "./appwrite"
import type { Order, User } from "./types"
import { sendOrderNotificationEmail, sendCustomerConfirmationEmail } from "./email-service"

// Helper functions
function stringifyOrderItems(items: any[]): string {
  return JSON.stringify(items)
}

function stringifyAddress(address: any): string {
  return JSON.stringify(address)
}

// Server-side order creation (for API routes)
export async function createOrderServer(order: Omit<Order, "id">, user: User): Promise<Order> {
  try {
    // Stringify the items array and addresses before saving
    const orderToSave = {
      ...order,
      items: Array.isArray(order.items) ? stringifyOrderItems(order.items) : order.items,
      shippingAddress: typeof order.shippingAddress === 'object' ? stringifyAddress(order.shippingAddress) : order.shippingAddress,
      billingAddress: typeof order.billingAddress === 'object' ? stringifyAddress(order.billingAddress) : order.billingAddress,
    }

    const response = await appwriteServer.database.createDocument(
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
    console.log(`Order total: ${createdOrder.total.toFixed(2)}`)
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
    console.error("Error creating order on server:", error)
    throw error
  }
}
