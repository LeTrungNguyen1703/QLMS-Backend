# Staff Management Architecture

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND (Vue 3)                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │         AdminDashboard.vue (Container)                    │ │
│  │  ┌─────────────────────────────────────────────────────┐ │ │
│  │  │  Tab: "Quản lý người dùng"                          │ │ │
│  │  │  ┌───────────────────────────────────────────────┐  │ │ │
│  │  │  │   StaffManagement.vue (Component)            │  │ │ │
│  │  │  │                                               │  │ │ │
│  │  │  │   ┌─────────────────────────────────────┐    │  │ │ │
│  │  │  │   │  Staff List Table                   │    │  │ │ │
│  │  │  │   │  - MSNV, Name, Email, Phone, etc.   │    │  │ │ │
│  │  │  │   │  - Search Bar                       │    │  │ │ │
│  │  │  │   │  - Action Buttons                   │    │  │ │ │
│  │  │  │   └─────────────────────────────────────┘    │  │ │ │
│  │  │  │                                               │  │ │ │
│  │  │  │   ┌─────────────────────────────────────┐    │  │ │ │
│  │  │  │   │  Modals                             │    │  │ │ │
│  │  │  │   │  - Create Staff Modal               │    │  │ │ │
│  │  │  │   │  - Edit Staff Modal                 │    │  │ │ │
│  │  │  │   │  - View Details Modal               │    │  │ │ │
│  │  │  │   │  - Delete Confirmation Modal        │    │  │ │ │
│  │  │  │   └─────────────────────────────────────┘    │  │ │ │
│  │  │  │                                               │  │ │ │
│  │  │  └───────────────────────────────────────────────┘  │ │ │
│  │  └─────────────────────────────────────────────────────┘ │ │
│  └───────────────────────────────────────────────────────────┘ │
│                             │                                   │
│                             ▼                                   │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │    nhanVienService.ts (Service Layer)                     │ │
│  │                                                            │ │
│  │    - getAllNhanVien()                                     │ │
│  │    - getNhanVienById(id)                                  │ │
│  │    - createNhanVien(data)                                 │ │
│  │    - updateNhanVien(id, data)                             │ │
│  │    - deleteNhanVien(id)                                   │ │
│  │                                                            │ │
│  │    [Axios Instance with JWT Token Interceptor]            │ │
│  └───────────────────────────────────────────────────────────┘ │
│                             │                                   │
└─────────────────────────────┼───────────────────────────────────┘
                              │
                              │ HTTP Requests (Authorization: Bearer <token>)
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      BACKEND (Express.js)                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │         server.ts                                          │ │
│  │         app.use("/api/nhanvien", routerNhanVien)          │ │
│  └───────────────────────────────────────────────────────────┘ │
│                             │                                   │
│                             ▼                                   │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │    NhanVienRouter.ts (Routes)                             │ │
│  │                                                            │ │
│  │    GET    /api/nhanvien/       → getallNV                 │ │
│  │    GET    /api/nhanvien/:id    → getNV                    │ │
│  │    POST   /api/nhanvien/       → addNV                    │ │
│  │    PUT    /api/nhanvien/:id    → updateNV                 │ │
│  │    DELETE /api/nhanvien/:id    → deleteNV                 │ │
│  │                                                            │ │
│  │    [Middleware: TokenMiddleware.authenticate]             │ │
│  │    [Middleware: TokenMiddleware.authorize(ADMIN)]         │ │
│  └───────────────────────────────────────────────────────────┘ │
│                             │                                   │
│                             ▼                                   │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │    NhanVienController.ts (Controllers)                    │ │
│  │                                                            │ │
│  │    - addNV(req, res)                                      │ │
│  │    - updateNV(req, res)                                   │ │
│  │    - getNV(req, res)                                      │ │
│  │    - deleteNV(req, res)                                   │ │
│  │    - getallNV(req, res)                                   │ │
│  └───────────────────────────────────────────────────────────┘ │
│                             │                                   │
│                             ▼                                   │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │    NhanVienService.ts (Business Logic)                    │ │
│  │                                                            │ │
│  │    - createNhanVien(dto)                                  │ │
│  │    - updateNhanVien(id, dto)                              │ │
│  │    - getNhanVienById(id)                                  │ │
│  │    - deleteNhanVien(id)                                   │ │
│  │    - getAllNhanVien()                                     │ │
│  └───────────────────────────────────────────────────────────┘ │
│                             │                                   │
│                             ▼                                   │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │    NhanVienRepository.ts (Data Access)                    │ │
│  │                                                            │ │
│  │    - create(entity)                                       │ │
│  │    - update(id, entity)                                   │ │
│  │    - getById(id)                                          │ │
│  │    - delete(id)                                           │ │
│  │    - getAll()                                             │ │
│  └───────────────────────────────────────────────────────────┘ │
│                             │                                   │
└─────────────────────────────┼───────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                       DATABASE (MongoDB)                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Collection: nhanviens                                          │
│                                                                 │
│  Document Schema:                                               │
│  {                                                              │
│    _id: ObjectId                                                │
│    MSNV: String (unique)                                        │
│    TenTaiKhoan: String (unique)                                 │
│    MatKhau: String (hashed)                                     │
│    HoTenNV: String                                              │
│    NgaySinh: Date                                               │
│    Phai: String                                                 │
│    DiaChi: String                                               │
│    SoDienThoai: String                                          │
│    Email: String                                                │
│    ChucVu: String                                               │
│  }                                                              │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## Data Flow

