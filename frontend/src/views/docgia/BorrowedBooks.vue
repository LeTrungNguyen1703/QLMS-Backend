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
        <!-- Search and Filter Section -->
        <div class="row mb-3">
          <div class="col-md-6">
            <div class="input-group">
              <span class="input-group-text">
                <i class="bi bi-search"></i>
              </span>
              <input
                type="text"
                class="form-control"
                placeholder="Tìm theo tên sách hoặc tác giả..."
                v-model="searchQuery"
              />
            </div>
          </div>
          <div class="col-md-3">
            <select class="form-select" v-model="statusFilter">
              <option value="all">Tất cả trạng thái</option>
              <option value="CHO_DUYET">Chờ duyệt</option>
              <option value="DA_DUYET">Đã duyệt</option>
              <option value="DA_TRA">Đã trả</option>
            </select>
          </div>
          <div class="col-md-3">
            <select class="form-select" v-model="sortBy">
              <option value="date_desc">Ngày mượn (Mới nhất)</option>
              <option value="date_asc">Ngày mượn (Cũ nhất)</option>
              <option value="due_date_asc">Hạn trả (Gần nhất)</option>
              <option value="name_asc">Tên sách (A-Z)</option>
            </select>
          </div>
        </div>

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
        <div v-else-if="paginatedBorrows.length > 0">
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
              <tr v-for="borrow in paginatedBorrows" :key="borrow._id">
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
                      {{ getStatusLabel(borrow.TrangThai) }}
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
                      title="Xem chi tiết và mượn lại"
                    >
                      <i class="bi bi-eye"></i>
                    </button>
                    <button
                      v-if="borrow.TrangThai === TrangThaiMuonSach.CHO_DUYET"
                      class="btn btn-outline-danger"
                      @click="cancelBorrowRequest(borrow._id)"
                      title="Hủy yêu cầu"
                    >
                      <i class="bi bi-x-circle"></i>
                    </button>
                    <button
                      v-else
                      class="btn btn-outline-success"
                      @click="quickBorrow(borrow.MaSach)"
                      title="Mượn nhanh (1 quyển)"
                    >
                      <i class="bi bi-plus-circle-fill"></i>
                    </button>
                    <button
                      v-if="borrow.TrangThai !== TrangThaiMuonSach.CHO_DUYET"
                      class="btn btn-outline-primary"
                      @click="borrowAgain(borrow.MaSach)"
                      title="Mượn lại (tùy chọn số lượng)"
                    >
                      <i class="bi bi-arrow-repeat"></i>
                    </button>
                  </div>
                </td>
              </tr>
              </tbody>
            </table>
          </div>

          <!-- Pagination -->
          <nav aria-label="Page navigation" v-if="totalPages > 1">
            <ul class="pagination justify-content-center">
              <li class="page-item" :class="{ disabled: currentPage === 1 }">
                <a class="page-link" href="#" @click.prevent="changePage(currentPage - 1)">
                  <i class="bi bi-chevron-left"></i>
                </a>
              </li>
              <li
                class="page-item"
                v-for="page in displayPages"
                :key="page"
                :class="{ active: currentPage === page }"
              >
                <a class="page-link" href="#" @click.prevent="changePage(page)">{{ page }}</a>
              </li>
              <li class="page-item" :class="{ disabled: currentPage === totalPages }">
                <a class="page-link" href="#" @click.prevent="changePage(currentPage + 1)">
                  <i class="bi bi-chevron-right"></i>
                </a>
              </li>
            </ul>
          </nav>

          <!-- Showing info -->
          <div class="text-center text-muted mb-3">
            Hiển thị {{ (currentPage - 1) * itemsPerPage + 1 }} -
            {{ Math.min(currentPage * itemsPerPage, sortedActiveBorrows.length) }}
            trong tổng số {{ sortedActiveBorrows.length }} bản ghi
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

              <div class="modal-body-custom">
                <!-- Loading state -->
                <div v-if="isLoadingBookDetail" class="book-detail-loading">
                  <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Đang tải...</span>
                  </div>
                  <p class="mt-3">Đang tải thông tin sách...</p>
                </div>

                <!-- Book details -->
                <div v-else-if="selectedBook">
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
              </div>

              <div class="modal-footer-custom">
                <button class="btn btn-secondary" @click="closeDetailModal">
                  <i class="bi bi-x-circle me-1"></i>
                  Đóng
                </button>
                <button
                  class="btn btn-gradient"
                  @click="borrowFromDetail"
                  :disabled="isLoadingBookDetail || !selectedBook || selectedBook.SoQuyen === 0"
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
import {TrangThaiMuonSach, TrangThaiMuonSachLabel} from '../../types/book'

const router = useRouter()
const borrows = ref<TheoDoiMuonSach[]>([])
const isLoading = ref(false)
const errorMessage = ref('')

// Search, filter, sort states
const searchQuery = ref('')
const statusFilter = ref<string>('all')
const sortBy = ref('date_desc')

// Pagination states
const currentPage = ref(1)
const itemsPerPage = ref(10)

// Modal states
const showDetailModal = ref(false)
const showBorrowModal = ref(false)
const showLoginPrompt = ref(false)
const selectedBook = ref<Sach | null>(null)
const borrowQuantity = ref(1)
const isBorrowing = ref(false)
const borrowError = ref('')
const borrowSuccess = ref('')
const isLoadingBookDetail = ref(false)

