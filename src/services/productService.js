import apiClient from './authService'

// Mock data for demo
const mockProducts = [
  {
    id: 'prod_123',
    name: 'Chanel No. 5',
    price: 1500000,
    featured: true,
    isNew: false,
    category: 'luxury',
    image: '/images/chanel-no5.jpg',
    stock: 10
  },
  {
    id: 'prod_124', 
    name: 'Dior Sauvage',
    price: 1200000,
    featured: false,
    isNew: true,
    category: 'mens',
    image: '/images/dior-sauvage.jpg',
    stock: 15
  }
]

const mockFeaturedProducts = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        data: mockProducts.filter(p => p.featured)
      })
    }, 500)
  })
}

const mockNewProducts = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        data: mockProducts.filter(p => p.isNew)
      })
    }, 500)
  })
}

// Check if we should use mock data
const shouldUseMock = () => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api'
  return API_BASE_URL.includes('localhost:3001')
}

export const productAPI = {
  // Get all products with pagination and filtering
  getProducts: (params = {}) => {
    const queryParams = new URLSearchParams({
      page: params.page || 1,
      limit: params.limit || 10,
      search: params.search || '',
      category: params.category || '',
      status: params.status || '',
      sortBy: params.sortBy || 'createdAt',
      sortOrder: params.sortOrder || 'desc',
    }).toString()
    
    if (shouldUseMock()) {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            data: {
              products: mockProducts,
              total: mockProducts.length,
              page: params.page || 1,
              limit: params.limit || 10
            }
          })
        }, 800)
      })
    }
    
    return apiClient.get(`/products?${queryParams}`)
  },

  // Get featured products
  getFeaturedProducts: () => {
    if (shouldUseMock()) {
      return mockFeaturedProducts()
    }
    return apiClient.get('/products/featured')
  },

  // Get new products
  getNewProducts: () => {
    if (shouldUseMock()) {
      return mockNewProducts()
    }
    return apiClient.get('/products/new')
  },

  // Get single product by ID
  getProduct: (id) => {
    if (shouldUseMock()) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const product = mockProducts.find(p => p.id === id)
          if (product) {
            resolve({ data: product })
          } else {
            reject({ response: { status: 404, data: { message: 'Product not found' } } })
          }
        }, 500)
      })
    }
    return apiClient.get(`/products/${id}`)
  },

  // Create new product
  createProduct: (productData) => apiClient.post('/products', productData),

  // Update existing product
  updateProduct: (id, productData) => apiClient.put(`/products/${id}`, productData),

  // Delete product
  deleteProduct: (id) => apiClient.delete(`/products/${id}`),

  // Upload product images
  uploadImages: (productId, files) => {
    const formData = new FormData()
    files.forEach((file) => {
      formData.append('images', file)
    })
    
    return apiClient.post(`/products/${productId}/images`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },

  // Delete product image
  deleteImage: (productId, imageId) => 
    apiClient.delete(`/products/${productId}/images/${imageId}`),

  // Bulk operations
  bulkImport: (file) => {
    const formData = new FormData()
    formData.append('file', file)
    
    return apiClient.post('/products/bulk-import', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },

  bulkUpdate: (updates) => apiClient.patch('/products/bulk-update', updates),

  bulkDelete: (ids) => apiClient.post('/products/bulk-delete', { ids }),

  // Categories and tags
  getCategories: () => apiClient.get('/products/categories'),
  getTags: () => apiClient.get('/products/tags'),
  
  // Inventory management
  updateStock: (id, stockData) => 
    apiClient.patch(`/products/${id}/stock`, stockData),

  // Analytics
  getProductAnalytics: (id, params = {}) => 
    apiClient.get(`/products/${id}/analytics`, { params }),
} 
