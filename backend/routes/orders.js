import express from 'express'
import { v4 as uuidv4 } from 'uuid'
import { verifyToken } from './auth.js'

const router = express.Router()

// Mock orders data
let orders = [
  {
    id: 'ORD-1703123456789',
    status: 'pending',
    total: 3000000,
    orderDate: new Date('2024-01-15').toISOString(),
    customerInfo: {
      firstName: 'Nguyễn',
      lastName: 'Văn A',
      email: 'user@example.com',
      phone: '0123456789',
      address: '123 Đường ABC, Quận 1, TP.HCM'
    },
    items: [
      {
        productId: 'prod_123',
        productName: 'Chanel No. 5',
        quantity: 2,
        price: 1500000,
        total: 3000000
      }
    ],
    paymentStatus: 'pending',
    shippingAddress: '123 Đường ABC, Quận 1, TP.HCM',
    trackingNumber: null,
    createdAt: new Date('2024-01-15').toISOString(),
    updatedAt: new Date('2024-01-15').toISOString()
  }
]

// Helper function to generate order ID
const generateOrderId = () => {
  return `ORD-${Date.now()}`
}

// Helper function for pagination
const paginate = (array, page, limit) => {
  const offset = (page - 1) * limit
  const paginatedItems = array.slice(offset, offset + limit)
  return {
    data: paginatedItems,
    total: array.length,
    page: parseInt(page),
    limit: parseInt(limit),
    totalPages: Math.ceil(array.length / limit)
  }
}

