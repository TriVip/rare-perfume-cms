import { Link } from 'react-router-dom'
import { PlusIcon } from '@heroicons/react/24/outline'

const ProductList = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-secondary-900">Products</h1>
        <Link
          to="/products/new"
          className="btn-primary inline-flex items-center"
        >
          <PlusIcon className="w-5 h-5 mr-2" />
          Add Product
        </Link>
      </div>

      {/* Placeholder content */}
      <div className="card">
        <div className="text-center py-12">
          <div className="text-secondary-400 text-lg mb-4">Product Management</div>
          <p className="text-secondary-600 mb-6">
            This page will contain a comprehensive product management interface with:
          </p>
          <ul className="text-left max-w-md mx-auto space-y-2 text-sm text-secondary-600">
            <li>• Product listing with search and filters</li>
            <li>• Bulk operations</li>
            <li>• Image management</li>
            <li>• Inventory tracking</li>
            <li>• Category and tag management</li>
            <li>• CSV import/export functionality</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default ProductList 
