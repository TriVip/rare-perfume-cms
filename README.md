# Rare Perfume - Admin CMS

A modern, responsive Content Management System built for e-commerce perfume stores. Built with React, Redux Toolkit, and Tailwind CSS.

## 🚀 Features

### Core E-commerce & CMS Features

- **Dashboard**: Overview of sales, orders, and key metrics with interactive charts
- **Product Management**: 
  - CRUD operations for products
  - Multiple image upload with drag-and-drop reordering
  - Inventory management and stock tracking
  - Product variations (sizes, prices)
  - Categories and tags management
  - CSV/Excel bulk import
- **Order Management**:
  - Comprehensive order listing with filtering and sorting
  - Order status updates and tracking
  - Customer information and order details
  - Bulk operations
- **Blog Management**:
  - Rich text editor (TipTap) for content creation
  - SEO optimization fields
  - Categories and tags
  - Draft/publish workflow
- **Content Management**: Simple interface for editing static pages

### Technical Features

- **Authentication**: JWT-based authentication with role-based access
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **State Management**: Redux Toolkit for efficient state management
- **API Integration**: Axios-based service layer with interceptors
- **Modern UI**: Headless UI components for accessibility
- **Type Safety**: Built with modern JavaScript and React hooks

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern React with functional components and hooks
- **Vite** - Fast build tool and development server
- **Redux Toolkit** - State management
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Headless UI** - Accessible UI components
- **Heroicons** - Beautiful SVG icons

### Form Handling & Rich Text
- **React Hook Form** - Performant forms with easy validation
- **TipTap** - Rich text editor for blog posts and content

### Additional Libraries
- **Axios** - HTTP client with interceptors
- **React Toastify** - Toast notifications
- **Chart.js** - Data visualization
- **React Dropzone** - File upload handling

## 📁 Project Structure

\`\`\`
rare-perfume-cms/
├── public/                     # Static files
├── src/
│   ├── components/            # Reusable components
│   │   ├── common/           # Common components (ProtectedRoute, etc.)
│   │   ├── forms/            # Form components
│   │   ├── layout/           # Layout components (Header, Sidebar)
│   │   └── tables/           # Table components (OrderList, etc.)
│   ├── pages/                # Page components
│   │   ├── auth/             # Authentication pages
│   │   ├── dashboard/        # Dashboard page
│   │   ├── products/         # Product management pages
│   │   ├── orders/           # Order management pages
│   │   ├── blog/             # Blog management pages
│   │   └── content/          # Content management pages
│   ├── services/             # API service layer
│   │   ├── authService.js    # Authentication API
│   │   ├── productService.js # Product API
│   │   ├── orderService.js   # Order API
│   │   └── blogService.js    # Blog API
│   ├── store/                # Redux store
│   │   ├── slices/           # Redux slices
│   │   └── store.js          # Store configuration
│   ├── hooks/                # Custom React hooks
│   ├── utils/                # Utility functions
│   ├── contexts/             # React contexts
│   └── assets/               # Images, icons, etc.
├── Dockerfile                # Docker configuration
├── docker-compose.yml        # Docker Compose configuration
├── nginx.conf                # Nginx configuration
└── README.md                 # This file
\`\`\`

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- Git

### Installation

1. **Clone the repository**
   \`\`\`bash
   git clone <repository-url>
   cd rare-perfume-cms
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   \`\`\`
3. **Run the linter**
   ```bash
   npm run lint
   ```

4. **Set up environment variables**
   \`\`\`bash
   cp .env.example .env
   \`\`\`
   Edit the \`.env\` file with your API endpoint and other configuration.

5. **Start the development server**
   \`\`\`bash
   npm run dev
   \`\`\`

6. **Open your browser**
   Visit \`http://localhost:3000\` to see the application.

### Demo Credentials

For testing purposes, you can use these demo credentials:
- **Email**: admin@rareperfume.com
- **Password**: admin123

## 🏗️ Building for Production

1. **Build the application**
   \`\`\`bash
   npm run build
   \`\`\`

2. **Preview the production build**
   \`\`\`bash
   npm run preview
   \`\`\`

## 🐳 Docker Deployment

### Using Docker

1. **Build the Docker image**
   \`\`\`bash
   docker build -t rare-perfume-cms .
   \`\`\`

2. **Run the container**
   \`\`\`bash
   docker run -p 3000:80 rare-perfume-cms
   \`\`\`

### Using Docker Compose

1. **Start the application**
   \`\`\`bash
   docker-compose up -d
   \`\`\`

2. **Stop the application**
   \`\`\`bash
   docker-compose down
   \`\`\`

## 🌐 Deployment to Cloud

### Vercel Deployment
\`\`\`bash
npm install -g vercel
vercel --prod
\`\`\`

### Netlify Deployment
1. Build: \`npm run build\`
2. Publish directory: \`dist\`

### AWS S3 + CloudFront
1. Build the application: \`npm run build\`
2. Upload the \`dist\` folder to S3
3. Configure CloudFront distribution

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| \`VITE_API_BASE_URL\` | Backend API URL | \`http://localhost:3001/api\` |
| \`NODE_ENV\` | Environment mode | \`development\` |
| \`VITE_APP_NAME\` | Application name | \`Rare Perfume CMS\` |

### API Integration

The CMS expects a REST API with the following endpoints:

#### Authentication
- \`POST /auth/login\` - User login
- \`GET /auth/me\` - Get current user
- \`POST /auth/logout\` - User logout

#### Products
- \`GET /products\` - List products
- \`POST /products\` - Create product
- \`GET /products/:id\` - Get product
- \`PUT /products/:id\` - Update product
- \`DELETE /products/:id\` - Delete product

#### Orders
- \`GET /orders\` - List orders
- \`GET /orders/:id\` - Get order
- \`PATCH /orders/:id/status\` - Update order status

#### Blog
- \`GET /blog/posts\` - List blog posts
- \`POST /blog/posts\` - Create blog post
- \`PUT /blog/posts/:id\` - Update blog post
- \`DELETE /blog/posts/:id\` - Delete blog post

## 🎨 Customization

### Themes and Colors

The application uses a custom color palette defined in \`tailwind.config.js\`:

- **Primary**: Pink/Rose colors for brand elements
- **Secondary**: Gray colors for text and backgrounds

### Adding New Features

1. **Create new pages** in \`src/pages/\`
2. **Add routes** in \`src/App.jsx\`
3. **Create services** in \`src/services/\`
4. **Add Redux slices** in \`src/store/slices/\`

## Frontend Integration

This CMS backend is designed to work with the Rare Perfume frontend website located at `path/to/rare-parfume-website`.

### Connection Setup

1. The backend API runs on port 3001
2. The frontend is configured to connect to the backend API at `http://localhost:3001/api`
3. CORS is configured to allow requests from the frontend

For detailed integration instructions, see the [Frontend Integration Guide](./FRONTEND_INTEGRATION.md).

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: \`git checkout -b feature/new-feature\`
3. Run the linter: `npm run lint`
4. Commit your changes: \`git commit -am 'Add new feature'\`
5. Push to the branch: \`git push origin feature/new-feature\`
6. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🔗 Related Projects

- [Backend API Repository](#) - The backend API for this CMS
- [Frontend Store](#) - The customer-facing e-commerce store

## 📞 Support

For support, email support@rareperfume.com or create an issue in this repository. 
