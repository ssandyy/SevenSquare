import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye, 
  MoreHorizontal,
  Package,
  DollarSign,
  TrendingUp,
  AlertCircle,
  Loader2,
  Upload,
  Image as ImageIcon,
  Link as LinkIcon,
  X
} from 'lucide-react';
import { productsService } from '../../services/adminService';
import { useContext } from 'react';
import { ProductContext } from '../../contexts/ProductContext';
import { saveProductImage, getProductImage, deleteProductImage } from '../../utils/imageStorage';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [imageUploading, setImageUploading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    stock: '',
    description: '',
    status: 'active'
  });
  
  // Multiple images state
  const [productImages, setProductImages] = useState([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [showUrlInput, setShowUrlInput] = useState(false);

  // Get refreshProducts from ProductContext
  const { refreshProducts } = useContext(ProductContext);

  // Predefined categories with suggested images
  const predefinedCategories = [
    'Beauty Products',
    'Fragrances', 
    'Furniture',
    'Groceries'
  ];

  // Category image suggestions
  const categoryImageSuggestions = {
    'Beauty Products': [
      'https://dummyimage.com/300x200/000/fff&text=Mascara',
      'https://dummyimage.com/300x200/ff0000/fff&text=Lipstick',
      'https://dummyimage.com/300x200/800080/fff&text=Eyeshadow'
    ],
    'Fragrances': [
      'https://dummyimage.com/300x200/ff69b4/fff&text=Perfume+1',
      'https://dummyimage.com/300x200/9370db/fff&text=Perfume+2'
    ],
    'Furniture': [
      'https://dummyimage.com/300x200/8b4513/fff&text=Bed',
      'https://dummyimage.com/300x200/a0522d/fff&text=Sofa'
    ],
    'Groceries': [
      'https://dummyimage.com/300x200/ff0000/fff&text=Apple',
      'https://dummyimage.com/300x200/ffff00/000&text=Banana'
    ]
  };

  // Sample product data for each category
  const sampleProducts = {
    'Beauty Products': [
      {
        name: 'Volumizing Mascara',
        price: '29.99',
        stock: '100',
        description: 'Long-lasting volumizing mascara for dramatic lashes'
      },
      {
        name: 'Matte Lipstick',
        price: '19.99',
        stock: '75',
        description: 'Rich, matte finish lipstick in vibrant red'
      },
      {
        name: 'Eyeshadow Palette',
        price: '39.99',
        stock: '50',
        description: 'Professional eyeshadow palette with 12 shades'
      }
    ],
    'Fragrances': [
      {
        name: 'Floral Perfume',
        price: '89.99',
        stock: '30',
        description: 'Elegant floral fragrance with long-lasting scent'
      },
      {
        name: 'Luxury Perfume',
        price: '129.99',
        stock: '25',
        description: 'Premium luxury perfume with exotic notes'
      }
    ],
    'Furniture': [
      {
        name: 'Queen Size Bed',
        price: '599.99',
        stock: '10',
        description: 'Comfortable queen size bed with wooden frame'
      },
      {
        name: 'Leather Sofa',
        price: '899.99',
        stock: '8',
        description: 'Premium leather sofa for living room'
      }
    ],
    'Groceries': [
      {
        name: 'Fresh Red Apples',
        price: '4.99',
        stock: '200',
        description: 'Sweet and crisp red apples, perfect for snacking'
      },
      {
        name: 'Organic Bananas',
        price: '3.99',
        stock: '150',
        description: 'Fresh organic bananas, rich in potassium'
      }
    ]
  };

  // Fetch products on component mount
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await productsService.getAllProducts();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (file) => {
    try {
      setImageUploading(true);
      
      // Create a preview URL for immediate display
      const previewUrl = URL.createObjectURL(file);
      const newImage = {
        id: Date.now(),
        url: previewUrl,
        file: file,
        type: 'file'
      };
      
      setProductImages(prev => [...prev, newImage]);
      setSelectedImageIndex(productImages.length); // Select the new image
      
    } catch (error) {
      alert(error.message);
    } finally {
      setImageUploading(false);
    }
  };

  const handleAddImageUrl = () => {
    if (imageUrlInput.trim()) {
      const newImage = {
        id: Date.now(),
        url: imageUrlInput.trim(),
        type: 'url'
      };
      
      setProductImages(prev => [...prev, newImage]);
      setSelectedImageIndex(productImages.length); // Select the new image
      setImageUrlInput('');
      setShowUrlInput(false);
    }
  };

  const handleCategoryChange = (category) => {
    setFormData({...formData, category});
    
    // Auto-suggest images for predefined categories
    if (categoryImageSuggestions[category] && productImages.length === 0) {
      const suggestedImages = categoryImageSuggestions[category].map((url, index) => ({
        id: Date.now() + index,
        url: url,
        type: 'url'
      }));
      setProductImages(suggestedImages);
      setSelectedImageIndex(0);
    }
  };

  const addCategoryImage = (imageUrl) => {
    const newImage = {
      id: Date.now(),
      url: imageUrl,
      type: 'url'
    };
    
    setProductImages(prev => [...prev, newImage]);
    setSelectedImageIndex(productImages.length);
  };

  const handleRemoveImage = (index) => {
    const imageToRemove = productImages[index];
    
    // Clean up blob URL if it's a file
    if (imageToRemove.type === 'file' && imageToRemove.url.startsWith('blob:')) {
      URL.revokeObjectURL(imageToRemove.url);
    }
    
    setProductImages(prev => prev.filter((_, i) => i !== index));
    
    // Adjust selected index if needed
    if (selectedImageIndex >= index) {
      setSelectedImageIndex(Math.max(0, selectedImageIndex - 1));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const productData = { ...formData };
      
      if (editingProduct) {
        // If editing and new images are selected, upload them first
        if (productImages.length > 0) {
          const imageUrls = [];
          for (const image of productImages) {
            if (image.type === 'file') {
              const imageUrl = await saveProductImage(editingProduct.id, image.file);
              imageUrls.push(imageUrl);
            } else {
              imageUrls.push(image.url);
            }
          }
          productData.images = imageUrls;
          productData.image = imageUrls[0]; // Set first image as main image
        }
        await productsService.updateProduct(editingProduct.id, productData);
        setEditingProduct(null);
      } else {
        const newProduct = await productsService.addProduct(productData);
        
        // Save images if uploaded
        if (productImages.length > 0) {
          const imageUrls = [];
          for (const image of productImages) {
            if (image.type === 'file') {
              const imageUrl = await saveProductImage(newProduct.id, image.file);
              imageUrls.push(imageUrl);
            } else {
              imageUrls.push(image.url);
            }
          }
          // Update product with image URLs
          await productsService.updateProduct(newProduct.id, { 
            ...productData, 
            images: imageUrls,
            image: imageUrls[0] // Set first image as main image
          });
        }
      }
      
      setShowAddModal(false);
      resetForm();
      fetchProducts(); // Refresh admin list
      refreshProducts(); // Refresh frontend products
    } catch (error) {
      console.error('Error saving product:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        // Get the product to find its image filename
        const product = products.find(p => p.id === id);
        if (product && product.image) {
          // Extract filename from image URL
          const filename = product.image.split('/').pop();
          if (filename && filename.startsWith('opt-')) {
            await deleteProductImage(filename);
          }
        }
        
        await productsService.deleteProduct(id);
        fetchProducts(); // Refresh admin list
        refreshProducts(); // Refresh frontend products
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      category: '',
      price: '',
      stock: '',
      description: '',
      status: 'active'
    });
    
    // Clean up all blob URLs to prevent memory leaks
    productImages.forEach(image => {
      if (image.type === 'file' && image.url.startsWith('blob:')) {
        URL.revokeObjectURL(image.url);
      }
    });
    
    setProductImages([]);
    setSelectedImageIndex(0);
    setImageUrlInput('');
    setShowUrlInput(false);
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name || '',
      category: product.category || '',
      price: product.price?.toString() || '',
      stock: product.stock?.toString() || '',
      description: product.description || '',
      status: product.status || 'active'
    });
    
    // Load existing images if available
    if (product.images && product.images.length > 0) {
      const images = product.images.map((imageUrl, index) => ({
        id: index,
        url: imageUrl,
        type: 'url'
      }));
      setProductImages(images);
      setSelectedImageIndex(0);
    } else if (product.image) {
      // Fallback to single image
      setProductImages([{
        id: 0,
        url: product.image,
        type: 'url'
      }]);
      setSelectedImageIndex(0);
    } else {
      setProductImages([]);
      setSelectedImageIndex(0);
    }
    
    setShowAddModal(true);
  };

  const openAddModal = () => {
    setEditingProduct(null);
    resetForm();
    setShowAddModal(true);
  };

  const categories = ['all', ...predefinedCategories, ...Array.from(new Set(products.map(p => p.category).filter(cat => !predefinedCategories.includes(cat))))];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const stats = {
    total: products.length,
    active: products.filter(p => p.status === 'active').length,
    lowStock: products.filter(p => p.stock <= 10).length,
    totalValue: products.reduce((sum, p) => sum + (p.price * p.stock), 0)
  };

  const StatCard = ({ title, value, icon: Icon, color = 'blue' }) => (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`p-3 bg-${color}-100 rounded-lg`}>
          <Icon className={`w-6 h-6 text-${color}-600`} />
        </div>
      </div>
    </div>
  );

  const ProductCard = ({ product }) => {
    const productImage = getProductImage(product.id, product.image);
    
    return (
      <div className="bg-white rounded-lg shadow hover:shadow-md transition-shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <img 
              src={productImage} 
              alt={product.name}
              className="w-12 h-12 rounded-lg object-cover"
            />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
              <p className="text-sm text-gray-500">{product.category}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg">
              <Eye className="w-4 h-4" />
            </button>
            <button 
              className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg"
              onClick={() => openEditModal(product)}
            >
              <Edit className="w-4 h-4" />
            </button>
            <button 
              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
              onClick={() => handleDelete(product.id)}
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-sm text-gray-500">Price</p>
            <p className="text-lg font-semibold text-gray-900">₹{product.price}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Stock</p>
            <p className={`text-lg font-semibold ${product.stock <= 10 ? 'text-red-600' : 'text-gray-900'}`}>
              {product.stock} units
            </p>
          </div>
        </div>
        
        <p className="text-sm text-gray-600 mb-4">{product.description}</p>
        
        <div className="flex items-center justify-between">
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
            product.status === 'active' 
              ? 'bg-green-100 text-green-800' 
              : 'bg-gray-100 text-gray-800'
          }`}>
            {product.status}
          </span>
          {product.stock <= 10 && (
            <div className="flex items-center text-red-600 text-sm">
              <AlertCircle className="w-4 h-4 mr-1" />
              Low Stock
            </div>
          )}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        <span className="ml-2 text-gray-600">Loading products...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-600">Manage your product catalog</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={openAddModal}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Product
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Products"
          value={stats.total}
          icon={Package}
          color="blue"
        />
        <StatCard
          title="Active Products"
          value={stats.active}
          icon={TrendingUp}
          color="green"
        />
        <StatCard
          title="Low Stock Items"
          value={stats.lowStock}
          icon={AlertCircle}
          color="red"
        />
        <StatCard
          title="Total Value"
          value={`₹${stats.totalValue.toLocaleString()}`}
          icon={DollarSign}
          color="purple"
        />
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="text-sm text-gray-500">
            {filteredProducts.length} of {products.length} products
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {filteredProducts.length === 0 && !loading && (
        <div className="text-center py-12">
          <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
          <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
        </div>
      )}

      {/* Add/Edit Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              {editingProduct ? 'Edit Product' : 'Add New Product'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Multiple Image Upload Section */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Product Images
                </label>
                
                {/* Main Image Display */}
                {productImages.length > 0 && (
                  <div className="mb-4">
                    <div className="relative w-full h-64 bg-gray-100 rounded-lg overflow-hidden">
                      <img 
                        src={productImages[selectedImageIndex]?.url} 
                        alt="Main preview" 
                        className="w-full h-full object-contain"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(selectedImageIndex)}
                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Thumbnail Gallery */}
                {productImages.length > 0 && (
                  <div className="mb-4">
                    <div className="flex gap-2 overflow-x-auto pb-2">
                      {productImages.map((image, index) => (
                        <div
                          key={image.id}
                          className={`relative flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 cursor-pointer ${
                            selectedImageIndex === index ? 'border-blue-500' : 'border-gray-200'
                          }`}
                          onClick={() => setSelectedImageIndex(index)}
                        >
                          <img
                            src={image.url}
                            alt={`Thumbnail ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveImage(index);
                            }}
                            className="absolute top-0 right-0 p-0.5 bg-red-500 text-white rounded-bl text-xs hover:bg-red-600"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Image Upload Options */}
                <div className="space-y-3">
                  {/* File Upload */}
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          handleImageUpload(file);
                        }
                      }}
                      className="hidden"
                      id="image-upload"
                    />
                    <label 
                      htmlFor="image-upload"
                      className="cursor-pointer flex flex-col items-center space-y-2"
                    >
                      {imageUploading ? (
                        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                      ) : (
                        <Upload className="w-8 h-8 text-gray-400" />
                      )}
                      <div>
                        <p className="text-sm text-gray-600">
                          {imageUploading ? 'Uploading...' : 'Click to upload image'}
                        </p>
                        <p className="text-xs text-gray-500">JPEG, PNG, WebP up to 5MB</p>
                      </div>
                    </label>
                  </div>

                  {/* URL Input */}
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setShowUrlInput(!showUrlInput)}
                      className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200"
                    >
                      <LinkIcon className="w-4 h-4" />
                      Add Image URL
                    </button>
                  </div>

                  {showUrlInput && (
                    <div className="flex gap-2">
                      <input
                        type="url"
                        value={imageUrlInput}
                        onChange={(e) => setImageUrlInput(e.target.value)}
                        placeholder="Enter image URL"
                        className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                      <button
                        type="button"
                        onClick={handleAddImageUrl}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      >
                        Add
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Product Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Product Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter product name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <select
                    required
                    value={formData.category}
                    onChange={(e) => handleCategoryChange(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select a category</option>
                    {predefinedCategories.map(category => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                  
                  {/* Category Image Suggestions */}
                  {formData.category && categoryImageSuggestions[formData.category] && (
                    <div className="mt-3">
                      <p className="text-sm text-gray-600 mb-2">Suggested images for {formData.category}:</p>
                      <div className="flex gap-2 overflow-x-auto pb-2">
                        {categoryImageSuggestions[formData.category].map((imageUrl, index) => (
                          <button
                            key={index}
                            type="button"
                            onClick={() => addCategoryImage(imageUrl)}
                            className="flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 border-gray-200 hover:border-blue-500 transition-colors"
                          >
                            <img
                              src={imageUrl}
                              alt={`Suggested ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price
                  </label>
                  <input
                    type="number"
                    required
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Stock
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.stock}
                    onChange={(e) => setFormData({...formData, stock: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="0"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter product description"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              
              <div className="flex items-center justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingProduct(null);
                    resetForm();
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {editingProduct ? 'Update Product' : 'Add Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products; 