<template>
  <div class="container-fluid px-4 mt-4">
    <div class="card shadow">
      <div class="card-header btn-gradient text-white">
        <h4 class="mb-0">
          <i class="bi bi-bookmark-check me-2"></i>
          Sách đã mượn
        </h4>
      </div>
      <div class="card-body">
        <!-- Loading state -->
        <div v-if="isLoading" class="text-center py-5">
          <div class="spinner-border text-success" role="status">
            <span class="visually-hidden">Đang tải...</span>
          </div>
          <p class="mt-2">Đang tải danh sách sách đã mượn...</p>
        </div>

        <!-- Error message -->
        <div v-else-if="errorMessage" class="alert alert-warning">
          <i class="bi bi-info-circle me-2"></i>
          {{ errorMessage }}
        </div>

        <!-- Borrowed books list -->
        <div v-else-if="activeBorrows.length > 0">
          <div class="table-responsive">
            <table class="table table-hover">
              <thead>
              <tr>
                <th>Tên sách</th>
                <th>Tác giả</th>
                <th>Số lượng</th>
                <th>Ngày mượn</th>
                <th>Hạn trả</th>
                <th>Trạng thái</th>
                <th>Phạt</th>
                <th class="text-center">Thao tác</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="borrow in activeBorrows" :key="borrow._id">
                <td>
                  <strong>{{ getBookTitle(borrow.MaSach) }}</strong>
                </td>
                <td>{{ getBookAuthor(borrow.MaSach) }}</td>
                <td>{{ borrow.SoQuyen }}</td>
                <td>{{ formatDate(borrow.NgayMuon) }}</td>
                <td>
                    <span :class="isOverdue(borrow.NgayTra) ? 'text-danger fw-bold' : ''">
                      {{ formatDate(borrow.NgayTra) }}
                    </span>
                </td>
                <td>
                    <span :class="getStatusClass(borrow.TrangThai)">
                      {{ borrow.TrangThai }}
                    </span>
                </td>
                <td>
                    <span v-if="borrow.PhatQuaHan.SoTienPhat > 0" class="text-danger">
                      {{ formatPrice(borrow.PhatQuaHan.SoTienPhat) }}
                    </span>
                  <span v-else class="text-muted">-</span>
                </td>
                <td class="text-center">
                  <div class="btn-group btn-group-sm">
                    <button
                      class="btn btn-outline-info"
                      @click="viewBookDetail(borrow.MaSach)"
                      title="Xem chi tiết"
                    >
                      <i class="bi bi-eye"></i>
                    </button>
                    <button
                      class="btn btn-outline-primary"
                      @click="borrowAgain(borrow.MaSach)"
                      :disabled="!canBorrowAgain(borrow.MaSach)"
                      title="Mượn lại"
                    >
                      <i class="bi bi-arrow-repeat"></i>
                    </button>
                  </div>
                </td>
              </tr>
              </tbody>
            </table>
          </div>

          <!-- Summary -->
          <div class="alert alert-info mt-3">
            <i class="bi bi-info-circle me-2"></i>
            Tổng số sách đang mượn: <strong>{{ activeBorrows.length }}</strong> |
            Quá hạn: <strong class="text-danger">{{ overdueCount }}</strong>
          </div>
        </div>

        <!-- No borrowed books -->
        <div v-else class="text-center py-5">
          <i class="bi bi-bookmark-x fs-1 text-muted"></i>
          <p class="text-muted mt-2">Bạn chưa mượn sách nào</p>
          <router-link to="/docgia/search-books" class="btn btn-primary">
            <i class="bi bi-search me-1"></i>
            Tìm sách để mượn
          </router-link>
        </div>
      </div>
    </div>

    <!-- Book Detail Modal -->
    <Transition name="modal-fade">
      <div v-if="showDetailModal" class="modal-backdrop" @click="closeDetailModal">
        <Transition name="modal-slide">
          <div v-if="showDetailModal" class="modal-dialog-wrapper" @click.stop>
            <div class="modal-content-custom">
              <button type="button" class="btn-close-custom" @click="closeDetailModal">
                <i class="bi bi-x-lg"></i>
              </button>

              <div v-if="selectedBook" class="modal-body-custom">
                <div class="book-detail-image">
                  <img
                    :src="selectedBook.HinhAnh || 'https://via.placeholder.com/300x400?text=No+Image'"
                    :alt="selectedBook.TenSach"
                  />
                </div>

                <div class="book-detail-info">
                  <h4 class="book-detail-title">{{ selectedBook.TenSach }}</h4>

                  <div class="book-detail-meta">
                    <div class="meta-row">
                      <span class="meta-label">
                        <i class="bi bi-person-fill me-1"></i>Tác giả:
                      </span>
                      <span class="meta-value">{{ selectedBook.TacGia }}</span>
                    </div>
                    <div class="meta-row">
                      <span class="meta-label">
                        <i class="bi bi-calendar-event me-1"></i>Năm xuất bản:
                      </span>
                      <span class="meta-value">{{ formatYear(selectedBook.NamXuatBan) }}</span>
                    </div>
                    <div class="meta-row">
                      <span class="meta-label">
                        <i class="bi bi-building me-1"></i>Nhà xuất bản:
                      </span>
                      <span class="meta-value">{{ getPublisherName(selectedBook.IdNxb) }}</span>
                    </div>
                    <div class="meta-row">
                      <span class="meta-label">
                        <i class="bi bi-cash me-1"></i>Đơn giá:
                      </span>
                      <span class="meta-value text-success fw-bold">{{ formatPrice(selectedBook.DonGia) }}</span>
                    </div>
                    <div class="meta-row">
                      <span class="meta-label">
                        <i class="bi bi-book-half me-1"></i>Số lượng:
                      </span>
                      <span class="meta-value">
                        <span :class="selectedBook.SoQuyen > 0 ? 'text-success' : 'text-danger'">
                          {{ selectedBook.SoQuyen }} quyển
                        </span>
                      </span>
                    </div>
                    <div class="meta-row">
                      <span class="meta-label">
                        <i class="bi bi-check-circle me-1"></i>Tình trạng:
                      </span>
                      <span class="meta-value">
                        <span :class="selectedBook.SoQuyen > 0 ? 'badge bg-success' : 'badge bg-danger'">
                          {{ selectedBook.SoQuyen > 0 ? 'Còn sách' : 'Hết sách' }}
                        </span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div class="modal-footer-custom">
                <button class="btn btn-secondary" @click="closeDetailModal">
                  <i class="bi bi-x-circle me-1"></i>
                  Đóng
                </button>
                <button
                  class="btn btn-gradient"
                  @click="borrowFromDetail"
                  :disabled="!selectedBook || selectedBook.SoQuyen === 0"
                >
                  <i class="bi bi-bookmark-plus me-1"></i>
                  Mượn lại
                </button>
              </div>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>

    <!-- Borrow Again Modal -->
    <Transition name="modal-fade">
      <div v-if="showBorrowModal" class="modal-backdrop" @click="closeBorrowModal">
        <Transition name="modal-slide">
          <div v-if="showBorrowModal" class="modal-dialog-wrapper-small" @click.stop>
            <div class="modal-content-custom">
              <button type="button" class="btn-close-custom" @click="closeBorrowModal">
                <i class="bi bi-x-lg"></i>
              </button>

              <div class="borrow-modal-content">
                <div class="borrow-modal-icon">
                  <i class="bi bi-arrow-repeat"></i>
                </div>
                <h4 class="borrow-modal-title">Mượn lại sách</h4>

                <div v-if="selectedBook" class="book-info-card">
                  <h5>{{ selectedBook.TenSach }}</h5>
                  <p class="text-muted mb-2">Tác giả: {{ selectedBook.TacGia }}</p>
                  <p class="text-muted mb-0">Còn lại: {{ selectedBook.SoQuyen }} quyển</p>
                </div>

                <div class="form-group mb-3">
                  <label class="form-label fw-bold">Số lượng mượn</label>
                  <input
                    type="number"
                    v-model="borrowQuantity"
                    class="form-control"
                    min="1"
                    :max="selectedBook?.SoQuyen || 1"
                  />
                </div>

                <!-- Alerts -->
                <div v-if="borrowError" class="alert alert-danger">
                  <i class="bi bi-exclamation-triangle-fill me-2"></i>
                  {{ borrowError }}
                </div>
                <div v-if="borrowSuccess" class="alert alert-success">
                  <i class="bi bi-check-circle-fill me-2"></i>
                  {{ borrowSuccess }}
                </div>

                <div class="borrow-modal-actions">
                  <button type="button" class="btn btn-secondary" @click="closeBorrowModal" :disabled="isBorrowing">
                    <i class="bi bi-x-circle me-1"></i>
                    Hủy
                  </button>
                  <button type="button" class="btn btn-primary" @click="confirmBorrowAgain" :disabled="isBorrowing">
                    <span v-if="isBorrowing">
                      <span class="spinner-border spinner-border-sm me-2"></span>
                      Đang xử lý...
                    </span>
                    <span v-else>
                      <i class="bi bi-check-lg me-1"></i>
                      Xác nhận mượn
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Transition>
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
                <h4 class="login-prompt-title">Phiên đăng nhập hết hạn</h4>
                <p class="login-prompt-message">
                  Phiên đăng nhập của bạn đã hết hạn. Vui lòng đăng nhập lại để tiếp tục mượn sách.
                </p>

                <div class="login-prompt-actions">
                  <button type="button" class="btn btn-secondary" @click="closeLoginPrompt">
                    <i class="bi bi-x-circle me-1"></i>
                    Hủy
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
  </div>
