# Frontend Integration Guide

This guide explains how to connect the Rare Perfume frontend website to the CMS backend.

## Configuration Setup

### Backend (CMS) Configuration

1. The backend API runs on port 3001 by default
2. The backend API endpoints are available at `http://localhost:3001/api/`
3. Available endpoints:
   - Authentication: `/api/auth`
   - Products: `/api/products`
   - Orders: `/api/orders`
   - Payments: `/api/payments`

### Frontend Configuration

1. The frontend API configuration is located at `/src/services/api.ts`
2. Environment variables are stored in `.env.local`

## How to Connect

### 1. Update Frontend Environment Variables

Make sure your frontend `.env.local` file has the correct API URL:

```
VITE_API_BASE_URL=http://localhost:3001/api
VITE_API_TIMEOUT=10000
VITE_DEBUG=true
```

### 2. Using the API in Frontend Components

The frontend already has an API client set up. Here's how to use it:

```typescript
import { api, handleApiError } from '../services/api';

// Example: Fetching products
const fetchProducts = async () => {
  try {
    const products = await api.get('/products');
    return products;
  } catch (error) {
    const errorMessage = handleApiError(error);
    console.error(errorMessage);
    // Handle error appropriately
  }
};

// Example: Creating an order
const createOrder = async (orderData) => {
  try {
    const newOrder = await api.post('/orders', orderData);
    return newOrder;
  } catch (error) {
    const errorMessage = handleApiError(error);
    console.error(errorMessage);
    // Handle error appropriately
  }
};
```

### 3. Authentication

The API client automatically adds the authentication token to requests:

```typescript
// After login, store the token
localStorage.setItem('accessToken', response.token);

// The API client will automatically include this token in subsequent requests
// No additional configuration needed
```

## Testing the Connection

1. Start the backend server:
   ```
   cd /Users/rekcal/rare-perfume-cms
   cd backend
   npm install
   npm start
   ```

2. Start the CMS development server:
   ```
   cd /Users/rekcal/rare-perfume-cms
   npm install
   npm run dev
   ```

3. Start the frontend development server:
   ```
   cd /Users/rekcal/rare-parfume-website
   npm install
   npm start
   ```

4. Test the API connection by navigating to the frontend application and checking the browser console for API requests.

## Troubleshooting

1. **CORS Issues**: If you encounter CORS errors, make sure the frontend origin is added to the allowed origins in the backend's `.env` file.

2. **API Connection Errors**: Check that both servers are running and that the `VITE_API_BASE_URL` is correctly set.

3. **Authentication Errors**: Ensure that the token is being properly stored in localStorage after login.

## Additional Resources

- Backend API Documentation: `http://localhost:3001/` (Root endpoint shows available endpoints)
- Health Check: `http://localhost:3001/health` 