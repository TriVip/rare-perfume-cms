import express from 'express'
import { v4 as uuidv4 } from 'uuid'
import { verifyToken } from './auth.js'

const router = express.Router()

// Mock payment data
let payments = []

const paymentMethods = [
  { id: 'bank_transfer', name: 'Chuyển khoản ngân hàng', icon: '🏦' },
  { id: 'momo', name: 'MoMo', icon: '💳' },
  { id: 'zalopay', name: 'ZaloPay', icon: '📱' },
  { id: 'vnpay', name: 'VNPay', icon: '💰' }
]

// Mock QR code (simple base64 placeholder)
const generateMockQR = () => {
  return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=='
}

// Mock bank info from environment
const getBankInfo = () => {
  return {
    bankCode: process.env.BANK_CODE || 'VCB',
    accountNumber: process.env.ACCOUNT_NUMBER || '1234567890',
    accountHolder: process.env.ACCOUNT_HOLDER || 'NGUYEN VAN A'
  }
}

// Helper function to generate payment ID
const generatePaymentId = () => {
  return `pi_${uuidv4().replace(/-/g, '')}`
}

// GET /api/payments/methods - Get available payment methods
router.get('/methods', (req, res) => {
  try {
    res.json(paymentMethods)
  } catch (error) {
    console.error('Get payment methods error:', error)
    res.status(500).json({
      error: { message: 'Internal server error', status: 500 }
    })
  }
})

// POST /api/payments/create-intent - Create payment intent
router.post('/create-intent', (req, res) => {
  try {
    const { amount, currency = 'VND', orderId, customerInfo } = req.body

    if (!amount || !orderId) {
      return res.status(400).json({
        error: { message: 'Amount and orderId are required', status: 400 }
      })
    }

    const paymentIntent = {
      id: generatePaymentId(),
      amount,
      currency,
      orderId,
      status: 'requires_payment_method',
      clientSecret: `${generatePaymentId()}_secret_${Math.random().toString(36).substr(2, 9)}`,
      customerInfo,
      createdAt: new Date().toISOString()
    }

    payments.push(paymentIntent)

    res.json({
      paymentIntent
    })
  } catch (error) {
    console.error('Create payment intent error:', error)
    res.status(500).json({
      error: { message: 'Internal server error', status: 500 }
    })
  }
})

// GET /api/payments/:id/status - Get payment status
router.get('/:id/status', (req, res) => {
  try {
    const { id } = req.params
    const payment = payments.find(p => p.id === id)

    if (!payment) {
      return res.status(404).json({
        error: { message: 'Payment not found', status: 404 }
      })
    }

    // Simulate random status for demo
    const statuses = ['pending', 'processing', 'completed', 'failed']
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)]

    const response = {
      id: payment.id,
      status: randomStatus,
      amount: payment.amount,
      currency: payment.currency,
      orderId: payment.orderId,
      paymentMethod: 'bank_transfer',
      createdAt: payment.createdAt,
      completedAt: randomStatus === 'completed' ? new Date().toISOString() : null
    }

    res.json(response)
  } catch (error) {
    console.error('Get payment status error:', error)
    res.status(500).json({
      error: { message: 'Internal server error', status: 500 }
    })
  }
})

// POST /api/payments/generate-qr - Generate QR code for bank transfer
router.post('/generate-qr', (req, res) => {
  try {
    const { amount, orderId, paymentId } = req.body

    if (!amount || !orderId) {
      return res.status(400).json({
        error: { message: 'Amount and orderId are required', status: 400 }
      })
    }

    const bankInfo = getBankInfo()
    const content = `Thanh toan don hang ${orderId}`
    const qrCode = generateMockQR()

    res.json({
      qrCode,
      bankInfo,
      amount,
      content,
      orderId,
      paymentId,
      expiredAt: new Date(Date.now() + 15 * 60 * 1000).toISOString() // 15 minutes
    })
  } catch (error) {
    console.error('Generate QR error:', error)
    res.status(500).json({
      error: { message: 'Internal server error', status: 500 }
    })
  }
})

// POST /api/payments/:id/process - Process payment
router.post('/:id/process', (req, res) => {
  try {
    const { id } = req.params
    const { paymentMethod, paymentDetails } = req.body

    const paymentIndex = payments.findIndex(p => p.id === id)
    if (paymentIndex === -1) {
      return res.status(404).json({
        error: { message: 'Payment not found', status: 404 }
      })
    }

    // Update payment status
    payments[paymentIndex].status = 'processing'
    payments[paymentIndex].paymentMethod = paymentMethod
    payments[paymentIndex].paymentDetails = paymentDetails
    payments[paymentIndex].processedAt = new Date().toISOString()

    res.json({
      success: true,
      paymentId: id,
      status: 'processing',
      message: 'Payment is being processed'
    })
  } catch (error) {
    console.error('Process payment error:', error)
    res.status(500).json({
      error: { message: 'Internal server error', status: 500 }
    })
  }
})

