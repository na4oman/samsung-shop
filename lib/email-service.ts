import { Resend } from 'resend'
import type { Order, User } from "./types"

// Email configuration
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@samsungdisplayshop.com"
const RESEND_API_KEY = process.env.RESEND_API_KEY

// Lazy initialization of Resend
let resend: Resend | null = null
function getResendInstance(): Resend | null {
  if (!RESEND_API_KEY) return null
  if (!resend) {
    resend = new Resend(RESEND_API_KEY)
  }
  return resend
}

interface OrderEmailData {
  order: Order
  user: User
}

// Format order items for email display
function formatOrderItems(items: any[]): string {
  return items
    .map(
      (item) =>
        `• ${item.product.name} (${item.product.model}) - Qty: ${item.quantity} - $${(
          item.price * item.quantity
        ).toFixed(2)}\n  Part #: ${item.product.partNumber}`
    )
    .join("\n")
}

// Format order items for HTML email display
function formatOrderItemsHTML(items: any[]): string {
  return items
    .map(
      (item) =>
        `<li><strong>${item.product.name}</strong> (${item.product.model})<br>
         Qty: ${item.quantity} - $${(item.price * item.quantity).toFixed(2)}<br>
         <small>Part #: ${item.product.partNumber}</small></li>`
    )
    .join("")
}

// Format address for email display
function formatAddress(address: any): string {
  return `${address.fullName}
${address.addressLine1}
${address.addressLine2 ? address.addressLine2 + "\n" : ""}${address.city}, ${address.state} ${address.postalCode}
${address.country}
Phone: ${address.phone}`
}

// Format address for HTML email display
function formatAddressHTML(address: any): string {
  return `<strong>${address.fullName}</strong><br>
${address.addressLine1}<br>
${address.addressLine2 ? address.addressLine2 + '<br>' : ''}${address.city}, ${address.state} ${address.postalCode}<br>
${address.country}<br>
Phone: ${address.phone}`
}

// Generate email content for admin notification
function generateAdminEmailContent({ order, user }: OrderEmailData): string {
  return `
New Order Received - Samsung Display Shop

ORDER DETAILS:
Order ID: ${order.id}
Status: ${order.status}
Created: ${new Date(order.createdAt).toLocaleString()}
Total: $${order.total.toFixed(2)}

CUSTOMER INFORMATION:
Name: ${user.name}
Email: ${user.email}
User ID: ${user.userId}

ITEMS ORDERED:
${formatOrderItems(order.items)}

SHIPPING ADDRESS:
${formatAddress(order.shippingAddress)}

BILLING ADDRESS:
${formatAddress(order.billingAddress)}

PAYMENT METHOD:
${order.paymentMethod}

${order.trackingNumber ? `TRACKING NUMBER: ${order.trackingNumber}` : ""}

Please process this order as soon as possible.

---
Samsung Display Shop Admin System
  `.trim()
}

// Generate HTML email content for admin notification
function generateAdminEmailHTML({ order, user }: OrderEmailData): string {
  return `
<h2>New Order Received - Samsung Display Shop</h2>

<h3>ORDER DETAILS:</h3>
<p><strong>Order ID:</strong> ${order.id}<br>
<strong>Status:</strong> ${order.status}<br>
<strong>Created:</strong> ${new Date(order.createdAt).toLocaleString()}<br>
<strong>Total:</strong> $${order.total.toFixed(2)}</p>

<h3>CUSTOMER INFORMATION:</h3>
<p><strong>Name:</strong> ${user.name}<br>
<strong>Email:</strong> ${user.email}<br>
<strong>User ID:</strong> ${user.userId}</p>

<h3>ITEMS ORDERED:</h3>
<ul>
${formatOrderItemsHTML(order.items)}
</ul>

<h3>SHIPPING ADDRESS:</h3>
<p>${formatAddressHTML(order.shippingAddress)}</p>

<h3>BILLING ADDRESS:</h3>
<p>${formatAddressHTML(order.billingAddress)}</p>

<h3>PAYMENT METHOD:</h3>
<p>${order.paymentMethod}</p>

${order.trackingNumber ? `<h3>TRACKING NUMBER:</h3><p>${order.trackingNumber}</p>` : ""}

<p><em>Please process this order as soon as possible.</em></p>

<hr>
<p><small>Samsung Display Shop Admin System</small></p>
  `.trim()
}

