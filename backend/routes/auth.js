import express from 'express'
import { v4 as uuidv4 } from 'uuid'
import { attemptLogin, findUser, findUserByEmail, insertUser } from '../services/user_service.js'

const router = express.Router()

const tokens = new Map()

// Helper function to generate JWT-like token
const generateToken = (user) => {
  const token = `jwt_${uuidv4()}_${Date.now()}`
  tokens.set(token, { userId: user.id, expiresAt: Date.now() + (24 * 60 * 60 * 1000) }) // 24 hours
  return token
}

// Middleware to verify token
const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: { message: 'No token provided', status: 401 } })
  }

  const token = authHeader.substring(7)
  const tokenData = tokens.get(token)
  
  if (!tokenData || Date.now() > tokenData.expiresAt) {
    tokens.delete(token)
    return res.status(401).json({ error: { message: 'Token expired or invalid', status: 401 } })
  }

  const user = await findUser(tokenData.userId)
  if (!user) {
    return res.status(401).json({ error: { message: 'User not found', status: 401 } })
  }

  req.user = user
  next()
}

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({
        error: { message: 'Email and password are required', status: 400 }
      })
    }

    const user = await attemptLogin(email, password)
    if (!user) {
      return res.status(401).json({
        error: { message: 'Invalid email or password', status: 401 }
      })
    }

    const token = generateToken(user)
    const { password: _, ...userWithoutPassword } = user

    res.json({
      token,
      user: userWithoutPassword,
      message: 'Login successful'
    })
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({
      error: { message: 'Internal server error', status: 500 }
    })
  }
})

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { email, password, name } = req.body

    if (!email || !password || !name) {
      return res.status(400).json({
        error: { message: 'Email, password, and name are required', status: 400 }
      })
    }

    // Check if user already exists
    const existingUser = await findUserByEmail(email)
    if (existingUser) {
      return res.status(409).json({
        error: { message: 'User already exists', status: 409 }
      })
    }

    const newUser = {
      id: uuidv4(),
      email,
      password, // In production, hash this
      name,
      role: 'user',
      avatar: null,
      created_at: new Date().toISOString()
    }

    await insertUser(newUser)
    const token = generateToken(newUser)
    const { password: _, ...userWithoutPassword } = newUser

    res.status(201).json({
      token,
      user: userWithoutPassword,
      message: 'Registration successful'
    })
  } catch (error) {
    console.error('Registration error:', error)
    res.status(500).json({
      error: { message: 'Internal server error', status: 500 }
    })
  }
})

// GET /api/auth/me
router.get('/me', verifyToken, (req, res) => {
  try {
    const { password: _, ...userWithoutPassword } = req.user
    res.json(userWithoutPassword)
  } catch (error) {
    console.error('Get current user error:', error)
    res.status(500).json({
      error: { message: 'Internal server error', status: 500 }
    })
  }
})

// POST /api/auth/refresh
router.post('/refresh', verifyToken, (req, res) => {
  try {
    const newToken = generateToken(req.user)
    res.json({
      token: newToken,
      message: 'Token refreshed successfully'
    })
  } catch (error) {
    console.error('Token refresh error:', error)
    res.status(500).json({
      error: { message: 'Internal server error', status: 500 }
    })
  }
})

// POST /api/auth/logout
router.post('/logout', verifyToken, (req, res) => {
  try {
    const authHeader = req.headers.authorization
    const token = authHeader.substring(7)
    tokens.delete(token)
    
    res.json({ message: 'Logged out successfully' })
  } catch (error) {
    console.error('Logout error:', error)
    res.status(500).json({
      error: { message: 'Internal server error', status: 500 }
    })
  }
})

export default router
export { verifyToken } 
