# 🚀 Hướng dẫn Kết nối Frontend với Backend - Hoàn chỉnh

## ✅ Setup trong 10 phút

### Bước 1: Tạo file Environment Variables

#### 1.1. Frontend (.env.local)
Tạo file `.env.local` trong thư mục gốc:

```env
# 🔗 URL Backend của bạn  
VITE_API_BASE_URL=http://localhost:3001/api

# 💳 Thông tin thanh toán (thay bằng thông tin thật)
VITE_BANK_CODE=VCB
VITE_ACCOUNT_NUMBER=1234567890
VITE_ACCOUNT_HOLDER=NGUYEN VAN A

# 🛠️ Development settings
VITE_APP_ENVIRONMENT=development
VITE_DEBUG=true
```

#### 1.2. Backend (.env)
Tạo file `.env` trong thư mục `backend/`:

```env
# Server Configuration
PORT=3001
NODE_ENV=development

# Bank Information (for QR code generation)
BANK_CODE=VCB
ACCOUNT_NUMBER=1234567890
ACCOUNT_HOLDER=NGUYEN VAN A

# CORS Origins
CORS_ORIGINS=http://localhost:3000,http://localhost:5173

# Security
JWT_SECRET=changeme
```
👉 **Lưu ý**: Hãy thay đổi `JWT_SECRET` thành giá trị bảo mật khi triển khai sản phẩm thực tế.

### Bước 2: Cài đặt Dependencies

#### 2.1. Frontend (thư mục gốc)
```bash
npm install
```

#### 2.2. Backend
```bash
cd backend
npm install
```

### Bước 3: Khởi chạy

#### Cách 1: Chạy đồng thời (Recommended)
```bash
# Terminal 1 - Frontend
npm run dev

# Terminal 2 - Backend  
cd backend && npm run dev
```

#### Cách 2: Chạy lần lượt
```bash
# Khởi động backend trước
cd backend
npm run dev

# Mở terminal mới, khởi động frontend
npm run dev
```

### Bước 4: Kiểm tra

✅ **Frontend**: http://localhost:5173 (hoặc :3000)  
✅ **Backend**: http://localhost:3001  
✅ **API Health**: http://localhost:3001/health

---

## 🧪 Test kết nối

### 1. Test Backend API
```bash
# Health check
curl http://localhost:3001/health

# Login test
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@rareperfume.com","password":"admin123"}'

# Get products
curl http://localhost:3001/api/products/featured
```

### 2. Test Frontend
1. Mở http://localhost:5173
2. Mở Developer Tools (F12) → Console
3. Xem logs để kiểm tra API calls
4. Thử login với: `admin@rareperfume.com` / `admin123`

---

## 📊 API Endpoints hoàn chỉnh

### 🔐 Authentication
```
POST   /api/auth/login         # Đăng nhập
POST   /api/auth/register      # Đăng ký  
GET    /api/auth/me            # Thông tin user
POST   /api/auth/refresh       # Refresh token
POST   /api/auth/logout        # Đăng xuất
```

### 📦 Orders
```
POST   /api/orders                    # Tạo đơn hàng
GET    /api/orders/:id                # Chi tiết đơn hàng
PATCH  /api/orders/:id/status         # Cập nhật trạng thái
GET    /api/orders/users/:userId      # Đơn hàng của user
GET    /api/orders                    # Danh sách đơn hàng (admin)
PUT    /api/orders/:id                # Cập nhật đơn hàng
DELETE /api/orders/:id                # Xóa đơn hàng
PATCH  /api/orders/:id/payment-status # Cập nhật thanh toán
PATCH  /api/orders/:id/tracking       # Thêm tracking
```

### 🛍️ Products
```
GET    /api/products                  # Danh sách sản phẩm
GET    /api/products/:id              # Chi tiết sản phẩm
GET    /api/products/featured         # Sản phẩm nổi bật
GET    /api/products/new              # Sản phẩm mới
GET    /api/products/categories       # Danh mục sản phẩm
POST   /api/products                  # Tạo sản phẩm (admin)
PUT    /api/products/:id              # Cập nhật sản phẩm (admin)
DELETE /api/products/:id              # Xóa sản phẩm (admin)
PATCH  /api/products/:id/stock        # Cập nhật tồn kho
POST   /api/products/bulk-delete      # Xóa hàng loạt
```

### 💳 Payments
```
GET    /api/payments/methods          # Phương thức thanh toán
POST   /api/payments/create-intent    # Tạo payment intent
GET    /api/payments/:id/status       # Trạng thái thanh toán
POST   /api/payments/generate-qr      # Tạo QR code
POST   /api/payments/:id/process      # Xử lý thanh toán
POST   /api/payments/:id/confirm      # Xác nhận thanh toán (admin)
GET    /api/payments/history          # Lịch sử thanh toán
POST   /api/payments/:id/refund       # Hoàn tiền
GET    /api/payments/analytics        # Thống kê thanh toán
```

