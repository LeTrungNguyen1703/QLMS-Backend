# Testing Checklist: Book Detail Stock Fix

## Quick Test Guide

### 🧪 Test 1: View Detail Shows Current Stock

**Setup:**
1. Have a book with at least 3 copies in stock
2. Borrow 1 copy as User A
3. Have another user (User B) borrow 1 more copy
4. Result: Book should now have 1 copy remaining

**Test Steps:**
1. Log in as User A
2. Go to "Sách đã mượn" (Borrowed Books)
3. Find the book you borrowed
4. Click the 👁 (View Detail) icon

**Expected Result:**
- ✅ Loading spinner appears briefly
- ✅ Modal shows "Số lượng: 1 quyển"
- ✅ Status badge shows "Còn sách" (green)
- ✅ "Mượn lại" button is ENABLED

**If it shows 0 copies when 1 is available → BUG NOT FIXED** ❌

---

### 🧪 Test 2: View Detail Shows Out of Stock

**Setup:**
1. Have a book with exactly 1 copy in stock
2. Borrow it as User A
3. Result: Book should now have 0 copies

**Test Steps:**
1. Log in as User A
2. Go to "Sách đã mượn"
3. Click 👁 on that book

**Expected Result:**
- ✅ Loading spinner appears
- ✅ Modal shows "Số lượng: 0 quyển"
- ✅ Status badge shows "Hết sách" (red)
- ✅ "Mượn lại" button is DISABLED

---

### 🧪 Test 3: Borrow Again with Stock Available

**Setup:**
1. Have a book with 2+ copies in stock
2. Borrow 1 as User A
3. At least 1 copy should remain

**Test Steps:**
1. Go to "Sách đã mượn"
2. Find the book
3. Click 🔄 (Borrow Again) button OR click 👁 then "Mượn lại"

**Expected Result:**
- ✅ No alert about "Hết sách"
- ✅ Borrow modal opens
- ✅ Shows correct available quantity
- ✅ Can submit borrow request successfully

---

### 🧪 Test 4: Borrow Again with No Stock

**Setup:**
1. Borrow a book as User A when it had stock
2. Have other users borrow all remaining copies
3. Book now has 0 copies available

**Test Steps:**
1. Go to "Sách đã mượn"
2. Click 🔄 on that book

**Expected Result:**
- ✅ Alert appears: "Sách hiện không còn để mượn"
- ✅ Borrow modal does NOT open
- ✅ User cannot proceed with invalid borrow

---

### 🧪 Test 5: Loading States

**Test Steps:**
1. Go to "Sách đã mượn"
2. Click 👁 on any book
3. Observe the modal

**Expected Result:**
- ✅ Modal opens immediately
- ✅ Loading spinner appears
- ✅ Text says "Đang tải thông tin sách..."
- ✅ After ~100-500ms, book details appear
- ✅ "Mượn lại" button disabled during loading
- ✅ "Mượn lại" button enabled/disabled based on stock after loading

---

### 🧪 Test 6: Error Handling (Network Failure)

**Setup:**
1. Open browser DevTools (F12)
2. Go to Network tab
3. Enable "Offline" mode

**Test Steps:**
1. Go to "Sách đã mượn"
2. Click 👁 on any book

**Expected Result:**
- ✅ Loading spinner appears
- ✅ After timeout, shows cached book data (fallback)
- ✅ No blank screen or crash
- ✅ Console shows error log (check console)

**Cleanup:** Disable offline mode

---

### 🧪 Test 7: Multiple Rapid Clicks

**Test Steps:**
1. Go to "Sách đã mượn"
2. Click 👁 on a book
3. Immediately close modal
4. Click 👁 again
5. Repeat 3-4 times quickly

**Expected Result:**
- ✅ No crashes
- ✅ Always shows loading state first
- ✅ Eventually shows correct data
- ✅ No stale data from previous opens

---

### 🧪 Test 8: Real-Time Accuracy

**Setup:**
1. Open app in two browser windows
2. Log in as User A in Window 1
3. Log in as User B in Window 2
4. Have a book with 2 copies available

**Test Steps:**
1. **Window 1 (User A):** Borrow 1 copy → 1 remains
2. **Window 1:** Go to "Sách đã mượn", click 👁
3. Verify shows "1 quyển"
4. **Window 2 (User B):** Borrow the last copy → 0 remain
5. **Window 1:** Close and reopen detail modal (click 👁 again)

**Expected Result:**
- ✅ First view shows "1 quyển" ✓
- ✅ Second view (after User B borrowed) shows "0 quyển" ✓
- ✅ Always reflects current database state

