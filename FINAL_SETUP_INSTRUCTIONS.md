# Final Setup Instructions - Order Creation with Emails

## The Problem

The API route was getting a `401 user_unauthorized` error because it doesn't have access to the user's session. Server-side operations need an API key.

## The Solution

Use Appwrite's API key for server-side order creation.

---

## Step 1: Get Your Appwrite API Key

1. Go to **Appwrite Console**: https://cloud.appwrite.io/console
2. Select your project: `67dc35d000275a69f0ee`
3. Click **"Settings"** → **"API Keys"**
4. Click **"Create API Key"**
5. Configure:
   - **Name**: `Order Creation API Key`
   - **Expiration**: Never
   - **Scopes**: Check ALL of these:
     - ✅ `databases.read`
     - ✅ `databases.write`  
     - ✅ `collections.read`
     - ✅ `collections.write`
     - ✅ `documents.read`
     - ✅ `documents.write`
6. **Copy the API key** (shown only once!)

---

## Step 2: Add API Key to Environment Variables

Open your `.env.local` file and update it:

```bash
# Appwrite Configuration
APPWRITE_API_KEY=paste_your_api_key_here

# Resend Configuration
RESEND_API_KEY=re_6jLArPF3_KFD5Yn2qjsEaQ8RTrk4SyeV6
ADMIN_EMAIL=atanas.irikev@gmail.com

# SMTP Configuration (backup - not needed if using Resend)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

---

## Step 3: Restart Development Server

```bash
# Stop the current server (Ctrl+C)
# Then restart:
npm run dev
```

---

## Step 4: Test Order Creation

1. Add items to cart
2. Go to checkout
3. Fill in shipping/billing addresses
4. Click "Complete Order"

### Expected Console Output:

```
API Route: Creating order for user: customer@example.com
API Route: Order total: 299.99
✅ Server Appwrite client initialized successfully
✅ Order created successfully in database: [order-id]
Order total: 299.99
Customer: customer@example.com
📧 Attempting to send email notifications...
Sending admin notification email for order [order-id]...
Admin notification email sent successfully: { id: 'email-id' }
✅ Admin notification email sent for order [order-id]
Sending customer confirmation email for order [order-id]...
Customer confirmation email sent successfully: { id: 'email-id' }
✅ Customer confirmation email sent for order [order-id]
API Route: Order created successfully: [order-id]
```

---

## What Should Work Now

✅ Order saves to Appwrite database  
✅ Order appears in "My Orders" page  
✅ Cart clears after order  
✅ Redirect to success page  
✅ **Admin receives notification email**  
✅ **Customer receives confirmation email**

---

## Troubleshooting

### If you get "APPWRITE_API_KEY is required" error:
- Make sure you added the API key to `.env.local`
- Make sure you restarted the dev server
- Check that there are no typos in the variable name

### If emails don't send:
- Check that `RESEND_API_KEY` is valid
- Check that `ADMIN_EMAIL` is correct
- Look for email logs in the console
- Check your Resend dashboard for sent emails

### If order doesn't save:
- Check Appwrite console for the order
- Look for error messages in the terminal
- Verify the API key has the correct permissions

---

## Security Notes

⚠️ **Important**:
- Never commit `.env.local` to git (it's already in `.gitignore`)
- The API key has full database access - keep it secret!
- Don't share your API key in screenshots or logs

---

## Files Modified

1. `lib/appwrite-server.ts` - Server-side Appwrite client with API key
2. `lib/order-service-server.ts` - Server-side order creation
3. `app/api/orders/route.ts` - API endpoint using server-side service
4. `.env.local` - Added APPWRITE_API_KEY

---

## Next Steps After Testing

Once everything works:
1. ✅ Verify orders appear in Appwrite database
2. ✅ Verify emails are received
3. ✅ Test with different products and quantities
4. ✅ Test with different addresses
5. ✅ Check that cart clears properly

---

## Need Help?

If you're still having issues:
1. Check the browser console for client-side errors
2. Check the terminal for server-side errors
3. Verify all environment variables are set correctly
4. Make sure your Appwrite project is accessible
5. Check Resend dashboard for email delivery status
