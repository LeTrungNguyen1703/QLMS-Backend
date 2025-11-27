<template>
  <div class="table-responsive">
    <table class="table table-hover">
      <thead>
        <tr>
          <th>Mã sách</th>
          <th>Mã đọc giả</th>
          <th>Ngày mượn</th>
          <th>Ngày trả dự kiến</th>
          <th>Số ngày quá hạn</th>
          <th>Phạt</th>
          <th>Chi tiết</th>
          <th>Thao tác</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in danhSach" :key="item._id">
         <SachItemInDanhSachSach :item="item" />
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
              class="btn btn-sm btn-info"
              @click="$emit('show-detail', item)"
              title="Xem chi tiết"
            >
              <i class="bi bi-eye"></i>
            </button>
          </td>
          <td>
            <button
              v-if="!item.PhatQuaHan"
              class="btn btn-sm btn-warning me-2"
              @click="$emit('show-phat-modal', item)"
              title="Phạt quá hạn"
            >
              <i class="bi bi-currency-dollar"></i>
            </button>
            <button
              class="btn btn-sm btn-primary"
              @click="$emit('xac-nhan-tra', item._id)"
              title="Xác nhận đã trả"
            >
              <i class="bi bi-check-circle"></i>
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import type { SachMuonItem } from '../../services/tinhTrangSachMuonService';
import SachItemInDanhSachSach from "./SachItemInDanhSachSach.vue";

defineProps<{
  danhSach: SachMuonItem[];
}>();

defineEmits<{
  (e: 'show-phat-modal', item: SachMuonItem): void;
  (e: 'xac-nhan-tra', id: string): void;
  (e: 'show-detail', item: SachMuonItem): void;
}>();

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