---

### 🧪 Test 9: Different Book States

Test with books in different states:

| Book Copies | After View Detail | "Mượn lại" Button |
|-------------|-------------------|-------------------|
| 0 | "Hết sách" (red) | Disabled ❌ |
| 1 | "Còn sách" (green), "1 quyển" | Enabled ✅ |
| 5 | "Còn sách" (green), "5 quyển" | Enabled ✅ |
| 100 | "Còn sách" (green), "100 quyển" | Enabled ✅ |

**All should match database exactly** ✓

---

### 🧪 Test 10: Performance Check

**Test Steps:**
1. Open Browser DevTools → Network tab
2. Click 👁 on a book
3. Check the network request

**Expected Result:**
- ✅ Sees GET request to `/sach/get-sach/:id`
- ✅ Response time < 1 second
- ✅ Loading spinner visible during request
- ✅ Data updates after response

---

## Automated Test Script (Optional)

```javascript
// Run in browser console on "Sách đã mượn" page

async function testBookDetail() {
  console.log('🧪 Starting automated test...');
  
  // Find first view button
  const viewBtn = document.querySelector('.btn-outline-info');
  if (!viewBtn) {
    console.error('❌ No view button found');
    return;
  }
  
  // Click it
  viewBtn.click();
  console.log('✓ Clicked view button');
  
  // Wait for modal
  await new Promise(r => setTimeout(r, 1000));
  
  // Check for loading state
  const loading = document.querySelector('.book-detail-loading');
  console.log(loading ? '✓ Loading state shown' : '✓ Loading completed');
  
  // Wait for data
  await new Promise(r => setTimeout(r, 2000));
  
  // Check for book details
  const title = document.querySelector('.book-detail-title');
  const quantity = document.querySelector('.meta-row:nth-child(5) .meta-value');
  const status = document.querySelector('.meta-row:nth-child(6) .badge');
  
  console.log('📊 Results:');
  console.log('  Title:', title?.textContent);
  console.log('  Quantity:', quantity?.textContent);
  console.log('  Status:', status?.textContent);
  
  // Check button state
  const borrowBtn = document.querySelector('.btn-gradient');
  console.log('  Borrow button:', borrowBtn?.disabled ? 'Disabled ❌' : 'Enabled ✅');
  
  console.log('✅ Test completed');
}

// Run it
testBookDetail();
```

---

## Common Issues & Solutions

### Issue 1: Still Shows Old Stock
**Symptom:** Modal shows "0 quyển" when books are available

**Solution:**
1. Clear browser cache
2. Hard refresh (Ctrl+F5)
3. Check browser console for errors
4. Verify backend API is running

### Issue 2: Loading Never Finishes
**Symptom:** Spinner keeps spinning forever

**Solution:**
1. Check network tab for failed requests
2. Verify backend server is running
3. Check CORS settings
4. Verify book ID exists in database

### Issue 3: Button Always Disabled
**Symptom:** "Mượn lại" button disabled even with stock

**Solution:**
1. Check `selectedBook.SoQuyen` value in Vue DevTools
2. Verify API response includes correct `SoQuyen`
3. Check for TypeScript errors in console

---

## Quick Visual Check

When you click 👁, you should see this sequence:

```
1. Modal Opens
   ┌─────────────────┐
   │   Loading...    │
   │      ⏳         │
   └─────────────────┘

2. Data Loads (after ~200ms)
   ┌─────────────────┐
   │ Harry Potter    │
   │ Số lượng: 5     │
   │ [Còn sách]      │
   │                 │
   │ [Mượn lại] ✅   │
   └─────────────────┘
```

If you see "Hết sách" but database has stock → **BUG!** ❌

---

## Success Criteria

✅ All 10 tests pass  
✅ No console errors  
✅ Stock always accurate  
✅ Button state always correct  
✅ Loading indicator works  
✅ Error handling graceful  
✅ Performance acceptable (<1s)  

**If all checked → FIX IS WORKING!** 🎉

---

## Report Issues

If any test fails, report with:
1. Test number that failed
2. Expected vs actual result
3. Browser console errors
4. Network tab screenshot
5. Steps to reproduce

---

## Next Steps After Testing

1. ✅ Verify all tests pass
2. ✅ Test on different browsers (Chrome, Firefox, Edge)
3. ✅ Test on mobile devices
4. ✅ Deploy to production
5. ✅ Monitor for issues
6. 🎉 Celebrate working feature!

