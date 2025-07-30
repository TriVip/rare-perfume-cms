import { useParams } from 'react-router-dom'

const BlogForm = () => {
  const { id } = useParams()
  const isEditing = !!id

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-secondary-900">
          {isEditing ? 'Edit Blog Post' : 'Create New Post'}
        </h1>
        <p className="text-secondary-600">
          {isEditing ? 'Update blog post content' : 'Write a new blog post'}
        </p>
      </div>

      {/* Placeholder content */}
      <div className="card">
        <div className="text-center py-12">
          <div className="text-secondary-400 text-lg mb-4">Blog Editor</div>
          <p className="text-secondary-600 mb-6">
            The blog editor will include:
          </p>
          <ul className="text-left max-w-md mx-auto space-y-2 text-sm text-secondary-600">
            <li>• Rich text editor (TipTap)</li>
            <li>• Title and excerpt fields</li>
            <li>• Featured image upload</li>
            <li>• SEO meta fields</li>
            <li>• URL slug editor</li>
            <li>• Categories and tags</li>
            <li>• Publish/Draft status</li>
            <li>• Scheduled publishing</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default BlogForm
