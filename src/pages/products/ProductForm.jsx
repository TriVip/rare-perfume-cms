import { useParams } from 'react-router-dom'

const ProductForm = () => {
  const { id } = useParams()
  const isEditing = !!id

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-secondary-900">
          {isEditing ? 'Edit Product' : 'Add New Product'}
        </h1>
        <p className="text-secondary-600">
          {isEditing ? 'Update product information' : 'Create a new perfume product'}
        </p>
      </div>

      {/* Placeholder content */}
      <div className="card">
        <div className="text-center py-12">
          <div className="text-secondary-400 text-lg mb-4">Product Form</div>
          <p className="text-secondary-600 mb-6">
            This form will include fields for:
          </p>
          <ul className="text-left max-w-md mx-auto space-y-2 text-sm text-secondary-600">
            <li>• Product Name & Description</li>
            <li>• Brand & Collection</li>
            <li>• Fragrance Notes (Top, Middle, Base)</li>
            <li>• Price & Sale Price</li>
            <li>• SKU & Inventory</li>
            <li>• Multiple Image Upload</li>
            <li>• Categories & Tags</li>
            <li>• SEO Fields</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default ProductForm 
