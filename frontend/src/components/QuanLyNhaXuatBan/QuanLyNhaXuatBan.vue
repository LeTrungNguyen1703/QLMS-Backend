<template>
  <div class="quan-ly-nha-xuat-ban">
    <!-- Tab Navigation -->
    <ul class="nav nav-pills mb-4" role="tablist">
      <li class="nav-item" role="presentation">
        <button
          :class="['nav-link', activeTab === 'danh-sach' ? 'active' : '']"
          @click="activeTab = 'danh-sach'"
          type="button"
        >
          <i class="bi bi-list-ul me-1"></i>
          Danh sách nhà xuất bản
        </button>
      </li>
      <li class="nav-item" role="presentation">
        <button
          :class="['nav-link', activeTab === 'them-nxb' ? 'active' : '']"
          @click="activeTab = 'them-nxb'"
          type="button"
        >
          <i class="bi bi-plus-circle me-1"></i>
          Thêm nhà xuất bản
        </button>
      </li>
    </ul>

    <!-- Tab Content -->
    <div class="tab-content">
      <!-- Danh sách nhà xuất bản -->
      <div v-show="activeTab === 'danh-sach'">
        <DanhSachNhaXuatBan
          :key="refreshKey"
          @edit="handleEdit"
          @refresh="refreshList"
        />
      </div>

      <!-- Thêm nhà xuất bản mới -->
      <div v-show="activeTab === 'them-nxb'">
        <ThemNhaXuatBan @success="handleAddSuccess" />
      </div>
    </div>

    <!-- Edit Modal -->
    <EditNhaXuatBanModal
      :show="showEditModal"
      :nhaXuatBan="selectedNXB"
      @close="closeEditModal"
      @updated="handleUpdateSuccess"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import DanhSachNhaXuatBan from './DanhSachNhaXuatBan.vue';
import ThemNhaXuatBan from './ThemNhaXuatBan.vue';
import EditNhaXuatBanModal from './EditNhaXuatBanModal.vue';
import type { NhaXuatBan } from '../../types/book';

const activeTab = ref<'danh-sach' | 'them-nxb'>('danh-sach');
const showEditModal = ref(false);
const selectedNXB = ref<NhaXuatBan | null>(null);
const refreshKey = ref(0);

const handleEdit = (nxb: NhaXuatBan) => {
  selectedNXB.value = nxb;
  showEditModal.value = true;
};

const closeEditModal = () => {
  showEditModal.value = false;
  selectedNXB.value = null;
};

const handleAddSuccess = () => {
  activeTab.value = 'danh-sach';
  refreshList();
};

const handleUpdateSuccess = () => {
  refreshList();
};

const refreshList = () => {
  refreshKey.value++;
};
</script>

<style scoped>
.quan-ly-nha-xuat-ban {
  padding: 1rem;
}

.nav-pills .nav-link {
  color: #6c757d;
  font-weight: 600;
  border-radius: 10px;
  transition: all 0.3s;
}

.nav-pills .nav-link:hover {
  background-color: #f8f9fa;
  color: #667eea;
}

.nav-pills .nav-link.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

</style>

