# How to Get Your Appwrite API Key

You need an Appwrite API key so the server can create orders on behalf of users.

## Steps to Get API Key:

1. **Go to Appwrite Console**: https://cloud.appwrite.io/console

2. **Select your project**: `67dc35d000275a69f0ee`

3. **Click on "Settings"** in the left sidebar

4. **Click on "API Keys"** tab

5. **Click "Create API Key"** button

6. **Configure the API Key**:
   - **Name**: `Order Creation API Key`
   - **Expiration**: Never (or set a long expiration)
   - **Scopes**: Check these permissions:
     - ✅ `databases.read`
     - ✅ `databases.write`
     - ✅ `collections.read`
     - ✅ `collections.write`
     - ✅ `documents.read`
     - ✅ `documents.write`

7. **Copy the API Key** (it will only be shown once!)

8. **Add it to your `.env.local` file**:
   ```bash
   APPWRITE_API_KEY=your_api_key_here
   ```

9. **Restart your dev server**:
   ```bash
   npm run dev
   ```

## Why Do We Need This?

The API route runs on the server without a user session. The API key allows the server to perform database operations on behalf of users.

## Security Note

- Never commit the API key to git
- Keep it in `.env.local` (which is in `.gitignore`)
- The API key has full access to your database, so keep it secret!
