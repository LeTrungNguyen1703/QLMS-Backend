# Quản Lý Nhà Xuất Bản - CRUD Feature Guide

## Overview
This document describes the CRUD (Create, Read, Update, Delete) implementation for managing publishers (Nhà Xuất Bản) in the library management system.

## Features Implemented

### 1. Components Structure
```
frontend/src/components/QuanLyNhaXuatBan/
├── QuanLyNhaXuatBan.vue          # Main component with tab navigation
├── DanhSachNhaXuatBan.vue         # Publisher list with search and delete
├── ThemNhaXuatBan.vue             # Add new publisher form
└── EditNhaXuatBanModal.vue        # Edit publisher modal
```

### 2. Service Layer
**File:** `frontend/src/services/nhaXuatBanService.ts`

Methods:
- `getAllNhaXuatBan()` - Fetch all publishers
- `getNhaXuatBanById(id)` - Get publisher by ID
- `createNhaXuatBan(data)` - Create new publisher
- `updateNhaXuatBan(id, data)` - Update publisher
- `deleteNhaXuatBan(id)` - Delete publisher

### 3. Data Model
```typescript
interface NhaXuatBan {
  _id: string;
  MaNXB: string;      // Auto-generated (NXB001, NXB002, etc.)
  TenNXB: string;     // Publisher name (required)
  DiaChi: string;     // Address (required)
}
```

### 4. Main Features

#### a) List Publishers (Danh sách nhà xuất bản)
- Table view with search functionality
- Search by: Publisher name, code (MaNXB), or address
- Real-time filtering
- Edit and Delete actions per row
- Loading state indicator
- Empty state message

#### b) Add Publisher (Thêm nhà xuất bản)
- Form fields:
  - Tên nhà xuất bản (Publisher name) - Required
  - Địa chỉ (Address) - Required, textarea for longer addresses
- Auto-generated MaNXB by backend
- Success/Error message display
- Form validation
- Reset button to clear form
- Auto-redirect to list after successful creation

#### c) Edit Publisher (Chỉnh sửa)
- Modal popup for editing
- Pre-filled form with current data
- MaNXB field is read-only (cannot be changed)
- Editable fields: TenNXB, DiaChi
- Success/Error message display
- Auto-refresh list after successful update
- Modal transitions with animation

#### d) Delete Publisher (Xóa)
- Confirmation dialog before deletion
- Success message after deletion
- Auto-refresh list after deletion
- Error handling

### 5. Integration with NhanVienDashboard

The Quản Lý Nhà Xuất Bản feature is integrated into the staff dashboard:

1. Added feature card in the functions grid
2. New tab option: 'nha-xuat-ban'
3. Icon: building icon (bi-building) with info color
4. Accessible from the main dashboard

### 6. Backend API Endpoints

Base URL: `/nhaxuatban`

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/get-all-nxb` | Get all publishers | Yes (NHAN_VIEN, ADMIN) |
| GET | `/get-nxb/:id` | Get publisher by ID | Yes (NHAN_VIEN, ADMIN) |
| POST | `/add-nxb` | Create new publisher | Yes (NHAN_VIEN, ADMIN) |
| PUT | `/update-nxb/:id` | Update publisher | Yes (NHAN_VIEN, ADMIN) |
| DELETE | `/delete-nxb/:id` | Delete publisher | Yes (NHAN_VIEN, ADMIN) |

### 7. UI/UX Features

- **Modern Design:** Gradient buttons and cards
- **Responsive:** Works on mobile and desktop
- **Smooth Animations:** Modal transitions, hover effects
- **Loading States:** Spinners during async operations
- **Form Validation:** Required field validation
- **User Feedback:** Success/error messages with icons
- **Search:** Real-time filtering of results

### 8. Styling

- Bootstrap 5 components
- Bootstrap Icons (bi-*)
- Custom gradient theme (purple: #667eea to #764ba2)
- Smooth transitions and hover effects
- Responsive table layout

## Usage

### For Staff (Nhân Viên):

1. Login to the system
2. Navigate to "Dashboard Nhân viên"
3. Click on "Quản lý Nhà xuất bản" card
4. Choose an action:
   - **Danh sách nhà xuất bản**: View/Edit/Delete publishers
   - **Thêm nhà xuất bản**: Add new publisher

### Adding a Publisher:
1. Click "Thêm nhà xuất bản" tab
2. Fill in:
   - Tên nhà xuất bản (e.g., "Nhà xuất bản Kim Đồng")
   - Địa chỉ (e.g., "55 Quang Trung, Hà Nội")
3. Click "Thêm nhà xuất bản" button
4. Success message appears, redirects to list

### Editing a Publisher:
1. In the list, click "Sửa" button on desired row
2. Modal opens with current data
3. Edit fields as needed
4. Click "Lưu thay đổi"
5. Success message appears, list refreshes

### Deleting a Publisher:
1. In the list, click "Xóa" button on desired row
2. Confirm deletion in dialog
3. Success message appears, list refreshes

## Error Handling

- Network errors are caught and displayed to user
- Form validation prevents empty submissions
- Backend validation errors are shown in alerts
- Loading states prevent duplicate submissions

## Future Enhancements

Potential improvements:
- Pagination for large publisher lists
- Sorting by columns (name, code, address)
- Export to Excel/PDF
- Publisher statistics (number of books published)
- Advanced search filters
- Bulk operations (delete multiple)

## Dependencies

- Vue 3 with Composition API
- TypeScript
- Axios (apiClient)
- Bootstrap 5
- Bootstrap Icons

