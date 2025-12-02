import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Header from "@/components/header"
import Footer from "@/components/footer"

import { Toaster } from "@/components/ui/toaster"
import CartProvider from "@/components/cart-provider"
import FavoritesProvider from "@/components/favorites-provider"
import AuthProvider from "@/components/auth-provider"
import { ProductRefreshProvider } from "@/components/product-refresh-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: {
    default: "Samsung Display Shop - LCD & AMOLED Displays",
    template: "%s | Samsung Display Shop"
  },
  description: "Shop for high-quality Samsung LCD and AMOLED displays. Browse our extensive catalog of display panels by model, category, color, and part number. Fast shipping and competitive prices.",
  keywords: [
    "Samsung displays",
    "LCD displays",
    "AMOLED displays",
    "display panels",
    "Samsung screens",
    "replacement displays",
    "display parts",
    "Samsung LCD",
    "Samsung AMOLED",
    "display shop"
  ],
  authors: [{ name: "Samsung Display Shop" }],
  creator: "Samsung Display Shop",
  publisher: "Samsung Display Shop",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    title: "Samsung Display Shop - LCD & AMOLED Displays",
    description: "Shop for high-quality Samsung LCD and AMOLED displays. Browse our extensive catalog of display panels.",
    siteName: "Samsung Display Shop",
  },
  twitter: {
    card: "summary_large_image",
    title: "Samsung Display Shop - LCD & AMOLED Displays",
    description: "Shop for high-quality Samsung LCD and AMOLED displays.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <CartProvider>
            <FavoritesProvider>
              <ProductRefreshProvider>
                <div className="flex min-h-screen flex-col">
                  <Header />
                  <main className="flex-1">{children}</main>
                  <Footer />
                </div>
                <Toaster />
              </ProductRefreshProvider>
            </FavoritesProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  )
}

