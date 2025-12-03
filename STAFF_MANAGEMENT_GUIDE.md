# Staff Management Feature - Implementation Guide

## Overview
The Staff Management feature allows Admin users to perform CRUD operations (Create, Read, Update, Delete) on staff members (Nhân viên) in the Library Management System.

## Files Created/Modified

### 1. Frontend Service Layer
**File:** `frontend/src/services/nhanVienService.ts`

This service handles all API calls related to staff management:

#### Interfaces:
- **NhanVien**: Represents a staff member object
  - `_id`: Unique identifier
  - `MSNV`: Staff ID code
  - `TenTaiKhoan`: Username
  - `HoTenNV`: Full name
  - `DiaChi`: Address
  - `SoDienThoai`: Phone number
  - `Email`: Email address
  - `NgaySinh`: Date of birth (optional)
  - `Phai`: Gender (optional)
  - `ChucVu`: Position (optional)

- **CreateNhanVienRequest**: Data required to create a new staff member
  - All required fields: HoTenNV, TenTaiKhoan, MatKhau, NgaySinh, Phai, DiaChi, SoDienThoai, Email
  - Optional: ChucVu (defaults to 'NHAN_VIEN')

- **UpdateNhanVienRequest**: Data for updating existing staff
  - All fields are optional

#### Methods:
```typescript
getAllNhanVien(): Promise<NhanVien[]>        // Get all staff members
getNhanVienById(id): Promise<NhanVien>       // Get staff by ID
createNhanVien(data): Promise<NhanVien>      // Create new staff (Admin only)
updateNhanVien(id, data): Promise<void>      // Update staff info
deleteNhanVien(id): Promise<void>            // Delete staff member
```

#### Authentication:
- Automatically includes JWT token from localStorage in all requests
- Token key: `'token'`
- Header format: `Authorization: Bearer <token>`

### 2. Frontend Component
**File:** `frontend/src/components/StaffManagement.vue`

A comprehensive Vue component with the following features:

#### Features:
1. **Staff List Display**
   - Table view showing all staff members
   - Displays: MSNV, Full Name, Email, Phone, Address
   - Responsive design with hover effects

2. **Search & Filter**
   - Real-time search across multiple fields:
     - Name (HoTenNV)
     - Email
     - Phone number
     - Username (TenTaiKhoan)
     - Staff ID (MSNV)
   - Search is case-insensitive

3. **Create Staff Modal**
   - Full form with all required fields:
     - Full Name (required)
     - Username (required)
     - Password (required, with show/hide toggle)
     - Email (required)
     - Phone number (required)
     - Date of birth (required)
     - Gender (required): Nam/Nữ/Khác
     - Address (required)
     - Position (optional): NHAN_VIEN/QUAN_LY
   - Validation and error handling
   - Success messages with auto-close

4. **Edit Staff Modal**
   - Update staff information
   - Cannot change username or password
   - Same validation as create
   - Pre-fills with existing data

5. **View Details Modal**
   - Read-only view of staff information
   - Avatar with initials
   - Formatted display of all fields

6. **Delete Confirmation**
   - Confirmation modal before deletion
   - Warning about irreversible action
   - Loading state during deletion

#### State Management:
```typescript
staffList: ref<NhanVien[]>          // All staff members
filteredStaff: ref<NhanVien[]>      // Filtered/searched results
searchQuery: ref<string>             // Search input
loading: ref<boolean>                // Loading state
error: ref<string>                   // Error messages
showCreateModal: ref<boolean>        // Create modal visibility
showEditModal: ref<boolean>          // Edit modal visibility
showViewModal: ref<boolean>          // View modal visibility
showDeleteModal: ref<boolean>        // Delete modal visibility
selectedStaff: ref<NhanVien | null>  // Currently selected staff
formData: ref<any>                   // Form input data
formLoading: ref<boolean>            // Form submission loading
formError: ref<string>               // Form error messages
formSuccess: ref<string>             // Form success messages
```

### 3. Integration with Admin Dashboard
**File:** `frontend/src/views/dashboard/AdminDashboard.vue`

#### Changes:
1. Imported `StaffManagement` component
2. Replaced placeholder in "Quản lý người dùng" tab with actual component
3. Tab now shows full staff management interface

#### Tab Structure:
- **Tổng quan (Overview)**: Dashboard cards showing all features
- **Đăng ký nhân viên (Register Staff)**: AdminRegisterNhanVien component
- **Quản lý người dùng (Manage Users)**: **NEW** StaffManagement component
- **Cấu hình hệ thống (System Config)**: Placeholder for future development

## Backend API Endpoints Used

The frontend communicates with these existing backend endpoints:

