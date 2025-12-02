# Samsung Display Shop 🖥️

A modern, full-featured e-commerce platform for Samsung LCD and AMOLED displays built with Next.js 15, React 19, and Appwrite.

![Next.js](https://img.shields.io/badge/Next.js-15-black)
![React](https://img.shields.io/badge/React-19-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC)
![Appwrite](https://img.shields.io/badge/Appwrite-Backend-F02E65)

## 🌟 Features

### 🛍️ Shopping Experience
- **Product Catalog** - Browse extensive collection of Samsung displays
- **Advanced Filtering** - Filter by category, model, color, and price range
- **Search Functionality** - Quick product search with real-time results
- **Product Details** - Comprehensive product information with specifications
- **Shopping Cart** - Add, remove, and manage cart items
- **Favorites** - Save products for later viewing
- **Responsive Design** - Optimized for desktop, tablet, and mobile

### 👤 User Management
- **Authentication** - Secure user registration and login via Appwrite
- **User Profiles** - Manage personal information and preferences
- **Order History** - Track all past orders and their status
- **Order Details** - View detailed information for each order

### 🛒 Checkout & Orders
- **Direct Checkout** - Streamlined order process without payment gateway
- **Address Management** - Separate shipping and billing addresses
- **Order Confirmation** - Instant order confirmation with email notifications
- **Order Tracking** - Monitor order status from pending to delivered

### 📧 Email Notifications
- **Customer Emails** - Order confirmation with full details
- **Admin Notifications** - New order alerts with customer information
- **Resend Integration** - Reliable email delivery service

### 👨‍💼 Admin Panel
- **Product Management** - Add, edit, and delete products
- **Order Management** - View and update order status
- **Excel Import/Export** - Bulk product operations via Excel files
- **Dashboard** - Overview of orders and products

### 🎨 UI/UX
- **Dark/Light Mode** - Theme switching with next-themes
- **Modern Design** - Clean interface with Shadcn/ui components
- **Smooth Animations** - Enhanced user experience
- **Toast Notifications** - Real-time feedback for user actions

### 🔍 SEO Optimized
- **Dynamic Metadata** - Product-specific titles and descriptions
- **Structured Data** - Schema.org JSON-LD for rich snippets
- **Sitemap** - Auto-generated sitemap.xml
- **Robots.txt** - Proper search engine configuration
- **Open Graph** - Enhanced social media sharing

## 🚀 Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **React 19** - Latest React features
- **TypeScript 5** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Shadcn/ui** - Beautiful component library
- **Radix UI** - Accessible component primitives
- **Lucide React** - Icon library

### Backend & Services
- **Appwrite** - Backend-as-a-Service (auth, database)
- **Resend** - Email delivery service
- **Node Appwrite** - Server-side Appwrite SDK

### State Management
- **React Context API** - Global state management
- **React Hook Form** - Form handling
- **Zod** - Schema validation

### Development Tools
- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixes

## 📋 Prerequisites

- Node.js 18+ 
- npm or pnpm
- Appwrite account (cloud.appwrite.io)
- Resend account (resend.com) for emails

## 🛠️ Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/samsung-display-shop.git
cd samsung-display-shop
```

2. **Install dependencies**
```bash
npm install
# or
pnpm install
```

3. **Set up environment variables**

Create a `.env.local` file in the root directory:

```bash
# Appwrite Configuration
APPWRITE_API_KEY=your_appwrite_api_key

# Resend Configuration
RESEND_API_KEY=your_resend_api_key
ADMIN_EMAIL=admin@yourdomain.com

# Site Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

4. **Configure Appwrite**

Update `lib/appwrite.ts` with your Appwrite credentials:

```typescript
export const appwriteConfig = {
  endpoint: 'https://cloud.appwrite.io/v1',
  projectId: 'your_project_id',
  databaseId: 'your_database_id',
  productsCollectionId: 'your_products_collection_id',
  ordersCollectionId: 'your_orders_collection_id',
  usersCollectionId: 'your_users_collection_id',
}
```

5. **Run the development server**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
samsung-display-shop/
├── app/                      # Next.js App Router
│   ├── admin/               # Admin panel pages
│   ├── api/                 # API routes
│   ├── cart/                # Shopping cart page
│   ├── checkout/            # Checkout pages
│   ├── favorites/           # Favorites page
│   ├── login/               # Login page
│   ├── orders/              # Orders pages
│   ├── product/             # Product detail pages
│   ├── profile/             # User profile page
│   ├── signup/              # Signup page
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Home page
│   ├── sitemap.ts           # SEO sitemap
│   └── robots.ts            # SEO robots.txt
├── components/              # React components
│   ├── ui/                  # Shadcn/ui components
│   ├── cart-provider.tsx    # Cart context
│   ├── auth-provider.tsx    # Auth context
│   ├── favorites-provider.tsx
│   ├── header.tsx           # Site header
│   ├── footer.tsx           # Site footer
│   └── ...                  # Other components
├── lib/                     # Utility functions
│   ├── appwrite.ts          # Appwrite client
│   ├── appwrite-server.ts   # Server-side Appwrite
│   ├── order-service.ts     # Order operations
│   ├── email-service.ts     # Email operations
│   ├── product-service.ts   # Product operations
│   ├── types.ts             # TypeScript types
│   └── utils.ts             # Helper functions
├── public/                  # Static assets
├── styles/                  # Global styles
└── .env.local              # Environment variables
```

## 🔧 Configuration

### Appwrite Setup

1. **Create Appwrite Project**
   - Go to [cloud.appwrite.io](https://cloud.appwrite.io)
   - Create a new project
   - Note your Project ID

2. **Create Database & Collections**
   - Create a database
   - Create collections for: products, orders, users
   - Set up appropriate attributes and permissions

3. **Get API Key**
   - Go to Settings → API Keys
   - Create new API key with database permissions
   - Add to `.env.local`

### Resend Setup

1. **Create Resend Account**
   - Go to [resend.com](https://resend.com)
   - Sign up for an account

2. **Get API Key**
   - Go to API Keys
   - Create new API key
   - Add to `.env.local`

3. **Configure Domain** (Optional)
   - Add and verify your domain
   - Update email sender in `lib/email-service.ts`

## 📧 Email Configuration

The app sends two types of emails:

1. **Customer Confirmation** - Sent to customer after order
2. **Admin Notification** - Sent to admin for new orders

Configure in `.env.local`:
```bash
RESEND_API_KEY=your_key
ADMIN_EMAIL=admin@yourdomain.com
```

## 🎨 Customization

### Theme Colors

Edit `app/globals.css` to customize colors:

```css
:root {
  --primary: ...;
  --secondary: ...;
  /* etc */
}
```

### Components

All UI components are in `components/ui/` and can be customized using Tailwind classes.

## 📱 Features in Detail

### Product Management
- Add products via admin panel
- Import products from Excel
- Export products to Excel
- Real-time product updates

### Order Processing
1. Customer adds items to cart
2. Proceeds to checkout
3. Fills shipping/billing info
4. Clicks "Complete Order"
5. Order saved to database
6. Emails sent to customer & admin
7. Order appears in "My Orders"

### User Roles
- **Customer** - Browse, shop, order
- **Admin** - Full access to admin panel

## 🔒 Security

- Secure authentication via Appwrite
- Environment variables for sensitive data
- API routes protected with authentication
- Input validation with Zod
- XSS protection
- CSRF protection

## 🚀 Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Other Platforms

The app can be deployed to any platform supporting Next.js:
- Netlify
- Railway
- AWS
- Google Cloud
- Self-hosted

## 📊 SEO Features

- Dynamic meta tags for all pages
- Product schema (JSON-LD)
- Sitemap generation
- Robots.txt configuration
- Open Graph tags
- Twitter Card tags
- Mobile-optimized
- Fast page loads

## 🧪 Testing

```bash
# Run linting
npm run lint

# Build for production
npm run build

# Start production server
npm run start
```

## 📝 Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- Your Name - Initial work

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [Appwrite](https://appwrite.io/) - Backend services
- [Shadcn/ui](https://ui.shadcn.com/) - UI components
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Resend](https://resend.com/) - Email service

## 📞 Support

For support, email support@yourdomain.com or open an issue on GitHub.

## 🗺️ Roadmap

- [ ] Payment gateway integration (Stripe/PayPal)
- [ ] Product reviews and ratings
- [ ] Wishlist sharing
- [ ] Advanced analytics dashboard
- [ ] Multi-language support
- [ ] Product comparison feature
- [ ] Live chat support
- [ ] Mobile app (React Native)

## 📸 Screenshots

### Home Page
Browse products with advanced filtering and search.

### Product Detail
View detailed product information with specifications.

### Shopping Cart
Manage cart items before checkout.

### Checkout
Simple and secure checkout process.

### Admin Panel
Comprehensive admin dashboard for managing products and orders.

---

Made with ❤️ using Next.js and Appwrite
