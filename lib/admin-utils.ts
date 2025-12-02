import { appwrite, appwriteConfig } from "./appwrite"
import { Query } from "appwrite"

/**
 * Updates a user's role to admin in the database
 * @param userId The Appwrite user ID to update
 * @returns Promise that resolves when the operation is complete
 */
export async function setUserAsAdmin(userId: string): Promise<void> {
  try {
    // First, find the user document in the users collection
    const userDocs = await appwrite.database.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.usersCollectionId,
      [Query.equal("userId", userId)],
    )

    if (userDocs.documents.length === 0) {
      throw new Error("User document not found")
    }

    // Update the user's role to admin
    const userDoc = userDocs.documents[0]
    await appwrite.database.updateDocument(appwriteConfig.databaseId, appwriteConfig.usersCollectionId, userDoc.$id, {
      role: "admin",
    })

    console.log(`User ${userId} has been set as admin`)
  } catch (error) {
    console.error("Error setting user as admin:", error)
    throw error
  }
}

/**
 * Checks if a user has admin role
 * @param userId The Appwrite user ID to check
 * @returns Promise that resolves to boolean indicating if user is admin
 */
export async function isUserAdmin(userId: string): Promise<boolean> {
  try {
    const userDocs = await appwrite.database.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.usersCollectionId,
      [Query.equal("userId", userId)],
    )

    if (userDocs.documents.length === 0) {
      return false
    }

    return userDocs.documents[0].role === "admin"
  } catch (error) {
    console.error("Error checking if user is admin:", error)
    return false
  }
}

