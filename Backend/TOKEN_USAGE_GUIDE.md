# Hướng dẫn sử dụng JWT Token Authentication

## 1. Đăng nhập để lấy token

### Đăng nhập cho Đọc giả:
```
POST /api/auth/login/docgia
Content-Type: application/json

{
  "TenTaiKhoan": "username",
  "MatKhau": "password"
}
```

### Đăng nhập cho Nhân viên:
```
POST /api/auth/login/nhanvien
Content-Type: application/json

{
  "TenTaiKhoan": "username", 
  "MatKhau": "password"
}
```

### Response sẽ trả về:
```json
{
  "success": true,
  "message": "Đăng nhập thành công",
  "data": {
    "Token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

## 2. Cách truyền token trong request

### Trong Header Authorization:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Ví dụ với fetch JavaScript:
```javascript
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...";

fetch('/api/docgia/get-all-dg', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
})
```

### Ví dụ với axios:
```javascript
const token = localStorage.getItem('token');

axios.get('/api/docgia/get-all-dg', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
})
```

### Ví dụ với Postman:
1. Vào tab "Authorization"
2. Chọn Type: "Bearer Token"
3. Paste token vào field "Token"

## 3. Các API endpoints đã được bảo vệ

### Authentication APIs:
- `POST /api/auth/login/docgia` - Đăng nhập đọc giả (public)
- `POST /api/auth/login/nhanvien` - Đăng nhập nhân viên (public)
- `POST /api/auth/refresh` - Làm mới token (cần token)
- `GET /api/auth/me` - Lấy thông tin user hiện tại (cần token)

### DocGia APIs (đã được bảo vệ):
- `POST /api/docgia/add-dg` - Tạo đọc giả (public)
- `GET /api/docgia/get-all-dg` - Lấy tất cả đọc giả (Admin, NhanVien)
- `GET /api/docgia/get-dg-by-custom-id/:id` - Lấy đọc giả theo custom ID (Admin, NhanVien)
- `GET /api/docgia/get-dg/:id` - Lấy đọc giả theo ID (Admin hoặc chính user đó)
- `PUT /api/docgia/update-dg/:id` - Cập nhật đọc giả (Admin hoặc chính user đó)
- `DELETE /api/docgia/delete-dg/:id` - Xóa đọc giả (chỉ Admin)

## 4. Phân quyền

### Roles hỗ trợ:
- `Admin` - Toàn quyền
- `NhanVien` - Quyền hạn hạn chế
- `DocGia` - Chỉ truy cập được tài nguyên của chính mình

### Middleware phân quyền:
- `authenticate` - Kiểm tra token hợp lệ
- `authorize('Admin', 'NhanVien')` - Chỉ Admin và NhanVien
- `authorizeOwner` - Admin hoặc chính user đó

## 5. Xử lý lỗi

### Các lỗi thường gặp:
- `401 Unauthorized` - Token không hợp lệ hoặc hết hạn
- `403 Forbidden` - Không có quyền truy cập
- `404 Not Found` - Route không tồn tại

### Response lỗi:
```json
{
  "success": false,
  "message": "Token đã hết hạn",
  "error": "TokenExpiredError"
}
```

## 6. Refresh token

### Khi token hết hạn:
```
POST /api/auth/refresh
Authorization: Bearer <old_token>
```

### Response:
```json
{
  "success": true,
  "message": "Làm mới token thành công",
  "data": {
    "Token": "new_token_here"
  }
}
```

## 7. Best practices

1. Lưu token vào localStorage hoặc sessionStorage
2. Luôn kiểm tra token expiry
3. Implement auto-refresh token
4. Xử lý logout để clear token
5. Sử dụng HTTPS trong production

## 8. Frontend implementation example

```javascript
class AuthService {
  static setToken(token) {
    localStorage.setItem('token', token);
  }
  
  static getToken() {
    return localStorage.getItem('token');
  }
  
  static removeToken() {
    localStorage.removeItem('token');
  }
  
  static isTokenExpired(token) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp < Date.now() / 1000;
    } catch {
      return true;
    }
  }
  
  static async makeAuthenticatedRequest(url, options = {}) {
    const token = this.getToken();
    
    if (!token || this.isTokenExpired(token)) {
      // Redirect to login or refresh token
      window.location.href = '/login';
      return;
    }
    
    return fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
  }
}
```
