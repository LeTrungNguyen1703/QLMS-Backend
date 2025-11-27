<template>
  <div class="search-customer-container">
    <div class="card shadow-sm">
      <div class="card-header bg-gradient">
        <h5 class="mb-0">
          <i class="bi bi-search me-2"></i>
          Tìm kiếm đọc giả
        </h5>
      </div>
      <div class="card-body">
        <!-- Search Form -->
        <div class="search-form">
          <div class="row g-3">
            <div class="col-md-8">
              <div class="input-group input-group-lg">
                <span class="input-group-text">
                  <i class="bi bi-person-search"></i>
                </span>
                <input
                  v-model="searchQuery"
                  type="text"
                  class="form-control"
                  placeholder="Nhập mã đọc giả hoặc tên đọc giả..."
                  @keyup.enter="searchCustomer"
                />
              </div>
            </div>
            <div class="col-md-4">
              <button
                class="btn btn-primary btn-lg w-100"
                @click="searchCustomer"
                :disabled="isSearching || !searchQuery.trim()"
              >
                <span v-if="isSearching">
                  <span class="spinner-border spinner-border-sm me-2"></span>
                  Đang tìm...
                </span>
                <span v-else>
                  <i class="bi bi-search me-2"></i>
                  Tìm kiếm
                </span>
              </button>
            </div>
          </div>
        </div>

        <!-- Search Results -->
        <div v-if="searchPerformed" class="search-results mt-4">
          <!-- Customer Info -->
          <div v-if="customerInfo" class="customer-info-card mb-4">
            <div class="customer-header">
              <div class="customer-avatar">
                <i class="bi bi-person-circle"></i>
              </div>
              <div class="customer-details">
                <h5 class="customer-name">{{ customerInfo.HoLot }} {{ customerInfo.Ten }}</h5>
                <p class="customer-id mb-1">
                  <i class="bi bi-hash me-1"></i>
                  Mã đọc giả: <strong>{{ customerInfo.MaDocGia }}</strong>
                </p>
                <p class="customer-contact mb-0">
                  <i class="bi bi-envelope me-1"></i>
                  {{ customerInfo.Email || 'Chưa có email' }}
                  <span v-if="customerInfo.SoDienThoai" class="ms-3">
                    <i class="bi bi-telephone me-1"></i>
                    {{ customerInfo.SoDienThoai }}
                  </span>
                </p>
              </div>
              <div class="customer-stats">
                <div class="stat-item">
                  <div class="stat-value">{{ loanedBooks.length }}</div>
                  <div class="stat-label">Sách đang mượn</div>
                </div>
              </div>
            </div>
          </div>

          <!-- No Customer Found -->
          <div v-else-if="!isSearching" class="alert alert-warning">
            <i class="bi bi-exclamation-triangle me-2"></i>
            Không tìm thấy đọc giả với thông tin: <strong>{{ searchQuery }}</strong>
          </div>

          <!-- Loaned Books List -->
          <div v-if="loanedBooks.length > 0" class="loaned-books-section">
            <h6 class="section-title mb-3">
              <i class="bi bi-book-half me-2"></i>
              Danh sách sách đã mượn ({{ loanedBooks.length }})
            </h6>

            <!-- Tab Navigation -->
            <ul class="nav nav-tabs mb-3" role="tablist">
              <li class="nav-item" role="presentation">
                <button
                  :class="['nav-link', activeTab === 'all' ? 'active' : '']"
                  @click="activeTab = 'all'"
                  type="button"
                >
                  Tất cả
                  <span class="badge bg-primary ms-2">{{ loanedBooks.length }}</span>
                </button>
              </li>
              <li class="nav-item" role="presentation">
                <button
                  :class="['nav-link', activeTab === 'borrowing' ? 'active' : '']"
                  @click="activeTab = 'borrowing'"
                  type="button"
                >
                  Đang mượn
                  <span class="badge bg-success ms-2">{{ filterBooks('DA_DUYET').length }}</span>
                </button>
              </li>
              <li class="nav-item" role="presentation">
                <button
                  :class="['nav-link', activeTab === 'overdue' ? 'active' : '']"
                  @click="activeTab = 'overdue'"
                  type="button"
                >
                  Quá hạn
                  <span class="badge bg-danger ms-2">{{ overdueBooks.length }}</span>
                </button>
              </li>
              <li class="nav-item" role="presentation">
                <button
                  :class="['nav-link', activeTab === 'returned' ? 'active' : '']"
                  @click="activeTab = 'returned'"
                  type="button"
                >
                  Đã trả
                  <span class="badge bg-secondary ms-2">{{ filterBooks('DA_TRA').length }}</span>
                </button>
              </li>
            </ul>

            <!-- Books Grid -->
            <div class="books-grid">
              <div
                v-for="loan in filteredBooks"
                :key="loan._id"
                class="book-loan-card"
                @click="showBookDetail(loan)"
              >
                <div class="book-image-container">
                  <img
                    :src="loan.MaSach.HinhAnh || '/placeholder-book.jpg'"
                    :alt="loan.MaSach.TenSach"
                    class="book-image"
                  />
                  <span :class="getStatusBadgeClass(loan)">
                    {{ getStatusText(loan) }}
                  </span>
                </div>
                <div class="book-loan-info">
                  <h6 class="book-title">{{ loan.MaSach.TenSach }}</h6>
                  <p class="book-author">
                    <i class="bi bi-person-fill me-1"></i>
                    {{ loan.MaSach.TacGia }}
                  </p>
                  <div class="loan-dates">
                    <div class="date-item">
                      <i class="bi bi-calendar-plus text-success"></i>
                      <span>{{ formatDate(loan.NgayMuon) }}</span>
                    </div>
                    <div class="date-item">
                      <i class="bi bi-calendar-check text-warning"></i>
                      <span>{{ formatDate(loan.NgayTra) }}</span>
                    </div>
                  </div>
                  <div v-if="isOverdue(loan.NgayTra) && loan.TrangThai === 'DA_DUYET'" class="overdue-warning">
                    <i class="bi bi-exclamation-triangle-fill me-1"></i>
                    Quá hạn {{ calculateOverdueDays(loan.NgayTra) }} ngày
                  </div>
                  <div v-if="loan.PhatQuaHan" class="fine-info">
                    <i class="bi bi-cash-stack me-1"></i>
                    Phạt: {{ formatPrice(loan.PhatQuaHan.SoTienPhat) }}
                  </div>
                </div>
              </div>
            </div>

            <!-- Empty State for Filtered View -->
            <div v-if="filteredBooks.length === 0" class="alert alert-info mt-3">
              <i class="bi bi-info-circle me-2"></i>
              Không có sách nào trong danh mục này
            </div>
          </div>

          <!-- No Books Loaned -->
          <div v-else-if="customerInfo && loanedBooks.length === 0" class="alert alert-info">
            <i class="bi bi-info-circle me-2"></i>
            Đọc giả này chưa mượn sách nào
          </div>
        </div>
      </div>
    </div>

    <!-- Book Detail Modal -->
    <BookDetailModal
      :show="showDetailModal"
      :book="selectedBook"
      @close="closeBookDetail"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import type { SachMuonItem } from '../../services/tinhTrangSachMuonService';
