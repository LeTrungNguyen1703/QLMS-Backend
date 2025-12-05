# Quick Reference: Separate Login Routes

## Routes Summary

| Role | Route | Component | Theme Color | Icon | Dashboard Redirect |
|------|-------|-----------|-------------|------|-------------------|
| Customer | `/login` | `CustomerLogin.vue` | Purple | 📚 book | `/docgia/dashboard` |
| Employee | `/employee/login` | `EmployeeLogin.vue` | Green | 👤 badge | `/nhanvien/dashboard` |
| Admin | `/admin/login` | `AdminLogin.vue` | Red | 🛡️ shield | `/admin/dashboard` |

## Files Modified

### Created
1. ✅ `frontend/src/views/auth/CustomerLogin.vue`
2. ✅ `frontend/src/views/auth/EmployeeLogin.vue`

### Updated
1. ✅ `frontend/src/types/auth.ts` - Added ADMIN to UserType enum
2. ✅ `frontend/src/router/index.ts` - Added separate login routes
3. ✅ `frontend/src/views/Welcome.vue` - Added role-specific login buttons
4. ✅ `frontend/src/views/auth/AdminLogin.vue` - Updated navigation links

## How to Use

### For Users
1. Visit the homepage (`/`)
2. Click on your role:
   - **Đọc giả** for customers
   - **Nhân viên** for employees
   - **Quản trị viên** for admins
3. Enter credentials and login
4. Auto-redirected to role-specific dashboard

### For Developers
```typescript
// Navigate to specific login
router.push('/login')              // Customer
router.push('/employee/login')     // Employee
router.push('/admin/login')        // Admin

// Check user type
import { UserType } from '@/types/auth'
UserType.DOCGIA    // Customer
UserType.NHANVIEN  // Employee
UserType.ADMIN     // Admin
```

## Authentication Flow

```
User → Welcome Page → Select Role → Login Page → Validate → Dashboard
                                                    ↓
                                            Store in localStorage:
                                            - authToken
                                            - userId
                                            - userName
                                            - userEmail
                                            - role
                                            - userType
```

## Role Validation

### Employee Login
```typescript
// Prevents admin from using employee login
if (response.Role === 'ADMIN') {
  errorMessage = 'Vui lòng sử dụng trang đăng nhập Admin.'
  return
}
```

### Admin Login
```typescript
// Requires admin role
if (response.Role !== 'ADMIN') {
  throw new Error('Bạn không có quyền truy cập admin.')
}
```

## Legacy Route Support

Old routes redirect to new routes:
- `/auth/login` → `/login`
- `/auth/admin` → `/admin/login`

## Quick Test Commands

```bash
# Start frontend dev server
cd frontend
npm run dev

# Test routes in browser
# http://localhost:5173/
# http://localhost:5173/login
# http://localhost:5173/employee/login
# http://localhost:5173/admin/login
```

## Color Scheme

```css
/* Customer - Purple */
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%)

/* Employee - Green */
background: linear-gradient(135deg, #10b981 0%, #059669 100%)

/* Admin - Red */
background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%)
```

## Component Structure

```
views/auth/
├── CustomerLogin.vue    (New)
├── EmployeeLogin.vue    (New)
├── AdminLogin.vue       (Updated)
├── LoginPage.vue        (Legacy - can deprecate)
└── RegisterPage.vue     (Customer registration)
```

## Next Steps

1. ✅ Separate login routes implemented
2. ⏭️ Add route guards for protected routes
3. ⏭️ Add auto-redirect if already logged in
4. ⏭️ Implement password recovery per role
5. ⏭️ Add session management