```
GET    /api/nhanvien/          - Get all staff members
GET    /api/nhanvien/:id       - Get staff by ID
POST   /api/nhanvien/          - Create new staff (Admin only)
PUT    /api/nhanvien/:id       - Update staff
DELETE /api/nhanvien/:id       - Delete staff
```

## User Flow

### Creating a Staff Member:
1. Admin clicks "Thêm nhân viên mới" button
2. Modal opens with create form
3. Admin fills in all required fields
4. Click "Thêm nhân viên"
5. System validates and creates staff
6. Success message displays
7. Staff list refreshes automatically
8. Modal closes after 1.5 seconds

### Editing a Staff Member:
1. Admin clicks pencil icon on staff row
2. Edit modal opens with pre-filled data
3. Admin modifies fields (cannot change username/password)
4. Click "Cập nhật"
5. System validates and updates staff
6. Success message displays
7. Staff list refreshes
8. Modal closes after 1.5 seconds

### Viewing Staff Details:
1. Admin clicks eye icon on staff row
2. View modal opens showing all information
3. Displays avatar with initials
4. Read-only formatted view
5. Click "Đóng" to close

### Deleting a Staff Member:
1. Admin clicks trash icon on staff row
2. Confirmation modal appears
3. Warning message about irreversible action
4. Click "Xóa nhân viên" to confirm
5. Staff is deleted from database
6. List refreshes automatically
7. Modal closes

### Searching Staff:
1. Type in search box
2. Results filter in real-time
3. Searches across: name, email, phone, username, MSNV
4. Clear search to show all staff

## Styling

### Design System:
- **Colors**:
  - Primary: #667eea (Purple gradient)
  - Success: Green
  - Danger: Red
  - Info: Blue
  - Warning: Yellow

- **Components**:
  - Cards with 12px border radius
  - Shadows for depth
  - Hover effects on interactive elements
  - Smooth transitions (0.2s-0.3s)

- **Icons**: Bootstrap Icons
  - bi-people-fill: Staff list
  - bi-person-plus-fill: Add staff
  - bi-eye: View details
  - bi-pencil: Edit
  - bi-trash: Delete
  - bi-search: Search

### Responsive Design:
- Mobile-first approach
- Table is scrollable on small screens
- Modals are centered and scrollable
- Forms adapt to screen size

## Security

1. **Authentication Required**:
   - All requests include JWT token
   - Token stored in localStorage
   - Auto-redirect to login if not authenticated

2. **Authorization**:
   - Only Admin can access Staff Management
   - Create staff endpoint restricted to Admin role
   - Backend validates permissions

3. **Input Validation**:
   - Required field validation
   - Email format validation
   - Phone number format
   - Date validation

## Error Handling

1. **Network Errors**:
   - Display user-friendly error messages
   - Fallback messages for unknown errors
   - Console logging for debugging

2. **API Errors**:
   - Shows error message from backend response
   - Generic fallback: "Operation failed. Please try again!"

3. **Loading States**:
   - Spinners during data fetching
   - Disabled buttons during submission
   - Loading text on buttons

## Future Enhancements

Potential improvements:
1. Pagination for large staff lists
2. Advanced filtering (by position, date range, etc.)
3. Export staff list to CSV/Excel
4. Bulk operations (delete multiple, import from file)
5. Staff activity history
6. Password reset functionality
7. Profile picture upload
8. Email notifications on staff creation
9. Staff statistics dashboard
10. Advanced search with filters

## Testing Checklist

- [ ] Load all staff members on component mount
- [ ] Search functionality works correctly
- [ ] Create new staff with all required fields
- [ ] Form validation prevents invalid submissions
- [ ] Edit existing staff updates correctly
- [ ] View details shows all information
- [ ] Delete staff with confirmation
- [ ] Error messages display properly
- [ ] Success messages auto-close
- [ ] Modals open and close correctly
- [ ] Responsive on mobile devices
- [ ] Token authentication works
- [ ] Refresh button reloads data
- [ ] Table shows proper data formatting
- [ ] Avatar initials generate correctly

## Technical Notes

### TypeScript Usage:
- Strong typing for all interfaces
- Proper type checking on API responses
- Generic types for form data

### Vue 3 Composition API:
- `<script setup>` syntax
- Reactive state with `ref()`
- Lifecycle hooks with `onMounted()`
- Template refs for form inputs

### Best Practices:
- Separation of concerns (service layer + component)
- Reusable service class
- Clean modal management
- Proper error boundaries
- Loading state management
- User feedback (success/error messages)

## Conclusion

The Staff Management feature is now fully implemented and integrated into the Admin Dashboard. Admins can easily manage all staff members through an intuitive interface with full CRUD capabilities, search functionality, and proper error handling.

