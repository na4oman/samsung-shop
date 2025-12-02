# Email Notification Setup

This document explains how to set up email notifications for order confirmations in the Samsung Display Shop.

## Overview

When a customer completes an order, the system will:
1. Save the order to the Appwrite database
2. Send an email notification to the admin with order details
3. Send a confirmation email to the customer (optional)

## Current Implementation

The current implementation is a **mock/demo version** that logs email content to the console. To enable real email sending, you need to configure one of the supported email services.

## Supported Email Services

### 1. Resend (Recommended)

Resend is a modern email API that's easy to set up and reliable.

```bash
npm install resend
```

**Environment Variables:**
```env
RESEND_API_KEY=your-resend-api-key
ADMIN_EMAIL=admin@yourdomain.com
```

**Code Update in `lib/email-service.ts`:**
```typescript
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

// Replace the mock implementation with:
await resend.emails.send({
  from: 'Samsung Display Shop <orders@yourdomain.com>',
  to: ADMIN_EMAIL,
  subject: subject,
  text: content,
  html: content.replace(/\n/g, '<br>'),
});
```

### 2. Nodemailer with SMTP

Use any SMTP provider (Gmail, Outlook, etc.)

```bash
npm install nodemailer @types/nodemailer
```

**Environment Variables:**
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
ADMIN_EMAIL=admin@yourdomain.com
```

**Code Update in `lib/email-service.ts`:**
```typescript
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransporter({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Replace the mock implementation with:
await transporter.sendMail({
  from: `"Samsung Display Shop" <${process.env.SMTP_USER}>`,
  to: ADMIN_EMAIL,
  subject: subject,
  text: content,
  html: content.replace(/\n/g, '<br>'),
});
```

### 3. SendGrid

```bash
npm install @sendgrid/mail
```

**Environment Variables:**
```env
SENDGRID_API_KEY=your-sendgrid-api-key
ADMIN_EMAIL=admin@yourdomain.com
```

### 4. AWS SES

```bash
npm install aws-sdk
```

**Environment Variables:**
```env
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_REGION=us-east-1
ADMIN_EMAIL=admin@yourdomain.com
```

## Email Content

The admin notification email includes:
- Order ID
- Customer information (name, email)
- Order items with quantities and prices
- Total amount
- Order status
- Shipping and billing addresses
- Payment method
- Creation timestamp

## Testing

To test the email functionality:

1. **Console Logging (Current)**: Check the server console for email content
2. **Real Email**: Configure one of the services above and test with a real order

## Configuration Steps

1. Copy `.env.example` to `.env.local`
2. Fill in your email service credentials
3. Update `lib/email-service.ts` with your chosen service implementation
4. Test with a sample order

## Security Notes

- Never commit email credentials to version control
- Use environment variables for all sensitive data
- Consider using app-specific passwords for Gmail
- Validate email addresses before sending
- Implement rate limiting for email sending

## Troubleshooting

**Common Issues:**
- Gmail: Use app-specific passwords, not your regular password
- SMTP: Check firewall settings and port availability
- API Keys: Ensure they have proper permissions
- Domain: Some services require domain verification

**Debug Steps:**
1. Check environment variables are loaded
2. Verify network connectivity
3. Check service-specific logs
4. Test with a simple email first