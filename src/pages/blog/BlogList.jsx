import { Link } from 'react-router-dom'
import { PlusIcon } from '@heroicons/react/24/outline'

const BlogList = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-secondary-900">Blog Posts</h1>
        <Link
          to="/blog/new"
          className="btn-primary inline-flex items-center"
        >
          <PlusIcon className="w-5 h-5 mr-2" />
          New Post
        </Link>
      </div>

      {/* Placeholder content */}
      <div className="card">
        <div className="text-center py-12">
          <div className="text-secondary-400 text-lg mb-4">Blog Management</div>
          <p className="text-secondary-600 mb-6">
            This section will provide:
          </p>
          <ul className="text-left max-w-md mx-auto space-y-2 text-sm text-secondary-600">
            <li>• Blog post listing with filters</li>
            <li>• Draft and published status management</li>
            <li>• Rich text editor integration</li>
            <li>• SEO optimization fields</li>
            <li>• Categories and tags</li>
            <li>• Featured image management</li>
            <li>• Scheduled publishing</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default BlogList 