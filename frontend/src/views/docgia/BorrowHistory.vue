<template>
  <div class="container mt-4">
    <div class="card shadow">
      <div class="card-header bg-info text-white">
        <h4 class="mb-0">
          <i class="bi bi-clock-history me-2"></i>
          Lịch sử mượn sách
        </h4>
      </div>
      <div class="card-body">
        <!-- Filter tabs -->
        <ul class="nav nav-pills mb-4">
          <li class="nav-item">
            <a
              class="nav-link"
              :class="{ active: filter === 'all' }"
              href="#"
              @click.prevent="filter = 'all'"
            >Tất cả</a>
          </li>
          <li class="nav-item">
            <a
              class="nav-link"
              :class="{ active: filter === 'cho_duyet' }"
              href="#"
              @click.prevent="filter = 'cho_duyet'"
            >Chờ duyệt</a>
          </li>
          <li class="nav-item">
            <a
              class="nav-link"
              :class="{ active: filter === 'da_duyet' }"
              href="#"
              @click.prevent="filter = 'da_duyet'"
            >Đã duyệt</a>
          </li>
          <li class="nav-item">
            <a
              class="nav-link"
              :class="{ active: filter === 'da_tra' }"
              href="#"
              @click.prevent="filter = 'da_tra'"
            >Đã trả</a>
          </li>
        </ul>

        <!-- Loading state -->
        <div v-if="isLoading" class="text-center py-5">
          <div class="spinner-border text-info" role="status">
            <span class="visually-hidden">Đang tải...</span>
          </div>
          <p class="mt-2">Đang tải lịch sử...</p>
        </div>

        <!-- Error message -->
        <div v-else-if="errorMessage" class="alert alert-warning">
          <i class="bi bi-info-circle me-2"></i>
          {{ errorMessage }}
        </div>

        <!-- History list -->
        <div v-else-if="filteredHistory.length > 0">
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
                  <th>Ghi chú</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="record in filteredHistory" :key="record._id">
                  <td>
                    <strong>{{ getBookTitle(record.MaSach) }}</strong>
                  </td>
                  <td>{{ getBookAuthor(record.MaSach) }}</td>
                  <td>{{ record.SoQuyen }}</td>
                  <td>{{ formatDate(record.NgayMuon) }}</td>
                  <td>
                    <span :class="isOverdue(record.NgayTra, record.TrangThai) ? 'text-danger' : ''">
                      {{ formatDate(record.NgayTra) }}
                    </span>
                  </td>
                  <td>
                    <span :class="getStatusClass(record.TrangThai)">
                      {{ record.TrangThai }}
                    </span>
                  </td>
                  <td>
                    <span v-if="record.PhatQuaHan.SoTienPhat > 0" class="text-danger fw-bold">
                      {{ formatPrice(record.PhatQuaHan.SoTienPhat) }}
                    </span>
                    <span v-else class="text-success">-</span>
                  </td>
                  <td>
                    <small class="text-muted">{{ record.PhatQuaHan.message }}</small>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Statistics -->
          <div class="row mt-4">
            <div class="col-md-3">
              <div class="card text-center">
                <div class="card-body">
                  <h3 class="text-primary">{{ statistics.total }}</h3>
                  <small class="text-muted">Tổng lượt mượn</small>
                </div>
              </div>
            </div>
            <div class="col-md-3">
              <div class="card text-center">
                <div class="card-body">
                  <h3 class="text-warning">{{ statistics.pending }}</h3>
                  <small class="text-muted">Chờ duyệt</small>
                </div>
              </div>
            </div>
            <div class="col-md-3">
              <div class="card text-center">
                <div class="card-body">
                  <h3 class="text-success">{{ statistics.approved }}</h3>
                  <small class="text-muted">Đã duyệt</small>
                </div>
              </div>
            </div>
            <div class="col-md-3">
              <div class="card text-center">
                <div class="card-body">
                  <h3 class="text-secondary">{{ statistics.returned }}</h3>
                  <small class="text-muted">Đã trả</small>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- No history -->
        <div v-else class="text-center py-5">
          <i class="bi bi-inbox fs-1 text-muted"></i>
          <p class="text-muted mt-2">Chưa có lịch sử mượn sách</p>
          <router-link to="/docgia/search-books" class="btn btn-info text-white">
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

const history = ref<TheoDoiMuonSach[]>([])
const filter = ref<'all' | 'cho_duyet' | 'da_duyet' | 'da_tra'>('all')
const isLoading = ref(false)
const errorMessage = ref('')

const filteredHistory = computed(() => {
  if (filter.value === 'all') return history.value

  const statusMap = {
    cho_duyet: TrangThaiMuonSach.CHO_DUYET,
    da_duyet: TrangThaiMuonSach.DA_DUYET,
    da_tra: TrangThaiMuonSach.DA_TRA
  }

  return history.value.filter(h => h.TrangThai === statusMap[filter.value])
})

const statistics = computed(() => {
  return {
    total: history.value.length,
    pending: history.value.filter(h => h.TrangThai === TrangThaiMuonSach.CHO_DUYET).length,
    approved: history.value.filter(h => h.TrangThai === TrangThaiMuonSach.DA_DUYET).length,
    returned: history.value.filter(h => h.TrangThai === TrangThaiMuonSach.DA_TRA).length
  }
})

const loadHistory = async () => {
  isLoading.value = true
  errorMessage.value = ''

  const userIdFromStorage = localStorage.getItem('userId')

  if (!userIdFromStorage) {
    errorMessage.value = 'Không tìm thấy thông tin người dùng'
    isLoading.value = false
    return
  }

  try {
    history.value = await bookService.getBorrowHistory(userIdFromStorage)
  } catch (error: any) {
    errorMessage.value = error.message || 'Chưa có lịch sử mượn sách'
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

const isOverdue = (ngayTra: string, trangThai: TrangThaiMuonSach): boolean => {
  if (trangThai === TrangThaiMuonSach.DA_TRA) return false
  return new Date(ngayTra) < new Date()
}

const getStatusClass = (status: TrangThaiMuonSach): string => {
  switch (status) {
    case TrangThaiMuonSach.CHO_DUYET:
      return 'badge bg-warning text-dark'
    case TrangThaiMuonSach.DA_DUYET:
      return 'badge bg-success'
    case TrangThaiMuonSach.DA_TRA:
      return 'badge bg-secondary'
    default:
      return 'badge bg-light text-dark'
  }
}

onMounted(() => {
  loadHistory()
})
</script>

<style scoped>
.nav-pills .nav-link {
  color: #6c757d;
}

.nav-pills .nav-link.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.table-responsive {
  border-radius: 8px;
}
</style>

