# SSMart Backend Server

This is the backend server for the SSMart e-commerce application that handles image uploads and storage.

## Features

- Image upload with automatic optimization
- Thumbnail generation
- File validation (JPEG, PNG, WebP)
- Static file serving
- CORS enabled for frontend integration

## Setup

1. **Install dependencies:**
   ```bash
   cd backend
   npm install
   ```

2. **Start the server:**
   ```bash
   npm run dev
   ```

The server will start on `http://localhost:5000`

## API Endpoints

### Upload Image
- **POST** `/api/upload-image`
- **Body:** FormData with `image` file and optional `productId`
- **Response:** 
  ```json
  {
    "success": true,
    "imageUrl": "/uploads/opt-image-123.jpg",
    "thumbnailUrl": "/uploads/thumbnails/thumb-image-123.jpg",
    "filename": "opt-image-123.jpg",
    "productId": "product123"
  }
  ```

### Delete Image
- **DELETE** `/api/delete-image/:filename`
- **Response:**
  ```json
  {
    "success": true,
    "message": "Image deleted successfully"
  }
  ```

### Get All Images
- **GET** `/api/images`
- **Response:**
  ```json
  {
    "images": [
      {
        "filename": "opt-image-123.jpg",
        "url": "/uploads/opt-image-123.jpg",
        "thumbnailUrl": "/uploads/thumbnails/thumb-image-123.jpg",
        "uploadedAt": "2024-01-01T00:00:00.000Z"
      }
    ]
  }
  ```

### Health Check
- **GET** `/api/health`
- **Response:**
  ```json
  {
    "status": "OK",
    "message": "SSMart Backend is running"
  }
  ```

## File Structure

```
backend/
├── uploads/           # Optimized images
├── uploads/thumbnails/ # Generated thumbnails
├── server.js          # Main server file
├── package.json       # Dependencies
└── README.md         # This file
```

## Image Processing

- **Original images** are automatically optimized to max 800x800px
- **Thumbnails** are generated at 300x300px
- **File size limit:** 5MB per image
- **Supported formats:** JPEG, PNG, WebP
- **Quality:** 85% for optimized images, 80% for thumbnails

## Frontend Integration

The frontend should be configured to use `http://localhost:5000` as the API base URL. Images are served statically from the `/uploads` directory. 