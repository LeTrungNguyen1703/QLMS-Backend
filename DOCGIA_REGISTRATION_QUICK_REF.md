# Quick Reference: DocGia Registration & Internal Login Separation

## Routes Overview

| Route | Visibility | Purpose | Theme |
|-------|-----------|---------|-------|
| `/` | Public | Welcome page | Purple |
| `/login` | Public (linked in UI) | Customer login | Purple |
| `/register` | Public (linked in UI) | Customer registration | Purple |
| `/employee/login` | Internal (direct URL only) | Employee login | Green |
| `/admin/login` | Internal (direct URL only) | Admin login | Red |

---

## What Changed

### ✨ NEW: Registration Page (`/register`)
Complete customer registration form with:
- Full field validation
- Professional design
- Auto-redirect after success

### 🔒 HIDDEN: Internal Logins
- Employee and Admin logins removed from public UI
- Still functional via direct URL access
- No links visible to public users

### 🎨 UPDATED: Welcome Page
**Before**: Three role selection buttons  
**After**: Two action buttons (Login & Register)

---

## User Journeys

### Customer Registration
```
/ → Click "Đăng ký tài khoản" → /register → Fill form → Success → /login
```

### Customer Login
```
/ → Click "Đăng nhập" → /login → Enter credentials → /docgia/dashboard
```

### Staff Access (Internal)
```
Type URL directly → /employee/login or /admin/login → Login → Dashboard
```

---

## Registration Form Fields

| Field | Validation | Example |
|-------|-----------|---------|
| Họ lót | Required | Nguyễn Văn |
| Tên | Required | An |
| Tên tài khoản | Min 4 chars | nguyenvana |
| Mật khẩu | Min 6 chars | password123 |
| Email | Valid email | user@example.com |
| Số điện thoại | 10-11 digits | 0912345678 |
| Ngày sinh | Not future | 2000-01-15 |
| Giới tính | Required | Nam/Nữ/Khác |
| Địa chỉ | Required | 123 ABC Street |

---

## Public UI Access

### Welcome Page Shows:
✅ Login button → `/login`  
✅ Register button → `/register`  
✅ Browse books link → `/docgia/search-books`

### Welcome Page DOES NOT Show:
❌ Employee login  
❌ Admin login  
❌ Any internal links

---

## Internal Access (Staff Only)

### How Staff Access Their Logins:
1. Type URL directly in browser
2. Bookmark the URL for easy access
3. Use internal documentation
4. Share URLs securely within organization

### Internal URLs:
- **Employee**: `http://your-domain.com/employee/login`
- **Admin**: `http://your-domain.com/admin/login`

---

## Navigation Links

### Customer Login Page
- ✅ Link to Register
- ✅ Link to Home
- ❌ NO links to employee/admin

### Employee Login Page
- ✅ Link to Admin login (internal navigation)
- ❌ NO link to customer login

### Admin Login Page
- ✅ Link to Employee login (internal navigation)
- ❌ NO link to customer login

---

## API Endpoints

### Registration
```
POST /docgia/add-dg
```

### Login
```
POST /auth/login/docgia      (Customer)
POST /auth/login/nhanvien    (Employee/Admin)
```

---

## Quick Test Commands

```bash
# Start dev server
cd frontend
npm run dev

# Test public URLs
http://localhost:5173/
http://localhost:5173/login
http://localhost:5173/register

# Test internal URLs (should work but not linked)
http://localhost:5173/employee/login
http://localhost:5173/admin/login
```

---

## Color Scheme

| Route | Color | Gradient |
|-------|-------|----------|
| Customer Login | Purple | #667eea → #764ba2 |
| Customer Register | Purple | #667eea → #764ba2 |
| Employee Login | Green | #10b981 → #059669 |
| Admin Login | Red | #dc2626 → #991b1b |

---

## Security Notes

### Public Routes
- Open to all users
- No authentication required
- Visible in UI navigation

### Internal Routes
- Hidden from public UI
- Accessible via direct URL
- No public links
- Staff must know URL

### Protected Routes
- Require authentication
- Role-based access control
- Auto-redirect if not authorized

---

## File Changes Summary

| File | Status | Changes |
|------|--------|---------|
| `RegisterPage.vue` | ✨ Rewritten | Full registration form |
| `index.ts` (router) | ✏️ Updated | Added meta tags, routes |
| `Welcome.vue` | ✏️ Updated | 2 buttons instead of 3 |
| `CustomerLogin.vue` | ✏️ Updated | Removed internal links |
| `EmployeeLogin.vue` | ✏️ Updated | Removed public links |
| `AdminLogin.vue` | ✏️ Updated | Removed public links |

---

## Responsive Design

All pages are fully responsive:
- ✅ Desktop (600px+ width)
- ✅ Tablet (768px width)
- ✅ Mobile (320px+ width)
- ✅ Scrollable forms on small screens

---

## Validation Messages

Form shows errors for:
- Empty required fields
- Invalid email format
- Phone number not 10-11 digits
- Username less than 4 characters
- Password less than 6 characters
- Future birth date

---

## Success Flow

After successful registration:
1. ✅ Success message displayed
2. ⏱️ 2-second wait
3. ➡️ Auto-redirect to `/login`
4. 🎉 User can login with new account

---

## Common Tasks

### Add new public route:
```typescript
{
  path: '/new-route',
  meta: { public: true }
}
```

### Add new internal route:
```typescript
{
  path: '/internal/route',
  meta: { internal: true }
}
```

### Add protected route:
```typescript
{
  path: '/protected',
  meta: { 
    requiresAuth: true,
    role: 'DOCGIA'
  }
}
```

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Can't find register | Click "Đăng ký tài khoản" on home |
| Can't find employee login | Type `/employee/login` directly |
| Form validation error | Check field requirements |
| Phone number error | Use 10-11 digits only |
| Date error | Cannot be future date |

---

## Next Steps (Optional)

1. Add route guards for authentication
2. Add IP whitelist for internal routes
3. Add CAPTCHA for registration
4. Add email verification
5. Add password strength meter
6. Add "forgot password" feature
7. Add session timeout handling

---

## Benefits Summary

**For Customers:**
- ✅ Simple, clear interface
- ✅ Easy registration
- ✅ No confusion

**For Staff:**
- ✅ Dedicated logins
- ✅ Professional tools
- ✅ Secure access

**For System:**
- ✅ Clean architecture
- ✅ Better security
- ✅ Scalable design