import { docGiaService } from '../../services/docGiaService';
import BookDetailModal from './BookDetailModal.vue';

interface DocGiaInfo {
  _id: string;
  MaDocGia: string;
  HoLot: string;
  Ten: string;
  Email?: string;
  SoDienThoai?: string;
}

const searchQuery = ref('');
const isSearching = ref(false);
const searchPerformed = ref(false);
const customerInfo = ref<DocGiaInfo | null>(null);
const loanedBooks = ref<SachMuonItem[]>([]);
const activeTab = ref<'all' | 'borrowing' | 'overdue' | 'returned'>('all');

const showDetailModal = ref(false);
const selectedBook = ref<SachMuonItem | null>(null);

// Computed properties
const overdueBooks = computed(() => {
  return loanedBooks.value.filter(
    book => book.TrangThai === 'DA_DUYET' && isOverdue(book.NgayTra)
  );
});

const filteredBooks = computed(() => {
  switch (activeTab.value) {
    case 'borrowing':
      return filterBooks('DA_DUYET');
    case 'overdue':
      return overdueBooks.value;
    case 'returned':
      return filterBooks('DA_TRA');
    default:
      return loanedBooks.value;
  }
});

// Methods
const searchCustomer = async () => {
  if (!searchQuery.value.trim()) return;

  isSearching.value = true;
  searchPerformed.value = true;
  customerInfo.value = null;
  loanedBooks.value = [];

  try {
    // Search for customer by MaDocGia or name
    const docGia = await docGiaService.searchDocGia(searchQuery.value.trim());
    console.log('Customer found:', docGia);

    if (docGia) {
      customerInfo.value = docGia;

      // Get loaned books for this customer
      try {
        const books = await docGiaService.getLoanedBooks(docGia._id);
        console.log('Books found:', books);
        loanedBooks.value = books || [];
      } catch (bookError: any) {
        console.error('Error loading books:', bookError);
        // If we can't get books, just show empty list but still show customer info
        loanedBooks.value = [];
        if (bookError.response?.status !== 404) {
          alert('Không thể tải danh sách sách mượn. Vui lòng thử lại sau.');
        }
      }
      activeTab.value = 'all';
    }
  } catch (error: any) {
    console.error('Search error:', error);
    customerInfo.value = null;
    loanedBooks.value = [];

    if (error.response?.status === 404) {
      // Customer not found - this is handled by the template
    } else {
      alert('Có lỗi xảy ra khi tìm kiếm. Vui lòng thử lại sau.');
    }
  } finally {
    isSearching.value = false;
  }
};

const filterBooks = (status: string) => {
  return loanedBooks.value.filter(book => book.TrangThai === status);
};

