"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { useToast } from "@/components/ui/use-toast"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { login } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      console.log("Attempting login with:", email)
      await login(email, password)
      console.log("Login successful")
      toast({
        title: "Login successful",
        description: "Welcome back!",
      })
      router.push("/")
    } catch (error: any) {
      console.error("Login error:", error)

      // Handle different error types
      if (error.message?.includes("Network error") || error.message?.includes("Failed to fetch")) {
        setError(
          "Network error: Cannot connect to authentication service. Please try again later or use mock data mode.",
        )
      } else {
        setError(error.message || "Invalid email or password. Please try again.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  // Function to login with mock data (bypass Appwrite)
  const handleMockLogin = () => {
    setIsLoading(true)

    // Create a mock user
    const mockUser = {
      id: "mock-user-1",
      email: email || "user@example.com",
      name: "Mock User",
      role: "admin", // Give admin role for testing
    }

    // Store in localStorage
    localStorage.setItem("user", JSON.stringify(mockUser))

    // Show success message
    toast({
      title: "Mock login successful",
      description: "You are now logged in with mock data.",
    })

    // Redirect to home page
    setTimeout(() => {
      setIsLoading(false)
      router.push("/")
      // Force page reload to ensure auth provider picks up the localStorage change
      window.location.href = "/"
    }, 1000)
  }

  return (
    <div className="container mx-auto px-4 py-16 flex justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>Enter your credentials to access your account</CardDescription>
        </CardHeader>
        {error && (
          <div className="px-6 mb-4">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="your.email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link href="/forgot-password" className="text-sm text-primary hover:underline">
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Logging in..." : "Login"}
            </Button>

            {error && error.includes("Network error") && (
              <Alert variant="warning" className="mt-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Connection Issue</AlertTitle>
                <AlertDescription>
                  Cannot connect to authentication service. Use mock data mode below to continue.
                </AlertDescription>
              </Alert>
            )}

            <div className="text-center">
              <Button
                type="button"
                variant={error && error.includes("Network error") ? "default" : "outline"}
                className="w-full"
                onClick={handleMockLogin}
              >
                Use Mock Data (No Authentication)
              </Button>
            </div>

            <div className="text-center text-sm">
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="text-primary hover:underline">
                Sign up
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