---

## 🔧 Cấu hình CORS

Backend đã được cấu hình CORS để cho phép requests từ:
- `http://localhost:3000` (React CRA)
- `http://localhost:5173` (Vite dev server)
- `http://127.0.0.1:3000` và `http://127.0.0.1:5173`

---

## 💾 Mock Data có sẵn

### 👤 User Account
- **Email**: admin@rareperfume.com
- **Password**: admin123
- **Role**: admin

### 🛍️ Sample Products
- **Chanel No. 5** (luxury, featured) - 1,500,000 VND
- **Dior Sauvage** (mens, new) - 1,200,000 VND  
- **Tom Ford Black Orchid** (unisex, featured + new) - 2,200,000 VND

### 💳 Payment Methods
- Chuyển khoản ngân hàng (VCB - 1234567890)
- MoMo
- ZaloPay
- VNPay

---

## 🛟 Troubleshooting

### ❌ CORS Error
```
Access to fetch at 'http://localhost:3001/api/orders' 
from origin 'http://localhost:5173' has been blocked by CORS policy
```
**Fix**: 
1. Kiểm tra backend có đang chạy không
2. Verify CORS configuration trong `backend/server.js`

### ❌ Connection Refused
```
Failed to fetch: ERR_CONNECTION_REFUSED
```
**Fix**:
1. Kiểm tra backend đang chạy trên port 3001
2. Test API: `curl http://localhost:3001/health`

### ❌ Module not found
```bash
# Frontend
npm install

# Backend  
cd backend && npm install
```

### ❌ Port already in use
```bash
# Tìm process đang dùng port
lsof -i :3001  # hoặc :5173

# Kill process
kill -9 <PID>
```

### ❌ Environment variables not loaded
1. Kiểm tra file `.env.local` trong thư mục gốc
2. Kiểm tra file `.env` trong thư mục `backend/`
3. Restart cả frontend và backend

---

## 📱 Test Checkout Flow

### Kịch bản Test
1. **Mở Frontend**: http://localhost:5173
2. **Browse Products**: Xem sản phẩm featured/new
3. **Add to Cart**: Thêm sản phẩm vào giỏ hàng
4. **Checkout**: Điền thông tin khách hàng
5. **Payment**: Chọn phương thức thanh toán
6. **Order Created**: Kiểm tra console logs

### Console Logs cần xem
```javascript
// API calls thành công
✅ GET /api/products/featured - 200 OK
✅ POST /api/orders - 201 Created
✅ POST /api/payments/create-intent - 200 OK
✅ POST /api/payments/generate-qr - 200 OK

// Nếu backend chưa sẵn sàng (sẽ fallback to mock)
⚠️ Using simulation mode for API calls
```

---

## 🌟 Tính năng đã hoạt động

### ✅ Simulation Mode
- Frontend tự động fallback nếu backend không available
- Mock data cho demo và testing
- Console logs chi tiết cho debugging

### ✅ Real Backend Mode  
- Khi backend chạy trên localhost:3001
- Real-time API calls
- Database persistence (in-memory)
- CORS properly configured

### ✅ Authentication Flow
- JWT-based authentication
- Token auto-refresh
- Protected routes
- Role-based access

### ✅ E-commerce Features
- Product catalog với featured/new
- Shopping cart functionality
- Order management
- Payment processing với QR codes
- Inventory tracking

---

## 🎯 Next Steps

### 1. Production Setup
- Thay mock data bằng real database (MongoDB/PostgreSQL)
- Setup real payment gateways
- Deploy lên cloud (Vercel + Railway/Render)

### 2. Enhanced Features
- Real-time notifications
- Email confirmations
- Advanced search/filtering
- Inventory alerts

### 3. Security Improvements
- Hash passwords với bcrypt
- Rate limiting
- Input validation
- HTTPS deployment

---

## 📞 Support

Nếu gặp vấn đề:

1. **Check Logs**: Console output trong terminal
2. **Test API**: Dùng curl commands ở trên
3. **Verify Ports**: Frontend (5173), Backend (3001)
4. **Check Files**: `.env.local` và `backend/.env`

**🎉 Chúc mừng! Frontend và Backend đã kết nối thành công!**

---

## 📋 Checklist

- [ ] Tạo `.env.local` cho frontend
- [ ] Tạo `backend/.env` cho backend  
- [ ] Cài đặt dependencies cho cả 2
- [ ] Khởi động backend (port 3001)
- [ ] Khởi động frontend (port 5173)
- [ ] Test API health check
- [ ] Test login với admin account
- [ ] Test product listing
- [ ] Test order creation
- [ ] Verify console logs không có lỗi

**Hoàn thành checklist = Hệ thống hoạt động hoàn hảo! 🚀** 
