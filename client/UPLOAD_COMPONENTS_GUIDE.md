# Cloudinary Upload Components Guide

This guide explains how to use the upload components for college logos, event banners, and user profile pictures.

## Components Available

### 1. CollegeLogoUpload
Upload and store college logos in Cloudinary

**Location**: [`client/src/components/upload/CloudinaryUpload.jsx`](CloudinaryUpload.jsx)

**Props**:
- `organizationId` (number, required) - The organization/college ID
- `onUploadSuccess` (function, optional) - Callback when upload completes with the image URL

**Example Usage in Organization Registration**:
```jsx
import { CollegeLogoUpload } from "@/components/upload/CloudinaryUpload";

function OrgRegistrationForm() {
  const [logoUrl, setLogoUrl] = useState(null);

  return (
    <div>
      <CollegeLogoUpload
        organizationId={orgId}
        onUploadSuccess={(url) => setLogoUrl(url)}
      />
      {logoUrl && <img src={logoUrl} alt="College Logo" />}
    </div>
  );
}
```

### 2. EventBannerUpload
Upload and store event banners in Cloudinary

**Props**:
- `eventId` (number, required) - The event ID
- `onUploadSuccess` (function, optional) - Callback when upload completes with the image URL

**Example Usage in Event Creation**:
```jsx
import { EventBannerUpload } from "@/components/upload/CloudinaryUpload";

function CreateEventForm() {
  const [bannerUrl, setBannerUrl] = useState(null);

  return (
    <div>
      <EventBannerUpload
        eventId={eventId}
        onUploadSuccess={(url) => setBannerUrl(url)}
      />
      {bannerUrl && <img src={bannerUrl} alt="Event Banner" />}
    </div>
  );
}
```

### 3. ProfilePictureUpload
Upload and store user profile pictures in Cloudinary

**Props**:
- `onUploadSuccess` (function, optional) - Callback when upload completes with the image URL (uses authenticated user's ID automatically)

**Example Usage in Registration/Profile**:
```jsx
import { ProfilePictureUpload } from "@/components/upload/CloudinaryUpload";

function UserProfile() {
  const [profileUrl, setProfileUrl] = useState(null);

  return (
    <div>
      <ProfilePictureUpload
        onUploadSuccess={(url) => setProfileUrl(url)}
      />
      {profileUrl && (
        <img src={profileUrl} alt="Profile" className="rounded-full" />
      )}
    </div>
  );
}
```

## Hook: useCloudinaryUpload

Custom React hook for handling Cloudinary uploads programmatically

**Returns**:
```js
{
  uploadFile: async (endpoint, file, additionalData) => Promise<data>,
  loading: boolean,
  error: string | null
}
```

**Manual Upload Example**:
```jsx
import { useCloudinaryUpload } from "@/hooks/useCloudinaryUpload";

function CustomUpload() {
  const { uploadFile, loading, error } = useCloudinaryUpload();

  const handleCustomUpload = async (file) => {
    try {
      const result = await uploadFile("/college-logo", file, {
        organizationId: 1,
      });
      console.log("Upload successful:", result.logoUrl);
    } catch (err) {
      console.error("Upload failed:", err);
    }
  };

  return (
    <div>
      <button onClick={() => handleCustomUpload(file)}>
        {loading ? "Uploading..." : "Upload"}
      </button>
      {error && <p className="error">{error}</p>}
    </div>
  );
}
```

## Integration Points

### College Logo Upload
**Best place to add**: `OrgRegistrationPage.jsx`
```jsx
<CollegeLogoUpload
  organizationId={newOrgId}
  onUploadSuccess={(url) => {
    // Update organization record with logo URL after registration
  }}
/>
```

### Event Banner Upload
**Best place to add**: `EventCreationForm` or `EditEventPage`
```jsx
<EventBannerUpload
  eventId={eventId}
  onUploadSuccess={(url) => {
    // Banner automatically saved to event in database
  }}
/>
```

### User Profile Picture
**Best place to add**: `RegistrationSuccessPage.jsx` or `ProfilePage`
```jsx
<ProfilePictureUpload
  onUploadSuccess={(url) => {
    // Profile picture automatically saved to user in database
  }}
/>
```

## File Validation

All components include built-in validation:
- **Accepted formats**: PNG, JPG, WebP, GIF
- **Max file size**: 5MB
- **Client-side validation** before upload
- **Server-side validation** with detailed error messages

## Error Handling

Components handle errors gracefully:

```jsx
const { loading, error } = useCloudinaryUpload();

{error && (
  <div className="alert alert-error">
    {error}
  </div>
)}
```

Common error messages:
- "No file provided" - User didn't select a file
- "Organization ID is required" - Missing organization ID
- "Event not found" - Invalid event ID
- "User not authenticated" - Session expired
- "File upload failed" - Cloudinary error or network issue

## Features

### Image Optimization
All uploaded images are automatically:
- Converted to WebP format for faster loading
- Optimized for quality/size balance
- Resized appropriately:
  - College logos: max 500px width
  - Event banners: max 1200px width
  - Profile pictures: max 400px with face detection

### Duplicate Prevention
- Each resource gets a unique public ID: `college-{id}`, `event-{id}`, `user-{id}`
- Uploading a new image overwrites the old one automatically
- No broken image links in database

### Security
- Only authenticated users can upload
- File types validated server-side
- File size limited to 5MB
- API secrets kept on server only

## Testing Upload Components

### Test College Logo Upload
1. Go to Organization Registration page
2. Click on logo upload area
3. Select a PNG/JPG image (< 5MB)
4. Click "Upload Logo"
5. Verify image URL shows in form

### Test Event Banner Upload
1. Create a new event
2. In event form, click banner upload
3. Select event banner image
4. Click "Upload Banner"
5. Verify event has banner URL in database

### Test Profile Picture Upload
1. Complete user registration
2. Go to Registration Success or Profile page
3. Click profile picture upload
4. Select profile image
5. Verify profile picture shows on dashboard

## Troubleshooting

### Upload not working
1. Check browser console for error message
2. Verify Cloudinary credentials in server `.env`
3. Check that authentication cookie is set
4. Ensure file is valid image format
5. Verify file size < 5MB

### Image not displaying
1. Check Cloudinary URL format in error message
2. Verify image wasn't deleted from Cloudinary dashboard
3. Check CORS settings in server
4. Clear browser cache and reload

### Component not importing
1. Verify file path is correct
2. Check that `@/` alias is configured in vite.config.js
3. Ensure component file exists at specified path

## Browser Support
- Chrome/Edge: ✅ Fully supported
- Firefox: ✅ Fully supported
- Safari: ✅ Fully supported
- IE11: ❌ Not supported

## Performance Tips
1. Resize large images before uploading (use image editor)
2. Compress images using tools like TinyPNG before upload
3. Use WebP format where possible for smaller file sizes
4. Lazy load images on pages with multiple images

## Future Enhancements
- Drag-and-drop file upload
- Multiple file upload
- Image crop/edit before upload
- Upload progress indicator
- Undo/delete uploaded image option
