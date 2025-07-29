import express from 'express';
import multer from 'multer';
import cors from 'cors';
import path from 'path';
import fs from 'fs-extra';
import sharp from 'sharp';
import { fileURLToPath } from 'url';

// Import admin routes
import authRouter from './admin/routes/auth.js';
import productsRouter from './admin/routes/products.js';
import customersRouter from './admin/routes/customers.js';
import ordersRouter from './admin/routes/orders.js';
import dashboardRouter from './admin/routes/dashboard.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
const thumbnailsDir = path.join(__dirname, 'uploads', 'thumbnails');
fs.ensureDirSync(uploadsDir);
fs.ensureDirSync(thumbnailsDir);

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG, and WebP images are allowed.'), false);
    }
  }
});

// Serve static files from uploads directory
app.use('/uploads', express.static(uploadsDir));

// Admin API Routes
app.use('/api/admin/auth', authRouter);
app.use('/api/admin/products', productsRouter);
app.use('/api/admin/customers', customersRouter);
app.use('/api/admin/orders', ordersRouter);
app.use('/api/admin/dashboard', dashboardRouter);

// Public API Routes (for frontend)
app.use('/api/products', productsRouter);
app.use('/api/customers', customersRouter);
app.use('/api/orders', ordersRouter);

// Upload image endpoint (public)
app.post('/api/upload-image', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    const originalPath = req.file.path;
    const filename = req.file.filename;
    const productId = req.body.productId || 'temp';

    // Create thumbnail
    const thumbnailPath = path.join(thumbnailsDir, `thumb-${filename}`);
    await sharp(originalPath)
      .resize(300, 300, { fit: 'inside', withoutEnlargement: true })
      .jpeg({ quality: 80 })
      .toFile(thumbnailPath);

    // Optimize original image
    const optimizedPath = path.join(uploadsDir, `opt-${filename}`);
    await sharp(originalPath)
      .resize(800, 800, { fit: 'inside', withoutEnlargement: true })
      .jpeg({ quality: 85 })
      .toFile(optimizedPath);

    // Remove original file
    await fs.remove(originalPath);

    const imageUrl = `/uploads/opt-${filename}`;
    const thumbnailUrl = `/uploads/thumbnails/thumb-${filename}`;

    res.json({
      success: true,
      imageUrl,
      thumbnailUrl,
      filename: `opt-${filename}`,
      productId
    });

  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Failed to upload image' });
  }
});

// Delete image endpoint
app.delete('/api/delete-image/:filename', async (req, res) => {
  try {
    const { filename } = req.params;
    
    const imagePath = path.join(uploadsDir, filename);
    const thumbnailPath = path.join(thumbnailsDir, `thumb-${filename}`);

    // Delete both original and thumbnail
    await fs.remove(imagePath);
    await fs.remove(thumbnailPath);

    res.json({ success: true, message: 'Image deleted successfully' });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ error: 'Failed to delete image' });
  }
});

// Get all images endpoint
app.get('/api/images', async (req, res) => {
  try {
    const files = await fs.readdir(uploadsDir);
    const imageFiles = files.filter(file => 
      /\.(jpg|jpeg|png|webp)$/i.test(file) && file.startsWith('opt-')
    );

    const images = imageFiles.map(filename => ({
      filename,
      url: `/uploads/${filename}`,
      thumbnailUrl: `/uploads/thumbnails/thumb-${filename}`,
      uploadedAt: fs.statSync(path.join(uploadsDir, filename)).mtime
    }));

    res.json({ images });
  } catch (error) {
    console.error('Error getting images:', error);
    res.status(500).json({ error: 'Failed to get images' });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'SSMart Backend is running' });
});

// Serve static files from the frontend build (dist folder at project root)
app.use(express.static(path.join(__dirname, '../dist')));

// SPA catch-all: serve index.html for all non-API, non-upload routes
app.get('*', (req, res) => {
  if (req.path.startsWith('/api') || req.path.startsWith('/uploads')) {
    return res.status(404).end();
  }
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Uploads directory: ${uploadsDir}`);
  console.log(`Admin API available at: http://localhost:${PORT}/api/admin`);
  console.log(`Public API available at: http://localhost:${PORT}/api`);
}); 