### 1. Loading Staff List (GET)
```
User clicks "Quản lý người dùng" tab
  ↓
StaffManagement.vue → onMounted() → loadStaff()
  ↓
nhanVienService.getAllNhanVien()
  ↓
GET /api/nhanvien/ (with JWT token)
  ↓
NhanVienRouter → TokenMiddleware → NhanVienController.getallNV()
  ↓
NhanVienService.getAllNhanVien()
  ↓
NhanVienRepository.getAll()
  ↓
MongoDB Query → Returns array of staff documents
  ↓
Transform to NhanVienResponse DTOs
  ↓
Return JSON: { message: "Success", data: [...] }
  ↓
Frontend updates staffList and filteredStaff
  ↓
Table displays staff members
```

### 2. Creating Staff (POST)
```
User clicks "Thêm nhân viên mới"
  ↓
Modal opens with empty form
  ↓
User fills form and clicks "Thêm nhân viên"
  ↓
handleCreate() validates and prepares CreateNhanVienRequest
  ↓
nhanVienService.createNhanVien(data)
  ↓
POST /api/nhanvien/ (with JWT token and form data)
  ↓
NhanVienRouter → TokenMiddleware (Admin check) → NhanVienController.addNV()
  ↓
NhanVienService.createNhanVien(dto)
  ↓
Hash password, generate MSNV
  ↓
NhanVienRepository.create(entity)
  ↓
MongoDB inserts new document
  ↓
Return created staff as NhanVienResponse
  ↓
Frontend shows success message
  ↓
Reload staff list
  ↓
Close modal after 1.5s
```

### 3. Updating Staff (PUT)
```
User clicks pencil icon on staff row
  ↓
editStaff() populates form with existing data
  ↓
Modal opens with pre-filled form
  ↓
User modifies fields and clicks "Cập nhật"
  ↓
handleUpdate() prepares UpdateNhanVienRequest
  ↓
nhanVienService.updateNhanVien(id, data)
  ↓
PUT /api/nhanvien/:id (with JWT token and update data)
  ↓
NhanVienRouter → TokenMiddleware → NhanVienController.updateNV()
  ↓
NhanVienService.updateNhanVien(id, dto)
  ↓
NhanVienRepository.update(id, entity)
  ↓
MongoDB updates document
  ↓
Return success message
  ↓
Frontend shows success message
  ↓
Reload staff list
  ↓
Close modal after 1.5s
```

### 4. Deleting Staff (DELETE)
```
User clicks trash icon on staff row
  ↓
confirmDelete() sets selectedStaff
  ↓
Confirmation modal opens with warning
  ↓
User clicks "Xóa nhân viên"
  ↓
handleDelete() calls service
  ↓
nhanVienService.deleteNhanVien(id)
  ↓
DELETE /api/nhanvien/:id (with JWT token)
  ↓
NhanVienRouter → TokenMiddleware → NhanVienController.deleteNV()
  ↓
NhanVienService.deleteNhanVien(id)
  ↓
NhanVienRepository.delete(id)
  ↓
MongoDB removes document
  ↓
Return success message
  ↓
Frontend reloads staff list
  ↓
Close confirmation modal
```

