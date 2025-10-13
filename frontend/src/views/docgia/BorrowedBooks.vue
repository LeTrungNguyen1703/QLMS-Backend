<template>
  <div class="container-fluid px-4 mt-4">
    <div class="card shadow">
      <div class="card-header bg-success text-white">
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
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { bookService } from '../../services/bookService'
import type { TheoDoiMuonSach, Sach } from '../../types/book'
import { TrangThaiMuonSach } from '../../types/book'

const borrows = ref<TheoDoiMuonSach[]>([])
const isLoading = ref(false)
const errorMessage = ref('')

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

  const userId = localStorage.getItem('authToken') // Lấy user ID từ decoded token hoặc localStorage
  // Tạm thời dùng ID từ localStorage, trong production nên decode từ JWT
  const userIdFromStorage = localStorage.getItem('userId')

  if (!userIdFromStorage) {
    errorMessage.value = 'Không tìm thấy thông tin người dùng'
    isLoading.value = false
    return
  }

  try {
    borrows.value = await bookService.getMyBorrowedBooks(userIdFromStorage)
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
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)
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

onMounted(() => {
  loadBorrowedBooks()
})
</script>

<style scoped>
.table-responsive {
  border-radius: 8px;
}
</style>