// POST /api/payments/:id/confirm - Confirm payment (manual verification)
router.post('/:id/confirm', verifyToken, (req, res) => {
  try {
    const { id } = req.params
    const { confirmationData } = req.body

    const paymentIndex = payments.findIndex(p => p.id === id)
    if (paymentIndex === -1) {
      return res.status(404).json({
        error: { message: 'Payment not found', status: 404 }
      })
    }

    // Update payment status to completed
    payments[paymentIndex].status = 'completed'
    payments[paymentIndex].confirmationData = confirmationData
    payments[paymentIndex].confirmedAt = new Date().toISOString()
    payments[paymentIndex].confirmedBy = req.user.id

    res.json({
      success: true,
      paymentId: id,
      status: 'completed',
      message: 'Payment confirmed successfully'
    })
  } catch (error) {
    console.error('Confirm payment error:', error)
    res.status(500).json({
      error: { message: 'Internal server error', status: 500 }
    })
  }
})

// GET /api/payments/history - Get payment history
router.get('/history', verifyToken, (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      status, 
      dateFrom, 
      dateTo 
    } = req.query

    let filteredPayments = payments

    // Filter by status
    if (status) {
      filteredPayments = filteredPayments.filter(p => p.status === status)
    }

    // Filter by date range
    if (dateFrom) {
      filteredPayments = filteredPayments.filter(p => 
        new Date(p.createdAt) >= new Date(dateFrom)
      )
    }
    if (dateTo) {
      filteredPayments = filteredPayments.filter(p => 
        new Date(p.createdAt) <= new Date(dateTo)
      )
    }

    // Sort by creation date (newest first)
    filteredPayments.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

    // Pagination
    const offset = (page - 1) * limit
    const paginatedPayments = filteredPayments.slice(offset, offset + parseInt(limit))

    res.json({
      payments: paginatedPayments,
      total: filteredPayments.length,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(filteredPayments.length / limit)
    })
  } catch (error) {
    console.error('Get payment history error:', error)
    res.status(500).json({
      error: { message: 'Internal server error', status: 500 }
    })
  }
})

// POST /api/payments/:id/refund - Refund payment
router.post('/:id/refund', verifyToken, (req, res) => {
  try {
    const { id } = req.params
    const { amount, reason } = req.body

    const paymentIndex = payments.findIndex(p => p.id === id)
    if (paymentIndex === -1) {
      return res.status(404).json({
        error: { message: 'Payment not found', status: 404 }
      })
    }

    const refund = {
      refundId: `rf_${uuidv4().replace(/-/g, '')}`,
      paymentId: id,
      amount: amount || payments[paymentIndex].amount,
      reason,
      status: 'processing',
      refundedBy: req.user.id,
      createdAt: new Date().toISOString()
    }

    // Add refund to payment
    if (!payments[paymentIndex].refunds) {
      payments[paymentIndex].refunds = []
    }
    payments[paymentIndex].refunds.push(refund)

    res.json({
      success: true,
      refundId: refund.refundId,
      amount: refund.amount,
      status: 'processing',
      message: 'Refund initiated successfully'
    })
  } catch (error) {
    console.error('Refund payment error:', error)
    res.status(500).json({
      error: { message: 'Internal server error', status: 500 }
    })
  }
})

// GET /api/payments/analytics - Payment analytics (bonus endpoint)
router.get('/analytics', verifyToken, (req, res) => {
  try {
    const { dateFrom, dateTo } = req.query

    let filteredPayments = payments

    // Filter by date range
    if (dateFrom) {
      filteredPayments = filteredPayments.filter(p => 
        new Date(p.createdAt) >= new Date(dateFrom)
      )
    }
    if (dateTo) {
      filteredPayments = filteredPayments.filter(p => 
        new Date(p.createdAt) <= new Date(dateTo)
      )
    }

    const analytics = {
      totalPayments: filteredPayments.length,
      totalAmount: filteredPayments.reduce((sum, p) => sum + p.amount, 0),
      statusBreakdown: {
        pending: filteredPayments.filter(p => p.status === 'pending').length,
        processing: filteredPayments.filter(p => p.status === 'processing').length,
        completed: filteredPayments.filter(p => p.status === 'completed').length,
        failed: filteredPayments.filter(p => p.status === 'failed').length
      },
      averageAmount: filteredPayments.length > 0 
        ? filteredPayments.reduce((sum, p) => sum + p.amount, 0) / filteredPayments.length 
        : 0
    }

    res.json(analytics)
  } catch (error) {
    console.error('Payment analytics error:', error)
    res.status(500).json({
      error: { message: 'Internal server error', status: 500 }
    })
  }
})

export default router 