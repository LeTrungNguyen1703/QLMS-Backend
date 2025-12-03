# Staff Management - Quick Test Guide

## Prerequisites
1. Backend server running on http://localhost:8080
2. Frontend server running on http://localhost:5173
3. Admin user logged in

## Test Steps

### 1. Access Staff Management
1. Login as Admin user
2. Navigate to Admin Dashboard
3. Click on "Quản lý người dùng" tab
4. You should see the Staff Management interface

### 2. Test List View
- [ ] Staff list loads automatically
- [ ] Table shows columns: MSNV, Họ tên, Email, Số điện thoại, Địa chỉ, Thao tác
- [ ] Each row shows staff information correctly
- [ ] Action buttons (View, Edit, Delete) are visible

### 3. Test Search Functionality
1. Type in search box: Test different searches
   - Search by name
   - Search by email
   - Search by phone number
   - Search by username
   - Search by MSNV
2. Verify results filter in real-time
3. Clear search - all staff should appear again

### 4. Test Create Staff
1. Click "Thêm nhân viên mới" button
2. Modal should open with empty form
3. Fill in all required fields:
   - **Họ tên**: Nguyễn Văn Test
   - **Tên tài khoản**: teststaff123
   - **Mật khẩu**: Test@123 (click eye icon to toggle visibility)
   - **Email**: teststaff@example.com
   - **Số điện thoại**: 0123456789
   - **Ngày sinh**: Select a date
   - **Giới tính**: Select Nam/Nữ/Khác
   - **Địa chỉ**: 123 Test Street, Test City
   - **Chức vụ**: NHAN_VIEN or QUAN_LY
4. Click "Thêm nhân viên"
5. Verify:
   - Success message appears
   - Modal closes after 1.5 seconds
   - New staff appears in the list
   - List refreshes automatically

### 5. Test View Details
1. Click eye icon on any staff row
2. Verify modal opens showing:
   - Avatar with initials
   - Full name and username
   - MSNV
   - Email
   - Phone number
   - Gender
   - Address
3. Click "Đóng" to close modal

### 6. Test Edit Staff
1. Click pencil icon on a staff row
2. Edit modal opens with pre-filled data
3. Modify some fields (e.g., phone number, address)
4. Note: Cannot change username or password
5. Click "Cập nhật"
6. Verify:
   - Success message appears
   - Changes are saved
   - List updates with new information
   - Modal closes after 1.5 seconds

### 7. Test Delete Staff
1. Click trash icon on a staff row
2. Confirmation modal appears
3. Verify warning message is shown
4. Click "Hủy" - modal closes, nothing deleted
5. Click trash icon again
6. Click "Xóa nhân viên"
7. Verify:
   - Staff is removed from list
   - Modal closes
   - List refreshes

### 8. Test Error Handling

#### Test Create with Missing Fields:
1. Click "Thêm nhân viên mới"
2. Leave some required fields empty
3. Try to submit
4. Browser validation should prevent submission

#### Test Create with Duplicate Username:
1. Try to create staff with existing username
2. Should show error message from backend

#### Test Network Error:
1. Stop backend server
2. Try to load staff list or create staff
3. Should show appropriate error message

### 9. Test Refresh
1. Click "Làm mới" button
2. Verify list reloads from server

### 10. Test Responsive Design
1. Resize browser window to mobile size
2. Verify:
   - Table is scrollable
   - Modals are properly sized
   - Buttons are accessible
   - Forms are usable

## API Endpoints Being Tested

```
GET    /api/nhanvien/          ✓ Get all staff
GET    /api/nhanvien/:id       ✓ Get staff by ID
POST   /api/nhanvien/          ✓ Create staff
PUT    /api/nhanvien/:id       ✓ Update staff
DELETE /api/nhanvien/:id       ✓ Delete staff
```

## Expected Behavior

### Success Scenarios:
- ✅ List loads with all staff members
- ✅ Search filters results correctly
- ✅ Create adds new staff to database
- ✅ Edit updates staff information
- ✅ Delete removes staff from database
- ✅ All modals open and close properly
- ✅ Success messages display and auto-close
- ✅ List auto-refreshes after operations

### Error Scenarios:
- ⚠️ Missing fields show validation errors
- ⚠️ Duplicate username shows error message
- ⚠️ Network errors show user-friendly messages
- ⚠️ Unauthorized access redirects to login
- ⚠️ Invalid data shows appropriate errors

## Common Issues and Solutions

### Issue: "Cannot read properties of undefined"
**Solution**: Check if backend is running and returning proper data structure

### Issue: "401 Unauthorized"
**Solution**: 
1. Check if user is logged in
2. Verify token is in localStorage
3. Ensure user has Admin role

### Issue: List not loading
**Solution**:
1. Check browser console for errors
2. Verify API endpoint is correct (/api/nhanvien/)
3. Check network tab in DevTools

### Issue: Modal not closing
**Solution**: 
1. Check for JavaScript errors
2. Verify formSuccess/formError states are being reset

### Issue: Search not working
**Solution**:
1. Verify searchQuery is bound correctly
2. Check filterStaff function implementation
3. Ensure filteredStaff is used in template

## Developer Tools

### Check Network Requests:
1. Open DevTools (F12)
2. Go to Network tab
3. Filter by XHR
4. Perform actions and verify:
   - Requests are sent to correct endpoints
   - Status codes are 200/201 for success
   - Authorization header includes token
   - Response data is correct

### Check Console:
1. Open Console tab in DevTools
2. Look for:
   - Error messages
   - API responses logged
   - State changes

### Check Vue DevTools:
1. Install Vue DevTools extension
2. Check component state
3. Verify reactive data updates

## Performance Checklist
- [ ] List loads quickly (< 2 seconds)
- [ ] Search is responsive (real-time filtering)
- [ ] Modals open/close smoothly
- [ ] No memory leaks when opening/closing modals
- [ ] Form submissions complete in reasonable time

## Security Checklist
- [ ] Only Admin can access Staff Management
- [ ] Token is included in all requests
- [ ] Sensitive data (passwords) not displayed
- [ ] CSRF protection enabled
- [ ] Input validation on both frontend and backend

## Accessibility Checklist
- [ ] Keyboard navigation works
- [ ] Tab order is logical
- [ ] Focus states are visible
- [ ] Error messages are announced
- [ ] Icons have proper aria-labels
- [ ] Modals can be closed with ESC key

---

## Test Results Template

Date: ___________
Tester: ___________

| Test Case | Status | Notes |
|-----------|--------|-------|
| List View | ⬜ | |
| Search | ⬜ | |
| Create Staff | ⬜ | |
| View Details | ⬜ | |
| Edit Staff | ⬜ | |
| Delete Staff | ⬜ | |
| Error Handling | ⬜ | |
| Responsive Design | ⬜ | |

**Overall Status**: ⬜ Pass / ⬜ Fail

**Issues Found**:
1. 
2. 
3. 

**Additional Comments**:

