import { Client, Account, Databases, ID } from 'appwrite'
import { mockProducts } from './mock-data'
import { mockOrders } from './mock-orders'

export interface AppwriteConfig {
  endpoint: string
  projectId: string
  databaseId: string
  productsCollectionId: string
  ordersCollectionId: string
  usersCollectionId: string
}

// Update the appwriteConfig object with the provided credentials
export const appwriteConfig: AppwriteConfig = {
  endpoint: 'https://cloud.appwrite.io/v1',
  projectId: '67dc35d000275a69f0ee',
  databaseId: '67dc37c8003aa96d2e4a',
  productsCollectionId: '67dc37f1002491ac9e25',
  ordersCollectionId: '67dc3a8b000c147f436c',
  usersCollectionId: '67dd2311001b3c0442fa',
}

// Create a single client instance to be reused
let client: Client | null = null
let account: Account | null = null
let databases: Databases | null = null

// Update the initialization function to match Appwrite's recommended pattern
export const initializeAppwrite = () => {
  if (typeof window !== 'undefined' && !client) {
    try {
      client = new Client()
        .setEndpoint(appwriteConfig.endpoint)
        .setProject(appwriteConfig.projectId)

      // Initialize services
      account = new Account(client)
      databases = new Databases(client)
    } catch (error) {
      console.error('Failed to initialize Appwrite client:', error)
      // Return null services to trigger fallback mechanisms
      return { client: null, account: null, databases: null }
    }
  }
  return { client, account, databases }
}

// Export the appwrite object with auth and database methods
export const appwrite = {
  // Auth service
  auth: {
    createAccount: async (email: string, password: string, name: string) => {
      if (typeof window === 'undefined') {
        throw new Error('Appwrite SDK can only be used on the client side')
      }

      try {
        const { account: accountService } = initializeAppwrite()
        if (!accountService)
          throw new Error('Appwrite account service not initialized')

        return await accountService.create(ID.unique(), email, password, name)
      } catch (error) {
        console.error('Error creating account:', error)
        throw error
      }
    },
    createSession: async (email: string, password: string) => {
      if (typeof window === 'undefined') {
        throw new Error('Appwrite SDK can only be used on the client side')
      }

      try {
        const { account: accountService } = initializeAppwrite()
        if (!accountService)
          throw new Error('Appwrite account service not initialized')

        return await accountService.createEmailPasswordSession(email, password)
      } catch (error) {
        console.error('Error creating session:', error)
        throw error
      }
    },
    getAccount: async () => {
      if (typeof window === 'undefined') {
        throw new Error('Appwrite SDK can only be used on the client side')
      }

      try {
        const { account: accountService } = initializeAppwrite()
        if (!accountService)
          throw new Error('Appwrite account service not initialized')

        return await accountService.get()
      } catch (error) {
        console.error('Error getting account:', error)
        throw error
      }
    },
    deleteSession: async (sessionId = 'current') => {
      if (typeof window === 'undefined') {
        throw new Error('Appwrite SDK can only be used on the client side')
      }

      try {
        const { account: accountService } = initializeAppwrite()
        if (!accountService)
          throw new Error('Appwrite account service not initialized')

        return await accountService.deleteSession(sessionId)
      } catch (error) {
        console.error('Error deleting session:', error)
        throw error
      }
    },
  },

  // Database service
  database: {
    listDocuments: async (
      databaseId: string,
      collectionId: string,
      queries: any[] = []
    ) => {
      if (typeof window === 'undefined') {
        throw new Error('Appwrite SDK can only be used on the client side')
      }

      try {
        const { databases: dbService } = initializeAppwrite()
        if (!dbService)
          throw new Error('Appwrite database service not initialized')

        // Try to get data from Appwrite
        return await dbService.listDocuments(databaseId, collectionId, queries)
      } catch (error) {
        console.error('Error listing documents:', error)

        // Fallback to mock data if API call fails
        if (collectionId === appwriteConfig.productsCollectionId) {
          console.log('Falling back to mock products data')
          return { documents: mockProducts }
        } else if (collectionId === appwriteConfig.ordersCollectionId) {
          console.log('Falling back to mock orders data')
          return { documents: mockOrders }
        }

        // If not a known collection, rethrow the error
        throw error
      }
    },
    getDocument: async (
      databaseId: string,
      collectionId: string,
      documentId: string
    ) => {
      if (typeof window === 'undefined') {
        throw new Error('Appwrite SDK can only be used on the client side')
      }

      try {
        const { databases: dbService } = initializeAppwrite()
        if (!dbService)
          throw new Error('Appwrite database service not initialized')

        return await dbService.getDocument(databaseId, collectionId, documentId)
      } catch (error) {
        console.error(`Error getting document ${documentId}:`, error)

        // Fallback to mock data if API call fails
        if (collectionId === appwriteConfig.productsCollectionId) {
          const product = mockProducts.find(p => p.id === documentId)
          if (product) return product
        } else if (collectionId === appwriteConfig.ordersCollectionId) {
          const order = mockOrders.find(o => o.id === documentId)
          if (order) return order
        }

        throw error
      }
    },
    createDocument: async (
      databaseId: string,
      collectionId: string,
      data: any,
      documentId: string = ID.unique()
    ) => {
      try {
        // Initialize client if not already done (works on both client and server in API routes)
        if (!client) {
          client = new Client()
            .setEndpoint(appwriteConfig.endpoint)
            .setProject(appwriteConfig.projectId)
          databases = new Databases(client)
        }

        if (!databases) {
          throw new Error('Appwrite database service not initialized')
        }

        return await databases.createDocument(
          databaseId,
          collectionId,
          documentId,
          data
        )
      } catch (error) {
        console.error('Error creating document:', error)
        throw error
      }
    },
    updateDocument: async (
      databaseId: string,
      collectionId: string,
      documentId: string,
      data: any
    ) => {
      try {
        // Initialize client if not already done
        if (!client) {
          client = new Client()
            .setEndpoint(appwriteConfig.endpoint)
            .setProject(appwriteConfig.projectId)
          databases = new Databases(client)
        }

        if (!databases) {
          throw new Error('Appwrite database service not initialized')
        }

        return await databases.updateDocument(
          databaseId,
          collectionId,
          documentId,
          data
        )
      } catch (error) {
        console.error(`Error updating document ${documentId}:`, error)
        throw error
      }
    },
    deleteDocument: async (
      databaseId: string,
      collectionId: string,
      documentId: string
    ) => {
      if (typeof window === 'undefined') {
        throw new Error('Appwrite SDK can only be used on the client side')
      }

      try {
        const { databases: dbService } = initializeAppwrite()
        if (!dbService)
          throw new Error('Appwrite database service not initialized')

        return await dbService.deleteDocument(
          databaseId,
          collectionId,
          documentId
        )
      } catch (error) {
        console.error(`Error deleting document ${documentId}:`, error)
        throw error
      }
    },
  },
}
