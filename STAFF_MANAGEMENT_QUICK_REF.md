# 🎯 Staff Management - Quick Reference Card

## 📋 Quick Access

### For Users (Admin)
1. Login → Admin Dashboard → "Quản lý người dùng" tab
2. Click "Thêm nhân viên mới" to create staff
3. Use search box to find staff
4. Click eye/pencil/trash icons to view/edit/delete

### For Developers
- **Service**: `frontend/src/services/nhanVienService.ts`
- **Component**: `frontend/src/components/StaffManagement.vue`
- **Router**: `Backend/Routers/NhanVienRouter.ts`
- **Controller**: `Backend/Controllers/NhanVienController.ts`

---

## 🔑 Key Components

| Component | File | Purpose |
|-----------|------|---------|
| Service | `nhanVienService.ts` | API calls |
| UI Component | `StaffManagement.vue` | User interface |
| Backend Router | `NhanVienRouter.ts` | API routes |
| Controller | `NhanVienController.ts` | Request handling |

---

## 🌐 API Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/nhanvien/` | Get all staff | Admin |
| GET | `/api/nhanvien/:id` | Get staff by ID | Admin |
| POST | `/api/nhanvien/` | Create staff | Admin |
| PUT | `/api/nhanvien/:id` | Update staff | Admin |
| DELETE | `/api/nhanvien/:id` | Delete staff | Admin |

---

## ⚡ Quick Commands

### Start Backend
```bash
cd Backend
npm run dev
```

### Start Frontend
```bash
cd frontend
npm run dev
```

### Access Points
- Backend: http://localhost:8080
- Frontend: http://localhost:5173
- API Docs: http://localhost:8080/api-docs

---

## 📊 Features Checklist

### ✅ Implemented
- [x] List all staff members
- [x] Search and filter staff
- [x] Create new staff
- [x] Edit staff information
- [x] Delete staff with confirmation
- [x] View staff details
- [x] Loading states
- [x] Error handling
- [x] Success messages
- [x] Responsive design
- [x] Authentication & Authorization
- [x] Form validation

### 💡 Future Enhancements
- [ ] Pagination
- [ ] Export to CSV/Excel
- [ ] Bulk operations
- [ ] Advanced filters
- [ ] Profile pictures
- [ ] Activity history

---

## 🐛 Common Issues & Fixes

### Issue: List not loading
**Fix**: Check if backend is running and token is valid

### Issue: 401 Unauthorized
**Fix**: Login again, ensure Admin role

### Issue: Cannot create staff
**Fix**: Fill all required fields, check network tab

### Issue: Search not working
**Fix**: Refresh page, check console for errors

---

## 📝 Form Fields

### Create Staff Form
| Field | Type | Required | Example |
|-------|------|----------|---------|
| Họ tên | Text | ✅ | Nguyễn Văn A |
| Tên tài khoản | Text | ✅ | nguyenvana |
| Mật khẩu | Password | ✅ | Pass@123 |
| Email | Email | ✅ | nva@example.com |
| Số điện thoại | Tel | ✅ | 0123456789 |
| Ngày sinh | Date | ✅ | 1990-01-01 |
| Giới tính | Select | ✅ | Nam/Nữ/Khác |
| Địa chỉ | Textarea | ✅ | 123 ABC Street |
| Chức vụ | Select | ❌ | NHAN_VIEN |

### Edit Staff Form
Same as Create, but **cannot change**:
- Username (TenTaiKhoan)
- Password (MatKhau)

---

## 🎨 UI Components

### Modals
1. **Create Modal** - Add new staff
2. **Edit Modal** - Update staff info
3. **View Modal** - Display details
4. **Delete Modal** - Confirm deletion

### Buttons
- 🟦 **Primary** - Create, Update, Submit
- 🟥 **Danger** - Delete
- 🟨 **Warning** - Edit
- 🟩 **Info** - View
- ⬜ **Secondary** - Cancel, Close

---

## 🔒 Security Notes

- ✅ JWT token required for all requests
- ✅ Only Admin can access
- ✅ Passwords are hashed
- ✅ Input validation on frontend & backend
- ✅ CORS enabled
- ✅ Error messages don't expose sensitive data

---

## 📖 Documentation

| Document | Purpose |
|----------|---------|
| `STAFF_MANAGEMENT_GUIDE.md` | Complete implementation guide |
| `STAFF_MANAGEMENT_TEST.md` | Testing checklist |
| `STAFF_MANAGEMENT_ARCHITECTURE.md` | System architecture |

---

## 💻 Code Snippets

### Import Service
```typescript
import { nhanVienService } from '@/services/nhanVienService';
```

### Get All Staff
```typescript
const staff = await nhanVienService.getAllNhanVien();
```

### Create Staff
```typescript
await nhanVienService.createNhanVien({
  HoTenNV: "Nguyễn Văn A",
  TenTaiKhoan: "nguyenvana",
  MatKhau: "Pass@123",
  Email: "nva@example.com",
  SoDienThoai: "0123456789",
  NgaySinh: "1990-01-01",
  Phai: "nam",
  DiaChi: "123 ABC",
  ChucVu: "NHAN_VIEN"
});
```

### Update Staff
```typescript
await nhanVienService.updateNhanVien(id, {
  HoTenNV: "New Name",
  Email: "newemail@example.com"
});
```

### Delete Staff
```typescript
await nhanVienService.deleteNhanVien(id);
```

---

## 🎯 Testing Quick Guide

1. **Load** - Staff list appears
2. **Search** - Type and filter works
3. **Create** - Fill form → Submit → Success
4. **Edit** - Click pencil → Modify → Save
5. **View** - Click eye → Details appear
6. **Delete** - Click trash → Confirm → Deleted

---

## 📞 Support

- **Issues**: Check console and network tab
- **Errors**: See error messages in UI
- **Logs**: Backend console shows detailed logs
- **Debug**: Use Vue DevTools for frontend

---

## ✨ Key Features Summary

🔍 **Search** - Real-time filtering across multiple fields
➕ **Create** - Add new staff with full validation
✏️ **Edit** - Update staff information easily
👁️ **View** - See detailed staff profiles
🗑️ **Delete** - Safe deletion with confirmation
📱 **Responsive** - Works on all devices
🔒 **Secure** - Protected with authentication
🎨 **Modern** - Beautiful, intuitive UI

---

**Status**: ✅ Production Ready
**Version**: 1.0.0
**Date**: December 3, 2025

---

## 🚀 Get Started NOW!

1. Start backend: `cd Backend && npm run dev`
2. Start frontend: `cd frontend && npm run dev`
3. Login as Admin
4. Go to "Quản lý người dùng" tab
5. Start managing staff! 🎉