### 5. Searching Staff (Client-side)
```
User types in search box
  ↓
@input event → filterStaff()
  ↓
Normalize search query (lowercase, trim)
  ↓
Filter staffList by:
  - HoTenNV.includes(query)
  - Email.includes(query)
  - SoDienThoai.includes(query)
  - TenTaiKhoan.includes(query)
  - MSNV.includes(query)
  ↓
Update filteredStaff reactive array
  ↓
Table automatically re-renders with filtered results
```

## Security Flow

### Authentication & Authorization
```
Request from Frontend
  ↓
Token in Authorization header: Bearer <JWT>
  ↓
TokenMiddleware.authenticate
  ↓
Verify JWT signature and expiration
  ↓
If invalid → 401 Unauthorized
  ↓
If valid → Extract user info
  ↓
TokenMiddleware.authorize(UserRole.ADMIN)
  ↓
Check if user.role === 'ADMIN'
  ↓
If not Admin → 403 Forbidden
  ↓
If Admin → Proceed to controller
```

## Component State Management

### StaffManagement.vue State
```typescript
// Data State
staffList: ref<NhanVien[]>([])           // All staff from API
filteredStaff: ref<NhanVien[]>([])       // Filtered results
searchQuery: ref<string>('')              // Search input

// UI State
loading: ref<boolean>(false)              // Loading indicator
error: ref<string>('')                    // Error messages
showCreateModal: ref<boolean>(false)      // Create modal visibility
showEditModal: ref<boolean>(false)        // Edit modal visibility
showViewModal: ref<boolean>(false)        // View modal visibility
showDeleteModal: ref<boolean>(false)      // Delete modal visibility

// Form State
formData: ref<any>({ ... })               // Form input values
formLoading: ref<boolean>(false)          // Form submission loading
formError: ref<string>('')                // Form error messages
formSuccess: ref<string>('')              // Form success messages
showPassword: ref<boolean>(false)         // Password visibility toggle

// Selected State
selectedStaff: ref<NhanVien | null>(null) // Currently selected staff
deleteLoading: ref<boolean>(false)        // Delete operation loading
```

## Error Handling Strategy

```
Try-Catch Blocks
  ↓
API Call Fails
  ↓
Catch Block
  ↓
Check if err.response exists
  ↓
If yes → Extract err.response.data.message
  ↓
If no → Use generic fallback message
  ↓
Set error/formError state
  ↓
Display in UI (alert component)
  ↓
Log to console for debugging
  ↓
Reset loading states
```

## Technology Stack Summary

```
┌─────────────────────────────────────┐
│         FRONTEND STACK              │
├─────────────────────────────────────┤
│ Framework:    Vue 3                 │
│ Language:     TypeScript            │
│ API Client:   Axios                 │
│ UI Library:   Bootstrap 5           │
│ Icons:        Bootstrap Icons       │
│ State:        Composition API (ref) │
│ Routing:      Vue Router            │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│         BACKEND STACK               │
├─────────────────────────────────────┤
│ Framework:    Express.js            │
│ Language:     TypeScript            │
│ Database:     MongoDB + Mongoose    │
│ Auth:         JWT (jsonwebtoken)    │
│ Validation:   class-validator       │
│ Transform:    class-transformer     │
└─────────────────────────────────────┘
```

## File Structure
```
QLMS/
├── Backend/
│   ├── Controllers/
│   │   └── NhanVienController.ts      ✅ Handles HTTP requests
│   ├── Services/
│   │   └── NhanVienService.ts         ✅ Business logic
│   ├── Repositories/
│   │   └── NhanVienRepository.ts      ✅ Data access
│   ├── Routers/
│   │   └── NhanVienRouter.ts          ✅ Route definitions
│   ├── Models/
│   │   └── NHANVIEN.ts                ✅ Mongoose schema
│   └── DTO/
│       ├── Request/
│       │   └── NhanVienRequest.ts     ✅ Input validation
│       └── Response/
│           └── NhanVienResponse.ts    ✅ Output formatting
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   └── StaffManagement.vue    ✅ NEW: Main component
    │   ├── services/
    │   │   └── nhanVienService.ts     ✅ NEW: API service
    │   └── views/
    │       └── dashboard/
    │           └── AdminDashboard.vue ✅ UPDATED: Integration
    │
    └── Documentation/
        ├── STAFF_MANAGEMENT_GUIDE.md  ✅ NEW: Implementation guide
        └── STAFF_MANAGEMENT_TEST.md   ✅ NEW: Testing guide
```

---

**Architecture Status**: ✅ Complete and Production Ready
**Last Updated**: December 3, 2025

