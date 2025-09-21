# Environment Setup

## API Configuration

To connect the frontend to your backend API, create a `.env.local` file in the project root with the following content:

```bash
# API Configuration
VITE_API_BASE_URL=http://localhost:8000/api/v1

# Google OAuth Configuration
VITE_GOOGLE_CLIENT_ID=your-google-client-id
```

## Configuration Details

### VITE_API_BASE_URL

- **Purpose**: Base URL for your backend API
- **Default**: `http://localhost:8000/api/v1` (matches your current backend)
- **Production**: Update to your production API URL

### VITE_GOOGLE_CLIENT_ID

- **Purpose**: Google OAuth client ID for authentication
- **Current**: Uses existing setup from previous configuration
- **Note**: Optional if using guest/demo mode

## Testing the Integration

1. **Start your backend server**: Make sure `http://localhost:8000/api/docs#/` is accessible
2. **Create the `.env.local` file** with the configuration above
3. **Restart the frontend dev server**: `npm run dev`
4. **Test Goals functionality**:
   - Navigate to Goals page
   - Try creating a new goal
   - Check browser Network tab for API calls
   - Verify data persists on page refresh

## Troubleshooting

### CORS Issues

If you see CORS errors, make sure your backend allows requests from `http://localhost:5174` (or your frontend URL).

### API Connection Issues

- Check that `VITE_API_BASE_URL` matches your backend URL exactly
- Verify your backend is running and accessible
- Check browser console for detailed error messages

### Authentication Issues

- The frontend currently handles authentication independently
- The `userId` is extracted from the logged-in user and sent with API requests
- No backend authentication tokens are required for this integration
