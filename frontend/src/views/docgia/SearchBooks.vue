<template>
  <div class="search-books-page">
    <!-- Loading state -->
    <div v-if="isLoading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Đang tải...</span>
      </div>
      <p class="mt-2">Đang tải danh sách sách...</p>
    </div>

    <!--Carousel component-->
    <CarouselComponent v-else-if="!isLoading && !errorMessage && books.length === 0"/>

    <!-- Error message -->
    <div v-else-if="errorMessage" class="container mt-4">
      <div class="alert alert-danger">
        <i class="bi bi-exclamation-triangle me-2"></i>
        {{ errorMessage }}
      </div>
    </div>

    <!-- Books grid - Full width -->
    <div v-else-if="filteredBooks.length > 0" class="container-fluid px-4 py-4">
      <!-- Sort Controls -->
      <div class="sort-controls mb-4">
        <div class="d-flex align-items-center gap-3 flex-wrap">
          <span class="fw-semibold text-muted">
            <i class="bi bi-sort-down me-2"></i>Sắp xếp theo giá:
          </span>
          <div class="btn-group" role="group">
            <button
                type="button"
                class="btn btn-outline-primary"
                :class="{ active: sortOrder === 'default' }"
                @click="sortOrder = 'default'"
            >
              <i class="bi bi-list-ul me-1"></i>Mặc định
            </button>
            <button
                type="button"
                class="btn btn-outline-primary"
                :class="{ active: sortOrder === 'asc' }"
                @click="sortOrder = 'asc'"
            >
              <i class="bi bi-sort-numeric-down me-1"></i>Thấp đến cao
            </button>
            <button
                type="button"
                class="btn btn-outline-primary"
                :class="{ active: sortOrder === 'desc' }"
                @click="sortOrder = 'desc'"
            >
              <i class="bi bi-sort-numeric-down-alt me-1"></i>Cao đến thấp
            </button>
          </div>
          <span class="text-muted small ms-auto">
            Tìm thấy {{ filteredBooks.length }} cuốn sách
          </span>
          <div class="d-flex align-items-center gap-2">
            <span class="text-muted small">Hiển thị:</span>
            <select
              class="form-select form-select-sm"
              style="width: auto;"
              v-model.number="itemsPerPage"
              @change="changeItemsPerPage(itemsPerPage)"
            >
              <option :value="12">12</option>
              <option :value="24">24</option>
              <option :value="36">36</option>
              <option :value="48">48</option>
            </select>
          </div>
        </div>
      </div>

      <div class="row g-4 row-cols-2 row-cols-md-3 row-cols-lg-4 row-cols-xl-6">
        <div v-for="book in paginatedBooks" :key="book._id">
          <div class="card h-100 book-card">
            <div class="book-image-wrapper">
              <img
                  :src="book.HinhAnh || '/placeholder-book.jpg'"
                  class="card-img-top"
                  :alt="book.TenSach"
              />
            </div>
            <div class="card-body d-flex flex-column p-3">
              <h6 class="card-title text-truncate" :title="book.TenSach">{{ book.TenSach }}</h6>
              <p class="card-text text-muted small mb-1 text-truncate">
                <i class="bi bi-person me-1"></i>{{ book.TacGia }}
              </p>
              <p class="card-text small mb-2">
                <i class="bi bi-calendar me-1"></i>
                {{ new Date(book.NamXuatBan).getFullYear() }}
              </p>
              <div class="mt-auto">
                <div class="d-flex justify-content-between align-items-center mb-2">
                  <span class="text-primary fw-bold small">{{ formatPrice(book.DonGia) }}</span>
                </div>
                <div class="d-flex gap-1 mb-2">
                  <button
                      class="btn btn-gradient btn-sm flex-grow-1"
                      @click="handleBorrowClick(book)"
                      :disabled="book.SoQuyen === 0"
                  >
                    <i class="bi bi-bookmark-plus me-1"></i>
                    {{ book.SoQuyen === 0 ? 'Hết' : 'Mượn' }}
                  </button>
                  <button
                      class="btn btn-outline-primary btn-sm"
                      @click="handleAddToCart(book)"
                      :disabled="book.SoQuyen === 0 || isInCart(book._id)"
                      :title="isInCart(book._id) ? 'Đã có trong giỏ' : 'Thêm vào giỏ'"
                  >
                    <i :class="isInCart(book._id) ? 'bi bi-check-lg' : 'bi bi-cart-plus'"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Pagination Controls -->
      <div v-if="totalPages > 1" class="pagination-wrapper mt-5">
        <nav aria-label="Book pagination">
          <ul class="pagination justify-content-center">
            <!-- Previous Button -->
            <li class="page-item" :class="{ disabled: currentPage === 1 }">
              <button
                class="page-link"
                @click="goToPage(currentPage - 1)"
                :disabled="currentPage === 1"
                aria-label="Previous"
              >
                <i class="bi bi-chevron-left"></i>
              </button>
            </li>

            <!-- First Page -->
            <li v-if="currentPage > 3" class="page-item">
              <button class="page-link" @click="goToPage(1)">1</button>
            </li>
            <li v-if="currentPage > 4" class="page-item disabled">
              <span class="page-link">...</span>
            </li>

            <!-- Page Numbers -->
            <li
              v-for="page in getPageNumbers()"
              :key="page"
              class="page-item"
              :class="{ active: page === currentPage }"
            >
              <button class="page-link" @click="goToPage(page)">
                {{ page }}
              </button>
            </li>

            <!-- Last Page -->
            <li v-if="currentPage < totalPages - 3" class="page-item disabled">
              <span class="page-link">...</span>
            </li>
            <li v-if="currentPage < totalPages - 2" class="page-item">
              <button class="page-link" @click="goToPage(totalPages)">{{ totalPages }}</button>
            </li>

            <!-- Next Button -->
            <li class="page-item" :class="{ disabled: currentPage === totalPages }">
              <button
                class="page-link"
                @click="goToPage(currentPage + 1)"
                :disabled="currentPage === totalPages"
                aria-label="Next"
              >
                <i class="bi bi-chevron-right"></i>
              </button>
            </li>
          </ul>
        </nav>

        <!-- Pagination Info -->
        <div class="pagination-info text-center mt-3">
          <span class="text-muted small">
            Trang {{ currentPage }} / {{ totalPages }}
            (Hiển thị {{ (currentPage - 1) * itemsPerPage + 1 }} -
            {{ Math.min(currentPage * itemsPerPage, filteredBooks.length) }}
            trong số {{ filteredBooks.length }} sách)
          </span>
        </div>
      </div>
    </div>

    <!-- No results -->
    <div v-else class="container text-center py-5">
      <i class="bi bi-inbox fs-1 text-muted"></i>
      <p class="text-muted mt-2">Không tìm thấy sách nào</p>
    </div>

    <!-- Cart Notification Toast -->
    <Transition name="toast-fade">
      <div v-if="showCartNotification" class="cart-notification-toast">
        <i class="bi bi-check-circle-fill text-success me-2"></i>
        {{ cartNotificationMessage }}
      </div>
    </Transition>

    <!-- Login Prompt Modal -->
    <Transition name="modal-fade">
      <div v-if="showLoginPrompt" class="modal-backdrop" @click="closeLoginPrompt">
        <Transition name="modal-slide">
          <div v-if="showLoginPrompt" class="modal-dialog-wrapper-small" @click.stop>
            <div class="modal-content-custom">
              <button type="button" class="btn-close-custom" @click="closeLoginPrompt">
                <i class="bi bi-x-lg"></i>
              </button>

              <div class="login-prompt-content">
                <div class="login-prompt-icon">
                  <i class="bi bi-lock-fill"></i>
                </div>
                <h4 class="login-prompt-title">Yêu cầu đăng nhập</h4>
                <p class="login-prompt-message">
                  Bạn cần đăng nhập để mượn sách. Vui lòng đăng nhập hoặc tạo tài khoản mới.
                </p>

                <div class="login-prompt-actions">
                  <button type="button" class="btn btn-secondary" @click="closeLoginPrompt">
                    <i class="bi bi-x-circle me-1"></i>
                    Tiếp tục xem sách
                  </button>
                  <button type="button" class="btn btn-primary" @click="redirectToLogin">
                    <i class="bi bi-box-arrow-in-right me-1"></i>
                    Đăng nhập
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>

    <!-- Borrow Modal -->
    <Transition name="modal-fade">
      <div v-if="showBorrowModal" class="modal-backdrop" @click="closeBorrowModal">
        <Transition name="modal-slide">
          <div v-if="showBorrowModal" class="modal-dialog-wrapper" @click.stop>
            <div class="modal-content-custom">
              <button type="button" class="btn-close-custom" @click="closeBorrowModal">
                <i class="bi bi-x-lg"></i>
              </button>

              <div v-if="selectedBook" class="modal-body-custom">
                <!-- Book Image -->
                <div class="book-detail-image">
                  <img
                    :src="selectedBook.HinhAnh || '/placeholder-book.jpg'"
                    :alt="selectedBook.TenSach"
                  />
                </div>

                <!-- Book Details -->
                <div class="book-detail-info">
                  <h4 class="book-detail-title">{{ selectedBook.TenSach }}</h4>

                  <div class="book-detail-meta">
                    <div class="meta-item">
                      <i class="bi bi-person-fill text-primary"></i>
                      <span class="meta-label">Tác giả:</span>
                      <span class="meta-value">{{ selectedBook.TacGia }}</span>
                    </div>

                    <div class="meta-item">
                      <i class="bi bi-calendar-fill text-primary"></i>
                      <span class="meta-label">Năm xuất bản:</span>
                      <span class="meta-value">{{ new Date(selectedBook.NamXuatBan).getFullYear() }}</span>
                    </div>

                    <div class="meta-item">
                      <i class="bi bi-bookmark-fill text-primary"></i>
                      <span class="meta-label">Số lượng còn lại:</span>
                      <span>{{ selectedBook.SoQuyen }} quyển</span>
                    </div>

                    <div class="meta-item">
                      <i class="bi bi-currency-dollar text-primary"></i>
                      <span class="meta-label">Đơn giá:</span>
                      <span class="meta-value fw-bold text-primary">{{ formatPrice(selectedBook.DonGia) }}</span>
                    </div>
                  </div>

                  <!-- Borrow Form -->
                  <div class="borrow-form">
                    <label class="form-label fw-semibold">Số lượng mượn</label>
                    <input
                      v-model.number="borrowQuantity"
                      type="number"
                      class="form-control"
                      min="1"
                      :max="selectedBook.SoQuyen"
                    />
                  </div>

                  <!-- Error/Success Messages -->
                  <div v-if="borrowError" class="alert alert-danger">
                    <i class="bi bi-exclamation-circle me-2"></i>
                    {{ borrowError }}
                  </div>

                  <div v-if="borrowSuccess" class="alert alert-success">
                    <i class="bi bi-check-circle me-2"></i>
                    {{ borrowSuccess }}
                  </div>

                  <!-- Action Buttons -->
                  <div class="modal-actions">
                    <button type="button" class="btn btn-secondary" @click="closeBorrowModal">
                      <i class="bi bi-x-circle me-1"></i>
                      Hủy
                    </button>
                    <button
                      type="button"
                      class="btn btn-primary"
                      @click="confirmBorrow"
                      :disabled="isBorrowing"
                    >
                      <span v-if="isBorrowing">
                        <span class="spinner-border spinner-border-sm me-2"></span>
                        Đang xử lý...
                      </span>
                      <span v-else>
                        <i class="bi bi-bookmark-plus me-1"></i>
                        Xác nhận mượn
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import {ref, onMounted, computed, inject} from 'vue'
import type {Ref} from 'vue'
import { useRouter } from 'vue-router'
import {bookService} from '../../services/bookService'
import {authService} from '../../services/authService'
import type {Sach} from '../../types/book'
import CarouselComponent from "./CarouselComponent.vue"
import { useCart } from '../../composables/useCart'

