# Testing the Direct Checkout Flow

## Prerequisites
1. Ensure you have the Resend API key configured in `.env.local`
2. Ensure Appwrite is running and the orders collection exists
3. Have a user account created (or create one via signup)

## Test Steps

### 1. Start the Development Server
```bash
npm run dev
```

### 2. Add Products to Cart
1. Navigate to the home page
2. Browse products
3. Click "Add to Cart" on one or more products
4. Verify cart icon shows item count

### 3. View Cart
1. Click on the cart icon in the header
2. Verify all added products are displayed
3. Verify quantities and prices are correct
4. Verify total is calculated correctly

### 4. Proceed to Checkout
1. Click "Proceed to Checkout" button
2. If not logged in, you'll be redirected to login page
3. Log in with your credentials
4. You should see the checkout form

### 5. Fill Checkout Form
1. Fill in shipping address:
   - Full Name
   - Phone
   - Address Line 1
   - City
   - State
   - Postal Code
   - Country (defaults to United States)

2. For billing address, either:
   - Check "Same as shipping address" (default)
   - Or uncheck and fill in separate billing address

### 6. Complete Order
1. Click "Complete Order" button
2. Button should show "Processing..." while order is being created
3. Watch the browser console for logs:
   ```
   Starting direct checkout process...
   Creating order in database...
   ✅ Order created successfully in database: [order-id]
   Order total: [amount]
   Customer: [email]
   📧 Attempting to send email notifications...
   ✅ Admin notification email sent for order [order-id]
   ✅ Customer confirmation email sent for order [order-id]
   ```

### 7. Verify Success Page
1. You should be redirected to `/checkout/success?order_id=[order-id]`
2. Verify the success page shows:
   - Green checkmark icon
   - "Order Confirmed!" message
   - Your order number
   - Confirmation message about email
   - "View My Orders" button
   - "Continue Shopping" button

### 8. Verify Cart is Cleared
1. Check the cart icon in header - should show 0 items
2. Navigate to cart page - should show "Your cart is empty"

### 9. Verify Order in Database
1. Navigate to "My Orders" page
2. Verify your new order appears in the list
3. Click on the order to view details
4. Verify all information is correct:
   - Order ID
   - Status (should be "pending")
   - Items list
   - Total amount
   - Shipping address
   - Billing address
   - Payment method (should be "Direct Order")

### 10. Verify Emails

#### Customer Email
Check the customer's email inbox for:
- Subject: "Order Confirmation #[order-id] - Samsung Display Shop"
- Order ID
- Total amount
- Order status
- List of items with details
- Message about tracking information

#### Admin Email
Check the admin email inbox (configured in ADMIN_EMAIL) for:
- Subject: "New Order #[order-id] - [total] - Samsung Display Shop"
- Complete order details
- Customer information
- Items ordered with part numbers
- Shipping and billing addresses
- Payment method

**Note:** If Resend is not configured, emails will be logged to the console instead.

## Expected Console Output

```
Starting direct checkout process...
Creating order in database...
✅ Order created successfully in database: 67a1b2c3d4e5f6g7h8i9j0k1
Order total: 299.99
Customer: customer@example.com
📧 Attempting to send email notifications...
Sending admin notification email for order 67a1b2c3d4e5f6g7h8i9j0k1...
Admin notification email sent successfully: { id: 'email-id-123' }
✅ Admin notification email sent for order 67a1b2c3d4e5f6g7h8i9j0k1
Sending customer confirmation email for order 67a1b2c3d4e5f6g7h8i9j0k1...
Customer confirmation email sent successfully: { id: 'email-id-456' }
✅ Customer confirmation email sent for order 67a1b2c3d4e5f6g7h8i9j0k1
```

## Troubleshooting

### Order Creation Fails
- Check Appwrite connection
- Verify orders collection exists
- Check browser console for error details
- Verify user is logged in

### Emails Not Received
- Check RESEND_API_KEY is set in .env.local
- Check ADMIN_EMAIL is set correctly
- Look for email logs in console
- Verify Resend account is active
- Check spam folder

### Cart Not Clearing
- Check browser console for errors
- Verify localStorage is working
- Try refreshing the page

### Success Page Shows Error
- Verify order_id is in URL
- Check if order was actually created in database
- Look for redirect issues in console

## Test Data Examples

### Sample Shipping Address
```
Full Name: John Doe
Phone: (555) 123-4567
Address Line 1: 123 Main Street
Address Line 2: Apt 4B
City: New York
State: NY
Postal Code: 10001
Country: United States
```

### Sample Billing Address
```
Full Name: John Doe
Phone: (555) 123-4567
Address Line 1: 456 Business Ave
City: New York
State: NY
Postal Code: 10002
Country: United States
```

## Success Criteria

✅ Order is created in Appwrite database
✅ Order has correct items, quantities, and total
✅ Order has correct shipping and billing addresses
✅ Order status is "pending"
✅ Payment method is "Direct Order"
✅ Customer receives confirmation email
✅ Admin receives notification email
✅ Cart is cleared after order
✅ User is redirected to success page
✅ Order appears in "My Orders" page
✅ No console errors during the process
