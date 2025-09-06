/**
 * Image Utilities for EcoFinds
 * Handles image loading, fallbacks, and processing for the application
 */

// Default image from the web for product thumbnails
export const DEFAULT_PRODUCT_IMAGE = "https://images.unsplash.com/photo-1607083206968-13611e3d76db?q=80&w=600&auto=format&fit=crop";

// Local fallback images (if the web image fails)
export const LOCAL_PLACEHOLDER_IMAGE = "/placeholder-image.svg";
export const LOCAL_PLACEHOLDER_IMAGE_PNG = "/placeholder-image.png";

/**
 * Helper function to handle image loading errors
 * Falls back to a default image when the original source fails to load
 * 
 * @param {Event} event - The error event from the img element
 * @param {boolean} useLocal - Whether to use local fallback (true) or web fallback (false)
 */
export const handleImageError = (event, useLocal = false) => {
  const fallbackImage = useLocal ? LOCAL_PLACEHOLDER_IMAGE : DEFAULT_PRODUCT_IMAGE;
  
  // Only replace if the current src is not already the fallback
  if (event.target.src !== fallbackImage) {
    event.target.src = fallbackImage;
  }
  
  // If the web fallback fails, try the local fallback
  if (!useLocal && event.target.src === DEFAULT_PRODUCT_IMAGE) {
    event.target.onerror = (e) => handleImageError(e, true);
  } else if (useLocal && event.target.src === LOCAL_PLACEHOLDER_IMAGE) {
    // If SVG fails, try PNG
    event.target.src = LOCAL_PLACEHOLDER_IMAGE_PNG;
    event.target.onerror = null; // Stop the error cascade
  }
};

/**
 * Get appropriate image URL with fallbacks
 * 
 * @param {string} imageUrl - The original image URL
 * @param {boolean} useWeb - Whether to use web fallback (true) or local fallback (false)
 * @returns {string} - The appropriate image URL
 */
export const getImageUrl = (imageUrl, useWeb = true) => {
  return imageUrl || (useWeb ? DEFAULT_PRODUCT_IMAGE : LOCAL_PLACEHOLDER_IMAGE);
};