// Show all borrows and let the status filter control visibility
const activeBorrows = computed(() => {
  let result = [...borrows.value]

  // Search filter
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(b =>
      getBookTitle(b.MaSach).toLowerCase().includes(query) ||
      getBookAuthor(b.MaSach).toLowerCase().includes(query)
    )
  }

  // Status filter
  if (statusFilter.value !== 'all') {
    console.log('Filtering by status:', statusFilter.value)
    console.log('Sample book status:', result[0]?.TrangThai)
    result = result.filter(b => {
      const match = b.TrangThai === statusFilter.value
      if (!match) {
        console.log(`No match: "${b.TrangThai}" !== "${statusFilter.value}"`)
      }
      return match
    })
    console.log('Filtered result count:', result.length)
  }

  return result
})

const sortedActiveBorrows = computed(() => {
  const sorted = [...activeBorrows.value]

  switch (sortBy.value) {
    case 'date_asc':
      return sorted.sort((a, b) => new Date(a.NgayMuon).getTime() - new Date(b.NgayMuon).getTime())
    case 'date_desc':
      return sorted.sort((a, b) => new Date(b.NgayMuon).getTime() - new Date(a.NgayMuon).getTime())
    case 'due_date_asc':
      return sorted.sort((a, b) => new Date(a.NgayTra).getTime() - new Date(b.NgayTra).getTime())
    case 'name_asc':
      return sorted.sort((a, b) => getBookTitle(a.MaSach).localeCompare(getBookTitle(b.MaSach)))
    default:
      return sorted
  }
})

const totalPages = computed(() => {
  return Math.ceil(sortedActiveBorrows.value.length / itemsPerPage.value)
})

const paginatedBorrows = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return sortedActiveBorrows.value.slice(start, end)
})

const displayPages = computed(() => {
  const pages = []
  const maxDisplay = 5
  let startPage = Math.max(1, currentPage.value - Math.floor(maxDisplay / 2))
  let endPage = Math.min(totalPages.value, startPage + maxDisplay - 1)

  if (endPage - startPage < maxDisplay - 1) {
    startPage = Math.max(1, endPage - maxDisplay + 1)
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i)
  }

  return pages
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

const getStatusLabel = (status: TrangThaiMuonSach): string => {
  return TrangThaiMuonSachLabel[status] || status
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

// View book detail
const viewBookDetail = async (maSach: string | Sach) => {
  const book = getBook(maSach)
  if (!book) {
    return
  }

  isLoadingBookDetail.value = true
  showDetailModal.value = true

  try {
    // Fetch latest book data from API to get current stock quantity
    const latestBookData = await bookService.getBookById(book._id)
    selectedBook.value = latestBookData
  } catch (error: any) {
    // If API fails, fallback to cached data
    console.error('Failed to fetch latest book data:', error)
    selectedBook.value = book
  } finally {
    isLoadingBookDetail.value = false
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

// Quick borrow - instantly borrow 1 copy without modal
const quickBorrow = async (maSach: string | Sach) => {
  // Check if user is logged in
  if (!authService.isAuthenticated()) {
    showLoginPrompt.value = true
    return
  }

  const book = getBook(maSach)
  if (!book) {
    return
  }

  // Confirm quick borrow
  const bookTitle = getBookTitle(maSach)
  if (!confirm(`Mượn nhanh "${bookTitle}" (1 quyển)?`)) {
    return
  }

  try {
    // Fetch latest book data to check current availability
    const latestBookData = await bookService.getBookById(book._id)

    // Check if book is available
    if (latestBookData.SoQuyen === 0) {
      alert('Sách hiện không còn để mượn')
      return
    }

    // Show loading state
    isBorrowing.value = true

    // Submit borrow request with quantity 1
    const userId = localStorage.getItem('userId')
    if (!userId) {
      alert('Không tìm thấy thông tin người dùng')
      return
    }

    await bookService.borrowBook({
      MaSach: latestBookData._id,
      SoQuyen: 1
    })

    alert('✅ Yêu cầu mượn sách thành công! Chờ nhân viên duyệt.')

    // Reload the borrowed books list
    await loadBorrowedBooks()
  } catch (error: any) {
    alert(error.message || 'Không thể mượn sách. Vui lòng thử lại.')
  } finally {
    isBorrowing.value = false
  }
}

// Borrow again functionality
const borrowAgain = async (maSach: string | Sach) => {
  // Check if user is logged in
  if (!authService.isAuthenticated()) {
    showLoginPrompt.value = true
    return
  }

  const book = getBook(maSach)
  if (!book) {
    return
  }

  try {
    // Fetch latest book data to check current availability
    const latestBookData = await bookService.getBookById(book._id)

    // Check if book is available
    if (latestBookData.SoQuyen === 0) {
      alert('Sách hiện không còn để mượn')
      return
    }

    selectedBook.value = latestBookData
    borrowQuantity.value = 1
    borrowError.value = ''
    borrowSuccess.value = ''
    showBorrowModal.value = true
  } catch (error: any) {
    alert('Không thể tải thông tin sách. Vui lòng thử lại.')
  }
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

// Pagination handler
const changePage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
  }
}

// Cancel borrow request
const cancelBorrowRequest = async (borrowId: string) => {
  if (!confirm('Bạn có chắc chắn muốn hủy yêu cầu mượn sách này?')) {
    return
  }

  try {
    // Call the delete API to cancel the request
    await bookService.cancelBorrowRequest(borrowId)
    alert('Đã hủy yêu cầu mượn sách thành công')
    await loadBorrowedBooks() // Reload the list
  } catch (error: any) {
    alert(error.message || 'Không thể hủy yêu cầu. Vui lòng thử lại.')
  }
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

/* Quick borrow button styling */
.btn-outline-success {
  transition: all 0.3s ease;
}

.btn-outline-success:hover:not(:disabled) {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  border-color: #10b981;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
}

.btn-outline-success i {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
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

/* Book Detail Loading */
.book-detail-loading {
  padding: 4rem 2rem;
  text-align: center;
  min-height: 300px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.book-detail-loading p {
  color: #4a5568;
  font-size: 1rem;
  margin: 0;
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
