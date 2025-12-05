# Separate Login Routes Implementation Guide

## Overview
This implementation separates the login system into three distinct role-based routes for Customer (Đọc giả), Employee (Nhân viên), and Admin (Quản trị viên).

## Routes Structure

### 1. Customer Login
- **Route**: `/login`
- **Component**: `CustomerLogin.vue`
- **Role**: `DOCGIA`
- **Redirect After Login**: `/docgia/dashboard`
- **Features**:
  - Purple/violet gradient theme
  - Book icon
  - Link to registration
  - Link to employee/admin login

### 2. Employee Login
- **Route**: `/employee/login`
- **Component**: `EmployeeLogin.vue`
- **Role**: `NHANVIEN`
- **Redirect After Login**: `/nhanvien/dashboard`
- **Features**:
  - Green gradient theme
  - Badge icon
  - Role validation (prevents admin access)
  - Links to admin and customer login

### 3. Admin Login
- **Route**: `/admin/login`
- **Component**: `AdminLogin.vue`
- **Role**: `NHANVIEN` with `ADMIN` role check
- **Redirect After Login**: `/admin/dashboard`
- **Features**:
  - Red gradient theme
  - Shield icon
  - Role validation (requires ADMIN role)
  - Links to customer and employee login

## Updated Files

### 1. Type Definitions (`types/auth.ts`)
```typescript
export enum UserType {
    DOCGIA = 'docgia',
    NHANVIEN = 'nhanvien',
    ADMIN = 'admin'
}
```

### 2. Router Configuration (`router/index.ts`)
- Added three separate login routes
- Added redirects for legacy routes
- Removed unused AuthLayout import

### 3. Welcome Page (`views/Welcome.vue`)
- Updated with role-specific login buttons
- Color-coded buttons for each role
- Option to browse without login

### 4. New Components Created
- `views/auth/CustomerLogin.vue` - Customer login page
- `views/auth/EmployeeLogin.vue` - Employee login page
- Updated `views/auth/AdminLogin.vue` - Admin login page with new navigation

## User Flow

### From Welcome Page
1. User lands on `/` (Welcome page)
2. User sees three login options:
   - **Đọc giả** (Customer) - Purple button
   - **Nhân viên** (Employee) - Green button
   - **Quản trị viên** (Admin) - Red button
3. User can also browse books without logging in

### Login Process
1. User clicks role-specific button
2. Redirected to appropriate login page
3. Enters credentials
4. System validates credentials and role
5. Redirected to role-specific dashboard

### Cross-Role Navigation
Each login page provides links to other login pages:
- Customer Login → Employee/Admin Login
- Employee Login → Admin/Customer Login
- Admin Login → Customer/Employee Login

## Security Features

### Role Validation
1. **Employee Login**: Prevents admin users from accessing employee dashboard
2. **Admin Login**: Requires ADMIN role in response

### Authentication Flow
1. User submits credentials
2. Backend validates and returns role
3. Frontend stores token and role in localStorage
4. Frontend validates role matches expected route
5. Redirect to appropriate dashboard

## Styling

### Color Themes
- **Customer**: Purple gradient (#667eea to #764ba2)
- **Employee**: Green gradient (#10b981 to #059669)
- **Admin**: Red gradient (#dc2626 to #991b1b)

### Common Features
- Responsive design
- Password visibility toggle
- Loading states
- Error/Success messages
- Smooth animations
- Consistent card layout

## Backend Integration

The system uses the existing backend endpoints:
- `/auth/login/docgia` - Customer login
- `/auth/login/nhanvien` - Employee login (also used for admin)

Admin authentication uses the same endpoint as employee but validates the `Role` field in the response to ensure it equals 'ADMIN'.

## Navigation Map

```
/ (Welcome)
├── /login (Customer Login) → /docgia/dashboard
├── /employee/login (Employee Login) → /nhanvien/dashboard
├── /admin/login (Admin Login) → /admin/dashboard
└── /docgia/search-books (Anonymous browsing)
```

## Legacy Route Support

For backward compatibility, legacy routes redirect to new routes:
- `/auth/login` → `/login`
- `/auth/admin` → `/admin/login`
- `/auth/register` → Still accessible for customer registration

## Testing Checklist

- [ ] Navigate to `/` and verify three login buttons appear
- [ ] Click Customer login and verify redirect to `/login`
- [ ] Click Employee login and verify redirect to `/employee/login`
- [ ] Click Admin login and verify redirect to `/admin/login`
- [ ] Test login for each role with valid credentials
- [ ] Verify role-specific dashboard redirects
- [ ] Test cross-navigation between login pages
- [ ] Test password visibility toggle
- [ ] Test error messages for invalid credentials
- [ ] Test success messages and redirects
- [ ] Verify responsive design on mobile devices
- [ ] Test anonymous browsing option

## Future Enhancements

1. Add route guards to protect authenticated routes
2. Add automatic redirect if already logged in
3. Add "Remember me" functionality
4. Add password recovery for all roles
5. Add multi-factor authentication
6. Add session timeout handling
7. Add login attempt limiting

## Troubleshooting

### Issue: Can't access admin dashboard after login
**Solution**: Verify backend returns `Role: 'ADMIN'` in the login response

### Issue: Redirects not working
**Solution**: Check router configuration and ensure all dashboard routes exist

### Issue: Styling issues on mobile
**Solution**: Test responsive breakpoints and adjust media queries

### Issue: Error messages not showing
**Solution**: Check error handling in authService and component error state

## Notes

- All three login pages share similar structure but have distinct themes
- The admin role is a special case of the employee role with elevated permissions
- The system supports both new routes and legacy routes for compatibility
- Bootstrap Icons are used for all icons (ensure Bootstrap Icons CSS is loaded)

