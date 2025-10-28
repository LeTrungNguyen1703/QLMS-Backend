<template>
  <div class="table-responsive">
    <table class="table table-hover">
      <thead>
      <tr>
        <th>Tên Sách</th>
        <th>Mã đọc giả</th>
        <th>Tên Đọc Giả</th>
        <th>Ngày mượn</th>
        <th>Ngày trả dự kiến</th>
        <th>Trạng thái</th>
        <th>Thao tác</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="item in danhSach" :key="item._id">
        <SachItemInDanhSachSach :item="item" />
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
              @click="$emit('xac-nhan-tra', item._id)"
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
</template>

<script setup lang="ts">
import type {SachMuonItem} from '../../services/tinhTrangSachMuonService';
import SachItemInDanhSachSach from "./SachItemInDanhSachSach.vue";

defineProps<{
  danhSach: SachMuonItem[];
}>();

defineEmits<{
  (e: 'xac-nhan-tra', id: string): void;
}>();

const isOverdue = (ngayTra: string): boolean => {
  return new Date(ngayTra).getTime() < Date.now();
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

