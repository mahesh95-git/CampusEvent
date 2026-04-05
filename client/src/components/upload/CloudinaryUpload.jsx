import React, { useRef, useState } from "react";
import { useCloudinaryUpload } from "@/hooks/useCloudinaryUpload";

/**
 * College Logo Upload Component
 */
export function CollegeLogoUpload({ organizationId, onUploadSuccess }) {
  const fileInputRef = useRef(null);
  const [preview, setPreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const { uploadFile, loading, error } = useCloudinaryUpload();

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        alert("Please select a valid image file");
        return;
      }

      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("File size must be less than 5MB");
        return;
      }

      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !organizationId) {
      alert("Please select a file and provide organization ID");
      return;
    }

    try {
      const result = await uploadFile("/college-logo", selectedFile, {
        organizationId,
      });

      setSelectedFile(null);
      setPreview(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      onUploadSuccess?.(result.logoUrl);
    } catch (err) {
      console.error("Upload failed:", err);
    }
  };

  return (
    <div className="space-y-4">
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
        {preview ? (
          <div className="space-y-2">
            <img src={preview} alt="Preview" className="max-w-[200px] max-h-[200px] rounded" />
            <button
              onClick={() => {
                setPreview(null);
                setSelectedFile(null);
              }}
              className="text-sm text-red-600 hover:text-red-700"
            >
              Remove
            </button>
          </div>
        ) : (
          <div className="text-center">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="text-blue-600 hover:text-blue-700 underline"
            >
              Click to upload college logo
            </button>
            <p className="text-xs text-gray-500 mt-2">PNG, JPG, WebP, GIF up to 5MB</p>
          </div>
        )}
      </div>

      {error && <p className="text-red-600 text-sm">{error}</p>}

      {selectedFile && (
        <button
          onClick={handleUpload}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Uploading..." : "Upload Logo"}
        </button>
      )}
    </div>
  );
}

/**
 * Event Banner Upload Component
 */
export function EventBannerUpload({ eventId, onUploadSuccess }) {
  const fileInputRef = useRef(null);
  const [preview, setPreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const { uploadFile, loading, error } = useCloudinaryUpload();

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        alert("Please select a valid image file");
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        alert("File size must be less than 5MB");
        return;
      }

      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Please select a file");
      return;
    }

    // If no eventId, just upload to Cloudinary without saving to DB
    if (!eventId) {
      try {
        const result = await uploadFile("/event-banner", selectedFile, {
          eventId: 0, // Use 0 as placeholder, server will handle it
        });

        setSelectedFile(null);
        setPreview(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }

        onUploadSuccess?.(result.bannerUrl);
      } catch (err) {
        console.error("Upload failed:", err);
      }
      return;
    }

    try {
      const result = await uploadFile("/event-banner", selectedFile, {
        eventId,
      });

      setSelectedFile(null);
      setPreview(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      onUploadSuccess?.(result.bannerUrl);
    } catch (err) {
      console.error("Upload failed:", err);
    }
  };

  return (
    <div className="space-y-4">
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
        {preview ? (
          <div className="space-y-2">
            <img src={preview} alt="Preview" className="max-w-full max-h-[300px] rounded" />
            <button
              onClick={() => {
                setPreview(null);
                setSelectedFile(null);
              }}
              className="text-sm text-red-600 hover:text-red-700"
            >
              Remove
            </button>
          </div>
        ) : (
          <div className="text-center">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="text-blue-600 hover:text-blue-700 underline"
            >
              Click to upload event banner
            </button>
            <p className="text-xs text-gray-500 mt-2">PNG, JPG, WebP, GIF up to 5MB</p>
          </div>
        )}
      </div>

      {error && <p className="text-red-600 text-sm">{error}</p>}

      {selectedFile && (
        <button
          onClick={handleUpload}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Uploading..." : "Upload Banner"}
        </button>
      )}
    </div>
  );
}

/**
 * User Profile Picture Upload Component
 */
export function ProfilePictureUpload({ onUploadSuccess }) {
  const fileInputRef = useRef(null);
  const [preview, setPreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const { uploadFile, loading, error } = useCloudinaryUpload();

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        alert("Please select a valid image file");
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        alert("File size must be less than 5MB");
        return;
      }

      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Please select a file");
      return;
    }

    try {
      const result = await uploadFile("/profile-picture", selectedFile);

      setSelectedFile(null);
      setPreview(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      onUploadSuccess?.(result.profilePictureUrl);
    } catch (err) {
      console.error("Upload failed:", err);
    }
  };

  return (
    <div className="space-y-4">
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
        {preview ? (
          <div className="space-y-2">
            <img
              src={preview}
              alt="Preview"
              className="w-[150px] h-[150px] rounded-full object-cover mx-auto"
            />
            <button
              onClick={() => {
                setPreview(null);
                setSelectedFile(null);
              }}
              className="text-sm text-red-600 hover:text-red-700 block mx-auto"
            >
              Remove
            </button>
          </div>
        ) : (
          <div className="text-center">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="text-blue-600 hover:text-blue-700 underline"
            >
              Click to upload profile picture
            </button>
            <p className="text-xs text-gray-500 mt-2">PNG, JPG, WebP, GIF up to 5MB</p>
          </div>
        )}
      </div>

      {error && <p className="text-red-600 text-sm">{error}</p>}

      {selectedFile && (
        <button
          onClick={handleUpload}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Uploading..." : "Upload Picture"}
        </button>
      )}
    </div>
  );
}