// Generate HTML content for customer confirmation email
function generateCustomerEmailHTML({ order, user }: OrderEmailData): string {
  return `
<h2>Order Confirmation - Samsung Display Shop</h2>

<p>Dear <strong>${user.name}</strong>,</p>

<p>Thank you for your order! We've received your order and will process it shortly.</p>

<h3>Order Details:</h3>
<p><strong>Order ID:</strong> ${order.id}<br>
<strong>Total:</strong> $${order.total.toFixed(2)}<br>
<strong>Status:</strong> ${order.status}</p>

<h3>Items:</h3>
<ul>
${formatOrderItemsHTML(order.items)}
</ul>

<p>We'll send you tracking information once your order ships.</p>

<p>Best regards,<br>
<strong>Samsung Display Shop Team</strong></p>
  `.trim()
}

// Generate email subject
function generateEmailSubject(order: Order): string {
  return `New Order #${order.id} - $${order.total.toFixed(2)} - Samsung Display Shop`
}

// Send admin notification email using Resend
export async function sendOrderNotificationEmail({ order, user }: OrderEmailData): Promise<boolean> {
  try {
    const resendInstance = getResendInstance()
    
    if (!RESEND_API_KEY || !resendInstance) {
      console.warn("RESEND_API_KEY not configured, falling back to console logging")
      const subject = generateEmailSubject(order)
      const content = generateAdminEmailContent({ order, user })
      
      console.log("=== EMAIL NOTIFICATION (MOCK) ===")
      console.log(`To: ${ADMIN_EMAIL}`)
      console.log(`Subject: ${subject}`)
      console.log(`Content:\n${content}`)
      console.log("=== END EMAIL ===")
      
      return true
    }

    const subject = generateEmailSubject(order)
    const textContent = generateAdminEmailContent({ order, user })
    const htmlContent = generateAdminEmailHTML({ order, user })

    console.log(`Sending admin notification email for order ${order.id}...`)

    const result = await resendInstance.emails.send({
      from: 'Samsung Display Shop <onboarding@resend.dev>',
      to: ADMIN_EMAIL,
      subject: subject,
      text: textContent,
      html: htmlContent,
    })

    console.log(`Admin notification email sent successfully:`, result)
    return true
  } catch (error) {
    console.error("Failed to send order notification email:", error)
    return false
  }
}

// Send customer confirmation email using Resend
export async function sendCustomerConfirmationEmail({ order, user }: OrderEmailData): Promise<boolean> {
  try {
    const resendInstance = getResendInstance()
    
    if (!RESEND_API_KEY || !resendInstance) {
      console.warn("RESEND_API_KEY not configured, falling back to console logging")
      const subject = `Order Confirmation #${order.id} - Samsung Display Shop`
      const content = `
Dear ${user.name},

Thank you for your order! We've received your order and will process it shortly.

Order Details:
Order ID: ${order.id}
Total: $${order.total.toFixed(2)}
Status: ${order.status}

Items:
${formatOrderItems(order.items)}

We'll send you tracking information once your order ships.

Best regards,
Samsung Display Shop Team
      `.trim()

      console.log("=== CUSTOMER CONFIRMATION EMAIL (MOCK) ===")
      console.log(`To: ${user.email}`)
      console.log(`Subject: ${subject}`)
      console.log(`Content:\n${content}`)
      console.log("=== END EMAIL ===")
      
      return true
    }

    const subject = `Order Confirmation #${order.id} - Samsung Display Shop`
    const textContent = `
Dear ${user.name},

Thank you for your order! We've received your order and will process it shortly.

Order Details:
Order ID: ${order.id}
Total: $${order.total.toFixed(2)}
Status: ${order.status}

Items:
${formatOrderItems(order.items)}

We'll send you tracking information once your order ships.

Best regards,
Samsung Display Shop Team
    `.trim()
    
    const htmlContent = generateCustomerEmailHTML({ order, user })

    console.log(`Sending customer confirmation email for order ${order.id}...`)

    const result = await resendInstance.emails.send({
      from: 'Samsung Display Shop <onboarding@resend.dev>',
      to: user.email,
      subject: subject,
      text: textContent,
      html: htmlContent,
    })

    console.log(`Customer confirmation email sent successfully:`, result)
    return true
  } catch (error) {
    console.error("Failed to send customer confirmation email:", error)
    return false
  }
}