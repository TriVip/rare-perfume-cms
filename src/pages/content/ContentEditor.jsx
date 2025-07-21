import { useParams } from 'react-router-dom'

const ContentEditor = () => {
  const { page } = useParams()

  const pageNames = {
    about: 'About Us',
    contact: 'Contact Us',
    terms: 'Terms of Service',
    privacy: 'Privacy Policy',
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-secondary-900">
          Edit {pageNames[page] || 'Page'}
        </h1>
        <p className="text-secondary-600">
          Update static page content
        </p>
      </div>

      {/* Placeholder content */}
      <div className="card">
        <div className="text-center py-12">
          <div className="text-secondary-400 text-lg mb-4">Content Editor</div>
          <p className="text-secondary-600 mb-6">
            Static content management for:
          </p>
          <ul className="text-left max-w-md mx-auto space-y-2 text-sm text-secondary-600">
            <li>• Rich text editing</li>
            <li>• Image management</li>
            <li>• SEO meta fields</li>
            <li>• Preview functionality</li>
            <li>• Version history</li>
            <li>• Auto-save drafts</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default ContentEditor 