import apiClient from './authService'

// Mock data for demo
const mockCreateOrder = (orderData) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        data: {
          order: {
            id: `ORD-${Date.now()}`,
            status: 'pending',
            total: orderData.total,
            orderDate: new Date().toISOString(),
            customerInfo: orderData.customerInfo,
            items: orderData.items,
            paymentStatus: 'pending',
            shippingAddress: orderData.customerInfo.address
          }
        }
      })
    }, 1000)
  })
}

const mockGetUserOrders = (userId, params = {}) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        data: {
          orders: [],
          total: 0,
          page: params.page || 1,
          limit: params.limit || 10
        }
      })
    }, 800)
  })
}

// Check if we should use mock data
const shouldUseMock = () => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api'
  return API_BASE_URL.includes('localhost:3001')
}

export const orderAPI = {
  // Create new order (for customer checkout)
  createOrder: (orderData) => {
    if (shouldUseMock()) {
      return mockCreateOrder(orderData)
    }
    return apiClient.post('/orders', orderData)
  },

  // Get user orders (for customer)
  getUserOrders: (userId, params = {}) => {
    if (shouldUseMock()) {
      return mockGetUserOrders(userId, params)
    }
    
    const queryParams = new URLSearchParams({
      page: params.page || 1,
      limit: params.limit || 10,
      status: params.status || '',
      sortBy: params.sortBy || 'createdAt',
      sortOrder: params.sortOrder || 'desc',
    }).toString()
    
    return apiClient.get(`/orders/users/${userId}?${queryParams}`)
  },

  // Get all orders with pagination and filtering (for admin)
  getOrders: (params = {}) => {
    const queryParams = new URLSearchParams({
      page: params.page || 1,
      limit: params.limit || 10,
      search: params.search || '',
      status: params.status || '',
      dateFrom: params.dateFrom || '',
      dateTo: params.dateTo || '',
      sortBy: params.sortBy || 'createdAt',
      sortOrder: params.sortOrder || 'desc',
    }).toString()
    
    return apiClient.get(`/orders?${queryParams}`)
  },

  // Get single order by ID
  getOrder: (id) => apiClient.get(`/orders/${id}`),

  // Update order status
  updateOrderStatus: (id, status) => 
    apiClient.patch(`/orders/${id}/status`, { status }),

  // Update order details
  updateOrder: (id, orderData) => 
    apiClient.put(`/orders/${id}`, orderData),

  // Delete order
  deleteOrder: (id) => apiClient.delete(`/orders/${id}`),

  // Order analytics
  getOrderAnalytics: (params = {}) => 
    apiClient.get('/orders/analytics', { params }),

  // Export orders
  exportOrders: (params = {}) => 
    apiClient.get('/orders/export', { 
      params,
      responseType: 'blob'
    }),

  // Get order statistics
  getOrderStats: (params = {}) => 
    apiClient.get('/orders/stats', { params }),

  // Bulk operations
  bulkUpdateStatus: (orderIds, status) => 
    apiClient.post('/orders/bulk-update-status', { orderIds, status }),

  bulkDelete: (orderIds) => 
    apiClient.post('/orders/bulk-delete', { orderIds }),

  // Shipping and tracking
  updateShipping: (id, shippingData) => 
    apiClient.patch(`/orders/${id}/shipping`, shippingData),

  addTrackingNumber: (id, trackingNumber, carrier) => 
    apiClient.patch(`/orders/${id}/tracking`, { trackingNumber, carrier }),

  // Payment related
  processRefund: (id, amount, reason) => 
    apiClient.post(`/orders/${id}/refund`, { amount, reason }),

  markAsPaid: (id) => 
    apiClient.patch(`/orders/${id}/payment-status`, { status: 'paid' }),
} 