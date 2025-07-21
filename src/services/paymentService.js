import apiClient from './authService'

// Mock payment data for demo
const mockPaymentMethods = [
  { id: 'bank_transfer', name: 'Chuyển khoản ngân hàng', icon: '🏦' },
  { id: 'momo', name: 'MoMo', icon: '💳' },
  { id: 'zalopay', name: 'ZaloPay', icon: '📱' },
  { id: 'vnpay', name: 'VNPay', icon: '💰' }
]

const mockQRCode = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=='

// Check if we should use mock data
const shouldUseMock = () => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'
  return API_BASE_URL.includes('localhost:3001') || API_BASE_URL.includes('localhost:8000')
}

// Mock functions
const mockCreatePaymentIntent = (paymentData) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        data: {
          paymentIntent: {
            id: 'pi_' + Date.now(),
            amount: paymentData.amount,
            currency: 'VND',
            status: 'requires_payment_method',
            clientSecret: 'pi_' + Date.now() + '_secret_' + Math.random().toString(36).substr(2, 9)
          }
        }
      })
    }, 1000)
  })
}

const mockGetPaymentStatus = (paymentId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const statuses = ['pending', 'processing', 'completed', 'failed']
      const randomStatus = statuses[Math.floor(Math.random() * statuses.length)]
      
      resolve({
        data: {
          id: paymentId,
          status: randomStatus,
          amount: 1500000,
          currency: 'VND',
          paymentMethod: 'bank_transfer',
          createdAt: new Date().toISOString(),
          completedAt: randomStatus === 'completed' ? new Date().toISOString() : null
        }
      })
    }, 800)
  })
}

const mockGenerateQR = (paymentData) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const bankInfo = {
        bankCode: import.meta.env.VITE_BANK_CODE || 'VCB',
        accountNumber: import.meta.env.VITE_ACCOUNT_NUMBER || '1234567890',
        accountHolder: import.meta.env.VITE_ACCOUNT_HOLDER || 'NGUYEN VAN A'
      }
      
      resolve({
        data: {
          qrCode: mockQRCode,
          bankInfo,
          amount: paymentData.amount,
          content: `Thanh toan don hang ${paymentData.orderId}`,
          expiredAt: new Date(Date.now() + 15 * 60 * 1000).toISOString() // 15 minutes
        }
      })
    }, 500)
  })
}

export const paymentAPI = {
  // Get available payment methods
  getPaymentMethods: () => {
    if (shouldUseMock()) {
      return Promise.resolve({ data: mockPaymentMethods })
    }
    return apiClient.get('/payments/methods')
  },

  // Create payment intent
  createPaymentIntent: (paymentData) => {
    if (shouldUseMock()) {
      return mockCreatePaymentIntent(paymentData)
    }
    return apiClient.post('/payments/create-intent', paymentData)
  },

  // Get payment status
  getPaymentStatus: (paymentId) => {
    if (shouldUseMock()) {
      return mockGetPaymentStatus(paymentId)
    }
    return apiClient.get(`/payments/${paymentId}/status`)
  },

  // Generate QR code for bank transfer
  generateQR: (paymentData) => {
    if (shouldUseMock()) {
      return mockGenerateQR(paymentData)
    }
    return apiClient.post('/payments/generate-qr', paymentData)
  },

  // Process payment
  processPayment: (paymentId, paymentMethod, paymentDetails) => {
    if (shouldUseMock()) {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            data: {
              success: true,
              paymentId,
              status: 'processing',
              message: 'Payment is being processed'
            }
          })
        }, 2000)
      })
    }
    return apiClient.post(`/payments/${paymentId}/process`, {
      paymentMethod,
      paymentDetails
    })
  },

  // Confirm payment (for manual verification)
  confirmPayment: (paymentId, confirmationData) => {
    if (shouldUseMock()) {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            data: {
              success: true,
              paymentId,
              status: 'completed',
              message: 'Payment confirmed successfully'
            }
          })
        }, 1000)
      })
    }
    return apiClient.post(`/payments/${paymentId}/confirm`, confirmationData)
  },

  // Get payment history
  getPaymentHistory: (params = {}) => {
    if (shouldUseMock()) {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            data: {
              payments: [],
              total: 0,
              page: params.page || 1,
              limit: params.limit || 10
            }
          })
        }, 500)
      })
    }
    
    const queryParams = new URLSearchParams({
      page: params.page || 1,
      limit: params.limit || 10,
      status: params.status || '',
      dateFrom: params.dateFrom || '',
      dateTo: params.dateTo || '',
    }).toString()
    
    return apiClient.get(`/payments/history?${queryParams}`)
  },

  // Refund payment
  refundPayment: (paymentId, refundData) => {
    if (shouldUseMock()) {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            data: {
              success: true,
              refundId: 'rf_' + Date.now(),
              amount: refundData.amount,
              status: 'processing',
              message: 'Refund initiated successfully'
            }
          })
        }, 1500)
      })
    }
    return apiClient.post(`/payments/${paymentId}/refund`, refundData)
  }
}

export default paymentAPI 