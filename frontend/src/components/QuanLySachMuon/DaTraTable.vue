<template>
  <div class="table-responsive">
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
        <tr v-for="item in danhSach" :key="item._id">
          <SachItemInDanhSachSach :item="item" />
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
</template>

<script setup lang="ts">
import type { SachMuonItem } from '../../services/tinhTrangSachMuonService';
import SachItemInDanhSachSach from "./SachItemInDanhSachSach.vue";

defineProps<{
  danhSach: SachMuonItem[];
}>();

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
</style>

