# Hướng dẫn sử dụng hệ thống Quản lý Tình trạng Sách Mượn

## 📋 Tổng quan

Hệ thống quản lý tình trạng sách mượn cho phép nhân viên và admin duyệt yêu cầu mượn sách, xác nhận trả sách, xử lý phạt quá hạn và theo dõi trạng thái sách.

## 🔄 Quy trình Mượn/Trả Sách

### Các trạng thái:
1. **CHO_DUYET**: Đọc giả đã gửi yêu cầu mượn, chờ nhân viên duyệt
2. **DA_DUYET**: Nhân viên đã duyệt, đọc giả đang mượn sách
3. **DA_TRA**: Đọc giả đã trả sách

### Quy trình xử lý:
```
Đọc giả gửi yêu cầu → CHO_DUYET
                          ↓
              Nhân viên duyệt/từ chối
                          ↓
              DA_DUYET (Đang mượn) → Kiểm tra quá hạn
                          ↓              ↓
                    Trả sách         Phạt (nếu có)
                          ↓              ↓
                        DA_TRA ←────────┘
```

## 🎯 API Endpoints

### Backend (đã hoàn thiện)

**Base URL:** `/api/tinhtrangsachmuon`

#### 1. Xác nhận cho mượn sách
```http
PUT /xac-nhan-cho-muon-sach/:id
Authorization: Bearer <token>
Roles: ADMIN, NHAN_VIEN
```

#### 2. Xác nhận đã trả sách
```http
PUT /xac-nhan-da-tra-sach/:id
Authorization: Bearer <token>
Roles: ADMIN, NHAN_VIEN
```

#### 3. Phạt mượn sách quá hạn
```http
PUT /phat-muon-sach-qua-han/:id
Authorization: Bearer <token>
Roles: ADMIN, NHAN_VIEN

Body:
{
  "soTienPhat": 50000
}
```

#### 4. Từ chối cho mượn sách
```http
DELETE /tu-choi-cho-muon-sach/:id
Authorization: Bearer <token>
Roles: ADMIN, NHAN_VIEN

Body (optional):
{
  "lyDo": "Sách đã hết"
}
```

#### 5. Lấy danh sách theo trạng thái
```http
GET /danh-sach-cho-duyet
GET /danh-sach-da-duyet
GET /danh-sach-da-tra
GET /danh-sach-qua-han
Authorization: Bearer <token>
Roles: ADMIN, NHAN_VIEN
```

## 💻 Frontend - NhanVienDashboard

### Các tab chính:

#### 1. **Chờ duyệt** (CHO_DUYET)
- Hiển thị danh sách yêu cầu mượn sách đang chờ duyệt
- Thao tác:
  - ✅ **Duyệt**: Xác nhận cho mượn (chuyển sang DA_DUYET)
  - ❌ **Từ chối**: Từ chối yêu cầu (xóa khỏi hệ thống)

#### 2. **Đang mượn** (DA_DUYET)
- Hiển thị danh sách sách đang được mượn
- Hiển thị trạng thái: Đúng hạn / Quá hạn
- Thao tác:
  - ✅ **Đã trả**: Xác nhận đọc giả đã trả sách

#### 3. **Quá hạn**
- Hiển thị danh sách sách mượn quá hạn
- Tính số ngày quá hạn tự động
- Thao tác:
  - 💰 **Phạt**: Mở modal nhập số tiền phạt (mặc định 5,000đ/ngày)
  - ✅ **Đã trả**: Xác nhận đã trả (có thể kèm phạt)

#### 4. **Đã trả** (DA_TRA)
- Lịch sử các sách đã được trả
- Hiển thị số tiền phạt (nếu có)

## 🚀 Cách sử dụng

### 1. Đăng nhập với tài khoản nhân viên
```
URL: http://localhost:5173/auth/login
Chọn: Nhân viên
```

### 2. Vào Dashboard Nhân viên
```
URL: http://localhost:5173/nhanvien/dashboard
```

### 3. Click tab "Quản lý mượn/trả sách"

### 4. Xử lý yêu cầu mượn sách
- Tab **Chờ duyệt**: Duyệt hoặc từ chối yêu cầu
- Tab **Đang mượn**: Theo dõi sách đang được mượn
- Tab **Quá hạn**: Xử lý phạt và xác nhận trả sách quá hạn
- Tab **Đã trả**: Xem lịch sử

## 📊 Tính năng nổi bật

### ✅ Tự động tính toán
- Tự động phát hiện sách quá hạn
- Tính số ngày quá hạn
- Đề xuất số tiền phạt (5,000đ/ngày)

### 📱 Giao diện trực quan
- Badge hiển thị số lượng ở mỗi tab
- Màu sắc phân biệt trạng thái:
  - 🟡 Chờ duyệt
  - 🔵 Đang mượn
  - 🔴 Quá hạn
  - 🟢 Đã trả
- Table responsive, dễ sử dụng

### 🔔 Thông báo
- Xác nhận trước khi thực hiện thao tác
- Thông báo thành công/thất bại
- Hiển thị lỗi từ server

## 🔧 Cấu trúc Code

### Backend
```
Backend/
├── Controllers/
│   └── TinhTrangSachMuonController.ts    # ✨ MỚI
├── Services/
│   └── TinhTrangSachMuonService.ts       # ✅ Đã hoàn thiện
├── Routers/
│   └── TinhTrangSachMuonRouter.ts        # ✅ Đã hoàn thiện
└── server.ts                              # ✅ Đã đăng ký router
```

### Frontend
```
frontend/src/
├── components/
│   └── QuanLySachMuon.vue                 # ✨ MỚI - Component chính
├── services/
│   └── tinhTrangSachMuonService.ts        # ✨ MỚI - API service
└── views/dashboard/
    └── NhanVienDashboard.vue              # ✅ Đã tích hợp
```

## 📝 Lưu ý

### 1. Quy tắc nghiệp vụ
- Chỉ có thể từ chối yêu cầu ở trạng thái CHO_DUYET
- Phải duyệt cho mượn trước khi có thể xác nhận trả
- Chỉ có thể phạt khi sách thực sự quá hạn

### 2. Phân quyền
- Cần đăng nhập với tài khoản ADMIN hoặc NHAN_VIEN
- Token được tự động gửi kèm trong request headers

### 3. Xử lý lỗi
- Tất cả lỗi đều được xử lý và hiển thị thông báo cho user
- Validation ở cả frontend và backend

## 🎉 Hoàn thành!

Hệ thống quản lý tình trạng sách mượn đã hoàn thiện với đầy đủ tính năng:
- ✅ Backend API hoàn chỉnh
- ✅ Frontend component với UI đẹp
- ✅ Tích hợp vào NhanVienDashboard
- ✅ Xử lý quá hạn và phạt tự động
- ✅ Theo dõi trạng thái real-time

Nhân viên có thể dễ dàng quản lý toàn bộ quy trình mượn/trả sách ngay trong dashboard!

