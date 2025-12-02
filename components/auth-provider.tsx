'use client'

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from 'react'
import type { User } from '@/lib/types'
import { appwrite, appwriteConfig } from '@/lib/appwrite'
import { ID, Query } from 'appwrite'
import { useRouter } from 'next/navigation'

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  signup: (email: string, password: string, name: string) => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  login: async () => {},
  logout: async () => {},
  signup: async () => {},
})

export function useAuth() {
  return useContext(AuthContext)
}

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  // Check if user is logged in on initial load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // First try to get user from localStorage as a fallback
        const storedUser = localStorage.getItem('user')
        if (storedUser) {
          try {
            const parsedUser = JSON.parse(storedUser)
            setUser(parsedUser)
            setIsLoading(false)
            return // Exit early if we have a user in localStorage
          } catch (e) {
            console.error('Error parsing stored user:', e)
            localStorage.removeItem('user') // Remove invalid data
          }
        }

        // Try to get the current account from Appwrite
        try {
          const account = await appwrite.auth.getAccount()

          // Try to find user in users collection
          try {
            const userDocs = await appwrite.database.listDocuments(
              appwriteConfig.databaseId,
              appwriteConfig.usersCollectionId,
              [Query.equal('userId', account.$id)]
            )

            let role: User['role'] = 'user'

            // If user exists in collection, get their role
            if (userDocs.documents.length > 0) {
              const userDoc = userDocs.documents[0] as any
              role = (
                userDoc.role === 'admin' ? 'admin' : 'user'
              ) as User['role']
            }

            // Set the user with the appropriate role
            let orders: any[] = []
            let createdAt: string = new Date().toISOString()
            if (userDocs.documents.length > 0) {
              const userDoc = userDocs.documents[0] as any
              orders = Array.isArray(userDoc.orders) ? userDoc.orders : []
              createdAt =
                typeof userDoc.createdAt === 'string'
                  ? userDoc.createdAt
                  : new Date().toISOString()
            }
            const userData: User = {
              userId: account.$id,
              email: account.email,
              name: account.name,
              role: role,
              orders,
              createdAt,
            }

            setUser(userData)
            localStorage.setItem('user', JSON.stringify(userData))
          } catch (error) {
            console.error('Error finding user document:', error)
            // If error finding user document, still set basic user data
            const userData = {
              userId: account.$id,
              email: account.email,
              name: account.name,
              role: 'user',
              orders: [],
              createdAt: new Date().toISOString(),
            }
            setUser({
              userId: account.$id,
              email: userData.email,
              name: userData.name,
              role: userData.role as User['role'],
              orders: userData.orders,
              createdAt: userData.createdAt,
            })
            localStorage.setItem('user', JSON.stringify(userData))
          }
        } catch (error) {
          // User is not logged in or network error
          console.log('User not logged in with Appwrite')
          setUser(null)
        }
      } catch (error) {
        console.error('Error checking authentication:', error)
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  // Update the login function to match the documentation pattern
  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      await appwrite.auth.createSession(email, password)
      const account = await appwrite.auth.getAccount()
      let userDoc
      try {
        const userDocs = await appwrite.database.listDocuments(
          appwriteConfig.databaseId,
          appwriteConfig.usersCollectionId,
          [Query.equal('userId', account.$id)]
        )
        if (userDocs.documents.length > 0) {
          userDoc = userDocs.documents[0]
        } else {
          userDoc = await appwrite.database.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.usersCollectionId,
            // ID.unique(),
            {
              userId: account.$id,
              email: account.email,
              name: account.name,
              role: 'user',
              orders: [],
              createdAt: new Date().toISOString(),
            }
          )
        }
      } catch (error) {
        console.error('Error checking/creating user document:', error)
      }
      const doc = userDoc as any
      const userData: User = {
        userId: account.$id,
        email: account.email,
        name: account.name,
        role: doc?.role === 'admin' ? 'admin' : 'user',
        orders: doc && Array.isArray(doc.orders) ? doc.orders : [],
        createdAt:
          doc && typeof doc.createdAt === 'string'
            ? doc.createdAt
            : new Date().toISOString(),
      }
      setUser(userData)
      localStorage.setItem('user', JSON.stringify(userData))
    } catch (error: any) {
      console.error('Login error:', error)

      // Check if it's a missing account scope error
      if (error.message?.includes('missing scope (account)')) {
        throw new Error(
          'Authentication error: Please ensure you have the required permissions.'
        )
      }
      // Check if it's a network error
      else if (
        error.message?.includes('Failed to fetch') ||
        !navigator.onLine
      ) {
        throw new Error(
          'Network error: Please check your internet connection and try again.'
        )
      } else if (error.message) {
        throw new Error(error.message)
      } else if (error.response) {
        throw new Error(
          `Login failed: ${error.response.message || 'Invalid credentials'}`
        )
      } else {
        throw new Error('Failed to login. Please try again.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  // Update the signup function to match the documentation pattern
  const signup = async (email: string, password: string, name: string) => {
    setIsLoading(true)
    try {
      const account = await appwrite.auth.createAccount(email, password, name)
      await appwrite.auth.createSession(email, password)
      let userDoc
      try {
        userDoc = await appwrite.database.createDocument(
          appwriteConfig.databaseId,
          appwriteConfig.usersCollectionId,
          // ID.unique(),
          {
            userId: account.$id,
            email: account.email,
            name: account.name,
            role: 'user',
            orders: [],
            createdAt: new Date().toISOString(),
          }
        )
      } catch (error) {
        console.error('Error creating user document:', error)
      }
      const doc = userDoc as any
      const userData: User = {
        userId: account.$id,
        email,
        name,
        role: 'user',
        orders: doc && Array.isArray(doc.orders) ? doc.orders : [],
        createdAt:
          doc && typeof doc.createdAt === 'string'
            ? doc.createdAt
            : new Date().toISOString(),
      }
      setUser(userData)
      localStorage.setItem('user', JSON.stringify(userData))
    } catch (error: any) {
      console.error('Signup error:', error)

      // Check if it's a network error
      if (error.message?.includes('Failed to fetch') || !navigator.onLine) {
        throw new Error(
          'Network error: Please check your internet connection and try again.'
        )
      } else if (error.message) {
        throw new Error(error.message)
      } else if (error.response) {
        throw new Error(
          `Signup failed: ${
            error.response.message || 'Could not create account'
          }`
        )
      } else {
        throw new Error('Failed to create account. Please try again.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  // Updated logout function to redirect to login page
  const logout = async () => {
    setIsLoading(true)
    try {
      // Delete the current session with Appwrite
      await appwrite.auth.deleteSession('current')

      // Clear the user
      setUser(null)
      localStorage.removeItem('user')

      // Redirect to login page
      router.push('/login')
    } catch (error: any) {
      console.error('Logout error:', error)
      // Even if the API call fails, still clear the local user
      setUser(null)
      localStorage.removeItem('user')

      // Redirect to login page even if there's an error
      router.push('/login')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, signup }}>
      {children}
    </AuthContext.Provider>
  )
}
