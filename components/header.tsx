"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ShoppingCart, Heart, Menu, X, User, Package, LogOut, Settings } from "lucide-react"
import { useState, useEffect, Suspense } from "react"
import { useCart } from "./cart-provider"
import { Badge } from "./ui/badge"
import { usePathname, useSearchParams } from "next/navigation"

import { useAuth } from "./auth-provider"
import { SearchBar } from "./search-bar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

function HeaderSearchBar() {
  const searchParams = useSearchParams()
  const currentSearch = searchParams.get('search') || ''
  return <SearchBar defaultValue={currentSearch} />
}

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { cart } = useCart()
  const { user, logout } = useAuth()
  const pathname = usePathname()

  const cartItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0)

  const isActive = (path: string) => pathname === path

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  // Debug user role
  useEffect(() => {
    if (user) {
      console.log("Current user role:", user.role)
    }
  }, [user])

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center">
          <Link href="/" className="text-xl font-bold mr-6 text-primary-foreground hover:text-primary-foreground/90">
            Samsung Display Shop
          </Link>

          <nav className="hidden md:flex items-center space-x-4">
            <Link
              href="/"
              className={`text-sm font-medium transition-colors hover:text-primary-foreground/90 ${
                isActive("/") ? "text-primary-foreground font-semibold" : "text-primary-foreground/80"
              }`}
            >
              Home
            </Link>
            {user?.role === "admin" && (
              <Link
                href="/admin"
                className={`text-sm font-medium transition-colors hover:text-primary-foreground/90 ${
                  isActive("/admin") ? "text-primary-foreground font-semibold" : "text-primary-foreground/80"
                }`}
              >
                Admin
              </Link>
            )}
          </nav>
        </div>

        {/* Search Bar - Only show on home page */}
        {pathname === "/" && (
          <div className="hidden md:flex flex-1 max-w-md mx-6">
            <Suspense fallback={<div className="h-9 bg-muted animate-pulse rounded-md"></div>}>
              <HeaderSearchBar />
            </Suspense>
          </div>
        )}

        <div className="flex items-center space-x-4">
          <Link href="/favorites">
            <Button variant="ghost" size="icon" className="text-primary-foreground hover:text-primary-foreground/90 hover:bg-primary-foreground/10">
              <Heart className="h-5 w-5" />
            </Button>
          </Link>

          <Link href="/cart">
            <Button variant="ghost" size="icon" className="relative text-primary-foreground hover:text-primary-foreground/90 hover:bg-primary-foreground/10">
              <ShoppingCart className="h-5 w-5" />
              {cartItemsCount > 0 && (
                <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 bg-secondary text-secondary-foreground">
                  {cartItemsCount}
                </Badge>
              )}
            </Button>
          </Link>

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant='ghost' size="icon" className="rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="text-primary-foreground bg-primary-foreground/20">{getInitials(user.name)}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account {user.role === "admin" && "(Admin)"}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="cursor-pointer w-full">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/orders" className="cursor-pointer w-full">
                    <Package className="mr-2 h-4 w-4" />
                    <span>Orders</span>
                  </Link>
                </DropdownMenuItem>
                {user.role === "admin" && (
                  <DropdownMenuItem asChild>
                    <Link href="/admin" className="cursor-pointer w-full">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Admin Dashboard</span>
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link href="/login">
              <Button variant="ghost" className="text-primary-foreground hover:text-primary-foreground/90 hover:bg-primary-foreground/10">Login</Button>
            </Link>
          )}

          <Button variant="ghost" size="icon" className="md:hidden text-primary-foreground hover:text-primary-foreground/90 hover:bg-primary-foreground/10" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden border-t">
          <div className="container mx-auto px-4 py-3 flex flex-col space-y-3">
            {/* Mobile Search Bar - Only show on home page */}
            {pathname === "/" && (
              <div className="mb-3">
                <Suspense fallback={<div className="h-9 bg-muted animate-pulse rounded-md"></div>}>
                  <HeaderSearchBar />
                </Suspense>
              </div>
            )}
            <Link
              href="/"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive("/") ? "text-primary" : "text-muted-foreground"
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            {user?.role === "admin" && (
              <Link
                href="/admin"
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  isActive("/admin") ? "text-primary font-semibold" : "text-muted-foreground"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Admin
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  )
}

