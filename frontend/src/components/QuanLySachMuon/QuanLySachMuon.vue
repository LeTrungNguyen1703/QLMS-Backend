<template>
  <div class="quan-ly-sach-muon">
    <!-- Tab Navigation -->
    <ul class="nav nav-pills mb-4" role="tablist">
      <li class="nav-item" role="presentation">
        <button
          :class="['nav-link', activeTab === 'cho-duyet' ? 'active' : '']"
          @click="activeTab = 'cho-duyet'"
          type="button"
        >
          <i class="bi bi-clock-history me-1"></i>
          Chờ duyệt
          <span v-if="danhSachChoDuyet.length > 0" class="badge bg-warning ms-2">
            {{ danhSachChoDuyet.length }}
          </span>
        </button>
      </li>
      <li class="nav-item" role="presentation">
        <button
          :class="['nav-link', activeTab === 'dang-muon' ? 'active' : '']"
          @click="activeTab = 'dang-muon'"
          type="button"
        >
          <i class="bi bi-book me-1"></i>
          Đang mượn
          <span v-if="danhSachDangMuon.length > 0" class="badge bg-primary ms-2">
            {{ danhSachDangMuon.length }}
          </span>
        </button>
      </li>
      <li class="nav-item" role="presentation">
        <button
          :class="['nav-link', activeTab === 'qua-han' ? 'active' : '']"
          @click="activeTab = 'qua-han'"
          type="button"
        >
          <i class="bi bi-exclamation-triangle me-1"></i>
          Quá hạn
          <span v-if="danhSachQuaHan.length > 0" class="badge bg-danger ms-2">
            {{ danhSachQuaHan.length }}
          </span>
        </button>
      </li>
      <li class="nav-item" role="presentation">
        <button
          :class="['nav-link', activeTab === 'da-tra' ? 'active' : '']"
          @click="activeTab = 'da-tra'"
          type="button"
        >
          <i class="bi bi-check-circle me-1"></i>
          Đã trả
        </button>
      </li>
    </ul>

    <!-- Loading State -->
    <div v-if="isLoading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Đang tải...</span>
      </div>
    </div>

    <!-- Tab Content -->
    <div v-else class="tab-content">
      <!-- Chờ duyệt -->
      <div v-show="activeTab === 'cho-duyet'">
        <div v-if="danhSachChoDuyet.length === 0" class="alert alert-info">
          <i class="bi bi-info-circle me-2"></i>
          Không có yêu cầu mượn sách nào đang chờ duyệt
        </div>
        <div v-else class="table-responsive">
          <table class="table table-hover">
            <thead>
              <tr>
                <th>Mã sách</th>
                <th>Mã đọc giả</th>
                <th>Ngày mượn</th>
                <th>Ngày trả dự kiến</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in danhSachChoDuyet" :key="item._id">
                <td><strong>{{ item.MaSach }}</strong></td>
                <td>{{ item.MSDG }}</td>
                <td>{{ formatDate(item.NgayMuon) }}</td>
                <td>{{ formatDate(item.NgayTra) }}</td>
                <td>
                  <button
                    class="btn btn-sm btn-success me-2"
                    @click="xacNhanChoMuon(item._id)"
                    title="Duyệt cho mượn"
                  >
                    <i class="bi bi-check-lg"></i>
                  </button>
                  <button
                    class="btn btn-sm btn-danger"
                    @click="tuChoiChoMuon(item._id)"
                    title="Từ chối"
                  >
                    <i class="bi bi-x-lg"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Đang mượn -->
      <div v-show="activeTab === 'dang-muon'">
        <div v-if="danhSachDangMuon.length === 0" class="alert alert-info">
          <i class="bi bi-info-circle me-2"></i>
          Không có sách nào đang được mượn
        </div>
        <div v-else class="table-responsive">
          <table class="table table-hover">
            <thead>
              <tr>
                <th>Tên Sách</th>
                <th>Mã đọc giả</th>
                <th>Ngày mượn</th>
                <th>Ngày trả dự kiến</th>
                <th>Trạng thái</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in danhSachDangMuon" :key="item._id">
                <td><strong>{{ item.MaSach.TenSach }}</strong></td>
                <td>{{ item.MaDocGia.TenDocGia }}</td>
                <td>{{ formatDate(item.NgayMuon) }}</td>
                <td>{{ formatDate(item.NgayTra) }}</td>
                <td>
                  <span
                    :class="[
                      'badge',
                      isOverdue(item.NgayTra) ? 'bg-danger' : 'bg-success',
                    ]"
                  >
                    {{ isOverdue(item.NgayTra) ? 'Quá hạn' : 'Đúng hạn' }}
                  </span>
                </td>
                <td>
                  <button
                    class="btn btn-sm btn-primary"
                    @click="xacNhanDaTra(item._id)"
                    title="Xác nhận đã trả"
                  >
                    <i class="bi bi-check-circle me-1"></i>
                    Đã trả
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Quá hạn -->
      <div v-show="activeTab === 'qua-han'">
        <div v-if="danhSachQuaHan.length === 0" class="alert alert-success">
          <i class="bi bi-check-circle me-2"></i>
          Không có sách nào quá hạn
        </div>
        <div v-else class="table-responsive">
          <table class="table table-hover">
            <thead>
              <tr>
                <th>Mã sách</th>
                <th>Mã đọc giả</th>
                <th>Ngày mượn</th>
                <th>Ngày trả dự kiến</th>
                <th>Số ngày quá hạn</th>
                <th>Phạt</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in danhSachQuaHan" :key="item._id">
                <td><strong>{{ item.MaSach }}</strong></td>
                <td>{{ item.MSDG }}</td>
                <td>{{ formatDate(item.NgayMuon) }}</td>
                <td>{{ formatDate(item.NgayTra) }}</td>
                <td>
                  <span class="badge bg-danger">
                    {{ calculateOverdueDays(item.NgayTra) }} ngày
                  </span>
                </td>
                <td>
                  <span v-if="item.PhatQuaHan" class="text-danger fw-bold">
                    {{ formatCurrency(item.PhatQuaHan.SoTienPhat) }}
                  </span>
                  <span v-else class="text-muted">Chưa phạt</span>
                </td>
                <td>
                  <button
                    v-if="!item.PhatQuaHan"
                    class="btn btn-sm btn-warning me-2"
                    @click="showPhatModal(item)"
                    title="Phạt quá hạn"
                  >
                    <i class="bi bi-currency-dollar"></i>
                  </button>
                  <button
                    class="btn btn-sm btn-primary"
                    @click="xacNhanDaTra(item._id)"
                    title="Xác nhận đã trả"
                  >
                    <i class="bi bi-check-circle"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Đã trả -->
      <div v-show="activeTab === 'da-tra'">
        <div v-if="danhSachDaTra.length === 0" class="alert alert-info">
          <i class="bi bi-info-circle me-2"></i>
          Chưa có sách nào được trả
        </div>
        <div v-else class="table-responsive">
          <table class="table table-hover">
            <thead>
              <tr>
                <th>Mã sách</th>
                <th>Mã đọc giả</th>
                <th>Ngày mượn</th>
                <th>Ngày trả</th>
                <th>Phạt</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in danhSachDaTra" :key="item._id">
                <td><strong>{{ item.MaSach }}</strong></td>
                <td>{{ item.MSDG }}</td>
                <td>{{ formatDate(item.NgayMuon) }}</td>
                <td>{{ formatDate(item.NgayTra) }}</td>
                <td>
                  <span v-if="item.PhatQuaHan" class="text-danger fw-bold">
                    {{ formatCurrency(item.PhatQuaHan.SoTienPhat) }}
                  </span>
                  <span v-else class="text-success">
                    <i class="bi bi-check-circle"></i> Không phạt
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Modal phạt quá hạn -->
    <div
      class="modal fade"
      id="phatModal"
      tabindex="-1"
      aria-labelledby="phatModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="phatModalLabel">
              <i class="bi bi-currency-dollar me-2"></i>
              Phạt mượn sách quá hạn
            </h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <p>
              <strong>Mã sách:</strong> {{ selectedItem?.MaSach }}<br />
              <strong>Số ngày quá hạn:</strong>
              <span class="text-danger">
                {{ selectedItem ? calculateOverdueDays(selectedItem.NgayTra) : 0 }} ngày
              </span>
            </p>
            <div class="mb-3">
              <label class="form-label">Số tiền phạt (VNĐ)</label>
              <input
                v-model.number="soTienPhat"
                type="number"
                class="form-control"
                placeholder="Nhập số tiền phạt"
                min="0"
              />
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
              Hủy
            </button>
            <button
              type="button"
              class="btn btn-warning"
              @click="apDungPhat"
              :disabled="!soTienPhat || soTienPhat <= 0"
            >
              <i class="bi bi-check-lg me-1"></i>
              Áp dụng phạt
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Modal } from 'bootstrap';
import {type SachMuonItem, tinhTrangSachMuonService} from "../../services/tinhTrangSachMuonService.ts";