</template>

<script setup lang="ts">
import {ref, onMounted, computed} from 'vue'
import {useRouter} from 'vue-router'
import {bookService} from '../../services/bookService'
import {authService} from '../../services/authService'
import type {TheoDoiMuonSach, Sach} from '../../types/book'
import {TrangThaiMuonSach} from '../../types/book'

const router = useRouter()
const borrows = ref<TheoDoiMuonSach[]>([])
const isLoading = ref(false)
const errorMessage = ref('')

// Modal states
const showDetailModal = ref(false)
const showBorrowModal = ref(false)
const showLoginPrompt = ref(false)
const selectedBook = ref<Sach | null>(null)
const borrowQuantity = ref(1)
const isBorrowing = ref(false)
const borrowError = ref('')
const borrowSuccess = ref('')

// Filter only active borrows (not returned yet)
const activeBorrows = computed(() => {
  return borrows.value.filter(b => b.TrangThai !== TrangThaiMuonSach.DA_TRA)
})

const overdueCount = computed(() => {
  return activeBorrows.value.filter(b => isOverdue(b.NgayTra)).length
})

const loadBorrowedBooks = async () => {
  isLoading.value = true
  errorMessage.value = ''

  const userIdFromStorage = localStorage.getItem('userId')

  if (!userIdFromStorage) {
    errorMessage.value = 'Không tìm thấy thông tin người dùng'
    isLoading.value = false
    return
  }

  try {
    borrows.value = await bookService.getMyBorrowedBooks(userIdFromStorage)

    borrows.value = borrows.value.sort((a, b) => a.TrangThai.localeCompare(b.TrangThai))
  } catch (error: any) {
    errorMessage.value = error.message || 'Bạn chưa mượn sách nào'
  } finally {
    isLoading.value = false
  }
}

