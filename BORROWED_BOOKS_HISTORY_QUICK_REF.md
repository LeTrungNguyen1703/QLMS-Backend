# Quick Reference: Borrowed Books & History Features

## BorrowHistory Component

### New Features
✅ **Search by book name**
✅ **Date range filter** (From/To dates)
✅ **Multi-criteria sorting** (Date, Name, Fine)
✅ **Pagination** (10 items per page)
✅ **CSV Export** (with UTF-8 BOM)
✅ **Clear filters button**

### Key Variables
```typescript
searchQuery: ref('')        // Search term
dateFrom: ref('')          // Start date filter
dateTo: ref('')            // End date filter
sortBy: ref('date_desc')   // Sort criteria
currentPage: ref(1)        // Current page number
itemsPerPage: ref(10)      // Items per page
```

### Main Functions
```typescript
clearFilters()             // Reset all filters
changePage(page)           // Navigate to page
exportToCSV()              // Download CSV file
```

---

## BorrowedBooks Component

### New Features
✅ **Search by book name or author**
✅ **Status filter** (All/Pending/Approved)
✅ **Multi-criteria sorting** (Date, Due Date, Name)
✅ **Pagination** (10 items per page)
✅ **Cancel pending requests**

### Key Variables
```typescript
searchQuery: ref('')                     // Search term
statusFilter: ref<'all' | 'cho_duyet' | 'da_duyet'>('all')
sortBy: ref('date_desc')                // Sort criteria
currentPage: ref(1)                      // Current page
itemsPerPage: ref(10)                    // Items per page
```

### Main Functions
```typescript
changePage(page)                         // Navigate to page
cancelBorrowRequest(borrowId)            // Cancel pending request
```

### New API Method
```typescript
bookService.cancelBorrowRequest(borrowId: string)
// DELETE /muonsach/delete-muonsach/:id
```

---

## Computed Properties Chain

### BorrowHistory
```
history → filteredHistory → sortedAndFilteredHistory → paginatedHistory
```

### BorrowedBooks
```
borrows → activeBorrows → sortedActiveBorrows → paginatedBorrows
```

---

## UI Components

### Search Input
```vue
<input v-model="searchQuery" placeholder="Tìm kiếm..." />
```

### Date Filters (BorrowHistory only)
```vue
<input type="date" v-model="dateFrom" />
<input type="date" v-model="dateTo" />
```

### Sort Dropdown
```vue
<select v-model="sortBy">
  <option value="date_desc">Ngày mượn (Mới nhất)</option>
  <option value="date_asc">Ngày mượn (Cũ nhất)</option>
  <!-- ... -->
</select>
```

### Status Filter (BorrowedBooks only)
```vue
<select v-model="statusFilter">
  <option value="all">Tất cả</option>
  <option value="cho_duyet">Chờ duyệt</option>
  <option value="da_duyet">Đã duyệt</option>
</select>
```

### Pagination
```vue
<nav v-if="totalPages > 1">
  <ul class="pagination">
    <!-- Previous -->
    <li :class="{ disabled: currentPage === 1 }">
      <a @click.prevent="changePage(currentPage - 1)">
        <i class="bi bi-chevron-left"></i>
      </a>
    </li>
    
    <!-- Page numbers -->
    <li v-for="page in displayPages" 
        :class="{ active: currentPage === page }">
      <a @click.prevent="changePage(page)">{{ page }}</a>
    </li>
    
    <!-- Next -->
    <li :class="{ disabled: currentPage === totalPages }">
      <a @click.prevent="changePage(currentPage + 1)">
        <i class="bi bi-chevron-right"></i>
      </a>
    </li>
  </ul>
</nav>
```

### Cancel Button (BorrowedBooks only)
```vue
<button 
  v-if="borrow.TrangThai === 'Chờ duyệt'"
  @click="cancelBorrowRequest(borrow._id)"
  class="btn btn-outline-danger"
>
  <i class="bi bi-x-circle"></i>
</button>
```

---

## Sort Options

### BorrowHistory
- `date_desc` - Ngày mượn (Mới nhất)
- `date_asc` - Ngày mượn (Cũ nhất)
- `name_asc` - Tên sách (A-Z)
- `name_desc` - Tên sách (Z-A)
- `fine_asc` - Phạt (Thấp-Cao)
- `fine_desc` - Phạt (Cao-Thấp)

### BorrowedBooks
- `date_desc` - Ngày mượn (Mới nhất)
- `date_asc` - Ngày mượn (Cũ nhất)
- `due_date_asc` - Hạn trả (Gần nhất)
- `name_asc` - Tên sách (A-Z)

