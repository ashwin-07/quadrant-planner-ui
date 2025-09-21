# Google OAuth Setup Guide

This guide will help you set up Google Sign-In for the Quadrant Planner application.

## Prerequisites

- A Google Cloud Platform account
- Access to the Google Cloud Console

## Step 1: Create a Google Cloud Project

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Select a project" → "New Project"
3. Enter project name: "Quadrant Planner" (or your preferred name)
4. Click "Create"

## Step 2: Enable Google+ API

1. In the Google Cloud Console, go to "APIs & Services" → "Library"
2. Search for "Google+ API" and click on it
3. Click "Enable"

## Step 3: Create OAuth 2.0 Credentials

1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "OAuth 2.0 Client IDs"
3. If prompted, configure the OAuth consent screen first:
   - Choose "External" user type
   - Fill in the required fields:
     - App name: "Quadrant Planner"
     - User support email: your email
     - Developer contact: your email
   - Add your domain to authorized domains
   - Save and continue through the steps

4. For the OAuth client:
   - Application type: "Web application"
   - Name: "Quadrant Planner Web Client"
   - Authorized JavaScript origins:
     - `http://localhost:5173` (for development)
     - `https://yourdomain.com` (for production)
   - Authorized redirect URIs:
     - `http://localhost:5173` (for development)
     - `https://yourdomain.com` (for production)

5. Click "Create"
6. Copy the Client ID

## Step 4: Configure Environment Variables

1. Create a `.env.local` file in the project root:

```bash
VITE_GOOGLE_CLIENT_ID=your-client-id-here.apps.googleusercontent.com
```

2. Replace `your-client-id-here` with the actual Client ID from Step 3

## Step 5: Test the Integration

1. Start the development server:

```bash
npm run dev
```

2. Navigate to `http://localhost:5173`
3. You should see the login page with Google Sign-In button
4. Click "Sign in with Google" to test the integration

## Troubleshooting

### Google Sign-In Button Not Appearing

- Check that `VITE_GOOGLE_CLIENT_ID` is set correctly
- Verify the domain is added to authorized JavaScript origins
- Check browser console for errors

### "This app isn't verified" Warning

- This is normal for development
- Click "Advanced" → "Go to Quadrant Planner (unsafe)" to proceed
- For production, you'll need to verify your app with Google

### CORS Errors

- Ensure your domain is added to authorized JavaScript origins
- Check that the redirect URI matches exactly

## Production Deployment

For production deployment:

1. Add your production domain to authorized JavaScript origins
2. Add your production domain to authorized redirect URIs
3. Update the OAuth consent screen with production information
4. Consider submitting for verification to remove the "unverified app" warning

## Security Notes

- Never commit your `.env.local` file to version control
- Use environment variables in your deployment platform
- Regularly rotate your OAuth credentials
- Monitor usage in the Google Cloud Console

## Demo Mode

If you don't want to set up Google OAuth immediately, the app will work in demo mode. Users can click "Continue with Demo" to access the application with a mock user account.
