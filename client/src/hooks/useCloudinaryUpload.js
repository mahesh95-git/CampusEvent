import { useCallback, useState } from "react";

/**
 * Hook for handling Cloudinary uploads
 */
export const useCloudinaryUpload = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const uploadFile = useCallback(async (endpoint, file, additionalData = {}) => {
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();

      // Determine field name based on endpoint
      let fieldName = "file";
      if (endpoint.includes("college-logo")) {
        fieldName = "logo";
      } else if (endpoint.includes("event-banner")) {
        fieldName = "banner";
      } else if (endpoint.includes("profile-picture")) {
        fieldName = "profilePicture";
      }

      formData.append(fieldName, file);

      // Append additional data
      Object.entries(additionalData).forEach(([key, value]) => {
        formData.append(key, value);
      });

      const response = await fetch(`/api/upload${endpoint}`, {
        method: "POST",
        body: formData,
        credentials: "include",
      });
      console.log("Upload response status:", response);

      if (!response.ok) {
        try {
          const errorData = await response.json();
          throw new Error(errorData.message || `Upload failed with status ${response.status}`);
        } catch (parseErr) {
          throw new Error(`Upload failed with status ${response.status}`);
        }
      }

      try {
        const data = await response.json();
        setLoading(false);
        return data.data;
      } catch (parseErr) {
        throw new Error("Invalid response from server");
      }
    } catch (err) {
      const errorMsg = err.message || "File upload failed";
      setError(errorMsg);
      setLoading(false);
      throw err;
    }
  }, []);

  return { uploadFile, loading, error };
};
