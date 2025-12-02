"use client"

import { CardFooter } from "@/components/ui/card"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { useToast } from "@/components/ui/use-toast"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

export default function SignupPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { signup } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (password !== confirmPassword) {
      setError("Passwords don't match. Please make sure your passwords match.")
      return
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.")
      return
    }

    setIsLoading(true)

    try {
      console.log("Attempting signup with:", { email, name })
      await signup(email, password, name)
      console.log("Signup successful")
      toast({
        title: "Account created",
        description: "Your account has been created successfully.",
      })
      router.push("/")
    } catch (error: any) {
      console.error("Signup error:", error)

      // Handle different error types
      if (error.message?.includes("Network error") || error.message?.includes("Failed to fetch")) {
        setError(
          "Network error: Cannot connect to authentication service. Please try again later or use mock data mode.",
        )
      } else {
        setError(error.message || "There was an error creating your account. Please try again.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  // Function to create a mock account (bypass Appwrite)
  const handleMockSignup = () => {
    setIsLoading(true)

    if (password !== confirmPassword) {
      setError("Passwords don't match. Please make sure your passwords match.")
      setIsLoading(false)
      return
    }

    // Create a mock user
    const mockUser = {
      id: `mock-user-${Date.now()}`,
      email: email || "user@example.com",
      name: name || "Mock User",
      role: "admin", // Give admin role for testing
    }

    // Store in localStorage
    localStorage.setItem("user", JSON.stringify(mockUser))

    // Show success message
    toast({
      title: "Mock account created",
      description: "You are now signed up with mock data.",
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
          <CardTitle>Create an Account</CardTitle>
          <CardDescription>Enter your details to create a new account</CardDescription>
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
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
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
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
              />
              <p className="text-xs text-muted-foreground">Password must be at least 8 characters long</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Creating account..." : "Sign Up"}
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
                onClick={handleMockSignup}
              >
                Use Mock Data (No Authentication)
              </Button>
            </div>

            <div className="text-center text-sm">
              Already have an account?{" "}
              <Link href="/login" className="text-primary hover:underline">
                Login
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

