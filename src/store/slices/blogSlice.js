import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { blogAPI } from '../../services/blogService'

const initialState = {
  posts: [],
  currentPost: null,
  categories: [],
  tags: [],
  loading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  },
  filters: {
    search: '',
    category: '',
    status: '',
    author: '',
  },
}

// Async thunks
export const fetchPosts = createAsyncThunk(
  'blog/fetchPosts',
  async (params, { rejectWithValue }) => {
    try {
      const response = await blogAPI.getPosts(params)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch posts')
    }
  }
)

export const fetchPostById = createAsyncThunk(
  'blog/fetchPostById',
  async (postId, { rejectWithValue }) => {
    try {
      const response = await blogAPI.getPost(postId)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch post')
    }
  }
)

export const createPost = createAsyncThunk(
  'blog/createPost',
  async (postData, { rejectWithValue }) => {
    try {
      const response = await blogAPI.createPost(postData)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create post')
    }
  }
)

export const updatePost = createAsyncThunk(
  'blog/updatePost',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await blogAPI.updatePost(id, data)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update post')
    }
  }
)

export const deletePost = createAsyncThunk(
  'blog/deletePost',
  async (postId, { rejectWithValue }) => {
    try {
      await blogAPI.deletePost(postId)
      return postId
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete post')
    }
  }
)

const blogSlice = createSlice({
  name: 'blog',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload }
    },
    clearCurrentPost: (state) => {
      state.currentPost = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch posts
      .addCase(fetchPosts.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.loading = false
        state.posts = action.payload.posts
        state.pagination = action.payload.pagination
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Fetch post by ID
      .addCase(fetchPostById.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchPostById.fulfilled, (state, action) => {
        state.loading = false
        state.currentPost = action.payload
      })
      .addCase(fetchPostById.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Create post
      .addCase(createPost.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.loading = false
        state.posts.unshift(action.payload)
      })
      .addCase(createPost.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Update post
      .addCase(updatePost.fulfilled, (state, action) => {
        const index = state.posts.findIndex(post => post.id === action.payload.id)
        if (index !== -1) {
          state.posts[index] = action.payload
        }
        if (state.currentPost && state.currentPost.id === action.payload.id) {
          state.currentPost = action.payload
        }
      })
      // Delete post
      .addCase(deletePost.fulfilled, (state, action) => {
        state.posts = state.posts.filter(post => post.id !== action.payload)
      })
  },
})

export const { clearError, setFilters, clearCurrentPost } = blogSlice.actions
export default blogSlice.reducer