---

## CSV Export Format (BorrowHistory)

### Headers
```
Tên sách, Tác giả, Số lượng, Ngày mượn, Hạn trả, Trạng thái, Phạt, Ghi chú
```

### Filename Pattern
```
lich-su-muon-sach-YYYY-MM-DD.csv
```

### Implementation
```typescript
const exportToCSV = () => {
  const headers = ['Tên sách', 'Tác giả', ...]
  const rows = sortedAndFilteredHistory.value.map(record => [...])
  const csvContent = [headers.join(','), ...rows].join('\n')
  const BOM = '\uFEFF'  // For UTF-8 encoding
  const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' })
  // Download logic...
}
```

---

## Pagination Logic

### Calculate Total Pages
```typescript
const totalPages = computed(() => 
  Math.ceil(sortedAndFilteredHistory.value.length / itemsPerPage.value)
)
```

### Get Current Page Data
```typescript
const paginatedHistory = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return sortedAndFilteredHistory.value.slice(start, end)
})
```

### Display Page Numbers
```typescript
const displayPages = computed(() => {
  const maxDisplay = 5
  let startPage = Math.max(1, currentPage.value - Math.floor(maxDisplay / 2))
  let endPage = Math.min(totalPages.value, startPage + maxDisplay - 1)
  
  if (endPage - startPage < maxDisplay - 1) {
    startPage = Math.max(1, endPage - maxDisplay + 1)
  }
  
  return Array.from(
    { length: endPage - startPage + 1 }, 
    (_, i) => startPage + i
  )
})
```

---

## Filter Flow

### BorrowHistory
1. Filter by status tab (cho_duyet/da_duyet/da_tra/all)
2. Filter by search query (book name)
3. Filter by date range (from/to)
4. Sort by selected criteria
5. Paginate results

### BorrowedBooks
1. Filter active borrows (not returned)
2. Filter by search query (book name or author)
3. Filter by status (pending/approved/all)
4. Sort by selected criteria
5. Paginate results

---

## Event Handlers

### Search Input
```typescript
// Auto-updates on input (no debounce yet)
v-model="searchQuery"
```

### Clear Filters
```typescript
const clearFilters = () => {
  searchQuery.value = ''
  dateFrom.value = ''
  dateTo.value = ''
  currentPage.value = 1
}
```

### Cancel Request (with confirmation)
```typescript
const cancelBorrowRequest = async (borrowId: string) => {
  if (!confirm('Bạn có chắc chắn muốn hủy yêu cầu mượn sách này?')) {
    return
  }
  
  try {
    await bookService.cancelBorrowRequest(borrowId)
    alert('Đã hủy yêu cầu mượn sách thành công')
    await loadBorrowedBooks()
  } catch (error: any) {
    alert(error.message || 'Không thể hủy yêu cầu. Vui lòng thử lại.')
  }
}
```

---

## Styling Classes

### Button Gradients
```css
.btn-gradient {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
```

### Active Pagination
```css
.page-item.active .page-link {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
```

### Disabled States
```css
.page-item.disabled {
  pointer-events: none;
  opacity: 0.5;
}
```

---

## Testing Scenarios

### BorrowHistory
1. Search with "sách" → Should filter matching books
2. Set date range → Should show only records in range
3. Sort by fine → Should order high to low
4. Export CSV → Should download with correct encoding
5. Clear filters → Should reset all fields

### BorrowedBooks
1. Search "Nguyễn" → Should find books by author
2. Filter "Chờ duyệt" → Should show only pending
3. Click cancel on pending → Should confirm and delete
4. Sort by due date → Should show nearest first
5. Navigate pages → Should maintain filters

---

## Common Issues & Solutions

### Issue: CSV not showing Vietnamese characters
**Solution:** Use BOM (`\uFEFF`) prefix

### Issue: Filter not updating
**Solution:** Ensure computed properties are reactive

### Issue: Pagination shows wrong data
**Solution:** Check `slice()` logic and `currentPage` calculation

### Issue: Cancel button always visible
**Solution:** Check conditional rendering: `v-if="borrow.TrangThai === 'Chờ duyệt'"`

---

## Performance Tips

1. Use `computed` for derived data (not `watch`)
2. Limit items per page (10 is optimal)
3. Consider debouncing search input for large datasets
4. Use `v-if` for heavy components, `v-show` for light toggles
5. Lazy load images if book covers are shown

---

## Accessibility

- Pagination has `aria-label="Page navigation"`
- Buttons have `title` attributes for tooltips
- Form inputs have proper labels
- Table structure is semantic with `<thead>` and `<tbody>`

