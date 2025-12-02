import { Client, Databases, ID } from 'node-appwrite'
import { appwriteConfig } from './appwrite'

// Server-side Appwrite client (uses node-appwrite)
let serverClient: Client | null = null
let serverDatabases: Databases | null = null

export const initializeServerAppwrite = () => {
  if (!serverClient) {
    try {
      const apiKey = process.env.APPWRITE_API_KEY
      
      if (!apiKey) {
        console.error('APPWRITE_API_KEY is not set in environment variables')
        throw new Error('APPWRITE_API_KEY is required for server-side operations')
      }

      serverClient = new Client()
        .setEndpoint(appwriteConfig.endpoint)
        .setProject(appwriteConfig.projectId)
        .setKey(apiKey)

      serverDatabases = new Databases(serverClient)
      
      console.log('✅ Server Appwrite client initialized successfully')
    } catch (error) {
      console.error('Failed to initialize server Appwrite client:', error)
      return { client: null, databases: null }
    }
  }
  return { client: serverClient, databases: serverDatabases }
}

export const appwriteServer = {
  database: {
    createDocument: async (
      databaseId: string,
      collectionId: string,
      data: any,
      documentId: string = ID.unique()
    ) => {
      try {
        const { databases: dbService } = initializeServerAppwrite()
        if (!dbService) {
          throw new Error('Appwrite database service not initialized')
        }

        return await dbService.createDocument(
          databaseId,
          collectionId,
          documentId,
          data
        )
      } catch (error) {
        console.error('Error creating document on server:', error)
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
        const { databases: dbService } = initializeServerAppwrite()
        if (!dbService) {
          throw new Error('Appwrite database service not initialized')
        }

        return await dbService.updateDocument(
          databaseId,
          collectionId,
          documentId,
          data
        )
      } catch (error) {
        console.error(`Error updating document ${documentId} on server:`, error)
        throw error
      }
    },
  },
}
