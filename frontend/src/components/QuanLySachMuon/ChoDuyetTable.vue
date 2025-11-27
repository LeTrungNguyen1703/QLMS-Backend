<template>
  <div class="table-responsive">
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
        <tr v-for="item in danhSach" :key="item._id">
          <SachItemInDanhSachSach :item="item"/>
          <td>
            <button
              class="btn btn-sm btn-success me-2"
              @click="$emit('xac-nhan', item._id)"
              title="Duyệt cho mượn"
            >
              <i class="bi bi-check-lg"></i>
            </button>
            <button
              class="btn btn-sm btn-danger"
              @click="$emit('tu-choi', item._id)"
              title="Từ chối"
            >
              <i class="bi bi-x-lg"></i>
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
  (e: 'xac-nhan', id: string): void;
  (e: 'tu-choi', id: string): void;
}>();

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('vi-VN');
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

.btn-sm {
  padding: 0.375rem 0.75rem;
}
</style>

