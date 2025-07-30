import apiClient from './authService'

export const blogAPI = {
  // Get all blog posts with pagination and filtering
  getPosts: (params = {}) => {
    const queryParams = new URLSearchParams({
      page: params.page || 1,
      limit: params.limit || 10,
      search: params.search || '',
      category: params.category || '',
      status: params.status || '',
      author: params.author || '',
      sortBy: params.sortBy || 'createdAt',
      sortOrder: params.sortOrder || 'desc',
    }).toString()
    
    return apiClient.get(`/blog/posts?${queryParams}`)
  },

  // Get single blog post by ID
  getPost: (id) => apiClient.get(`/blog/posts/${id}`),

  // Create new blog post
  createPost: (postData) => apiClient.post('/blog/posts', postData),

  // Update existing blog post
  updatePost: (id, postData) => apiClient.put(`/blog/posts/${id}`, postData),

  // Delete blog post
  deletePost: (id) => apiClient.delete(`/blog/posts/${id}`),

  // Upload featured image
  uploadFeaturedImage: (postId, file) => {
    const formData = new FormData()
    formData.append('image', file)
    
    return apiClient.post(`/blog/posts/${postId}/featured-image`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },

  // Upload content images
  uploadContentImage: (file) => {
    const formData = new FormData()
    formData.append('image', file)
    
    return apiClient.post('/blog/upload-image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },

  // Categories and tags
  getCategories: () => apiClient.get('/blog/categories'),
  createCategory: (categoryData) => apiClient.post('/blog/categories', categoryData),
  updateCategory: (id, categoryData) => apiClient.put(`/blog/categories/${id}`, categoryData),
  deleteCategory: (id) => apiClient.delete(`/blog/categories/${id}`),

  getTags: () => apiClient.get('/blog/tags'),
  createTag: (tagData) => apiClient.post('/blog/tags', tagData),
  updateTag: (id, tagData) => apiClient.put(`/blog/tags/${id}`, tagData),
  deleteTag: (id) => apiClient.delete(`/blog/tags/${id}`),

  // SEO and publishing
  updateSEO: (id, seoData) => apiClient.patch(`/blog/posts/${id}/seo`, seoData),
  publishPost: (id) => apiClient.patch(`/blog/posts/${id}/publish`),
  unpublishPost: (id) => apiClient.patch(`/blog/posts/${id}/unpublish`),
  schedulePost: (id, publishDate) => 
    apiClient.patch(`/blog/posts/${id}/schedule`, { publishDate }),

  // Analytics
  getPostAnalytics: (id, params = {}) => 
    apiClient.get(`/blog/posts/${id}/analytics`, { params }),

  getBlogAnalytics: (params = {}) => 
    apiClient.get('/blog/analytics', { params }),

  // Bulk operations
  bulkDelete: (postIds) => apiClient.post('/blog/posts/bulk-delete', { postIds }),
  bulkUpdateStatus: (postIds, status) => 
    apiClient.post('/blog/posts/bulk-update-status', { postIds, status }),
}
