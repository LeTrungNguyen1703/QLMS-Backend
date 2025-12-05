# Tính Năng Mới Cho Sách Đã Mượn và Lịch Sử Mượn Sách

## Tổng Quan

Tài liệu này mô tả các tính năng mới đã được thêm vào các component **BorrowedBooks** và **BorrowHistory** để cải thiện trải nghiệm người dùng.

---

## 1. BorrowHistory Component (`BorrowHistory.vue`)

### Các tính năng đã thêm:

#### 1.1. **Tìm kiếm theo tên sách**
- Input tìm kiếm cho phép lọc lịch sử theo tên sách
- Tìm kiếm không phân biệt chữ hoa chữ thường
- Cập nhật kết quả ngay khi nhập

#### 1.2. **Lọc theo khoảng thời gian**
- Bộ lọc "Từ ngày": Lọc các bản ghi từ ngày được chọn
- Bộ lọc "Đến ngày": Lọc các bản ghi đến ngày được chọn
- Kết hợp cả hai để lọc theo khoảng thời gian cụ thể

#### 1.3. **Sắp xếp linh hoạt**
Hỗ trợ sắp xếp theo:
- Ngày mượn (Mới nhất/Cũ nhất)
- Tên sách (A-Z/Z-A)
- Tiền phạt (Cao-Thấp/Thấp-Cao)

#### 1.4. **Phân trang (Pagination)**
- Hiển thị 10 bản ghi mỗi trang (có thể tùy chỉnh)
- Điều hướng trang với nút Previous/Next
- Hiển thị số trang với khả năng nhảy trực tiếp
- Hiển thị thông tin "Hiển thị X - Y trong tổng số Z bản ghi"

#### 1.5. **Xuất dữ liệu ra CSV**
- Nút "Xuất CSV" để tải xuống lịch sử
- File CSV có BOM để hiển thị đúng tiếng Việt
- Tên file tự động theo định dạng: `lich-su-muon-sach-YYYY-MM-DD.csv`
- Bao gồm tất cả các trường: Tên sách, Tác giả, Số lượng, Ngày mượn, Hạn trả, Trạng thái, Phạt, Ghi chú

#### 1.6. **Nút xóa bộ lọc**
- Một nút để xóa tất cả bộ lọc (tìm kiếm và ngày tháng)
- Reset về trang đầu tiên

### Cách sử dụng:

```vue
<!-- Tìm kiếm -->
<input v-model="searchQuery" placeholder="Tìm theo tên sách..." />

<!-- Lọc theo ngày -->
<input type="date" v-model="dateFrom" />
<input type="date" v-model="dateTo" />

<!-- Sắp xếp -->
<select v-model="sortBy">
  <option value="date_desc">Ngày mượn (Mới nhất)</option>
  <!-- ... -->
</select>

<!-- Xuất CSV -->
<button @click="exportToCSV">Xuất CSV</button>
```

---

## 2. BorrowedBooks Component (`BorrowedBooks.vue`)

### Các tính năng đã thêm:

#### 2.1. **Tìm kiếm theo tên sách hoặc tác giả**
- Input tìm kiếm hỗ trợ tìm theo cả tên sách và tác giả
- Tìm kiếm động, cập nhật ngay lập tức

#### 2.2. **Lọc theo trạng thái**
Dropdown filter hỗ trợ:
- Tất cả trạng thái
- Chờ duyệt
- Đã duyệt

#### 2.3. **Sắp xếp linh hoạt**
Hỗ trợ sắp xếp theo:
- Ngày mượn (Mới nhất/Cũ nhất)
- Hạn trả (Gần nhất)
- Tên sách (A-Z)

#### 2.4. **Phân trang (Pagination)**
- Tương tự như BorrowHistory
- 10 bản ghi mỗi trang
- Điều hướng và hiển thị thông tin đầy đủ

#### 2.5. **Hủy yêu cầu mượn sách**
- Nút "Hủy yêu cầu" chỉ hiển thị cho các sách có trạng thái "Chờ duyệt"
- Xác nhận trước khi hủy
- Tự động tải lại danh sách sau khi hủy thành công
- Icon: `<i class="bi bi-x-circle"></i>`

#### 2.6. **Cải thiện UI/UX**
- Nút "Mượn lại" chỉ hiển thị khi sách đã được duyệt
- Hiển thị tổng số sách đang mượn và số sách quá hạn
- Responsive design tốt hơn

### API mới được thêm:

#### `bookService.cancelBorrowRequest(borrowId: string)`
```typescript
// Trong bookService.ts
async cancelBorrowRequest(borrowId: string): Promise<void> {
    try {
        await apiClient.delete(`/muonsach/delete-muonsach/${borrowId}`);
    } catch (error: any) {
        if (error.response?.data?.message) {
            throw new Error(error.response.data.message);
        }
        throw new Error('Không thể hủy yêu cầu mượn sách. Vui lòng thử lại.');
    }
}
```

### Cách sử dụng:

