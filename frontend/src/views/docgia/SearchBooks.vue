<template>
  <div class="container mt-4">
    <div class="card shadow">
      <div class="card-header bg-primary text-white">
        <h4 class="mb-0">
          <i class="bi bi-book me-2"></i>
          Tìm sách
        </h4>
      </div>
      <div class="card-body">
        <!-- Search bar -->
        <div class="mb-4">
          <div class="input-group">
            <input
              v-model="searchQuery"
              type="text"
              class="form-control"
              placeholder="Tìm kiếm theo tên sách, tác giả..."
              @input="filterBooks"
            />
            <button class="btn btn-primary" type="button">
              <i class="bi bi-search"></i>
            </button>
          </div>
        </div>

        <!-- Loading state -->
        <div v-if="isLoading" class="text-center py-5">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Đang tải...</span>
          </div>
          <p class="mt-2">Đang tải danh sách sách...</p>
        </div>

        <!-- Error message -->
        <div v-else-if="errorMessage" class="alert alert-danger">
          <i class="bi bi-exclamation-triangle me-2"></i>
          {{ errorMessage }}
        </div>

        <!-- Books grid -->
        <div v-else-if="filteredBooks.length > 0" class="row g-4">
          <div v-for="book in filteredBooks" :key="book._id" class="col-md-4">
            <div class="card h-100 book-card">
              <img
                :src="book.HinhAnh || '/placeholder-book.jpg'"
                class="card-img-top"
                :alt="book.TenSach"
                style="height: 250px; object-fit: cover;"
              />
              <div class="card-body d-flex flex-column">
                <h5 class="card-title">{{ book.TenSach }}</h5>
                <p class="card-text text-muted small mb-2">
                  <i class="bi bi-person me-1"></i>{{ book.TacGia }}
                </p>
                <p class="card-text small">
                  <i class="bi bi-calendar me-1"></i>
                  {{ new Date(book.NamXuatBan).getFullYear() }}
                </p>
                <div class="mt-auto">
                  <div class="d-flex justify-content-between align-items-center mb-2">
                    <span class="badge bg-success">Còn {{ book.SoQuyen }} quyển</span>
                    <span class="text-primary fw-bold">{{ formatPrice(book.DonGia) }}</span>
                  </div>
                  <button
                    class="btn btn-primary w-100"
                    @click="openBorrowModal(book)"
                    :disabled="book.SoQuyen === 0"
                  >
                    <i class="bi bi-bookmark-plus me-1"></i>
                    {{ book.SoQuyen === 0 ? 'Hết sách' : 'Mượn sách' }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- No results -->
        <div v-else class="text-center py-5">
          <i class="bi bi-inbox fs-1 text-muted"></i>
          <p class="text-muted mt-2">Không tìm thấy sách nào</p>
        </div>
      </div>
    </div>

    <!-- Borrow Modal -->
    <div v-if="showBorrowModal" class="modal fade show d-block" tabindex="-1" style="background: rgba(0,0,0,0.5)">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Mượn sách</h5>
            <button type="button" class="btn-close" @click="closeBorrowModal"></button>
          </div>
          <div class="modal-body">
            <div v-if="selectedBook">
              <h6>{{ selectedBook.TenSach }}</h6>
              <p class="text-muted small">{{ selectedBook.TacGia }}</p>

              <div class="mb-3">
                <label class="form-label">Số lượng mượn</label>
                <input
                  v-model.number="borrowQuantity"
                  type="number"
                  class="form-control"
                  min="1"
                  :max="selectedBook.SoQuyen"
                />
                <small class="text-muted">Còn lại: {{ selectedBook.SoQuyen }} quyển</small>
              </div>

              <div v-if="borrowError" class="alert alert-danger">
                {{ borrowError }}
              </div>

              <div v-if="borrowSuccess" class="alert alert-success">
                {{ borrowSuccess }}
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="closeBorrowModal">Hủy</button>
            <button
              type="button"
              class="btn btn-primary"
              @click="confirmBorrow"
              :disabled="isBorrowing"
            >
              <span v-if="isBorrowing">Đang xử lý...</span>
              <span v-else>Xác nhận mượn</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { bookService } from '../../services/bookService'
import type { Sach } from '../../types/book'

const books = ref<Sach[]>([])
const searchQuery = ref('')
const isLoading = ref(false)
const errorMessage = ref('')

const showBorrowModal = ref(false)
const selectedBook = ref<Sach | null>(null)
const borrowQuantity = ref(1)
const isBorrowing = ref(false)
const borrowError = ref('')
const borrowSuccess = ref('')

const filteredBooks = computed(() => {
  if (!searchQuery.value) return books.value

  const query = searchQuery.value.toLowerCase()
  return books.value.filter(book =>
    book.TenSach.toLowerCase().includes(query) ||
    book.TacGia.toLowerCase().includes(query)
  )
})

const loadBooks = async () => {
  isLoading.value = true
  errorMessage.value = ''
  try {
    books.value = await bookService.searchBooks()
  } catch (error: any) {
    errorMessage.value = error.message || 'Không thể tải danh sách sách'
  } finally {
    isLoading.value = false
  }
}

const filterBooks = () => {
  // Reactive computed sẽ tự động filter
}

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)
}

const openBorrowModal = (book: Sach) => {
  selectedBook.value = book
  borrowQuantity.value = 1
  borrowError.value = ''
  borrowSuccess.value = ''
  showBorrowModal.value = true
}

const closeBorrowModal = () => {
  showBorrowModal.value = false
  selectedBook.value = null
  borrowError.value = ''
  borrowSuccess.value = ''
}

const confirmBorrow = async () => {
  if (!selectedBook.value) return

  if (borrowQuantity.value < 1 || borrowQuantity.value > selectedBook.value.SoQuyen) {
    borrowError.value = 'Số lượng không hợp lệ'
    return
  }

  isBorrowing.value = true
  borrowError.value = ''
  borrowSuccess.value = ''

  try {
    await bookService.borrowBook({
      MaSach: selectedBook.value._id,
      SoQuyen: borrowQuantity.value
    })

    borrowSuccess.value = 'Yêu cầu mượn sách đã được gửi. Vui lòng chờ nhân viên duyệt.'

    // Reload books sau 1.5s
    setTimeout(() => {
      closeBorrowModal()
      loadBooks()
    }, 1500)
  } catch (error: any) {
    borrowError.value = error.message || 'Không thể mượn sách'
  } finally {
    isBorrowing.value = false
  }
}

onMounted(() => {
  loadBooks()
})
</script>

<style scoped>
.book-card {
  transition: transform 0.2s, box-shadow 0.2s;
  border: none;
  border-radius: 10px;
}

.book-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0,0,0,0.1);
}

.modal.show {
  display: block;
}
</style>