const getBookTitle = (maSach: string | Sach): string => {
  if (typeof maSach === 'object' && maSach.TenSach) {
    return maSach.TenSach
  }
  return 'Đang tải...'
}

const getBookAuthor = (maSach: string | Sach): string => {
  if (typeof maSach === 'object' && maSach.TacGia) {
    return maSach.TacGia
  }
  return '-'
}

const formatDate = (date: string): string => {
  return new Date(date).toLocaleDateString('vi-VN')
}

const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('vi-VN', {style: 'currency', currency: 'VND'}).format(price)
}

const isOverdue = (ngayTra: string): boolean => {
  return new Date(ngayTra) < new Date()
}

const getStatusClass = (status: TrangThaiMuonSach): string => {
  switch (status) {
    case TrangThaiMuonSach.CHO_DUYET:
      return 'badge bg-warning'
    case TrangThaiMuonSach.DA_DUYET:
      return 'badge bg-success'
    case TrangThaiMuonSach.DA_TRA:
      return 'badge bg-secondary'
    default:
      return 'badge bg-light text-dark'
  }
}

const formatYear = (date: string | Date): string => {
  return new Date(date).getFullYear().toString()
}

const getPublisherName = (publisher: any): string => {
  if (typeof publisher === 'object' && publisher?.TenNXB) {
    return publisher.TenNXB
  }
  return 'Đang tải...'
}

const getBook = (maSach: string | Sach): Sach | null => {
  if (typeof maSach === 'object') {
    return maSach
  }
  return null
}

const canBorrowAgain = (maSach: string | Sach): boolean => {
  const book = getBook(maSach)
  return book ? book.SoQuyen > 0 : false
}

// View book detail
const viewBookDetail = (maSach: string | Sach) => {
  const book = getBook(maSach)
  if (book) {
    selectedBook.value = book
    showDetailModal.value = true
  }
}

const closeDetailModal = () => {
  showDetailModal.value = false
}

const borrowFromDetail = () => {
  closeDetailModal()
  if (selectedBook.value) {
    borrowAgain(selectedBook.value)
  }
}

// Borrow again functionality
const borrowAgain = (maSach: string | Sach) => {
  // Check if user is logged in
  if (!authService.isAuthenticated()) {
    showLoginPrompt.value = true
    return
  }

  const book = getBook(maSach)
  if (!book) {
    return
  }

  // Check if book is available
  if (book.SoQuyen === 0) {
    alert('Sách hiện không còn để mượn')
    return
  }

  selectedBook.value = book
  borrowQuantity.value = 1
  borrowError.value = ''
  borrowSuccess.value = ''
  showBorrowModal.value = true
}

const closeBorrowModal = () => {
  showBorrowModal.value = false
  borrowError.value = ''
  borrowSuccess.value = ''
}