```vue
<!-- Tìm kiếm -->
<input v-model="searchQuery" placeholder="Tìm theo tên sách hoặc tác giả..." />

<!-- Lọc trạng thái -->
<select v-model="statusFilter">
  <option value="all">Tất cả trạng thái</option>
  <option value="cho_duyet">Chờ duyệt</option>
  <option value="da_duyet">Đã duyệt</option>
</select>

<!-- Hủy yêu cầu -->
<button 
  v-if="borrow.TrangThai === 'Chờ duyệt'"
  @click="cancelBorrowRequest(borrow._id)"
>
  <i class="bi bi-x-circle"></i>
</button>
```

---

## 3. Cấu Trúc Code

### Computed Properties quan trọng:

#### BorrowHistory.vue
```typescript
// Lọc theo status, search, và date range
const filteredHistory = computed(() => { ... })

// Sắp xếp kết quả đã lọc
const sortedAndFilteredHistory = computed(() => { ... })

// Lấy dữ liệu cho trang hiện tại
const paginatedHistory = computed(() => { ... })

// Tính tổng số trang
const totalPages = computed(() => { ... })

// Hiển thị các số trang
const displayPages = computed(() => { ... })
```

#### BorrowedBooks.vue
```typescript
// Lọc sách đang mượn (chưa trả)
const activeBorrows = computed(() => { ... })

// Sắp xếp
const sortedActiveBorrows = computed(() => { ... })

// Phân trang
const paginatedBorrows = computed(() => { ... })
```

### Các hàm chính:

```typescript
// Thay đổi trang
const changePage = (page: number) => { ... }

// Xóa bộ lọc
const clearFilters = () => { ... }

// Xuất CSV
const exportToCSV = () => { ... }

// Hủy yêu cầu mượn
const cancelBorrowRequest = async (borrowId: string) => { ... }
```

---

## 4. Styling và UX

### Pagination Styling
```css
.pagination {
  justify-content: center;
}

.page-item.active .page-link {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
```

### Responsive Design
- Mobile-friendly với breakpoint tại 768px
- Input fields stack vertically trên mobile
- Table responsive với horizontal scroll nếu cần

---

## 5. Backend Requirements

### API Endpoints cần có:

1. **GET** `/muonsach/get-by-docgia/:docgiaId` - Lấy danh sách sách đã mượn
2. **DELETE** `/muonsach/delete-muonsach/:id` - Hủy yêu cầu mượn sách
3. **POST** `/muonsach/add-muonsach` - Tạo yêu cầu mượn sách mới

### Backend Service (TheoDoiMuonSachService)
```typescript
async deleteSachMuon(id: string) {
    this.kiemTraTrangThaiSachMuon(id);
    const sachMuonDeleted = await TheoDoiMuonSachRepository.delete(id);
}
```

---

## 6. Testing Checklist

### BorrowHistory:
- [ ] Tìm kiếm hoạt động chính xác
- [ ] Lọc theo ngày hoạt động
- [ ] Sắp xếp theo các tiêu chí khác nhau
- [ ] Phân trang hiển thị đúng
- [ ] Xuất CSV với encoding đúng
- [ ] Nút xóa filter hoạt động

### BorrowedBooks:
- [ ] Tìm kiếm theo tên sách và tác giả
- [ ] Lọc theo trạng thái
- [ ] Sắp xếp hoạt động
- [ ] Phân trang chính xác
- [ ] Hủy yêu cầu chỉ hiện với "Chờ duyệt"
- [ ] Xác nhận trước khi hủy
- [ ] Reload danh sách sau khi hủy
- [ ] Nút "Mượn lại" chỉ hiện khi thích hợp

---

## 7. Future Enhancements

### Có thể thêm:
1. **Lọc nâng cao** - Modal với nhiều tùy chọn lọc
2. **Xuất PDF** - Thêm option xuất ra PDF
3. **In trực tiếp** - Nút in lịch sử
4. **Thống kê** - Charts/graphs cho lịch sử mượn
5. **Gia hạn** - Tính năng gia hạn sách đang mượn
6. **Thông báo** - Email/notification khi sắp đến hạn
7. **Bookmark** - Lưu các bộ lọc thường dùng
8. **Share** - Chia sẻ lịch sử qua link

---

## 8. Performance Considerations

- **Computed Properties**: Sử dụng computed để tránh tính toán lại không cần thiết
- **Pagination**: Giảm số lượng DOM elements được render
- **Debouncing**: Có thể thêm debounce cho search input
- **Virtual Scrolling**: Xem xét cho danh sách rất dài

---

## 9. Browser Compatibility

- Hỗ trợ: Chrome, Firefox, Safari, Edge (latest versions)
- CSV Export: Sử dụng BOM để hỗ trợ Unicode
- Date Input: HTML5 date input (fallback có thể cần cho IE)

---

## Kết Luận

Các tính năng mới này cải thiện đáng kể trải nghiệm người dùng khi quản lý sách đã mượn và xem lịch sử. Người dùng giờ có thể:
- Tìm kiếm và lọc dữ liệu dễ dàng
- Sắp xếp theo nhiều tiêu chí
- Xuất dữ liệu ra CSV
- Hủy yêu cầu mượn sách chưa được duyệt
- Điều hướng qua nhiều trang dữ liệu

Tất cả được thực hiện với UI/UX hiện đại và responsive design.

