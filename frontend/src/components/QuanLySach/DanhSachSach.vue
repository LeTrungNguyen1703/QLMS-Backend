<template>
  <div class="danh-sach-sach">
    <div class="card shadow-sm">
      <div class="card-body">
        <!-- Search Bar -->
        <div class="search-bar mb-4">
          <div class="input-group">
            <span class="input-group-text">
              <i class="bi bi-search"></i>
            </span>
            <input
              v-model="searchQuery"
              type="text"
              class="form-control"
              placeholder="Tìm kiếm theo tên sách, tác giả, mã sách..."
            />
          </div>
        </div>

        <!-- Loading State -->
        <div v-if="isLoading" class="text-center py-5">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Đang tải...</span>
          </div>
        </div>

        <!-- Book List -->
        <div v-else-if="filteredBooks.length > 0" class="books-grid">
          <div
            v-for="book in filteredBooks"
            :key="book._id"
            class="book-card"
          >
            <div class="book-image">
              <img
                :src="book.HinhAnh || '/placeholder-book.jpg'"
                :alt="book.TenSach"
              />
            </div>
            <div class="book-info">
              <h6 class="book-title">{{ book.TenSach }}</h6>
              <p class="book-author">
                <i class="bi bi-person-fill"></i>
                {{ book.TacGia }}
              </p>
              <p class="book-code">
                <i class="bi bi-upc-scan"></i>
                {{ book.MaSach }}
              </p>
              <div class="book-details">
                <div class="detail-item">
                  <span class="label">Số lượng:</span>
                  <span class="value">{{ book.SoQuyen }}</span>
                </div>
                <div class="detail-item">
                  <span class="label">Giá:</span>
                  <span class="value">{{ formatPrice(book.DonGia) }}</span>
                </div>
              </div>
              <div class="book-actions">
                <button
                  class="btn btn-sm btn-outline-primary"
                  @click="handleEdit(book)"
                  title="Chỉnh sửa"
                >
                  <i class="bi bi-pencil"></i>
                  Sửa
                </button>
                <button
                  class="btn btn-sm btn-outline-danger"
                  @click="handleDelete(book)"
                  title="Xóa"
                >
                  <i class="bi bi-trash"></i>
                  Xóa
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else class="text-center py-5">
          <i class="bi bi-inbox fs-1 text-muted"></i>
          <p class="text-muted mt-2">
            {{ searchQuery ? 'Không tìm thấy sách phù hợp' : 'Chưa có sách nào' }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { bookService } from '../../services/bookService';
import type { Sach } from '../../types/book';

const emit = defineEmits<{
  edit: [book: Sach];
  refresh: [];
}>();

const books = ref<Sach[]>([]);
const searchQuery = ref('');
const isLoading = ref(false);

const filteredBooks = computed(() => {
  if (!searchQuery.value) return books.value;

  const query = searchQuery.value.toLowerCase();
  return books.value.filter(book =>
    book.TenSach.toLowerCase().includes(query) ||
    book.TacGia.toLowerCase().includes(query) ||
    book.MaSach.toLowerCase().includes(query)
  );
});

onMounted(() => {
  loadBooks();
});

const loadBooks = async () => {
  isLoading.value = true;
  try {
    books.value = await bookService.getAllBooks();
  } catch (error: any) {
    console.error('Error loading books:', error);
    alert('Không thể tải danh sách sách');
  } finally {
    isLoading.value = false;
  }
};

const handleEdit = (book: Sach) => {
  console.log('DanhSachSach.handleEdit - Book object:', book);
  console.log('Book _id:', book._id);
  console.log('Book keys:', Object.keys(book));
  emit('edit', book);
};

const handleDelete = async (book: Sach) => {
  if (!confirm(`Bạn có chắc chắn muốn xóa sách "${book.TenSach}"?`)) {
    return;
  }

  try {
    await bookService.deleteBook(book._id);
    alert('Xóa sách thành công!');
    loadBooks();
  } catch (error: any) {
    console.error('Error deleting book:', error);
    alert(error.message || 'Không thể xóa sách. Vui lòng thử lại!');
  }
};

const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(price);
};

// Expose method for parent to refresh
defineExpose({
  loadBooks
});
</script>

<style scoped>
.danh-sach-sach {
  max-width: 100%;
}

.card {
  border: none;
  border-radius: 12px;
}

.bg-gradient {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1.25rem 1.5rem;
}

.search-bar {
  max-width: 500px;
}

.input-group-text {
  background: white;
  border-right: none;
}

.search-bar .form-control {
  border-left: none;
}

.search-bar .form-control:focus {
  border-color: #ced4da;
  box-shadow: none;
}

.books-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
}

.book-card {
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s;
  background: white;
}

.book-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
}

.book-image {
  width: 100%;
  height: 300px;
  overflow: hidden;
  background: #f8f9fa;
}

.book-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.book-info {
  padding: 1.25rem;
}

.book-title {
  font-size: 1rem;
  font-weight: 700;
  color: #2d3748;
  margin-bottom: 0.5rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.book-author,
.book-code {
  font-size: 0.875rem;
  color: #718096;
  margin-bottom: 0.25rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.book-details {
  margin: 1rem 0;
  padding: 0.75rem;
  background: #f8f9fa;
  border-radius: 8px;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
}

.detail-item:last-child {
  margin-bottom: 0;
}

.detail-item .label {
  color: #718096;
}

.detail-item .value {
  font-weight: 600;
  color: #2d3748;
}

.book-actions {
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #e2e8f0;
}

.book-actions .btn {
  flex: 1;
  font-weight: 500;
  border-radius: 6px;
  transition: all 0.2s;
}

.btn-outline-primary {
  border-color: #3b82f6;
  color: #3b82f6;
}

.btn-outline-primary:hover {
  background: #3b82f6;
  color: white;
}

.btn-outline-danger {
  border-color: #ef4444;
  color: #ef4444;
}

.btn-outline-danger:hover {
  background: #ef4444;
  color: white;
}
</style>

