import express from 'express'
import { v4 as uuidv4 } from 'uuid'
import { verifyToken } from './auth.js'

const router = express.Router()

// Mock products data
let products = [
  {
    id: 'prod_123',
    name: 'Chanel No. 5',
    description: 'Hương thơm kinh điển của Chanel với note hoa nhài và ylang-ylang',
    price: 1500000,
    originalPrice: 1800000,
    featured: true,
    isNew: false,
    category: 'luxury',
    brand: 'Chanel',
    size: '100ml',
    stock: 10,
    images: ['/images/chanel-no5.jpg'],
    status: 'active',
    createdAt: new Date('2024-01-01').toISOString(),
    updatedAt: new Date('2024-01-01').toISOString()
  },
  {
    id: 'prod_124',
    name: 'Dior Sauvage',
    description: 'Hương thơm nam tính mạnh mẽ với note bergamot và hạt tiêu',
    price: 1200000,
    originalPrice: 1400000,
    featured: false,
    isNew: true,
    category: 'mens',
    brand: 'Dior',
    size: '100ml',
    stock: 15,
    images: ['/images/dior-sauvage.jpg'],
    status: 'active',
    createdAt: new Date('2024-01-10').toISOString(),
    updatedAt: new Date('2024-01-10').toISOString()
  },
  {
    id: 'prod_125',
    name: 'Tom Ford Black Orchid',
    description: 'Hương thơm quyến rũ với note hoa lan đen và vani',
    price: 2200000,
    originalPrice: 2500000,
    featured: true,
    isNew: true,
    category: 'unisex',
    brand: 'Tom Ford',
    size: '50ml',
    stock: 8,
    images: ['/images/tom-ford-black-orchid.jpg'],
    status: 'active',
    createdAt: new Date('2024-01-15').toISOString(),
    updatedAt: new Date('2024-01-15').toISOString()
  }
]

// Helper function for pagination
const paginate = (array, page, limit) => {
  const offset = (page - 1) * limit
  const paginatedItems = array.slice(offset, offset + limit)
  return {
    products: paginatedItems,
    total: array.length,
    page: parseInt(page),
    limit: parseInt(limit),
    totalPages: Math.ceil(array.length / limit)
  }
}

// GET /api/products - Get all products with filtering
router.get('/', (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      search, 
      category, 
      status, 
      sortBy = 'createdAt', 
      sortOrder = 'desc' 
    } = req.query

    let filteredProducts = products

    // Filter by search (name or description)
    if (search) {
      filteredProducts = filteredProducts.filter(p => 
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.description.toLowerCase().includes(search.toLowerCase()) ||
        p.brand.toLowerCase().includes(search.toLowerCase())
      )
    }

    // Filter by category
    if (category) {
      filteredProducts = filteredProducts.filter(p => p.category === category)
    }

    // Filter by status
    if (status) {
      filteredProducts = filteredProducts.filter(p => p.status === status)
    }

    // Sort products
    filteredProducts.sort((a, b) => {
      const aValue = a[sortBy]
      const bValue = b[sortBy]
      
      if (sortBy === 'price' || sortBy === 'stock') {
        return sortOrder === 'desc' ? bValue - aValue : aValue - bValue
      }
      
      if (sortOrder === 'desc') {
        return new Date(bValue) - new Date(aValue)
      }
      return new Date(aValue) - new Date(bValue)
    })

    const paginatedResult = paginate(filteredProducts, page, limit)
    res.json(paginatedResult)
  } catch (error) {
    console.error('Get products error:', error)
    res.status(500).json({
      error: { message: 'Internal server error', status: 500 }
    })
  }
})

// GET /api/products/featured - Get featured products
router.get('/featured', (req, res) => {
  try {
    const featuredProducts = products.filter(p => p.featured && p.status === 'active')
    res.json(featuredProducts)
  } catch (error) {
    console.error('Get featured products error:', error)
    res.status(500).json({
      error: { message: 'Internal server error', status: 500 }
    })
  }
})

// GET /api/products/new - Get new products
router.get('/new', (req, res) => {
  try {
    const newProducts = products.filter(p => p.isNew && p.status === 'active')
    res.json(newProducts)
  } catch (error) {
    console.error('Get new products error:', error)
    res.status(500).json({
      error: { message: 'Internal server error', status: 500 }
    })
  }
})

