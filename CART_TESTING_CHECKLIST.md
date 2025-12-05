# ✅ Cart Feature - Testing Checklist

## Pre-Testing Setup

- [ ] Frontend server running (`npm run dev`)
- [ ] Backend server running
- [ ] Database connected
- [ ] Test user account available
- [ ] Sample books in database
- [ ] Browser DevTools open (Console + Network tabs)

---

## 1. Cart Button Display

### Header Integration
- [ ] Cart button visible in App header
- [ ] Cart button positioned correctly (between search and login)
- [ ] Icon displays properly (🛒)
- [ ] Hover effect works (scale + color change)
- [ ] Badge hidden when cart empty
- [ ] Badge shows correct count when items added
- [ ] Pulse animation active when cart has items

---

## 2. Add to Cart Functionality

### From Search Books Page
- [ ] "Add to Cart" button visible on all book cards
- [ ] Button icon shows cart-plus when not in cart
- [ ] Button icon changes to checkmark when in cart
- [ ] Button disabled when book out of stock
- [ ] Button disabled when book already in cart
- [ ] Click adds book to cart
- [ ] Toast notification appears after adding
- [ ] Toast shows correct book title
- [ ] Toast auto-hides after 3 seconds
- [ ] Cart badge count increases
- [ ] Can add multiple different books
- [ ] Button state updates immediately

### Edge Cases
- [ ] Cannot add out-of-stock books
- [ ] Cannot add same book twice (button disabled)
- [ ] Adding book with SoQuyen = 0 shows error

---

## 3. Cart Drawer Display

### Opening Cart
- [ ] Click cart button opens drawer
- [ ] Drawer slides in from right smoothly
- [ ] Backdrop appears with blur effect
- [ ] Drawer width correct (420px desktop, 90vw mobile)
- [ ] Close button (X) visible in header
- [ ] Click backdrop closes drawer
- [ ] Click close button closes drawer
- [ ] Drawer closes smoothly (slide out)

### Empty Cart State
- [ ] Shows "Giỏ sách trống" message
- [ ] Shows empty cart icon
- [ ] Shows helper text
- [ ] No items displayed
- [ ] Footer hidden (no borrow/clear buttons)

### Cart with Items
- [ ] All cart items displayed
- [ ] Each item shows:
  - [ ] Book image
  - [ ] Book title
  - [ ] Author name
  - [ ] Price (formatted)
  - [ ] Quantity controls
  - [ ] Stock remaining
  - [ ] Remove button
- [ ] Items in correct order (latest first/FIFO)

---

## 4. Quantity Management

### Increment/Decrement
- [ ] Plus button increases quantity
- [ ] Minus button decreases quantity
- [ ] Cannot go below 1
- [ ] Cannot exceed available stock
- [ ] Plus button disabled at max stock
- [ ] Minus button disabled at quantity 1
- [ ] Quantity updates immediately
- [ ] Cart count updates
- [ ] Total price updates

### Manual Input
- [ ] Can type quantity directly
- [ ] Invalid input handled (negative, 0, text)
- [ ] Quantity constrained to valid range
- [ ] Updates trigger recalculation

---

## 5. Remove Items

### Individual Remove
- [ ] Remove button visible on each item
- [ ] Click removes item from cart
- [ ] Item disappears with animation
- [ ] Cart count updates
- [ ] Total price updates
- [ ] Badge updates
- [ ] Book's add-to-cart button re-enabled
- [ ] Last item removal shows empty state

### Clear Cart
- [ ] "Xóa giỏ sách" button visible
- [ ] Confirmation prompt appears
- [ ] Cancel keeps cart intact
- [ ] Confirm clears all items
- [ ] Shows empty cart state
- [ ] Badge disappears
- [ ] All book buttons re-enabled

---

## 6. Cart Persistence

### localStorage
- [ ] Cart saves to localStorage on changes
- [ ] Key is "libraryCart"
- [ ] Format is valid JSON
- [ ] Page refresh preserves cart
- [ ] Browser close/reopen preserves cart
- [ ] Multiple tabs share cart state

### Clear Tests
- [ ] Manual localStorage.clear() handled
- [ ] Cart rebuilds from storage on load
- [ ] Invalid JSON handled gracefully

---

## 7. Borrow All Functionality

### Authenticated User
- [ ] "Mượn tất cả" button visible
- [ ] Button enabled when cart has items
- [ ] Click shows loading state
- [ ] Loading spinner displays
- [ ] Button disabled during loading
- [ ] API requests sent for all items
- [ ] Success message displays
- [ ] Cart clears after success
- [ ] Redirects to /docgia/borrowed-books
- [ ] New borrow requests appear in list

### Unauthenticated User
- [ ] Login prompt modal appears
- [ ] Modal shows lock icon
- [ ] "Cần đăng nhập" message displays
- [ ] Cancel button closes modal
- [ ] "Đăng nhập" button redirects to /login
- [ ] Cart preserved after redirect
- [ ] Can complete borrow after login