const confirmBorrowAgain = async () => {
  if (!selectedBook.value) return

  borrowError.value = ''
  borrowSuccess.value = ''
  isBorrowing.value = true

  try {
    const userId = localStorage.getItem('userId')
    if (!userId) {
      borrowError.value = 'Không tìm thấy thông tin người dùng'
      return
    }

    await bookService.borrowBook({
      MaSach: selectedBook.value._id,
      SoQuyen: borrowQuantity.value
    })

    borrowSuccess.value = 'Yêu cầu mượn sách thành công!'

    setTimeout(() => {
      closeBorrowModal()
      loadBorrowedBooks() // Reload the list
    }, 1500)
  } catch (error: any) {
    borrowError.value = error.message || 'Không thể mượn sách. Vui lòng thử lại.'
  } finally {
    isBorrowing.value = false
  }
}

// Login prompt handlers
const closeLoginPrompt = () => {
  showLoginPrompt.value = false
}

const redirectToLogin = () => {
  showLoginPrompt.value = false
  router.push('/auth/login')
}

onMounted(() => {
  loadBorrowedBooks()
})
</script>

<style scoped>
.table-responsive {
  border-radius: 8px;
}

.btn-group-sm .btn {
  padding: 0.25rem 0.5rem;
  font-size: 0.875rem;
}

/* Modal Backdrop */
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 1rem;
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
  border-radius: 16px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  position: relative;
  overflow: hidden;
}

/* Close Button */
.btn-close-custom {
  position: absolute;
  top: 1rem;
  right: 1rem;
  z-index: 10;
  background: rgba(255, 255, 255, 0.9);
  border: none;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-close-custom:hover {
  background: white;
  transform: rotate(90deg);
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
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.book-detail-image img {
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
}

.book-detail-meta {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.meta-row {
  display: flex;
  align-items: center;
  padding: 0.75rem 0;
  border-bottom: 1px solid #e2e8f0;
}

.meta-row:last-child {
  border-bottom: none;
}

.meta-label {
  min-width: 150px;
  font-weight: 600;
  color: #4a5568;
  display: flex;
  align-items: center;
}

.meta-value {
  color: #2d3748;
  font-weight: 500;
}

/* Modal Footer */
.modal-footer-custom {
  padding: 1.5rem 2rem;
  background: #f7fafc;
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}

.modal-footer-custom .btn {
  padding: 0.75rem 1.5rem;
  font-weight: 600;
  border-radius: 8px;
}

/* Borrow Modal Content */
.borrow-modal-content {
  padding: 3rem 2rem;
  text-align: center;
}

.borrow-modal-icon {
  width: 80px;
  height: 80px;
  margin: 0 auto 1.5rem;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 20px rgba(16, 185, 129, 0.3);
}

.borrow-modal-icon i {
  font-size: 2.5rem;
  color: white;
}

.borrow-modal-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: #2d3748;
  margin-bottom: 1.5rem;
}

.book-info-card {
  background: #f7fafc;
  padding: 1.5rem;
  border-radius: 12px;
  margin-bottom: 1.5rem;
  text-align: left;
}

.book-info-card h5 {
  color: #2d3748;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.form-group {
  text-align: left;
}

.form-label {
  color: #4a5568;
  margin-bottom: 0.5rem;
}

.form-control {
  border-radius: 8px;
  border: 1px solid #d2d6da;
  padding: 0.75rem;
  font-size: 1rem;
}

.form-control:focus {
  border-color: #667eea;
  box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.15);
}

.borrow-modal-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 1.5rem;
}

.borrow-modal-actions .btn {
  padding: 0.75rem 1.5rem;
  font-weight: 600;
  border-radius: 8px;
  transition: all 0.3s;
}

.borrow-modal-actions .btn-secondary {
  background: #e2e8f0;
  border: none;
  color: #4a5568;
}

.borrow-modal-actions .btn-secondary:hover {
  background: #cbd5e0;
  transform: translateY(-2px);
}

.borrow-modal-actions .btn-primary {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  border: none;
}

.borrow-modal-actions .btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(16, 185, 129, 0.4);
}

/* Login Prompt Modal */
.login-prompt-content {
  padding: 3rem 2rem;
  text-align: center;
}

.login-prompt-icon {
  width: 80px;
  height: 80px;
  margin: 0 auto 1.5rem;
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 20px rgba(239, 68, 68, 0.3);
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

/* Alerts */
.alert {
  border-radius: 8px;
  border: none;
  padding: 1rem;
  margin-bottom: 1rem;
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

/* Responsive */
@media (max-width: 768px) {
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

  .modal-footer-custom,
  .borrow-modal-actions,
  .login-prompt-actions {
    flex-direction: column;
  }

  .borrow-modal-content,
  .login-prompt-content {
    padding: 2rem 1.5rem;
  }

  .borrow-modal-title,
  .login-prompt-title {
    font-size: 1.5rem;
  }

  .login-prompt-message {
    font-size: 1rem;
  }
}
</style>
