import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs-extra';
import sharp from 'sharp';

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadsDir = path.join(process.cwd(), 'uploads');
    fs.ensureDirSync(uploadsDir);
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

// In-memory storage for products (replace with database in production)
let products = [];
let nextId = 1;

// Get all products
router.get('/', (req, res) => {
  try {
    res.json({
      success: true,
      products: products,
      total: products.length
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch products' });
  }
});

// Get single product
router.get('/:id', (req, res) => {
  try {
    const product = products.find(p => p.id === req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }
    res.json({ success: true, product });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch product' });
  }
});

// Create new product
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { name, category, price, stock, description, status } = req.body;
    
    const productData = {
      id: nextId.toString(),
      name,
      category,
      price: parseFloat(price),
      stock: parseInt(stock),
      description,
      status: status || 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Handle image upload
    if (req.file) {
      const originalPath = req.file.path;
      const filename = req.file.filename;
      const thumbnailsDir = path.join(process.cwd(), 'uploads', 'thumbnails');
      fs.ensureDirSync(thumbnailsDir);

      // Create thumbnail
      const thumbnailPath = path.join(thumbnailsDir, `thumb-${filename}`);
      await sharp(originalPath)
        .resize(300, 300, { fit: 'inside', withoutEnlargement: true })
        .jpeg({ quality: 80 })
        .toFile(thumbnailPath);

      // Optimize original image
      const optimizedPath = path.join(path.dirname(originalPath), `opt-${filename}`);
      await sharp(originalPath)
        .resize(800, 800, { fit: 'inside', withoutEnlargement: true })
        .jpeg({ quality: 85 })
        .toFile(optimizedPath);

      // Remove original file
      await fs.remove(originalPath);

      productData.image = `/uploads/opt-${filename}`;
      productData.thumbnail = `/uploads/thumbnails/thumb-${filename}`;
    }

    products.push(productData);
    nextId++;

    res.status(201).json({
      success: true,
      product: productData,
      message: 'Product created successfully'
    });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ success: false, error: 'Failed to create product' });
  }
});

// Update product
router.put('/:id', upload.single('image'), async (req, res) => {
  try {
    const productIndex = products.findIndex(p => p.id === req.params.id);
    if (productIndex === -1) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }

    const { name, category, price, stock, description, status } = req.body;
    
    const updatedProduct = {
      ...products[productIndex],
      name,
      category,
      price: parseFloat(price),
      stock: parseInt(stock),
      description,
      status: status || 'active',
      updatedAt: new Date().toISOString()
    };

    // Handle image upload
    if (req.file) {
      const originalPath = req.file.path;
      const filename = req.file.filename;
      const thumbnailsDir = path.join(process.cwd(), 'uploads', 'thumbnails');
      fs.ensureDirSync(thumbnailsDir);

      // Create thumbnail
      const thumbnailPath = path.join(thumbnailsDir, `thumb-${filename}`);
      await sharp(originalPath)
        .resize(300, 300, { fit: 'inside', withoutEnlargement: true })
        .jpeg({ quality: 80 })
        .toFile(thumbnailPath);

      // Optimize original image
      const optimizedPath = path.join(path.dirname(originalPath), `opt-${filename}`);
      await sharp(originalPath)
        .resize(800, 800, { fit: 'inside', withoutEnlargement: true })
        .jpeg({ quality: 85 })
        .toFile(optimizedPath);

      // Remove original file
      await fs.remove(originalPath);

      // Delete old image if exists
      if (products[productIndex].image) {
        const oldImagePath = path.join(process.cwd(), products[productIndex].image.substring(1));
        const oldThumbnailPath = path.join(process.cwd(), products[productIndex].thumbnail.substring(1));
        try {
          await fs.remove(oldImagePath);
          await fs.remove(oldThumbnailPath);
        } catch (error) {
          console.log('Old image not found, skipping deletion');
        }
      }

      updatedProduct.image = `/uploads/opt-${filename}`;
      updatedProduct.thumbnail = `/uploads/thumbnails/thumb-${filename}`;
    }

    products[productIndex] = updatedProduct;

    res.json({
      success: true,
      product: updatedProduct,
      message: 'Product updated successfully'
    });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ success: false, error: 'Failed to update product' });
  }
});

// Delete product
router.delete('/:id', async (req, res) => {
  try {
    const productIndex = products.findIndex(p => p.id === req.params.id);
    if (productIndex === -1) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }

    const product = products[productIndex];

    // Delete associated images
    if (product.image) {
      const imagePath = path.join(process.cwd(), product.image.substring(1));
      const thumbnailPath = path.join(process.cwd(), product.thumbnail.substring(1));
      try {
        await fs.remove(imagePath);
        await fs.remove(thumbnailPath);
      } catch (error) {
        console.log('Image not found, skipping deletion');
      }
    }

    products.splice(productIndex, 1);

    res.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ success: false, error: 'Failed to delete product' });
  }
});

// Get product statistics
router.get('/stats/overview', (req, res) => {
  try {
    const totalProducts = products.length;
    const activeProducts = products.filter(p => p.status === 'active').length;
    const lowStockProducts = products.filter(p => p.stock < 10).length;
    const totalValue = products.reduce((sum, p) => sum + (p.price * p.stock), 0);

    res.json({
      success: true,
      stats: {
        totalProducts,
        activeProducts,
        lowStockProducts,
        totalValue: Math.round(totalValue * 100) / 100
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch statistics' });
  }
});

export default router; 