# Cloudinary Media Storage Setup Guide

This project uses Cloudinary for storing and serving media files like college logos, event banners, and user profile pictures.

## Prerequisites

- Cloudinary account (free tier available at https://cloudinary.com)
- Server running with environment variables configured

## Setup Steps

### 1. Create a Cloudinary Account

1. Go to [Cloudinary](https://cloudinary.com/users/register/free)
2. Sign up for a free account
3. Verify your email

### 2. Get Your Cloudinary Credentials

1. Log in to your Cloudinary Dashboard
2. You'll see your credentials on the dashboard:
   - **Cloud Name** - Your unique cloud name
   - **API Key** - Your API key
   - **API Secret** - Your API secret (keep this private!)

### 3. Configure Environment Variables

Add these credentials to your `.env` file:

```env
CLOUDINARY_CLOUD_NAME=your_cloud_name_here
CLOUDINARY_API_KEY=your_api_key_here
CLOUDINARY_API_SECRET=your_api_secret_here
```

## API Endpoints

### Upload College Logo
- **Endpoint**: `POST /api/upload/college-logo`
- **Authentication**: Required
- **Field Name**: `logo`
- **Body**: 
  ```json
  {
    "organizationId": 1
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "data": {
      "logoUrl": "https://res.cloudinary.com/..."
    },
    "message": "College logo uploaded successfully"
  }
  ```

### Upload Event Banner
- **Endpoint**: `POST /api/upload/event-banner`
- **Authentication**: Required
- **Field Name**: `banner`
- **Body**:
  ```json
  {
    "eventId": 1
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "data": {
      "bannerUrl": "https://res.cloudinary.com/..."
    },
    "message": "Event banner uploaded successfully"
  }
  ```

### Upload User Profile Picture
- **Endpoint**: `POST /api/upload/profile-picture`
- **Authentication**: Required (uses authenticated user's ID)
- **Field Name**: `profilePicture`
- **Body**: (empty - only file required)
- **Response**:
  ```json
  {
    "success": true,
    "data": {
      "profilePictureUrl": "https://res.cloudinary.com/..."
    },
    "message": "Profile picture uploaded successfully"
  }
  ```

## Upload Configuration

### File Restrictions
- **Allowed Formats**: JPEG, PNG, WebP, GIF
- **Max File Size**: 5MB
- **Storage Method**: Memory (processed on-the-fly)

### Cloud Storage Structure
Files are organized in Cloudinary with the following folder structure:
```
campus-event/
├── college-logos/       (College logos)
├── event-banners/       (Event banners)
└── user-profiles/       (User profile pictures)
```

### Image Optimization
- All images are automatically converted to WebP format
- Quality is set to "auto" for optimal compression
- Images are resized appropriately:
  - College logos: max 500px width
  - Event banners: max 1200px width
  - User profiles: max 400px width with face gravity
- Gravity is set to "auto" (except user profiles which use "face")

## Database Schema Updates

The following fields have been added to the database:

### User Model
- `profilePictureUrl: String?` - URL of the user's profile picture

### Event Model
- `bannerUrl: String?` - URL of the event banner

### Organization Model
- `logoUrl: String?` - Already existed, used for college logo

## Example Frontend Usage (React)

### Upload College Logo
```javascript
const uploadCollegeLogo = async (organizationId, logoFile) => {
  const formData = new FormData();
  formData.append('logo', logoFile);
  formData.append('organizationId', organizationId);

  const response = await fetch('/api/upload/college-logo', {
    method: 'POST',
    body: formData,
    credentials: 'include',
  });

  const data = await response.json();
  return data.data.logoUrl;
};
```

### Upload Event Banner
```javascript
const uploadEventBanner = async (eventId, bannerFile) => {
  const formData = new FormData();
  formData.append('banner', bannerFile);
  formData.append('eventId', eventId);

  const response = await fetch('/api/upload/event-banner', {
    method: 'POST',
    body: formData,
    credentials: 'include',
  });

  const data = await response.json();
  return data.data.bannerUrl;
};
```

### Upload User Profile Picture
```javascript
const uploadProfilePicture = async (profileFile) => {
  const formData = new FormData();
  formData.append('profilePicture', profileFile);

  const response = await fetch('/api/upload/profile-picture', {
    method: 'POST',
    body: formData,
    credentials: 'include',
  });

  const data = await response.json();
  return data.data.profilePictureUrl;
};
```

## Security Notes

1. **API Secret**: Never expose your API secret in client-side code
2. **File Validation**: The server validates file types and sizes
3. **Authentication**: All upload endpoints require authentication
4. **Public IDs**: Files are stored with specific public IDs to prevent duplicates (overwriting old images)

## Troubleshooting

### "File upload failed" Error
- Check that Cloudinary credentials are correctly set in `.env`
- Verify the file is a valid image format
- Ensure file size is under 5MB

### "Organization/Event/User not found" Error
- Verify the ID provided in the request body exists
- Check that the authenticated user has permission to update the resource

### CORS Issues
- Ensure `CLIENT_URL` is correctly configured in `.env`
- The server CORS configuration should allow requests from your frontend

### Images Not Displaying
- Verify the Cloudinary URL is accessible
- Check network tab in browser DevTools
- Ensure the image hasn't been deleted from Cloudinary dashboard

## Free Tier Limits

Cloudinary free tier includes:
- 25GB total storage
- 25GB monthly transformations
- Unlimited builds/updates
- Reasonable rate limits

For more details, see [Cloudinary Pricing](https://cloudinary.com/pricing)
