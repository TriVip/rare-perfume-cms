# 🌸 Rare Perfume Backend API

Backend API cho hệ thống CMS quản lý nước hoa, cung cấp các endpoints cho authentication, orders, products, và payments.

## 🚀 Cài đặt nhanh

### 1. Cài đặt Dependencies
```bash
cd backend
npm install
```

### 2. Cấu hình Environment Variables
File `.env` đã được tạo sẵn với cấu hình mặc định. Bạn có thể chỉnh sửa nếu cần:

```env
PORT=3001
NODE_ENV=development
BANK_CODE=VCB
ACCOUNT_NUMBER=1234567890
ACCOUNT_HOLDER=NGUYEN VAN A
```

### 3. Khởi chạy Server
```bash
# Development mode (với nodemon)
npm run dev

# Production mode
npm start
```

Server sẽ chạy tại: **http://localhost:3001**

---

## 📋 API Endpoints

### 🔐 Authentication (`/api/auth`)
- `POST /login` - Đăng nhập
- `POST /register` - Đăng ký
- `GET /me` - Thông tin user hiện tại
- `POST /refresh` - Refresh token
- `POST /logout` - Đăng xuất

### 📦 Orders (`/api/orders`)
- `POST /` - Tạo đơn hàng mới
- `GET /:id` - Chi tiết đơn hàng
- `PATCH /:id/status` - Cập nhật trạng thái
- `GET /users/:userId/orders` - Đơn hàng của user
- `GET /` - Danh sách đơn hàng (admin)

### 🛍️ Products (`/api/products`)
- `GET /` - Danh sách sản phẩm
- `GET /:id` - Chi tiết sản phẩm
- `GET /featured` - Sản phẩm nổi bật
- `GET /new` - Sản phẩm mới
- `POST /` - Tạo sản phẩm (admin)
- `PUT /:id` - Cập nhật sản phẩm (admin)
- `DELETE /:id` - Xóa sản phẩm (admin)

### 💳 Payments (`/api/payments`)
- `POST /create-intent` - Tạo payment intent
- `GET /:id/status` - Trạng thái thanh toán
- `POST /generate-qr` - Tạo QR code
- `POST /:id/process` - Xử lý thanh toán
- `POST /:id/confirm` - Xác nhận thanh toán (admin)

---

## 🧪 Test API với Curl

### Đăng nhập
\`\`\`bash
curl -X POST http://localhost:3001/api/auth/login \\
  -H "Content-Type: application/json" \\
  -d '{"email":"admin@rareperfume.com","password":"admin123"}'
\`\`\`

### Tạo đơn hàng
\`\`\`bash
curl -X POST http://localhost:3001/api/orders \\
  -H "Content-Type: application/json" \\
  -d '{
    "customerInfo": {
      "firstName": "Nguyễn",
      "lastName": "Văn A", 
      "email": "user@example.com",
      "phone": "0123456789",
      "address": "123 Đường ABC"
    },
    "items": [
      {
        "productId": "prod_123",
        "quantity": 2,
        "price": 1500000
      }
    ],
    "total": 3000000
  }'
\`\`\`

### Lấy sản phẩm nổi bật
\`\`\`bash
curl http://localhost:3001/api/products/featured
\`\`\`

---

## 🔧 Cấu hình CORS

Server đã được cấu hình để cho phép requests từ:
- `http://localhost:3000` (React app)
- `http://localhost:5173` (Vite dev server)

Để thêm domain khác, chỉnh sửa `server.js`:

\`\`\`javascript
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:5173',
    'https://your-domain.com'  // Thêm domain mới
  ],
  credentials: true
}))
\`\`\`

---

## 💾 Dữ liệu Mock

### Users
- **Email**: admin@rareperfume.com
- **Password**: admin123
- **Role**: admin

### Products
- Chanel No. 5 (luxury, featured)
- Dior Sauvage (mens, new)
- Tom Ford Black Orchid (unisex, featured + new)

### Payment Methods
- Chuyển khoản ngân hàng
- MoMo
- ZaloPay  
- VNPay

---

## 🔍 Debugging

### Kiểm tra Health
\`\`\`bash
curl http://localhost:3001/health
\`\`\`

### Logs
Server sẽ log tất cả requests. Nếu có lỗi, kiểm tra console output.

### Common Issues

**1. Port đã được sử dụng**
\`\`\`bash
# Tìm process đang dùng port 3001
lsof -i :3001

# Kill process
kill -9 <PID>
\`\`\`

**2. CORS Error**
- Kiểm tra origin trong CORS configuration
- Đảm bảo frontend đang chạy đúng port

**3. Module not found**
\`\`\`bash
npm install
\`\`\`

---

## 🚀 Deployment

### Using PM2
\`\`\`bash
npm install -g pm2
pm2 start server.js --name "rare-perfume-api"
pm2 startup
pm2 save
\`\`\`

### Using Docker
\`\`\`bash
# Build image
docker build -t rare-perfume-api .

# Run container
docker run -p 3001:3001 rare-perfume-api
\`\`\`

---

## 📞 Support

Nếu gặp vấn đề:
1. Kiểm tra console logs
2. Test với curl commands ở trên
3. Verify port và CORS configuration
4. Restart server

**API đã sẵn sàng để kết nối với frontend! 🎉** 