### Error Handling
- [ ] Network error shows error message
- [ ] Invalid token shows login prompt
- [ ] Server error displays friendly message
- [ ] Cart preserved on error
- [ ] Can retry after fixing issue

---

## 8. Responsive Design

### Desktop (>1024px)
- [ ] Cart drawer 420px wide
- [ ] 6 book columns in grid
- [ ] All features fully visible
- [ ] Comfortable spacing

### Tablet (768-1024px)
- [ ] Cart drawer 420px wide
- [ ] 3-4 book columns in grid
- [ ] Touch targets adequate
- [ ] Readable text sizes

### Mobile (<768px)
- [ ] Cart drawer full width
- [ ] 2 book columns in grid
- [ ] All content accessible
- [ ] Buttons easily tappable
- [ ] No horizontal scroll
- [ ] Text remains readable

---

## 9. UI/UX Quality

### Animations
- [ ] Drawer slide smooth
- [ ] Backdrop fade smooth
- [ ] Toast slide smooth
- [ ] No janky animations
- [ ] 60fps performance

### Visual Feedback
- [ ] Hover states work
- [ ] Active states work
- [ ] Disabled states clear
- [ ] Loading states obvious
- [ ] Success states satisfying

### Accessibility
- [ ] Can navigate with keyboard
- [ ] Tab order logical
- [ ] Focus visible
- [ ] Screen reader friendly (aria labels)
- [ ] Color contrast sufficient

---

## 10. Integration Testing

### With Search Books
- [ ] Add from search works
- [ ] Search filtering doesn't break cart
- [ ] Pagination doesn't break cart
- [ ] Sort doesn't break cart

### With Authentication
- [ ] Login/logout handled correctly
- [ ] Token expiry handled
- [ ] Refresh token works
- [ ] Multiple accounts work

### With Book Service
- [ ] API calls formatted correctly
- [ ] Error responses handled
- [ ] Success responses processed
- [ ] Stock updates reflected

---

## 11. Edge Cases & Error Scenarios

### Stock Issues
- [ ] Book goes out of stock while in cart
- [ ] Stock drops below cart quantity
- [ ] Multiple users borrowing same book

### Connection Issues
- [ ] Offline mode handled
- [ ] Timeout handled
- [ ] Slow connection UX acceptable

### Data Issues
- [ ] Missing book images handled
- [ ] Invalid prices handled
- [ ] Corrupted localStorage handled

---

## 12. Performance Testing

### Load Testing
- [ ] Cart with 1 item performs well
- [ ] Cart with 10 items performs well
- [ ] Cart with 50 items performs well
- [ ] No memory leaks
- [ ] No console errors
- [ ] Network calls optimized

### Browser Testing
- [ ] Works in Chrome
- [ ] Works in Firefox
- [ ] Works in Safari
- [ ] Works in Edge
- [ ] Mobile browsers work

---

## 13. Security Testing

### Client-side Validation
- [ ] Quantity constraints enforced
- [ ] Cannot add invalid items
- [ ] XSS prevention in book titles
- [ ] CSRF protection

### Server-side Validation
- [ ] Token validation works
- [ ] Authorization checked
- [ ] Stock verified server-side
- [ ] Rate limiting works

---

## 14. Documentation Verification

### Code Documentation
- [ ] Functions have JSDoc comments
- [ ] Types properly defined
- [ ] Complex logic explained

### User Documentation
- [ ] CART_FEATURE_GUIDE.md accurate
- [ ] CART_QUICK_REF.md helpful
- [ ] CART_VISUAL_GUIDE.md clear
- [ ] Examples work as shown

---

## 15. Final Checklist

### Functionality
- [ ] All features work as designed
- [ ] No console errors
- [ ] No network errors
- [ ] No visual glitches

### User Experience
- [ ] Intuitive to use
- [ ] Fast and responsive
- [ ] Pleasant animations
- [ ] Clear feedback

### Code Quality
- [ ] No TypeScript errors
- [ ] No linting warnings
- [ ] Clean code structure
- [ ] Good performance

### Production Ready
- [ ] Tested on multiple browsers
- [ ] Tested on multiple devices
- [ ] Tested with real data
- [ ] Documented thoroughly

---

## Bug Report Template

If you find bugs, use this format:

```
**Bug Title**: [Short description]

**Steps to Reproduce**:
1. 
2. 
3. 

**Expected Result**: 

**Actual Result**: 

**Browser**: 
**Device**: 
**Screenshot**: 
**Console Errors**: 
```

---

## Sign-off

**Tester Name**: _______________  
**Date**: _______________  
**Test Environment**: _______________  
**Overall Status**: [ ] PASS [ ] FAIL  
**Notes**: 

---

**Testing Guide Version**: 1.0  
**Last Updated**: December 5, 2024  
**Feature**: Shopping Cart for QLMS