const activeTab = ref<'cho-duyet' | 'dang-muon' | 'qua-han' | 'da-tra'>('cho-duyet');
const isLoading = ref(false);

const danhSachChoDuyet = ref<SachMuonItem[]>([]);
const danhSachDangMuon = ref<SachMuonItem[]>([]);
const danhSachQuaHan = ref<SachMuonItem[]>([]);
const danhSachDaTra = ref<SachMuonItem[]>([]);

const selectedItem = ref<SachMuonItem | null>(null);
const soTienPhat = ref<number>(0);

let phatModalInstance: Modal | null = null;

onMounted(async () => {
  await loadAllData();

  const modalElement = document.getElementById('phatModal');
  if (modalElement) {
    phatModalInstance = new Modal(modalElement);
  }
});

const loadAllData = async () => {
  isLoading.value = true;
  try {
    await Promise.all([
      loadChoDuyet(),
      loadDangMuon(),
      loadQuaHan(),
      loadDaTra(),
    ]);
  } catch (error) {
    console.error('Lỗi tải dữ liệu:', error);
  } finally {
    isLoading.value = false;
  }
};

const loadChoDuyet = async () => {
  try {
    danhSachChoDuyet.value = await tinhTrangSachMuonService.getDanhSachChoDuyet();
  } catch (error) {
    console.error('Lỗi tải danh sách chờ duyệt:', error);
  }
};

