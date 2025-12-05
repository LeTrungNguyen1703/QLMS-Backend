<template>
  <div class="container-fluid px-4 mt-4">
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

        <!-- Search and Filter Section -->
        <div class="row mb-3">
          <div class="col-md-4">
            <div class="input-group">
              <span class="input-group-text">
                <i class="bi bi-search"></i>
              </span>
              <input
                type="text"
                class="form-control"
                placeholder="Tìm theo tên sách..."
                v-model="searchQuery"
              />
            </div>
          </div>
          <div class="col-md-3">
            <input
              type="date"
              class="form-control"
              v-model="dateFrom"
              placeholder="Từ ngày"
            />
          </div>
          <div class="col-md-3">
            <input
              type="date"
              class="form-control"
              v-model="dateTo"
              placeholder="Đến ngày"
            />
          </div>
          <div class="col-md-2">
            <button class="btn btn-outline-secondary w-100" @click="clearFilters">
              <i class="bi bi-x-circle me-1"></i>
              Xóa lọc
            </button>
          </div>
        </div>

        <!-- Sort Options -->
        <div class="row mb-3">
          <div class="col-md-4">
            <select class="form-select" v-model="sortBy">
              <option value="date_desc">Ngày mượn (Mới nhất)</option>
              <option value="date_asc">Ngày mượn (Cũ nhất)</option>
              <option value="name_asc">Tên sách (A-Z)</option>
              <option value="name_desc">Tên sách (Z-A)</option>
              <option value="fine_desc">Phạt (Cao-Thấp)</option>
              <option value="fine_asc">Phạt (Thấp-Cao)</option>
            </select>
          </div>
          <div class="col-md-8 text-end">
            <button class="btn btn-success" @click="exportToCSV" :disabled="filteredHistory.length === 0">
              <i class="bi bi-download me-1"></i>
              Xuất CSV
            </button>
          </div>
        </div>

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
        <div v-else-if="paginatedHistory.length > 0">
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
                <tr v-for="record in paginatedHistory" :key="record._id">
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
            {{ Math.min(currentPage * itemsPerPage, sortedAndFilteredHistory.length) }}
            trong tổng số {{ sortedAndFilteredHistory.length }} bản ghi
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
const filter = ref<'all' | 'CHO_DUYET' | 'DA_DUYET' | 'DA_TRA'>('all')
const isLoading = ref(false)
const errorMessage = ref('')

// Search and filter states
const searchQuery = ref('')
const dateFrom = ref('')
const dateTo = ref('')
const sortBy = ref('date_desc')

// Pagination states
const currentPage = ref(1)
const itemsPerPage = ref(10)

const filteredHistory = computed(() => {
  let result = history.value

  // Filter by status
  if (filter.value !== 'all') {
    const statusMap: Record<string, TrangThaiMuonSach> = {
      cho_duyet: TrangThaiMuonSach.CHO_DUYET,
      da_duyet: TrangThaiMuonSach.DA_DUYET,
      da_tra: TrangThaiMuonSach.DA_TRA
    }
    result = result.filter(h => h.TrangThai === statusMap[filter.value])
  }

  // Search by book title
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(h =>
      getBookTitle(h.MaSach).toLowerCase().includes(query)
    )
  }

  // Filter by date range
  if (dateFrom.value) {
    const fromDate = new Date(dateFrom.value)
    result = result.filter(h => new Date(h.NgayMuon) >= fromDate)
  }

  if (dateTo.value) {
    const toDate = new Date(dateTo.value)
    toDate.setHours(23, 59, 59, 999)
    result = result.filter(h => new Date(h.NgayMuon) <= toDate)
  }

  return result
})

const sortedAndFilteredHistory = computed(() => {
  const sorted = [...filteredHistory.value]

  switch (sortBy.value) {
    case 'date_asc':
      return sorted.sort((a, b) => new Date(a.NgayMuon).getTime() - new Date(b.NgayMuon).getTime())
    case 'date_desc':
      return sorted.sort((a, b) => new Date(b.NgayMuon).getTime() - new Date(a.NgayMuon).getTime())
    case 'name_asc':
      return sorted.sort((a, b) => getBookTitle(a.MaSach).localeCompare(getBookTitle(b.MaSach)))
    case 'name_desc':
      return sorted.sort((a, b) => getBookTitle(b.MaSach).localeCompare(getBookTitle(a.MaSach)))
    case 'fine_asc':
      return sorted.sort((a, b) => a.PhatQuaHan.SoTienPhat - b.PhatQuaHan.SoTienPhat)
    case 'fine_desc':
      return sorted.sort((a, b) => b.PhatQuaHan.SoTienPhat - a.PhatQuaHan.SoTienPhat)
    default:
      return sorted
  }
})

const totalPages = computed(() => {
  return Math.ceil(sortedAndFilteredHistory.value.length / itemsPerPage.value)
})

const paginatedHistory = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return sortedAndFilteredHistory.value.slice(start, end)
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

const clearFilters = () => {
  searchQuery.value = ''
  dateFrom.value = ''
  dateTo.value = ''
  currentPage.value = 1
}

const changePage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
  }
}

const exportToCSV = () => {
  const headers = ['Tên sách', 'Tác giả', 'Số lượng', 'Ngày mượn', 'Hạn trả', 'Trạng thái', 'Phạt', 'Ghi chú']
  const rows = sortedAndFilteredHistory.value.map(record => [
    getBookTitle(record.MaSach),
    getBookAuthor(record.MaSach),
    record.SoQuyen,
    formatDate(record.NgayMuon),
    formatDate(record.NgayTra),
    record.TrangThai,
    record.PhatQuaHan.SoTienPhat > 0 ? formatPrice(record.PhatQuaHan.SoTienPhat) : '0',
    record.PhatQuaHan.message || ''
  ])

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n')

  const BOM = '\uFEFF'
  const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)

  link.setAttribute('href', url)
  link.setAttribute('download', `lich-su-muon-sach-${new Date().toISOString().split('T')[0]}.csv`)
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
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
