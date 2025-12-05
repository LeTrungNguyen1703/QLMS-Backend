# DocGia Registration & Internal Login Separation Guide

## Overview
This implementation creates a complete customer (DocGia) registration system and separates admin/employee logins from the public UI, making them accessible only through direct URL endpoints.

---

## 🎯 Key Changes

### 1. **DocGia Registration Page**
A complete, user-friendly registration form for library customers.

**Route**: `/register`  
**Component**: `RegisterPage.vue`

#### Features:
- ✅ Full form validation with required fields
- ✅ Password visibility toggle
- ✅ Date picker with max date validation
- ✅ Phone number pattern validation (10-11 digits)
- ✅ Email validation
- ✅ Gender selection
- ✅ Address textarea
- ✅ Success/Error message handling
- ✅ Auto-redirect to login after successful registration
- ✅ Responsive design with scrollable form
- ✅ Purple gradient theme matching customer login

#### Form Fields:
- **Họ lót** (Last name) - Required
- **Tên** (First name) - Required
- **Tên tài khoản** (Username) - Required, min 4 characters
- **Mật khẩu** (Password) - Required, min 6 characters
- **Email** - Required, valid email format
- **Số điện thoại** (Phone) - Required, 10-11 digits
- **Ngày sinh** (Birth date) - Required, cannot be future date
- **Giới tính** (Gender) - Required (Nam/Nữ/Khác)
- **Địa chỉ** (Address) - Required

---

### 2. **Internal Login Separation**

Admin and Employee logins are now **hidden from public UI** and only accessible through direct URLs.

#### Public UI (Welcome Page)
**Shows only:**
- ✅ Customer Login button → `/login`
- ✅ Register button → `/register`
- ✅ Browse without login → `/docgia/search-books`

**Hidden from public:**
- ❌ Employee login link
- ❌ Admin login link

#### Internal Access (Direct URLs Only)
These routes are functional but not linked in the public UI:

**Employee Login**: `/employee/login`
- Only accessible by typing URL directly
- Green theme, badge icon
- Links to admin login only

**Admin Login**: `/admin/login`
- Only accessible by typing URL directly
- Red theme, shield icon
- Links to employee login only

---

## 📁 Modified Files

### 1. `views/auth/RegisterPage.vue` ✨ **COMPLETELY REWRITTEN**
**Before**: Empty placeholder with basic text  
**After**: Full-featured registration form with:
- Complete field validation
- Professional styling
- Error handling
- Success feedback
- Auto-redirect after registration

### 2. `router/index.ts` ✏️ **UPDATED**
**Changes**:
- Added `/register` route with meta tags
- Added `meta.internal: true` for admin/employee routes
- Added `meta.public: true` for customer routes
- Added `meta.requiresAuth` and `meta.role` for protected routes
- Added page title meta handling
- Added navigation guard for page titles
- Updated legacy route redirects

### 3. `views/Welcome.vue` ✏️ **UPDATED**
**Changes**:
- Removed three-role selection buttons
- Added two action buttons (Login & Register)
- Updated color scheme (purple for login, pink for register)
- Removed `goToLogin(role)` function
- Added separate `goToLogin()` and `goToRegister()` functions
- Updated CSS to match new button layout

### 4. `views/auth/CustomerLogin.vue` ✏️ **UPDATED**
**Changes**:
- Removed link to employee/admin logins
- Added link to registration page
- Added "Back to home" link
- Simplified footer navigation

### 5. `views/auth/EmployeeLogin.vue` ✏️ **UPDATED**
**Changes**:
- Removed link to customer login (public)
- Kept only admin login link (internal)
- Simplified footer to single line

### 6. `views/auth/AdminLogin.vue` ✏️ **UPDATED**
**Changes**:
- Removed link to customer login (public)
- Kept only employee login link (internal)
- Simplified footer to single line

---

## 🔐 Security Architecture