const loadDangMuon = async () => {
  try {
    danhSachDangMuon.value = await tinhTrangSachMuonService.getDanhSachDaDuyet();
  } catch (error) {
    console.error('Lỗi tải danh sách đang mượn:', error);
  }
};

const loadQuaHan = async () => {
  try {
    danhSachQuaHan.value = await tinhTrangSachMuonService.getDanhSachQuaHan();
  } catch (error) {
    console.error('Lỗi tải danh sách quá hạn:', error);
  }
};

const loadDaTra = async () => {
  try {
    danhSachDaTra.value = await tinhTrangSachMuonService.getDanhSachDaTra();
  } catch (error) {
    console.error('Lỗi tải danh sách đã trả:', error);
  }
};

const xacNhanChoMuon = async (id: string) => {
  if (!confirm('Xác nhận cho phép mượn sách này?')) return;

  try {
    await tinhTrangSachMuonService.xacNhanChoMuon(id);
    alert('Đã duyệt cho mượn sách thành công!');
    await loadAllData();
  } catch (error: any) {
    alert(error.response?.data?.message || 'Có lỗi xảy ra!');
  }
};

const xacNhanDaTra = async (id: string) => {
  if (!confirm('Xác nhận đã trả sách?')) return;

  try {
    await tinhTrangSachMuonService.xacNhanDaTra(id);
    alert('Đã xác nhận trả sách thành công!');
    await loadAllData();
  } catch (error: any) {
    alert(error.response?.data?.message || 'Có lỗi xảy ra!');
  }
};

const tuChoiChoMuon = async (id: string) => {
  const lyDo = prompt('Nhập lý do từ chối (không bắt buộc):');
  if (lyDo === null) return; // User cancelled

  try {
    await tinhTrangSachMuonService.tuChoiChoMuon(id, lyDo);
    alert('Đã từ chối yêu cầu mượn sách!');
    await loadAllData();
  } catch (error: any) {
    alert(error.response?.data?.message || 'Có lỗi xảy ra!');
  }
};

const showPhatModal = (item: SachMuonItem) => {
  selectedItem.value = item;
  const soNgayQuaHan = calculateOverdueDays(item.NgayTra);
  soTienPhat.value = soNgayQuaHan * 5000; // Mặc định 5000đ/ngày
  phatModalInstance?.show();
};

const apDungPhat = async () => {
  if (!selectedItem.value || !soTienPhat.value) return;

  try {
    await tinhTrangSachMuonService.phatQuaHan(selectedItem.value._id, soTienPhat.value);
    alert('Đã áp dụng phạt thành công!');
    phatModalInstance?.hide();
    await loadAllData();
  } catch (error: any) {
    alert(error.response?.data?.message || 'Có lỗi xảy ra!');
  }
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('vi-VN');
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

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(amount);
};
</script>

<style scoped>
.nav-pills .nav-link {
  color: #6c757d;
  font-weight: 600;
  transition: all 0.2s;
}

.nav-pills .nav-link:hover {
  background-color: #f8f9fa;
}

.nav-pills .nav-link.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.table-responsive {
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.table {
  margin-bottom: 0;
}

.table thead {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.table tbody tr:hover {
  background-color: #f8f9fa;
}

.badge {
  padding: 0.4rem 0.8rem;
  font-size: 0.85rem;
}

.btn-sm {
  padding: 0.375rem 0.75rem;
}
</style>

