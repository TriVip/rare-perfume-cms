import { useParams } from 'react-router-dom'

const OrderDetail = () => {
  const { id } = useParams()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-secondary-900">Order #{id}</h1>
        <p className="text-secondary-600">View and manage order details</p>
      </div>

      {/* Placeholder content */}
      <div className="card">
        <div className="text-center py-12">
          <div className="text-secondary-400 text-lg mb-4">Order Details</div>
          <p className="text-secondary-600 mb-6">
            This page will display:
          </p>
          <ul className="text-left max-w-md mx-auto space-y-2 text-sm text-secondary-600">
            <li>• Customer information</li>
            <li>• Order status and timeline</li>
            <li>• Product details and quantities</li>
            <li>• Shipping information</li>
            <li>• Payment details</li>
            <li>• Order actions (update status, refund, etc.)</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default OrderDetail 
