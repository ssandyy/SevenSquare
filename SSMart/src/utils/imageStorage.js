// Image storage utility for localStorage
export class ImageStorage {
  static STORAGE_KEY = 'ssmart_product_images';
  static MAX_SIZE = 1024 * 1024; // 1MB max per image
  static QUALITY = 0.8; // JPEG quality

  // Convert image to base64 with compression
  static async imageToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');

          // Calculate new dimensions (max 800px width/height)
          let { width, height } = img;
          const maxSize = 800;
          
          if (width > height) {
            if (width > maxSize) {
              height = (height * maxSize) / width;
              width = maxSize;
            }
          } else {
            if (height > maxSize) {
              width = (width * maxSize) / height;
              height = maxSize;
            }
          }

          canvas.width = width;
          canvas.height = height;

          // Draw and compress image
          ctx.drawImage(img, 0, 0, width, height);
          const compressedDataUrl = canvas.toDataURL('image/jpeg', this.QUALITY);
          
          resolve(compressedDataUrl);
        };
        img.onerror = reject;
        img.src = e.target.result;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  // Save image to localStorage
  static async saveImage(productId, file) {
    try {
      const base64 = await this.imageToBase64(file);
      const images = this.getAllImages();
      
      images[productId] = {
        data: base64,
        timestamp: Date.now(),
        filename: file.name,
        size: file.size
      };

      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(images));
      return base64;
    } catch (error) {
      console.error('Error saving image:', error);
      throw error;
    }
  }

  // Get image from localStorage
  static getImage(productId) {
    const images = this.getAllImages();
    return images[productId] || null;
  }

  // Get all images
  static getAllImages() {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      return stored ? JSON.parse(stored) : {};
    } catch (error) {
      console.error('Error reading images from localStorage:', error);
      return {};
    }
  }

  // Delete image from localStorage
  static deleteImage(productId) {
    const images = this.getAllImages();
    delete images[productId];
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(images));
  }

  // Get storage usage
  static getStorageUsage() {
    const images = this.getAllImages();
    let totalSize = 0;
    let count = 0;

    Object.values(images).forEach(image => {
      totalSize += image.data.length * 0.75; // Approximate base64 size
      count++;
    });

    return {
      count,
      totalSize: Math.round(totalSize / 1024), // KB
      totalSizeMB: Math.round((totalSize / 1024 / 1024) * 100) / 100 // MB
    };
  }

  // Clear all images
  static clearAllImages() {
    localStorage.removeItem(this.STORAGE_KEY);
  }

  // Generate thumbnail
  static async generateThumbnail(file, size = 150) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');

          canvas.width = size;
          canvas.height = size;

          // Calculate aspect ratio
          const aspectRatio = img.width / img.height;
          let drawWidth = size;
          let drawHeight = size;

          if (aspectRatio > 1) {
            drawHeight = size / aspectRatio;
          } else {
            drawWidth = size * aspectRatio;
          }

          // Center the image
          const x = (size - drawWidth) / 2;
          const y = (size - drawHeight) / 2;

          ctx.fillStyle = '#f3f4f6'; // Light gray background
          ctx.fillRect(0, 0, size, size);
          ctx.drawImage(img, x, y, drawWidth, drawHeight);

          const thumbnail = canvas.toDataURL('image/jpeg', 0.7);
          resolve(thumbnail);
        };
        img.onerror = reject;
        img.src = e.target.result;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  // Validate file
  static validateFile(file) {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!validTypes.includes(file.type)) {
      throw new Error('Invalid file type. Please upload JPEG, PNG, or WebP images.');
    }

    if (file.size > maxSize) {
      throw new Error('File too large. Please upload images smaller than 5MB.');
    }

    return true;
  }
}

// Helper function to get image URL (localStorage or fallback)
export const getProductImage = (productId, fallbackUrl = null) => {
  const storedImage = ImageStorage.getImage(productId);
  if (storedImage) {
    return storedImage.data;
  }
  return fallbackUrl || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDMwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjNGNEY2Ii8+Cjx0ZXh0IHg9IjE1MCIgeT0iMTUwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTYiIGZpbGw9IiM5Q0EzQUYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5ObyBJbWFnZTwvdGV4dD4KPC9zdmc+';
};

// Helper function to save product image
export const saveProductImage = async (productId, file) => {
  ImageStorage.validateFile(file);
  return await ImageStorage.saveImage(productId, file);
};

// Helper function to delete product image
export const deleteProductImage = async (filename) => {
  return await ImageStorage.deleteImage(filename);
};