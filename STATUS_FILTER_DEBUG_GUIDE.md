# Status Filter Debugging Guide

## The filter is still not working? Let's debug it step by step!

---

## Quick Debug Steps

### Step 1: Open Browser Console
1. Go to the BorrowedBooks page
2. Press F12 to open Developer Tools
3. Go to the Console tab

### Step 2: Check What's Being Logged
When you change the status filter dropdown, you should see:
```
Filtering by status: Chờ duyệt
Sample book status: Chờ duyệt
Filtered result count: 5
```

### Step 3: Look for the Problem

#### If you see NO logs at all:
**Problem:** The filter code isn't running
**Solution:** The `statusFilter` value might not be updating

#### If you see logs like this:
```
Filtering by status: Chờ duyệt
Sample book status: Chờ duyệt
No match: "Chờ duyệt" !== "Chờ duyệt"  ← THIS IS THE PROBLEM!
Filtered result count: 0
```

**Problem:** String comparison is failing even though they look the same
**Reason:** Hidden unicode characters, extra spaces, or encoding issues

---

## Common Issues & Solutions

### Issue 1: Extra Spaces
```javascript
// Bad
"Chờ duyệt " !== "Chờ duyệt"  // Extra space at end

// Fix: Trim the values
b.TrangThai.trim() === statusFilter.value.trim()
```

### Issue 2: Unicode Characters
```javascript
// Vietnamese characters might have different encodings
// "ờ" could be: ờ (single char) or o + ̀ + ̛ (combining chars)

// Fix: Normalize before comparing
b.TrangThai.normalize() === statusFilter.value.normalize()
```

### Issue 3: Database Returns Different Format
```javascript
// Database might return:
{ TrangThai: "CHO_DUYET" }  // All caps, underscore

// But we're comparing with:
"Chờ duyệt"  // Vietnamese text

// Fix: Need to check actual API response
```

---

## Manual Debug in Browser Console

### 1. Check actual data from API
Paste this in browser console:
```javascript
// Get the Vue component instance
const app = document.querySelector('#app').__vueParentComponent
const borrows = app.ctx.borrows

// Check what the API actually returns
console.log('All borrows:', borrows)
console.log('First borrow status:', borrows[0]?.TrangThai)
console.log('Status type:', typeof borrows[0]?.TrangThai)
console.log('Status length:', borrows[0]?.TrangThai?.length)
console.log('Status char codes:', [...(borrows[0]?.TrangThai || '')].map(c => c.charCodeAt(0)))
```

### 2. Check filter value
```javascript
// Check what the dropdown value is
const filterValue = document.querySelector('select.form-select').value
console.log('Filter value:', filterValue)
console.log('Filter type:', typeof filterValue)
console.log('Filter length:', filterValue.length)
console.log('Filter char codes:', [...filterValue].map(c => c.charCodeAt(0)))
```

### 3. Compare them
```javascript
const status = borrows[0]?.TrangThai
const filter = filterValue

console.log('Are they equal?', status === filter)
console.log('Status:', JSON.stringify(status))
console.log('Filter:', JSON.stringify(filter))

// Character by character comparison
if (status && filter) {
  for (let i = 0; i < Math.max(status.length, filter.length); i++) {
    const s = status[i] || '(none)'
    const f = filter[i] || '(none)'
    if (s !== f) {
      console.log(`Position ${i}: "${s}" (${s.charCodeAt(0)}) !== "${f}" (${f.charCodeAt(0)})`)
    }
  }
}
```

---

## Expected Console Output (When Working)

### When you select "Chờ duyệt":
```
Filtering by status: Chờ duyệt
Sample book status: Chờ duyệt
Filtered result count: 3
```

### When you select "Đã duyệt":
```
Filtering by status: Đã duyệt
Sample book status: Đã duyệt
Filtered result count: 7
```

### When you select "Tất cả trạng thái":
```
(No logs - filter not applied)
```

---

## Solutions Based on Console Output

### Solution 1: If status has extra spaces
```vue
<!-- Update the filter logic -->
result = result.filter(b => b.TrangThai.trim() === statusFilter.value.trim())
```

### Solution 2: If database returns different format
Check the actual API response:
```bash
# Check the API directly
curl http://localhost:3000/api/muonsach/get-by-docgia/YOUR_USER_ID
```

Look at the `TrangThai` field:
```json
{
  "TrangThai": "CHO_DUYET"  // ← If it's this format
}
```

Then update the dropdown:
```vue
<option value="CHO_DUYET">Chờ duyệt</option>
<option value="DA_DUYET">Đã duyệt</option>
```

### Solution 3: If there are unicode issues
```vue
<!-- Normalize both strings -->
result = result.filter(b => 
  b.TrangThai.normalize() === statusFilter.value.normalize()
)
```

---

## Alternative: Use Enum Values Directly

Instead of strings, use the enum:

```vue
<!-- Dropdown -->
<select class="form-select" v-model="statusFilter">
  <option :value="null">Tất cả trạng thái</option>
  <option :value="TrangThaiMuonSach.CHO_DUYET">Chờ duyệt</option>
  <option :value="TrangThaiMuonSach.DA_DUYET">Đã duyệt</option>
</select>
```

```typescript
// Import at top
import { TrangThaiMuonSach } from '../../types/book'

// State
const statusFilter = ref<TrangThaiMuonSach | null>(null)

// Filter logic
if (statusFilter.value !== null) {
  result = result.filter(b => b.TrangThai === statusFilter.value)
}
```

---

## What to Report Back

After checking the console, please tell me:

1. **What do you see in the console?**
   - Copy the exact log messages

2. **What does the API return?**
   - Copy the TrangThai value from the browser Network tab

3. **What happens when you select a filter?**
   - Does the table update?
   - How many results show?

4. **Any error messages?**
   - In console or on screen

---

## Quick Fix to Try Right Now

Open the browser console and run this:

```javascript
// This will tell us exactly what's wrong
const borrows = [...document.querySelectorAll('tr')].slice(1) // Skip header row
const statuses = [...new Set(borrows.map(row => {
  const statusCell = row.cells[5] // Status column
  return statusCell?.textContent?.trim()
}))]

console.log('Unique statuses in table:', statuses)
console.log('Filter dropdown options:', 
  [...document.querySelectorAll('select.form-select option')]
    .map(opt => opt.value)
)
```

This will show you:
- What statuses are actually in the table
- What values the dropdown has
- If they match

---

## Most Likely Fix

Based on common issues, try this fix:

```vue
<!-- In BorrowedBooks.vue, update filter logic -->

// Status filter with trim and normalize
if (statusFilter.value !== 'all') {
  const filterValue = statusFilter.value.trim().normalize()
  result = result.filter(b => {
    const statusValue = b.TrangThai.trim().normalize()
    return statusValue === filterValue
  })
}
```

---

## Still Not Working?

If after all this the filter still doesn't work, we need to:

1. **Check the API response format**
   - Open Network tab in browser
   - Reload the page
   - Find the request to `/muonsach/get-by-docgia/...`
   - Look at the Response
   - Check the `TrangThai` field format

2. **Verify the enum definition**
   - Check `frontend/src/types/book.ts`
   - Make sure enum values match API response

3. **Try a simpler filter**
   ```typescript
   // Super simple, no tricks
   if (statusFilter.value !== 'all') {
     console.log('Before filter:', result.length)
     result = result.filter(b => {
       console.log('Comparing:', b.TrangThai, 'with', statusFilter.value)
       return b.TrangThai === statusFilter.value
     })
     console.log('After filter:', result.length)
   }
   ```

Then send me the console output!

