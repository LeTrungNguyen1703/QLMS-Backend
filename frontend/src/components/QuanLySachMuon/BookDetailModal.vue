<template>
  <!-- Book Detail Modal -->
  <Transition name="modal-fade">
    <div v-if="show" class="modal-backdrop" @click="handleClose">
      <Transition name="modal-slide">
        <div v-if="show" class="modal-dialog-wrapper" @click.stop>
          <div class="modal-content-custom">
            <button type="button" class="btn-close-custom" @click="handleClose">
              <i class="bi bi-x-lg"></i>
            </button>

            <div v-if="book" class="modal-body-custom">
              <!-- Book Image -->
              <div class="book-detail-image">
                <img
                  :src="book.MaSach.HinhAnh || '/placeholder-book.jpg'"
                  :alt="book.MaSach.TenSach"
                />
              </div>

              <!-- Book Details -->
              <div class="book-detail-info">
                <h4 class="book-detail-title">{{ book.MaSach.TenSach }}</h4>

                <!-- Book Information Section -->
                <div class="detail-section">
                  <h6 class="section-title">
                    <i class="bi bi-book me-2"></i>
                    Thông tin sách
                  </h6>
                  <div class="book-detail-meta">
                    <div class="meta-item">
                      <i class="bi bi-person-fill text-primary"></i>
                      <span class="meta-label">Tác giả:</span>
                      <span class="meta-value">{{ book.MaSach.TacGia }}</span>
                    </div>

                    <div class="meta-item">
                      <i class="bi bi-currency-dollar text-primary"></i>
                      <span class="meta-label">Đơn giá:</span>
                      <span class="meta-value fw-bold text-primary">{{ formatPrice(book.MaSach.DonGia) }}</span>
                    </div>
                  </div>
                </div>

                <!-- Reader Information Section -->
                <div class="detail-section">
                  <h6 class="section-title">
                    <i class="bi bi-person-badge me-2"></i>
                    Thông tin đọc giả
                  </h6>
                  <div class="book-detail-meta">
                    <div class="meta-item">
                      <i class="bi bi-hash text-success"></i>
                      <span class="meta-label">Mã đọc giả:</span>
                      <span class="meta-value">{{ book.MaDocGia.MaDocGia }}</span>
                    </div>

                    <div class="meta-item">
                      <i class="bi bi-person-circle text-success"></i>
                      <span class="meta-label">Họ tên:</span>
                      <span class="meta-value">{{ getFullName(book) }}</span>
                    </div>
                  </div>
                </div>

                <!-- Loan Information Section -->
                <div class="detail-section">
                  <h6 class="section-title">
                    <i class="bi bi-calendar-event me-2"></i>
                    Thông tin mượn sách
                  </h6>
                  <div class="book-detail-meta">
                    <div class="meta-item">
                      <i class="bi bi-calendar-plus text-info"></i>
                      <span class="meta-label">Ngày mượn:</span>
                      <span class="meta-value">{{ formatDate(book.NgayMuon) }}</span>
                    </div>

                    <div class="meta-item">
                      <i class="bi bi-calendar-check text-info"></i>
                      <span class="meta-label">Ngày trả dự kiến:</span>
                      <span class="meta-value">{{ formatDate(book.NgayTra) }}</span>
                    </div>

                    <div class="meta-item">
                      <i class="bi bi-info-circle text-info"></i>
                      <span class="meta-label">Trạng thái:</span>
                      <span class="meta-value">
                        <span :class="getStatusBadgeClass(book.TrangThai)">
                          {{ getStatusText(book.TrangThai) }}
                        </span>
                      </span>
                    </div>

                    <div v-if="isOverdue(book.NgayTra)" class="meta-item">
                      <i class="bi bi-exclamation-triangle-fill text-danger"></i>
                      <span class="meta-label">Quá hạn:</span>
                      <span class="meta-value">
                        <span class="badge bg-danger">
                          {{ calculateOverdueDays(book.NgayTra) }} ngày
                        </span>
                      </span>
                    </div>

                    <div v-if="book.PhatQuaHan" class="meta-item">
                      <i class="bi bi-cash-stack text-warning"></i>
                      <span class="meta-label">Tiền phạt:</span>
                      <span class="meta-value fw-bold text-danger">
                        {{ formatPrice(book.PhatQuaHan.SoTienPhat) }}
                      </span>
                    </div>
                  </div>
                </div>

                <!-- Close Button -->
                <div class="modal-actions">
                  <button type="button" class="btn btn-secondary" @click="handleClose">
                    <i class="bi bi-x-circle me-1"></i>
                    Đóng
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import type { SachMuonItem } from '../../services/tinhTrangSachMuonService';

defineProps<{
  show: boolean;
  book: SachMuonItem | null;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
}>();

const handleClose = () => {
  emit('close');
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(price);
};

const getFullName = (book: SachMuonItem): string => {
  return `${book.MaDocGia.HoLot} ${book.MaDocGia.Ten}`;
};

const getStatusText = (status: string): string => {
  const statusMap: Record<string, string> = {
    'CHO_DUYET': 'Chờ duyệt',
    'DA_DUYET': 'Đã duyệt',
    'DA_TRA': 'Đã trả'
  };
  return statusMap[status] || status;
};

const getStatusBadgeClass = (status: string): string => {
  const classMap: Record<string, string> = {
    'CHO_DUYET': 'badge bg-warning',
    'DA_DUYET': 'badge bg-success',
    'DA_TRA': 'badge bg-secondary'
  };
  return classMap[status] || 'badge bg-info';
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
</script>

<style scoped>
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

/* Detail Section */
.detail-section {
  margin-bottom: 1.5rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #e2e8f0;
}

.detail-section:last-of-type {
  border-bottom: none;
}

.section-title {
  font-size: 1rem;
  font-weight: 600;
  color: #4a5568;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
}

/* Meta Items */
.book-detail-meta {
  margin-left: 1.5rem;
}

.meta-item {
  display: flex;
  align-items: center;
  padding: 0.75rem 0;
  border-bottom: 1px solid #f7fafc;
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
  min-width: 140px;
}

.meta-value {
  color: #2d3748;
  flex: 1;
}

.badge {
  padding: 0.4rem 0.8rem;
  font-size: 0.85rem;
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

@media (max-width: 768px) {
  .modal-dialog-wrapper {
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
    min-width: 110px;
    font-size: 0.9rem;
  }

  .book-detail-meta {
    margin-left: 0.5rem;
  }
}
</style>