const books = ref<Sach[]>([])
// Inject searchQuery từ App.vue
const searchQuery = inject<Ref<string>>('searchQuery', ref(''))
const isLoading = ref(false)
const errorMessage = ref('')
const router = useRouter()

// Cart composable
const { addToCart, isInCart } = useCart()
const showCartNotification = ref(false)
const cartNotificationMessage = ref('')

const showBorrowModal = ref(false)
const showLoginPrompt = ref(false)
const selectedBook = ref<Sach | null>(null)
const borrowQuantity = ref(1)
const isBorrowing = ref(false)
const borrowError = ref('')
const borrowSuccess = ref('')
const sortOrder = ref<'default' | 'asc' | 'desc'>('default')
const currentPage = ref(1)
const itemsPerPage = ref(12)

const filteredBooks = computed(() => {
  let result = books.value

  // Apply search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(book =>
        book.TenSach.toLowerCase().includes(query) ||
        book.TacGia.toLowerCase().includes(query)
    )
  }

  // Apply price sorting
  if (sortOrder.value === 'asc') {
    result = [...result].sort((a, b) => a.DonGia - b.DonGia)
  } else if (sortOrder.value === 'desc') {
    result = [...result].sort((a, b) => b.DonGia - a.DonGia)
  }

  return result
})

