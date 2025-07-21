import { useState, useEffect } from 'react'
import { 
  CurrencyDollarIcon, 
  ShoppingCartIcon, 
  UsersIcon, 
  EyeIcon 
} from '@heroicons/react/24/outline'

const Dashboard = () => {
  const [stats, setStats] = useState({
    revenue: 12540,
    orders: 156,
    customers: 89,
    pageViews: 3421,
  })

  const metrics = [
    {
      title: 'Total Revenue',
      value: `$${stats.revenue.toLocaleString()}`,
      change: '+12.5%',
      changeType: 'positive',
      icon: CurrencyDollarIcon,
    },
    {
      title: 'Orders',
      value: stats.orders.toString(),
      change: '+8.2%',
      changeType: 'positive',
      icon: ShoppingCartIcon,
    },
    {
      title: 'Customers',
      value: stats.customers.toString(),
      change: '+5.1%',
      changeType: 'positive',
      icon: UsersIcon,
    },
    {
      title: 'Page Views',
      value: stats.pageViews.toLocaleString(),
      change: '-2.3%',
      changeType: 'negative',
      icon: EyeIcon,
    },
  ]

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div>
        <h1 className="text-2xl font-bold text-secondary-900">Dashboard</h1>
        <p className="text-secondary-600">Welcome back! Here's what's happening with your store.</p>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric) => (
          <div key={metric.title} className="card">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center">
                  <metric.icon className="w-5 h-5 text-primary-600" />
                </div>
              </div>
              <div className="ml-4 flex-1">
                <p className="text-sm font-medium text-secondary-600">{metric.title}</p>
                <div className="flex items-baseline">
                  <p className="text-2xl font-semibold text-secondary-900">{metric.value}</p>
                  <p className={`ml-2 text-sm font-medium ${
                    metric.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {metric.change}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="card">
          <h3 className="text-lg font-medium text-secondary-900 mb-4">Revenue Overview</h3>
          <div className="h-64 bg-secondary-50 rounded-lg flex items-center justify-center">
            <p className="text-secondary-500">Chart will be implemented with Chart.js</p>
          </div>
        </div>

        {/* Orders Chart */}
        <div className="card">
          <h3 className="text-lg font-medium text-secondary-900 mb-4">Order Trends</h3>
          <div className="h-64 bg-secondary-50 rounded-lg flex items-center justify-center">
            <p className="text-secondary-500">Chart will be implemented with Chart.js</p>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card">
        <h3 className="text-lg font-medium text-secondary-900 mb-4">Recent Activity</h3>
        <div className="space-y-3">
          {[
            'New order #1234 received from John Doe',
            'Product "Midnight Rose" stock is running low',
            'Blog post "Spring Collection 2024" published',
            'Customer review added for "Ocean Breeze"',
          ].map((activity, index) => (
            <div key={index} className="flex items-center p-3 bg-secondary-50 rounded-lg">
              <div className="w-2 h-2 bg-primary-600 rounded-full mr-3"></div>
              <p className="text-sm text-secondary-700">{activity}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Dashboard 