// GET /api/products/categories - Get product categories
router.get('/categories', (req, res) => {
  try {
    const categories = [
      { id: 'luxury', name: 'Luxury', count: products.filter(p => p.category === 'luxury').length },
      { id: 'mens', name: 'Nam giới', count: products.filter(p => p.category === 'mens').length },
      { id: 'womens', name: 'Nữ giới', count: products.filter(p => p.category === 'womens').length },
      { id: 'unisex', name: 'Unisex', count: products.filter(p => p.category === 'unisex').length }
    ]
    res.json(categories)
  } catch (error) {
    console.error('Get categories error:', error)
    res.status(500).json({
      error: { message: 'Internal server error', status: 500 }
    })
  }
})

// GET /api/products/:id - Get single product
router.get('/:id', (req, res) => {
  try {
    const { id } = req.params
    const product = products.find(p => p.id === id)

    if (!product) {
      return res.status(404).json({
        error: { message: 'Product not found', status: 404 }
      })
    }

    res.json(product)
  } catch (error) {
    console.error('Get product error:', error)
    res.status(500).json({
      error: { message: 'Internal server error', status: 500 }
    })
  }
})

// POST /api/products - Create new product
router.post('/', verifyToken, (req, res) => {
  try {
    const productData = req.body

    if (!productData.name || !productData.price) {
      return res.status(400).json({
        error: { message: 'Name and price are required', status: 400 }
      })
    }

    const newProduct = {
      id: `prod_${uuidv4()}`,
      ...productData,
      featured: productData.featured || false,
      isNew: productData.isNew || false,
      status: productData.status || 'active',
      stock: productData.stock || 0,
      images: productData.images || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    products.push(newProduct)

    res.status(201).json({
      product: newProduct,
      message: 'Product created successfully'
    })
  } catch (error) {
    console.error('Create product error:', error)
    res.status(500).json({
      error: { message: 'Internal server error', status: 500 }
    })
  }
})

// PUT /api/products/:id - Update product
router.put('/:id', verifyToken, (req, res) => {
  try {
    const { id } = req.params
    const productData = req.body

    const productIndex = products.findIndex(p => p.id === id)
    if (productIndex === -1) {
      return res.status(404).json({
        error: { message: 'Product not found', status: 404 }
      })
    }

    products[productIndex] = {
      ...products[productIndex],
      ...productData,
      id, // Preserve original ID
      updatedAt: new Date().toISOString()
    }

    res.json({
      product: products[productIndex],
      message: 'Product updated successfully'
    })
  } catch (error) {
    console.error('Update product error:', error)
    res.status(500).json({
      error: { message: 'Internal server error', status: 500 }
    })
  }
})

// DELETE /api/products/:id - Delete product
router.delete('/:id', verifyToken, (req, res) => {
  try {
    const { id } = req.params
    const productIndex = products.findIndex(p => p.id === id)

    if (productIndex === -1) {
      return res.status(404).json({
        error: { message: 'Product not found', status: 404 }
      })
    }

    products.splice(productIndex, 1)
    res.json({ message: 'Product deleted successfully' })
  } catch (error) {
    console.error('Delete product error:', error)
    res.status(500).json({
      error: { message: 'Internal server error', status: 500 }
    })
  }
})

// PATCH /api/products/:id/stock - Update product stock
router.patch('/:id/stock', verifyToken, (req, res) => {
  try {
    const { id } = req.params
    const { stock, operation } = req.body

    const productIndex = products.findIndex(p => p.id === id)
    if (productIndex === -1) {
      return res.status(404).json({
        error: { message: 'Product not found', status: 404 }
      })
    }

    if (operation === 'add') {
      products[productIndex].stock += stock
    } else if (operation === 'subtract') {
      products[productIndex].stock = Math.max(0, products[productIndex].stock - stock)
    } else {
      products[productIndex].stock = stock
    }

    products[productIndex].updatedAt = new Date().toISOString()

    res.json({
      product: products[productIndex],
      message: 'Stock updated successfully'
    })
  } catch (error) {
    console.error('Update stock error:', error)
    res.status(500).json({
      error: { message: 'Internal server error', status: 500 }
    })
  }
})

// POST /api/products/bulk-delete - Bulk delete products
router.post('/bulk-delete', verifyToken, (req, res) => {
  try {
    const { ids } = req.body

    if (!ids || !Array.isArray(ids)) {
      return res.status(400).json({
        error: { message: 'IDs array is required', status: 400 }
      })
    }

    const deletedProducts = []
    ids.forEach(id => {
      const productIndex = products.findIndex(p => p.id === id)
      if (productIndex !== -1) {
        deletedProducts.push(products[productIndex])
        products.splice(productIndex, 1)
      }
    })

    res.json({
      deletedProducts,
      message: `${deletedProducts.length} products deleted successfully`
    })
  } catch (error) {
    console.error('Bulk delete products error:', error)
    res.status(500).json({
      error: { message: 'Internal server error', status: 500 }
    })
  }
})

export default router 