// POST /api/orders - Create new order
router.post('/', (req, res) => {
  try {
    const { customerInfo, items, total } = req.body

    if (!customerInfo || !items || !total) {
      return res.status(400).json({
        error: { message: 'Customer info, items, and total are required', status: 400 }
      })
    }

    const newOrder = {
      id: generateOrderId(),
      status: 'pending',
      total,
      orderDate: new Date().toISOString(),
      customerInfo,
      items,
      paymentStatus: 'pending',
      shippingAddress: customerInfo.address,
      trackingNumber: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    orders.push(newOrder)

    res.status(201).json({
      order: newOrder,
      message: 'Order created successfully'
    })
  } catch (error) {
    console.error('Create order error:', error)
    res.status(500).json({
      error: { message: 'Internal server error', status: 500 }
    })
  }
})

// GET /api/orders/users/:userId - Get user orders
router.get('/users/:userId', (req, res) => {
  try {
    const { userId } = req.params
    const { page = 1, limit = 10, status, sortBy = 'createdAt', sortOrder = 'desc' } = req.query

    // In a real app, filter by userId. For demo, return all orders
    let filteredOrders = orders

    // Filter by status if provided
    if (status) {
      filteredOrders = filteredOrders.filter(o => o.status === status)
    }

    // Sort orders
    filteredOrders.sort((a, b) => {
      const aValue = a[sortBy]
      const bValue = b[sortBy]
      if (sortOrder === 'desc') {
        return new Date(bValue) - new Date(aValue)
      }
      return new Date(aValue) - new Date(bValue)
    })

    const paginatedResult = paginate(filteredOrders, page, limit)
    res.json({
      orders: paginatedResult.data,
      ...paginatedResult
    })
  } catch (error) {
    console.error('Get user orders error:', error)
    res.status(500).json({
      error: { message: 'Internal server error', status: 500 }
    })
  }
})

// GET /api/orders/:id - Get single order
router.get('/:id', (req, res) => {
  try {
    const { id } = req.params
    const order = orders.find(o => o.id === id)

    if (!order) {
      return res.status(404).json({
        error: { message: 'Order not found', status: 404 }
      })
    }

    res.json(order)
  } catch (error) {
    console.error('Get order error:', error)
    res.status(500).json({
      error: { message: 'Internal server error', status: 500 }
    })
  }
})

// GET /api/orders - Get all orders (for admin)
router.get('/', verifyToken, (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      search, 
      status, 
      dateFrom, 
      dateTo, 
      sortBy = 'createdAt', 
      sortOrder = 'desc' 
    } = req.query

    let filteredOrders = orders

    // Filter by search (customer name or order ID)
    if (search) {
      filteredOrders = filteredOrders.filter(o => 
        o.id.toLowerCase().includes(search.toLowerCase()) ||
        `${o.customerInfo.firstName} ${o.customerInfo.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
        o.customerInfo.email.toLowerCase().includes(search.toLowerCase())
      )
    }

    // Filter by status
    if (status) {
      filteredOrders = filteredOrders.filter(o => o.status === status)
    }

    // Filter by date range
    if (dateFrom) {
      filteredOrders = filteredOrders.filter(o => new Date(o.orderDate) >= new Date(dateFrom))
    }
    if (dateTo) {
      filteredOrders = filteredOrders.filter(o => new Date(o.orderDate) <= new Date(dateTo))
    }

    // Sort orders
    filteredOrders.sort((a, b) => {
      const aValue = a[sortBy]
      const bValue = b[sortBy]
      if (sortOrder === 'desc') {
        return new Date(bValue) - new Date(aValue)
      }
      return new Date(aValue) - new Date(bValue)
    })

    const paginatedResult = paginate(filteredOrders, page, limit)
    res.json(paginatedResult)
  } catch (error) {
    console.error('Get orders error:', error)
    res.status(500).json({
      error: { message: 'Internal server error', status: 500 }
    })
  }
})

// PATCH /api/orders/:id/status - Update order status
router.patch('/:id/status', verifyToken, (req, res) => {
  try {
    const { id } = req.params
    const { status } = req.body

    if (!status) {
      return res.status(400).json({
        error: { message: 'Status is required', status: 400 }
      })
    }

    const orderIndex = orders.findIndex(o => o.id === id)
    if (orderIndex === -1) {
      return res.status(404).json({
        error: { message: 'Order not found', status: 404 }
      })
    }

    orders[orderIndex].status = status
    orders[orderIndex].updatedAt = new Date().toISOString()

    res.json({
      order: orders[orderIndex],
      message: 'Order status updated successfully'
    })
  } catch (error) {
    console.error('Update order status error:', error)
    res.status(500).json({
      error: { message: 'Internal server error', status: 500 }
    })
  }
})

// PUT /api/orders/:id - Update order
router.put('/:id', verifyToken, (req, res) => {
  try {
    const { id } = req.params
    const orderData = req.body

    const orderIndex = orders.findIndex(o => o.id === id)
    if (orderIndex === -1) {
      return res.status(404).json({
        error: { message: 'Order not found', status: 404 }
      })
    }

    orders[orderIndex] = {
      ...orders[orderIndex],
      ...orderData,
      id, // Preserve original ID
      updatedAt: new Date().toISOString()
    }

    res.json({
      order: orders[orderIndex],
      message: 'Order updated successfully'
    })
  } catch (error) {
    console.error('Update order error:', error)
    res.status(500).json({
      error: { message: 'Internal server error', status: 500 }
    })
  }
})

// DELETE /api/orders/:id - Delete order
router.delete('/:id', verifyToken, (req, res) => {
  try {
    const { id } = req.params
    const orderIndex = orders.findIndex(o => o.id === id)

    if (orderIndex === -1) {
      return res.status(404).json({
        error: { message: 'Order not found', status: 404 }
      })
    }

    orders.splice(orderIndex, 1)
    res.json({ message: 'Order deleted successfully' })
  } catch (error) {
    console.error('Delete order error:', error)
    res.status(500).json({
      error: { message: 'Internal server error', status: 500 }
    })
  }
})

// PATCH /api/orders/:id/payment-status - Update payment status
router.patch('/:id/payment-status', verifyToken, (req, res) => {
  try {
    const { id } = req.params
    const { status } = req.body

    const orderIndex = orders.findIndex(o => o.id === id)
    if (orderIndex === -1) {
      return res.status(404).json({
        error: { message: 'Order not found', status: 404 }
      })
    }

    orders[orderIndex].paymentStatus = status
    orders[orderIndex].updatedAt = new Date().toISOString()

    res.json({
      order: orders[orderIndex],
      message: 'Payment status updated successfully'
    })
  } catch (error) {
    console.error('Update payment status error:', error)
    res.status(500).json({
      error: { message: 'Internal server error', status: 500 }
    })
  }
})

// PATCH /api/orders/:id/tracking - Add tracking number
router.patch('/:id/tracking', verifyToken, (req, res) => {
  try {
    const { id } = req.params
    const { trackingNumber, carrier } = req.body

    const orderIndex = orders.findIndex(o => o.id === id)
    if (orderIndex === -1) {
      return res.status(404).json({
        error: { message: 'Order not found', status: 404 }
      })
    }

    orders[orderIndex].trackingNumber = trackingNumber
    orders[orderIndex].carrier = carrier
    orders[orderIndex].updatedAt = new Date().toISOString()

    res.json({
      order: orders[orderIndex],
      message: 'Tracking number added successfully'
    })
  } catch (error) {
    console.error('Add tracking number error:', error)
    res.status(500).json({
      error: { message: 'Internal server error', status: 500 }
    })
  }
})

export default router 
