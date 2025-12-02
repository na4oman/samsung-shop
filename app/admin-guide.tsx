"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, CheckCircle } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { useRouter } from "next/navigation"
import { setUserAsAdmin } from "@/lib/admin-utils"

export default function AdminGuidePage() {
  const [userId, setUserId] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const { user } = useAuth()
  const router = useRouter()

  // Redirect if not admin
  if (user && user.role !== "admin") {
    router.push("/")
    return null
  }

  const handleSetAdmin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    setIsLoading(true)

    try {
      await setUserAsAdmin(userId)
      setSuccess(`User ${userId} has been successfully set as admin`)
      setUserId("")
    } catch (error: any) {
      setError(error.message || "Failed to set user as admin")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Admin User Guide</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Step-by-Step Guide to Create Admin Users</CardTitle>
            <CardDescription>Follow these steps to create and set up admin users</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h3 className="font-semibold">Step 1: Create a New User Account</h3>
              <p>First, create a new user account using the signup page.</p>
              <ol className="list-decimal list-inside space-y-1 pl-4">
                <li>
                  Go to the{" "}
                  <a href="/signup" className="text-primary hover:underline">
                    Signup page
                  </a>
                </li>
                <li>Fill in the required information (name, email, password)</li>
                <li>Complete the registration process</li>
              </ol>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold">Step 2: Get the User ID</h3>
              <p>After creating the account, you need to get the user's ID:</p>
              <ol className="list-decimal list-inside space-y-1 pl-4">
                <li>Log in with the new account</li>
                <li>Open browser developer tools (F12 or right-click and select "Inspect")</li>
                <li>Go to the "Application" tab (Chrome) or "Storage" tab (Firefox)</li>
                <li>Look for "Local Storage" and select your website domain</li>
                <li>Find the "user" item and copy the "id" value</li>
              </ol>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold">Step 3: Set User as Admin</h3>
              <p>Use the form below to set the user as an admin (requires admin privileges):</p>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold">Step 4: Verify Admin Access</h3>
              <p>After setting the user as admin:</p>
              <ol className="list-decimal list-inside space-y-1 pl-4">
                <li>Log out of the current account</li>
                <li>Log in with the newly created admin account</li>
                <li>Verify that the Admin Dashboard is accessible from the header menu</li>
                <li>
                  Check that you can access the{" "}
                  <a href="/admin" className="text-primary hover:underline">
                    Admin Dashboard
                  </a>
                </li>
              </ol>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Set User as Admin</CardTitle>
              <CardDescription>Enter the user ID to grant admin privileges</CardDescription>
            </CardHeader>
            <form onSubmit={handleSetAdmin}>
              <CardContent className="space-y-4">
                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {success && (
                  <Alert className="bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-900">
                    <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                    <AlertTitle className="text-green-800 dark:text-green-400">Success</AlertTitle>
                    <AlertDescription className="text-green-700 dark:text-green-300">{success}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Label htmlFor="userId">User ID</Label>
                  <Input
                    id="userId"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                    placeholder="Enter the user ID"
                    required
                  />
                  <p className="text-xs text-muted-foreground">This is the ID of the user you want to make an admin</p>
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" disabled={isLoading || !userId}>
                  {isLoading ? "Processing..." : "Set as Admin"}
                </Button>
              </CardFooter>
            </form>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Appwrite Console Setup</CardTitle>
              <CardDescription>Alternative method using Appwrite Console</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="font-semibold">Using Appwrite Console:</h3>
                <ol className="list-decimal list-inside space-y-1 pl-4">
                  <li>Log in to your Appwrite Console</li>
                  <li>Go to "Databases" → Select your database</li>
                  <li>Find the "users" collection</li>
                  <li>Find the user document for the user you want to make admin</li>
                  <li>Edit the document and change the "role" field to "admin"</li>
                  <li>Save the changes</li>
                  <li>The user will now have admin privileges when they log in</li>
                </ol>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