### Public Routes (Visible in UI)
```
/ (Welcome)
├── /login (Customer Login)
├── /register (Customer Registration)
└── /docgia/search-books (Anonymous browsing)
```

### Internal Routes (Direct URL Only)
```
/employee/login (Employee Login)
    └── Only accessible by typing URL
    
/admin/login (Admin Login)
    └── Only accessible by typing URL
```

### Protected Routes (Require Authentication)
```
/docgia/dashboard (Requires DOCGIA role)
/docgia/borrowed-books (Requires DOCGIA role)
/docgia/borrow-history (Requires DOCGIA role)
/nhanvien/dashboard (Requires NHANVIEN role, internal)
/admin/dashboard (Requires ADMIN role, internal)
```

---

## 🎨 Design System

### Customer/Public Routes
- **Color**: Purple gradient (#667eea → #764ba2)
- **Icon**: Book (📚) for login, Person-plus for register
- **Theme**: Welcoming, accessible

### Employee Routes (Internal)
- **Color**: Green gradient (#10b981 → #059669)
- **Icon**: Badge (👤)
- **Theme**: Professional, staff-focused

### Admin Routes (Internal)
- **Color**: Red gradient (#dc2626 → #991b1b)
- **Icon**: Shield (🛡️)
- **Theme**: Secure, administrative

---

## 📋 User Flow

### New Customer Registration Flow
```
1. User visits Welcome page (/)
2. Clicks "Đăng ký tài khoản" button
3. Redirected to /register
4. Fills out registration form
5. Submits form
6. Success message appears
7. Auto-redirected to /login after 2 seconds
8. User can now login with new credentials
```

### Customer Login Flow
```
1. User visits Welcome page (/)
2. Clicks "Đăng nhập" button
3. Redirected to /login
4. Enters credentials
5. Successful login
6. Redirected to /docgia/dashboard
```

### Internal Staff Access
```
1. Employee/Admin knows the direct URL
2. Types /employee/login or /admin/login directly
3. No link exists in public UI
4. Enters credentials
5. Successful login
6. Redirected to respective dashboard
```

---

## 🧪 Testing Checklist

### Registration Testing
- [ ] Navigate to `/` and click "Đăng ký tài khoản"
- [ ] Verify redirect to `/register`
- [ ] Test all form validations:
  - [ ] Username min 4 characters
  - [ ] Password min 6 characters
  - [ ] Email format validation
  - [ ] Phone number pattern (10-11 digits)
  - [ ] Date cannot be in future
  - [ ] All required fields show error when empty
- [ ] Toggle password visibility
- [ ] Submit valid registration
- [ ] Verify success message appears
- [ ] Verify auto-redirect to login after 2 seconds
- [ ] Test responsive design on mobile
- [ ] Scroll form and verify scrollbar works

### UI Separation Testing
- [ ] Visit Welcome page (`/`)
- [ ] Verify ONLY two buttons visible: "Đăng nhập" and "Đăng ký tài khoản"
- [ ] Verify NO employee or admin links visible
- [ ] Click "Đăng nhập" → should go to `/login`
- [ ] Click "Đăng ký tài khoản" → should go to `/register`
- [ ] On customer login, verify NO links to employee/admin login
- [ ] Manually type `/employee/login` → should work (not blocked)
- [ ] Manually type `/admin/login` → should work (not blocked)
- [ ] On employee login, verify NO link to customer login
- [ ] On admin login, verify NO link to customer login

### Cross-Navigation Testing
- [ ] From `/employee/login`, can navigate to `/admin/login`
- [ ] From `/admin/login`, can navigate to `/employee/login`
- [ ] From `/login`, can navigate to `/register`
- [ ] From `/register`, can navigate to `/login`
- [ ] From `/login`, can navigate to `/` (home)

---

## 📞 API Integration

### Registration Endpoint
```typescript
POST /docgia/add-dg

Request Body (RegisterDocGiaRequest):
{
  "HoLot": string,
  "Ten": string,
  "TenTaiKhoan": string,
  "MatKhau": string,
  "NgaySinh": string (ISO date),
  "Phai": "nam" | "nữ" | "khác",
  "DiaChi": string,
  "SoDienThoai": string,
  "Email": string
}

Response:
{
  "message": string,
  "data": object
}
```

### Login Endpoints (Unchanged)
```typescript
POST /auth/login/docgia     // Customer login
POST /auth/login/nhanvien   // Employee/Admin login
```

---

## 🔍 Route Meta Tags

### Public Routes
```typescript
{
  path: '/login',
  meta: { 
    public: true,
    title: 'Đăng nhập - Đọc giả'
  }
}
```

### Internal Routes
```typescript
{
  path: '/employee/login',
  meta: { 
    internal: true,
    title: 'Đăng nhập - Nhân viên'
  }
}
```

### Protected Routes
```typescript
{
  path: '/docgia/dashboard',
  meta: { 
    requiresAuth: true,
    role: 'DOCGIA'
  }
}
```

---

## 🚀 Deployment Considerations

### URL Access Control
Currently, internal routes are:
- ✅ Hidden from UI (no links)
- ⚠️ Still accessible via direct URL (intentional)

**For production**, consider:
1. **Keep current approach** if staff know the URLs
2. **Add IP whitelist** for extra security on internal routes
3. **Add route guards** to check referrer or session
4. **Add environment-based access** (dev vs production)

### Security Best Practices
1. Internal login URLs should be:
   - Shared securely with staff
   - Not published publicly
   - Monitored for unauthorized access attempts

2. Consider adding:
   - Rate limiting on login attempts
   - CAPTCHA for repeated failures
   - Two-factor authentication for admin

---

## 📊 Benefits

### For Users (Customers)
- ✅ Clear, simple registration process
- ✅ No confusion with staff login options
- ✅ Intuitive user journey
- ✅ Professional, welcoming interface

### For Staff (Employee/Admin)
- ✅ Separate, dedicated login pages
- ✅ No interference from public users
- ✅ Professional internal tools
- ✅ Clear role distinction

### For System
- ✅ Clean separation of concerns
- ✅ Reduced UI complexity
- ✅ Better security through obscurity
- ✅ Scalable architecture

---

## 🔧 Troubleshooting

### Issue: Can't find registration page
**Solution**: Click "Đăng ký tài khoản" on welcome page or go to `/register`

### Issue: Can't access employee/admin login
**Solution**: These are internal. Type URL directly: `/employee/login` or `/admin/login`

### Issue: Registration form shows errors
**Solution**: Check all required fields meet validation requirements (min lengths, formats, etc.)

### Issue: Phone validation fails
**Solution**: Enter 10-11 digits only, no spaces or special characters

### Issue: Date validation fails
**Solution**: Birth date cannot be today or in the future

---

## 📝 Notes

- Registration is **only for customers** (DocGia)
- Employee/Admin accounts should be created through admin panel or database
- Internal routes are functional but hidden from public UI
- All routes use proper page titles via meta tags
- Form validation is client-side; server-side validation should also exist
- Success message auto-disappears with redirect

---

## ✅ Completion Summary

**Implemented:**
1. ✅ Complete DocGia registration page with full validation
2. ✅ Separated internal logins from public UI
3. ✅ Updated Welcome page to show only customer options
4. ✅ Removed cross-links between public and internal logins
5. ✅ Added route meta tags for better organization
6. ✅ Added page title handling
7. ✅ Maintained internal login functionality via direct URLs
8. ✅ Professional styling consistent with existing design
9. ✅ Comprehensive documentation

**Result**: 
- Public users see only relevant options (login/register)
- Internal staff can access their logins via direct URLs
- Clear separation between public and internal access
- Professional, user-friendly registration experience