const totalPages = computed(() => Math.ceil(filteredBooks.value.length / itemsPerPage.value))

const paginatedBooks = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredBooks.value.slice(start, end)
})

const goToPage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

const changeItemsPerPage = (size: number) => {
  itemsPerPage.value = size
  currentPage.value = 1
}

const getPageNumbers = () => {
  const pages: number[] = []
  const maxVisible = 5 // Maximum number of page buttons to show

  let start = Math.max(1, currentPage.value - 2)
  let end = Math.min(totalPages.value, start + maxVisible - 1)

  // Adjust start if we're near the end
  if (end - start < maxVisible - 1) {
    start = Math.max(1, end - maxVisible + 1)
  }

  for (let i = start; i <= end; i++) {
    pages.push(i)
  }

  return pages
}

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

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('vi-VN', {style: 'currency', currency: 'VND'}).format(price)
}

const handleBorrowClick = (book: Sach) => {
  // Check if user is logged in
  if (!authService.isAuthenticated()) {
    selectedBook.value = book
    showLoginPrompt.value = true
    return
  }

  // User is logged in, open borrow modal
  openBorrowModal(book)
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

const closeLoginPrompt = () => {
  showLoginPrompt.value = false
}

const redirectToLogin = () => {
  showLoginPrompt.value = false
  router.push('/auth/login')
}

const handleAddToCart = (book: Sach) => {
  addToCart(book, 1)
  cartNotificationMessage.value = `Đã thêm "${book.TenSach}" vào giỏ`
  showCartNotification.value = true

  // Auto hide notification after 3 seconds
  setTimeout(() => {
    showCartNotification.value = false
  }, 3000)
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

// Export để App.vue có thể gọi filterBooks từ search bar
defineExpose({
  searchQuery
})
</script>

<style scoped>
.search-books-page {
  min-height: calc(100vh - 88px);
  background: #f5f7fb;
}

/* Sort Controls */
.sort-controls {
  background: white;
  padding: 1rem 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.sort-controls .btn-outline-primary {
  border-color: #e2e8f0;
  color: #4a5568;
  transition: all 0.3s;
}

.sort-controls .btn-outline-primary:hover {
  background: #f7fafc;
  border-color: #667eea;
  color: #667eea;
}

.sort-controls .btn-outline-primary.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-color: #667eea;
  color: white;
}

/* Pagination Styles */
.pagination-wrapper {
  margin-top: 3rem;
}

.pagination {
  margin-bottom: 0;
  gap: 0.5rem;
}

.pagination .page-item {
  margin: 0;
}

.pagination .page-link {
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  color: #4a5568;
  padding: 0.5rem 0.75rem;
  font-weight: 600;
  transition: all 0.3s;
  min-width: 40px;
  text-align: center;
}

.pagination .page-link:hover:not(:disabled) {
  background: #f7fafc;
  border-color: #667eea;
  color: #667eea;
  transform: translateY(-2px);
}

.pagination .page-item.active .page-link {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-color: #667eea;
  color: white;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.pagination .page-item.disabled .page-link {
  background: #f8f9fa;
  border-color: #e2e8f0;
  color: #cbd5e0;
  cursor: not-allowed;
}

.pagination .page-link:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination-info {
  font-size: 0.95rem;
}

.card {
  border: none;
  border-radius: 12px;
}

.book-image-wrapper {
  width: 100%;
  height: 200px;
  overflow: hidden;
  border-radius: 12px 12px 0 0;
  background: #f8f9fa;
}

.book-image-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.book-card {
  transition: transform 0.2s, box-shadow 0.2s;
  border: none;
  border-radius: 12px;
  overflow: hidden;
}

.book-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
}

.book-card .card-title {
  font-size: 0.95rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  line-height: 1.3;
}

.book-card .card-body {
  padding: 0.75rem;
}

/* Modal Backdrop */
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1050;
  padding: 20px;
}

/* Modal Dialog Wrapper */
.modal-dialog-wrapper {
  max-width: 700px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-dialog-wrapper-small {
  max-width: 450px;
  width: 100%;
}

/* Modal Content */
.modal-content-custom {
  background: white;
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  position: relative;
  overflow: hidden;
}

/* Close Button */
.btn-close-custom {
  position: absolute;
  top: 15px;
  right: 15px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.9);
  border: none;
  cursor: pointer;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.btn-close-custom:hover {
  background: white;
  transform: rotate(90deg);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.btn-close-custom i {
  font-size: 1.2rem;
  color: #333;
}

/* Modal Body */
.modal-body-custom {
  padding: 0;
}

/* Book Detail Image */
.book-detail-image {
  width: 100%;
  height: 300px;
  overflow: hidden;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.book-detail-image img {
  width: auto;
  height: 100%;
  max-width: 100%;
  object-fit: contain;
}

/* Book Detail Info */
.book-detail-info {
  padding: 2rem;
}

.book-detail-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: #2d3748;
  margin-bottom: 1.5rem;
  line-height: 1.3;
}

/* Meta Items */
.book-detail-meta {
  margin-bottom: 2rem;
}

.meta-item {
  display: flex;
  align-items: center;
  padding: 0.75rem 0;
  border-bottom: 1px solid #e2e8f0;
}

.meta-item:last-child {
  border-bottom: none;
}

.meta-item i {
  font-size: 1.1rem;
  margin-right: 0.75rem;
  width: 20px;
}

.meta-label {
  font-weight: 600;
  color: #4a5568;
  margin-right: 0.5rem;
  min-width: 130px;
}

.meta-value {
  color: #2d3748;
  flex: 1;
}

/* Borrow Form */
.borrow-form {
  margin-bottom: 1.5rem;
}

.borrow-form .form-control {
  border-radius: 8px;
  border: 2px solid #e2e8f0;
  padding: 0.75rem;
  font-size: 1rem;
  transition: border-color 0.3s;
}

.borrow-form .form-control:focus {
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

/* Modal Actions */
.modal-actions {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
}

.modal-actions .btn {
  flex: 1;
  padding: 0.75rem;
  font-weight: 600;
  border-radius: 8px;
  transition: all 0.3s;
}

.modal-actions .btn-secondary {
  background: #e2e8f0;
  border: none;
  color: #4a5568;
}

.modal-actions .btn-secondary:hover {
  background: #cbd5e0;
  transform: translateY(-2px);
}

.modal-actions .btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
}

.modal-actions .btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}

.modal-actions .btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-gradient {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  color: white;
  transition: all 0.3s;
}

.btn-gradient:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}

/* Modal Animations - Slide from Top */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-slide-enter-active {
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.modal-slide-leave-active {
  transition: all 0.3s ease;
}

.modal-slide-enter-from {
  transform: translateY(-100vh);
  opacity: 0;
}

.modal-slide-leave-to {
  transform: translateY(-50px);
  opacity: 0;
}

/* Alerts */
.alert {
  border-radius: 8px;
  border: none;
  padding: 1rem;
  margin-bottom: 1rem;
}

/* Cart Notification Toast */
.cart-notification-toast {
  position: fixed;
  top: 100px;
  right: 20px;
  background: white;
  padding: 1rem 1.5rem;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  z-index: 1100;
  display: flex;
  align-items: center;
  font-weight: 600;
  border-left: 4px solid #28a745;
}

.toast-fade-enter-active,
.toast-fade-leave-active {
  transition: all 0.3s ease;
}

.toast-fade-enter-from,
.toast-fade-leave-to {
  opacity: 0;
  transform: translateX(100px);
}

/* Login Prompt Modal Styles */
.login-prompt-content {
  padding: 3rem 2rem;
  text-align: center;
}

.login-prompt-icon {
  width: 80px;
  height: 80px;
  margin: 0 auto 1.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
}

.login-prompt-icon i {
  font-size: 2.5rem;
  color: white;
}

.login-prompt-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: #2d3748;
  margin-bottom: 1rem;
}

.login-prompt-message {
  color: #4a5568;
  font-size: 1.05rem;
  margin-bottom: 2rem;
  line-height: 1.6;
}

.login-prompt-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.login-prompt-actions .btn {
  padding: 0.75rem 1.5rem;
  font-weight: 600;
  border-radius: 8px;
  transition: all 0.3s;
}

.login-prompt-actions .btn-secondary {
  background: #e2e8f0;
  border: none;
  color: #4a5568;
}

.login-prompt-actions .btn-secondary:hover {
  background: #cbd5e0;
  transform: translateY(-2px);
}

.login-prompt-actions .btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
}

