<template>
  <div class="quan-ly-sach">
    <!-- Tab Navigation -->
    <ul class="nav nav-pills mb-4" role="tablist">
      <li class="nav-item" role="presentation">
        <button
          :class="['nav-link', activeTab === 'danh-sach' ? 'active' : '']"
          @click="activeTab = 'danh-sach'"
          type="button"
        >
          <i class="bi bi-list-ul me-1"></i>
          Danh sách sách
        </button>
      </li>
      <li class="nav-item" role="presentation">
        <button
          :class="['nav-link', activeTab === 'them-sach' ? 'active' : '']"
          @click="activeTab = 'them-sach'"
          type="button"
        >
          <i class="bi bi-plus-circle me-1"></i>
          Thêm sách mới
        </button>
      </li>
    </ul>

    <!-- Tab Content -->
    <div class="tab-content">
      <!-- Danh sách sách -->
      <div v-show="activeTab === 'danh-sach'">
        <DanhSachSach @edit="handleEdit" @refresh="loadBooks" />
      </div>

      <!-- Thêm sách mới -->
      <div v-show="activeTab === 'them-sach'">
        <ThemSachMoi @success="handleAddSuccess" />
      </div>
    </div>

    <!-- Edit Book Modal -->
    <EditBookModal
      :show="showEditModal"
      :book="selectedBook"
      @close="closeEditModal"
      @updated="handleUpdateSuccess"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import DanhSachSach from './DanhSachSach.vue';
import ThemSachMoi from './ThemSachMoi.vue';
import EditBookModal from './EditBookModal.vue';

const activeTab = ref<'danh-sach' | 'them-sach'>('danh-sach');
const showEditModal = ref(false);
const selectedBook = ref<any>(null);

const handleEdit = (book: any) => {
  console.log('QuanLySach.handleEdit - Received book:', book);
  console.log('Book _id:', book._id);
  selectedBook.value = book;
  console.log('selectedBook.value set to:', selectedBook.value);
  showEditModal.value = true;
};

const closeEditModal = () => {
  showEditModal.value = false;
  selectedBook.value = null;
};

const handleAddSuccess = () => {
  activeTab.value = 'danh-sach';
  loadBooks();
};

const handleUpdateSuccess = () => {
  loadBooks();
};

const loadBooks = () => {
  // This will trigger refresh in DanhSachSach component
  if (activeTab.value === 'danh-sach') {
    window.location.reload(); // Simple refresh, or use a more elegant state management
  }
};
</script>

<style scoped>
.quan-ly-sach {
  padding: 1rem;
}

.nav-pills .nav-link {
  color: #6c757d;
  font-weight: 600;
  border-radius: 10px;
  padding: 0.75rem 1.5rem;
  transition: all 0.2s;
}

.nav-pills .nav-link:hover {
  background-color: #f8f9fa;
  color: #667eea;
}

.nav-pills .nav-link.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.tab-content {
  animation: fadeIn 0.3s ease-in;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>

