import { Routes, Route, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Layout from './components/layout/Layout'
import Login from './pages/auth/Login'
import Dashboard from './pages/dashboard/Dashboard'
import ProductList from './pages/products/ProductList'
import ProductForm from './pages/products/ProductForm'
import OrderList from './pages/orders/OrderList'
import OrderDetail from './pages/orders/OrderDetail'
import BlogList from './pages/blog/BlogList'
import BlogForm from './pages/blog/BlogForm'
import ContentEditor from './pages/content/ContentEditor'
import ProtectedRoute from './components/common/ProtectedRoute'

function App() {
  const { isAuthenticated } = useSelector((state) => state.auth)

  return (
    <div className="min-h-screen bg-secondary-50">
      <Routes>
        {/* Public Routes */}
        <Route 
          path="/login" 
          element={!isAuthenticated ? <Login /> : <Navigate to="/dashboard" replace />} 
        />
        
        {/* Protected Routes */}
        <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          
          {/* Product Management */}
          <Route path="products" element={<ProductList />} />
          <Route path="products/new" element={<ProductForm />} />
          <Route path="products/edit/:id" element={<ProductForm />} />
          
          {/* Order Management */}
          <Route path="orders" element={<OrderList />} />
          <Route path="orders/:id" element={<OrderDetail />} />
          
          {/* Blog Management */}
          <Route path="blog" element={<BlogList />} />
          <Route path="blog/new" element={<BlogForm />} />
          <Route path="blog/edit/:id" element={<BlogForm />} />
          
          {/* Content Management */}
          <Route path="content/:page" element={<ContentEditor />} />
        </Route>
        
        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </div>
  )
}

export default App 