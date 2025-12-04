<template>
  <div class="container mt-5">
    <div class="card shadow">
      <div class="card-header btn-gradient text-white">
        <h4 class="mb-0">
          <i class="bi bi-briefcase me-2"></i>
          Dashboard Nhân viên
        </h4>
      </div>
      <div class="card-body">

        <h5>Thông tin tài khoản</h5>
        <ul class="list-unstyled">
          <li><strong>Tên:</strong> {{ userInfo.userName }}</li>
          <li><strong>Email:</strong> {{ userInfo.email }}</li>
        </ul>

        <!-- Tab Navigation -->
        <ul class="nav nav-tabs mt-4" role="tablist">
          <li class="nav-item" role="presentation">
            <button
                :class="['nav-link', activeTab === 'functions' ? 'active' : '']"
                @click="activeTab = 'functions'"
                type="button"
            >
              <i class="bi bi-grid-3x3-gap me-1"></i>
              Chức năng
            </button>
          </li>
        </ul>

        <!-- Tab Content -->
        <div class="tab-content mt-4">
          <!-- Functions Tab -->
          <div v-show="activeTab === 'functions'">
            <h5>Chức năng quản lý</h5>
            <div class="row g-3">
              <div class="col-md-4">
                <div class="card feature-card" @click="activeTab = 'them-sach'">
                  <div class="card-body text-center">
                    <i class="bi bi-book-half fs-1 text-success"></i>
                    <h6 class="mt-2">Quản lý sách</h6>
                  </div>
                </div>
              </div>
              <div class="col-md-4">
                <div class="card feature-card" @click="activeTab = 'muon-tra'">
                  <div class="card-body text-center">
                    <i class="bi bi-arrow-left-right fs-1 text-warning"></i>
                    <h6 class="mt-2">Mượn/Trả sách</h6>
                  </div>
                </div>
              </div>
              <div class="col-md-4">
                <div class="card feature-card" @click="activeTab = 'nha-xuat-ban'">
                  <div class="card-body text-center">
                    <i class="bi bi-building fs-1 text-info"></i>
                    <h6 class="mt-2">Quản lý Nhà xuất bản</h6>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Quản lý sách Tab -->
          <div v-show="activeTab === 'them-sach'">
            <QuanLySach/>
          </div>

          <!-- Quản lý mượn trả sách Tab -->
          <div v-show="activeTab === 'muon-tra'">
            <QuanLySachMuon/>
          </div>

          <!-- Quản lý nhà xuất bản Tab -->
          <div v-show="activeTab === 'nha-xuat-ban'">
            <QuanLyNhaXuatBan/>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref, onMounted} from 'vue'
import {useRouter} from 'vue-router'
import {authService} from '../../services/authService'
import QuanLySach from "../../components/QuanLySach/QuanLySach.vue";
import QuanLySachMuon from "../../components/QuanLySachMuon/QuanLySachMuon.vue";
import QuanLyNhaXuatBan from "../../components/QuanLyNhaXuatBan/QuanLyNhaXuatBan.vue";

const router = useRouter()
const activeTab = ref<'functions' | 'muon-tra' | 'them-sach' | 'nha-xuat-ban'>('functions')
const userInfo = ref({
  userName: '',
  email: '',
  userType: ''
})

onMounted(async () => {
  try {
    const info = await authService.getCurrentUser()
    if (info && info.email) {
      userInfo.value = {
        userName: info.userName,
        email: info.email,
        userType: info.role || ''
      }
    } else {
      // Nếu chưa đăng nhập, redirect về login
      router.push('/auth/login')
    }
  } catch (error) {
    console.error('Error fetching user info:', error)
    router.push('/auth/login')
  }
})
</script>

<style scoped>
.card {
  border: none;
  border-radius: 10px;
}

.feature-card {
  transition: all 0.3s ease;
  cursor: pointer;
}

.feature-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.nav-tabs {
  border-bottom: 2px solid #e9ecef;
}

.nav-tabs .nav-link {
  border: none;
  color: #6c757d;
  font-weight: 600;
  padding: 0.75rem 1.5rem;
  transition: all 0.2s;
}

.nav-tabs .nav-link:hover {
  color: #667eea;
  border-color: transparent;
}

.nav-tabs .nav-link.active {
  color: #667eea;
  border-bottom: 3px solid #667eea;
  background: transparent;
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
