<template>
  <div class="danh-sach-nha-xuat-ban">
    <div class="card shadow-sm">
      <div class="card-body">
        <!-- Search Bar -->
        <div class="search-bar mb-4">
          <div class="input-group">
            <span class="input-group-text">
              <i class="bi bi-search"></i>
            </span>
            <input
              v-model="searchQuery"
              type="text"
              class="form-control"
              placeholder="Tìm kiếm theo tên nhà xuất bản, mã NXB, địa chỉ..."
            />
          </div>
        </div>

        <!-- Loading State -->
        <div v-if="isLoading" class="text-center py-5">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Đang tải...</span>
          </div>
        </div>

        <!-- Publisher Table -->
        <div v-else-if="filteredPublishers.length > 0" class="table-responsive">
          <table class="table table-hover align-middle">
            <thead class="table-light">
              <tr>
                <th style="width: 15%">Mã NXB</th>
                <th style="width: 30%">Tên nhà xuất bản</th>
                <th style="width: 35%">Địa chỉ</th>
                <th style="width: 20%" class="text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="publisher in filteredPublishers" :key="publisher._id">
                <td>
                  <span class="badge btn-gradient">{{ publisher.MaNXB }}</span>
                </td>
                <td>
                  <strong>{{ publisher.TenNXB }}</strong>
                </td>
                <td>
                  <i class="bi bi-geo-alt me-1"></i>
                  {{ publisher.DiaChi }}
                </td>
                <td class="text-center">
                  <div class="btn-group btn-group-sm">
                    <button
                      class="btn btn-outline-primary"
                      @click="handleEdit(publisher)"
                      title="Chỉnh sửa"
                    >
                      <i class="bi bi-pencil"></i>
                      Sửa
                    </button>
                    <button
                      class="btn btn-outline-danger"
                      @click="handleDelete(publisher)"
                      title="Xóa"
                    >
                      <i class="bi bi-trash"></i>
                      Xóa
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Empty State -->
        <div v-else class="text-center py-5">
          <i class="bi bi-inbox fs-1 text-muted"></i>
          <p class="text-muted mt-2">
            {{ searchQuery ? 'Không tìm thấy nhà xuất bản phù hợp' : 'Chưa có nhà xuất bản nào' }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { nhaXuatBanService } from '../../services/nhaXuatBanService';
import type { NhaXuatBan } from '../../types/book';

const emit = defineEmits<{
  edit: [nxb: NhaXuatBan];
  refresh: [];
}>();

const publishers = ref<NhaXuatBan[]>([]);
const searchQuery = ref('');
const isLoading = ref(false);

const filteredPublishers = computed(() => {
  if (!searchQuery.value) return publishers.value;

  const query = searchQuery.value.toLowerCase();
  return publishers.value.filter(publisher =>
    publisher.TenNXB.toLowerCase().includes(query) ||
    publisher.MaNXB.toLowerCase().includes(query) ||
    publisher.DiaChi.toLowerCase().includes(query)
  );
});

onMounted(() => {
  loadPublishers();
});

const loadPublishers = async () => {
  isLoading.value = true;
  try {
    publishers.value = await nhaXuatBanService.getAllNhaXuatBan();
  } catch (error: any) {
    console.error('Error loading publishers:', error);
    alert('Không thể tải danh sách nhà xuất bản');
  } finally {
    isLoading.value = false;
  }
};

const handleEdit = (publisher: NhaXuatBan) => {
  emit('edit', publisher);
};

const handleDelete = async (publisher: NhaXuatBan) => {
  if (!confirm(`Bạn có chắc chắn muốn xóa nhà xuất bản "${publisher.TenNXB}"?`)) {
    return;
  }

  try {
    await nhaXuatBanService.deleteNhaXuatBan(publisher._id);
    alert('Xóa nhà xuất bản thành công!');
    loadPublishers();
  } catch (error: any) {
    alert(error.message || 'Không thể xóa nhà xuất bản');
  }
};
</script>

<style scoped>
.search-bar {
  max-width: 500px;
}

.input-group-text {
  background-color: white;
  border-right: none;
}

.form-control {
  border-left: none;
}

.form-control:focus {
  border-left: none;
  box-shadow: none;
}

.table {
  margin-bottom: 0;
}

.table thead th {
  font-weight: 600;
  text-transform: uppercase;
  font-size: 0.85rem;
  color: #495057;
  border-bottom: 2px solid #dee2e6;
}

.table tbody tr {
  transition: all 0.2s;
}

.table tbody tr:hover {
  background-color: #f8f9fa;
  transform: scale(1.01);
}

.btn-group-sm .btn {
  font-size: 0.875rem;
  padding: 0.25rem 0.75rem;
}

.badge {
  font-size: 0.85rem;
  font-weight: 600;
}
.btn-gradient {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  color: white;
  transition: all 0.3s;
}

.btn-gradient:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}
</style>