.login-prompt-actions .btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}

/* Modal Transitions */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-slide-enter-active,
.modal-slide-leave-active {
  transition: all 0.3s ease;
}

.modal-slide-enter-from {
  transform: translateY(-50px);
  opacity: 0;
}

.modal-slide-leave-to {
  transform: translateY(50px);
  opacity: 0;
}

@media (max-width: 768px) {
  .book-image-wrapper {
    height: 180px;
  }

  .sort-controls .d-flex {
    flex-direction: column;
    align-items: flex-start !important;
  }

  .sort-controls .btn-group {
    width: 100%;
  }

  .sort-controls .btn-group .btn {
    font-size: 0.875rem;
    padding: 0.5rem;
  }

  .pagination {
    gap: 0.25rem;
  }

  .pagination .page-link {
    padding: 0.4rem 0.6rem;
    min-width: 36px;
    font-size: 0.875rem;
  }

  .modal-dialog-wrapper,
  .modal-dialog-wrapper-small {
    max-width: 95%;
  }

  .book-detail-image {
    height: 250px;
  }

  .book-detail-info {
    padding: 1.5rem;
  }

  .book-detail-title {
    font-size: 1.5rem;
  }

  .meta-label {
    min-width: 100px;
    font-size: 0.9rem;
  }

  .modal-actions,
  .login-prompt-actions {
    flex-direction: column;
  }

  .login-prompt-content {
    padding: 2rem 1.5rem;
  }

  .login-prompt-title {
    font-size: 1.5rem;
  }

  .login-prompt-message {
    font-size: 1rem;
  }
}
</style>
