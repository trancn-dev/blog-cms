# CMS Admin Panel - Setup Documentation

## 📋 Tổng quan
CMS Admin Panel được xây dựng với Vue.js 3 và Vuetify 3, kết nối với Laravel API.

## 🚀 Cài đặt

### 1. Cài đặt dependencies
```bash
cd cms
npm install
```

### 2. Cấu hình môi trường
File `.env` đã được tạo với cấu hình mặc định:
```env
VITE_API_BASE_URL=http://localhost:8000/api
VITE_API_TIMEOUT=30000
VITE_APP_NAME=CMS Admin
VITE_APP_PORT=3000
```

**Lưu ý:** Điều chỉnh `VITE_API_BASE_URL` nếu API Laravel chạy ở port khác.

### 3. Chạy dự án
```bash
npm run dev
```

CMS sẽ chạy tại: `http://localhost:3000`

## 📁 Cấu trúc dự án

```
cms/
├── src/
│   ├── api/              # API calls
│   │   └── index.js      # Tất cả API endpoints
│   ├── config/           # Cấu hình
│   │   └── axios.js      # Axios instance với interceptors
│   ├── router/           # Vue Router
│   │   └── index.js      # Routes và navigation guards
│   ├── stores/           # Pinia stores
│   │   └── auth.js       # Auth store
│   ├── views/            # Pages/Views
│   │   ├── Login.vue     # Trang đăng nhập
│   │   └── Dashboard.vue # Trang dashboard
│   ├── components/       # Vue components
│   ├── plugins/          # Vue plugins (Vuetify, Router, Pinia)
│   ├── App.vue          # Root component
│   └── main.js          # Entry point
├── .env                 # Environment variables
├── .env.example         # Environment template
└── package.json         # Dependencies

```

## 🔧 Các tính năng đã setup

### ✅ Axios Configuration
- Base URL từ environment variables
- Request interceptor: Tự động thêm Bearer token
- Response interceptor: Xử lý lỗi 401, 403, 404, 500
- Timeout configuration

### ✅ API Integration
Đã tạo sẵn API endpoints cho:
- **Auth**: login, logout, me, refresh
- **Posts**: CRUD operations
- **Categories**: CRUD operations
- **Tags**: CRUD operations
- **Projects**: CRUD operations
- **Skills**: CRUD operations
- **Comments**: approve, reject, delete
- **Media**: upload, delete
- **About**: CRUD operations

### ✅ Vue Router
- Route protection với authentication guard
- Lazy loading components
- Routes:
  - `/login` - Trang đăng nhập
  - `/dashboard` - Trang chính (yêu cầu auth)

### ✅ Pinia Store
- Auth store với:
  - State: user, token
  - Getters: isAuthenticated
  - Actions: login, logout, fetchUser
  - LocalStorage persistence

### ✅ Vuetify UI
- Material Design components
- Responsive layout
- Theme configuration

## 🔐 Authentication Flow

1. User nhập email/password tại `/login`
2. API call đến `POST /api/auth/login`
3. Nhận token và lưu vào localStorage
4. Token được tự động thêm vào mọi API request
5. Nếu token hết hạn (401), tự động redirect về login

## 📝 Cách sử dụng API

```javascript
import { postsAPI } from '@/api'

// Get all posts
const posts = await postsAPI.getAll({ page: 1, limit: 10 })

// Create new post
const newPost = await postsAPI.create({
  title: 'My Post',
  content: 'Content here...'
})

// Update post
await postsAPI.update(postId, { title: 'Updated Title' })

// Delete post
await postsAPI.delete(postId)
```

## 🔄 Kết nối với Laravel API

Đảm bảo Laravel API đang chạy:
```bash
cd devkit
php artisan serve
```

API sẽ chạy tại: `http://localhost:8000`

### CORS Configuration
Trong Laravel, cấu hình CORS tại `config/cors.php`:
```php
'paths' => ['api/*'],
'allowed_origins' => ['http://localhost:3000'],
'allowed_methods' => ['*'],
'allowed_headers' => ['*'],
'exposed_headers' => [],
'max_age' => 0,
'supports_credentials' => true,
```

## 📦 Dependencies chính

- **vue**: ^3.5.21
- **vuetify**: ^3.10.1
- **vue-router**: ^4.x
- **pinia**: Latest
- **axios**: Latest
- **vite**: ^7.1.5

## 🎯 Các bước tiếp theo

1. ✅ Setup cơ bản đã hoàn thành
2. 🔲 Tạo các trang quản lý (Posts, Categories, Tags, etc.)
3. 🔲 Thêm layout với sidebar/navbar
4. 🔲 Implement CRUD forms
5. 🔲 Thêm data tables với pagination
6. 🔲 Upload media handling
7. 🔲 Rich text editor cho content
8. 🔲 Validation & error handling
9. 🔲 Toast notifications

## 🐛 Troubleshooting

### Lỗi CORS
- Kiểm tra Laravel CORS config
- Đảm bảo API đang chạy

### Lỗi 401 Unauthorized
- Kiểm tra token trong localStorage
- Verify API endpoint đúng
- Kiểm tra Laravel auth middleware

### Port đã được sử dụng
Thay đổi port trong `.env`:
```env
VITE_APP_PORT=3001
```

Hoặc trong `vite.config.mjs`:
```javascript
server: {
  port: 3001,
}
```
