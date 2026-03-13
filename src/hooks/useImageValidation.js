/**
 * useImageValidation Hook
 * Centralized image validation and uploading logic
 * Extracted from ProductList, AddProductForm, UpdateProductForm
 */

import { useState, useCallback } from "react";

export const useImageValidation = (maxSizeMB = 8) => {
  const [selectedImages, setSelectedImages] = useState([]);
  const [imageError, setImageError] = useState(null);

  const maxTotalSize = maxSizeMB * 1024 * 1024;

  // Handle image file selection with validation
  const handleImageChange = useCallback(
    (e) => {
      setImageError(null);
      let files = Array.from(e.target.files || []);

      if (files.length === 0) {
        setSelectedImages([]);
        return;
      }

      // Validate total size
      const totalSize = files.reduce((acc, file) => acc + file.size, 0);
      if (totalSize > maxTotalSize) {
        setImageError(
          `Total image size must not exceed ${maxSizeMB}MB. Current: ${(totalSize / 1024 / 1024).toFixed(2)}MB`
        );
        e.target.value = "";
        return;
      }

      // Sort images: numeric names first in numeric order, then alphabetical
      files.sort((a, b) => {
        const nameA = a.name.split(".")[0];
        const nameB = b.name.split(".")[0];

        const numA = Number(nameA);
        const numB = Number(nameB);

        const isNumA = !isNaN(numA);
        const isNumB = !isNaN(numB);

        if (isNumA && isNumB) return numA - numB;
        if (isNumA && !isNumB) return -1;
        if (!isNumA && isNumB) return 1;
        return nameA.localeCompare(nameB);
      });

      setSelectedImages(files);
    },
    [maxTotalSize, maxSizeMB]
  );

  // Remove image by index
  const removeImage = useCallback((index) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
  }, []);

  // Reset images
  const resetImages = useCallback(() => {
    setSelectedImages([]);
    setImageError(null);
  }, []);

  return {
    selectedImages,
    imageError,
    handleImageChange,
    removeImage,
    resetImages,
  };
};