const getStatusText = (loan: SachMuonItem): string => {
  if (loan.TrangThai === 'DA_DUYET' && isOverdue(loan.NgayTra)) {
    return 'Quá hạn';
  }

  const statusMap: Record<string, string> = {
    'CHO_DUYET': 'Chờ duyệt',
    'DA_DUYET': 'Đang mượn',
    'DA_TRA': 'Đã trả'
  };
  return statusMap[loan.TrangThai] || loan.TrangThai;
};

const getStatusBadgeClass = (loan: SachMuonItem): string => {
  if (loan.TrangThai === 'DA_DUYET' && isOverdue(loan.NgayTra)) {
    return 'status-badge badge-overdue';
  }

  const classMap: Record<string, string> = {
    'CHO_DUYET': 'status-badge badge-warning',
    'DA_DUYET': 'status-badge badge-success',
    'DA_TRA': 'status-badge badge-secondary'
  };
  return classMap[loan.TrangThai] || 'status-badge badge-info';
};

const isOverdue = (ngayTra: string): boolean => {
  return new Date(ngayTra).getTime() < Date.now();
};

const calculateOverdueDays = (ngayTra: string): number => {
  const dueDate = new Date(ngayTra);
  const now = new Date();
  const diff = now.getTime() - dueDate.getTime();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('vi-VN');
};

const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(price);
};

const showBookDetail = (loan: SachMuonItem) => {
  selectedBook.value = loan;
  showDetailModal.value = true;
};

const closeBookDetail = () => {
  showDetailModal.value = false;
  selectedBook.value = null;
};
</script>

<style scoped>
.search-customer-container {
  max-width: 1400px;
  margin: 0 auto;
}

.card {
  border: none;
  border-radius: 12px;
  overflow: hidden;
}

.card-header.bg-gradient {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1.5rem;
}

.card-header h5 {
  display: flex;
  align-items: center;
}

/* Search Form */
.search-form {
  margin-bottom: 0;
}

.input-group-text {
  background: white;
  border-right: none;
  color: #667eea;
  font-size: 1.2rem;
}

.input-group .form-control {
  border-left: none;
  font-size: 1rem;
}

.input-group .form-control:focus {
  border-color: #ced4da;
  box-shadow: none;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

/* Customer Info Card */
.customer-info-card {
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.customer-header {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.customer-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  color: #667eea;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.customer-details {
  flex: 1;
}

.customer-name {
  font-size: 1.5rem;
  font-weight: 700;
  color: #2d3748;
  margin-bottom: 0.5rem;
}

.customer-id,
.customer-contact {
  color: #4a5568;
  font-size: 0.95rem;
}

.customer-stats {
  text-align: center;
}

.stat-item {
  background: white;
  padding: 1rem 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.stat-value {
  font-size: 2rem;
  font-weight: 700;
  color: #667eea;
}

.stat-label {
  font-size: 0.85rem;
  color: #718096;
  font-weight: 600;
}

/* Loaned Books Section */
.loaned-books-section {
  margin-top: 2rem;
}

.section-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #2d3748;
  display: flex;
  align-items: center;
}

/* Tabs */
.nav-tabs {
  border-bottom: 2px solid #e2e8f0;
}

.nav-tabs .nav-link {
  color: #6c757d;
  font-weight: 600;
  border: none;
  padding: 0.75rem 1.5rem;
  transition: all 0.2s;
}

.nav-tabs .nav-link:hover {
  color: #667eea;
  background-color: #f8f9fa;
}

.nav-tabs .nav-link.active {
  color: #667eea;
  background: white;
  border-bottom: 3px solid #667eea;
}

/* Books Grid */
.books-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-top: 1rem;
}

.book-loan-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s;
  cursor: pointer;
}

.book-loan-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
}

.book-image-container {
  position: relative;
  height: 300px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.book-image {
  width: auto;
  height: 100%;
  max-width: 100%;
  object-fit: contain;
}

.status-badge {
  position: absolute;
  top: 10px;
  right: 10px;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.badge-success {
  background: #48bb78;
  color: white;
}

.badge-warning {
  background: #f6ad55;
  color: white;
}

.badge-danger,
.badge-overdue {
  background: #f56565;
  color: white;
  animation: pulse 2s infinite;
}

.badge-secondary {
  background: #718096;
  color: white;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}

.book-loan-info {
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
  line-height: 1.4;
}

.book-author {
  color: #718096;
  font-size: 0.875rem;
  margin-bottom: 0.75rem;
}

.loan-dates {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
}

.date-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
  color: #4a5568;
}

.date-item i {
  font-size: 1rem;
}

.overdue-warning {
  background: #fed7d7;
  color: #c53030;
  padding: 0.5rem;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 600;
  margin-top: 0.5rem;
  display: flex;
  align-items: center;
}

.fine-info {
  background: #fefcbf;
  color: #744210;
  padding: 0.5rem;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 600;
  margin-top: 0.5rem;
  display: flex;
  align-items: center;
}

/* Responsive */
@media (max-width: 768px) {
  .customer-header {
    flex-direction: column;
    text-align: center;
  }

  .customer-details {
    text-align: center;
  }

  .books-grid {
    grid-template-columns: 1fr;
  }

  .book-image-container {
    height: 250px;
  }
}
</style>

