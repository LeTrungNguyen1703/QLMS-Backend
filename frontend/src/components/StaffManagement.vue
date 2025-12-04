<template>
  <div class="staff-management">
    <!-- Header with actions -->
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h5 class="mb-0">
        <i class="bi bi-people-fill me-2"></i>
        Danh sách nhân viên
      </h5>
      <button class="btn btn-gradient" @click="showCreateModal = true">
        <i class="bi bi-person-plus-fill me-1"></i>
        Thêm nhân viên mới
      </button>
    </div>

    <!-- Search and Filter -->
    <div class="card shadow-sm mb-4">
      <div class="card-body">
        <div class="row g-3">
          <div class="col-md-6">
            <div class="input-group">
              <span class="input-group-text bg-white">
                <i class="bi bi-search"></i>
              </span>
              <input
                v-model="searchQuery"
                type="text"
                class="form-control"
                placeholder="Tìm kiếm theo tên, email, số điện thoại..."
                @input="filterStaff"
              />
            </div>
          </div>
          <div class="col-md-3">
            <button class="btn btn-outline-primary w-100" @click="loadStaff">
              <i class="bi bi-arrow-clockwise me-1"></i>
              Làm mới
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Đang tải...</span>
      </div>
      <p class="mt-2 text-muted">Đang tải danh sách nhân viên...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="alert alert-danger">
      <i class="bi bi-exclamation-triangle-fill me-2"></i>
      {{ error }}
    </div>

    <!-- Staff List Table -->
    <div v-else class="card shadow-sm">
      <div class="card-body p-0">
        <div class="table-responsive">
          <table class="table table-hover align-middle mb-0">
            <thead class="table-light">
              <tr>
                <th class="px-4">MSNV</th>
                <th>Họ tên</th>
                <th>Email</th>
                <th>Số điện thoại</th>
                <th>Địa chỉ</th>
                <th class="text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="filteredStaff.length === 0">
                <td colspan="6" class="text-center py-5 text-muted">
                  <i class="bi bi-inbox fs-1 d-block mb-2"></i>
                  Không có nhân viên nào
                </td>
              </tr>
              <tr v-for="staff in filteredStaff" :key="staff._id">
                <td class="px-4">
                  <span class="badge btn-gradient">{{ staff.MSNV }}</span>
                </td>
                <td>
                  <div class="fw-bold">{{ staff.HoTenNV }}</div>
                  <small class="text-muted">@{{ staff.TenTaiKhoan }}</small>
                </td>
                <td>
                  <i class="bi bi-envelope me-1 text-muted"></i>
                  {{ staff.Email }}
                </td>
                <td>
                  <i class="bi bi-phone me-1 text-muted"></i>
                  {{ staff.SoDienThoai }}
                </td>
                <td>
                  <small>{{ staff.DiaChi }}</small>
                </td>
                <td class="text-center">
                  <div class="btn-group btn-group-sm">
                    <button
                      class="btn btn-outline-info"
                      @click="viewStaff(staff)"
                      title="Xem chi tiết"
                    >
                      <i class="bi bi-eye"></i>
                    </button>
                    <button
                      class="btn btn-outline-warning"
                      @click="editStaff(staff)"
                      title="Chỉnh sửa"
                    >
                      <i class="bi bi-pencil"></i>
                    </button>
                    <button
                      class="btn btn-outline-danger"
                      @click="confirmDelete(staff)"
                      title="Xóa"
                    >
                      <i class="bi bi-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div v-if="filteredStaff.length > 0" class="card-footer bg-light">
        <small class="text-muted">
          <i class="bi bi-info-circle me-1"></i>
          Tổng số: {{ filteredStaff.length }} nhân viên
        </small>
      </div>
    </div>

    <!-- Create/Edit Modal -->
    <div
      v-if="showCreateModal || showEditModal"
      class="modal fade show d-block"
      tabindex="-1"
      style="background-color: rgba(0, 0, 0, 0.5)"
    >
      <div class="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
        <div class="modal-content">
          <div class="modal-header bg-primary text-white">
            <h5 class="modal-title">
              <i :class="showCreateModal ? 'bi bi-person-plus-fill' : 'bi bi-pencil-fill'" class="me-2"></i>
              {{ showCreateModal ? 'Thêm nhân viên mới' : 'Chỉnh sửa nhân viên' }}
            </h5>
            <button
              type="button"
              class="btn-close btn-close-white"
              @click="closeModal"
            ></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="showCreateModal ? handleCreate() : handleUpdate()">
              <!-- Họ tên -->
              <div class="mb-3">
                <label class="form-label">
                  Họ tên nhân viên <span class="text-danger">*</span>
                </label>
                <input
                  v-model="formData.HoTenNV"
                  type="text"
                  class="form-control"
                  placeholder="Nhập họ tên nhân viên"
                  required
                />
              </div>

              <!-- Tên tài khoản (only for create) -->
              <div v-if="showCreateModal" class="mb-3">
                <label class="form-label">
                  Tên tài khoản <span class="text-danger">*</span>
                </label>
                <input
                  v-model="formData.TenTaiKhoan"
                  type="text"
                  class="form-control"
                  placeholder="Nhập tên tài khoản"
                  required
                />
              </div>

              <!-- Mật khẩu (only for create) -->
              <div v-if="showCreateModal" class="mb-3">
                <label class="form-label">
                  Mật khẩu <span class="text-danger">*</span>
                </label>
                <div class="input-group">
                  <input
                    v-model="formData.MatKhau"
                    :type="showPassword ? 'text' : 'password'"
                    class="form-control"
                    placeholder="Nhập mật khẩu"
                    required
                  />
                  <button
                    type="button"
                    class="btn btn-outline-secondary"
                    @click="showPassword = !showPassword"
                  >
                    <i :class="showPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
                  </button>
                </div>
              </div>

              <!-- Email và Số điện thoại -->
              <div class="row mb-3">
                <div class="col-md-6">
                  <label class="form-label">
                    Email <span class="text-danger">*</span>
                  </label>
                  <input
                    v-model="formData.Email"
                    type="email"
                    class="form-control"
                    placeholder="Nhập email"
                    required
                  />
                </div>
                <div class="col-md-6">
                  <label class="form-label">
                    Số điện thoại <span class="text-danger">*</span>
                  </label>
                  <input
                    v-model="formData.SoDienThoai"
                    type="tel"
                    class="form-control"
                    placeholder="Nhập số điện thoại"
                    required
                  />
                </div>
              </div>

              <!-- Ngày sinh và Giới tính -->
              <div class="row mb-3">
                <div class="col-md-6">
                  <label class="form-label">
                    Ngày sinh <span class="text-danger">*</span>
                  </label>
                  <input
                    v-model="formData.NgaySinh"
                    type="date"
                    class="form-control"
                    required
                  />
                </div>
                <div class="col-md-6">
                  <label class="form-label">
                    Giới tính <span class="text-danger">*</span>
                  </label>
                  <select v-model="formData.Phai" class="form-select" required>
                    <option value="nam">Nam</option>
                    <option value="nữ">Nữ</option>
                    <option value="khác">Khác</option>
                  </select>
                </div>
              </div>

              <!-- Địa chỉ -->
              <div class="mb-3">
                <label class="form-label">
                  Địa chỉ <span class="text-danger">*</span>
                </label>
                <textarea
                  v-model="formData.DiaChi"
                  class="form-control"
                  placeholder="Nhập địa chỉ"
                  rows="2"
                  required
                ></textarea>
              </div>

              <!-- Chức vụ (only for create) -->
              <div v-if="showCreateModal" class="mb-3">
                <label class="form-label">Chức vụ</label>
                <select v-model="formData.ChucVu" class="form-select">
                  <option value="NHAN_VIEN">Nhân viên</option>
                  <option value="QUAN_LY">Quản lý</option>
                </select>
              </div>

              <!-- Alert Messages -->
              <div v-if="formError" class="alert alert-danger">
                <i class="bi bi-exclamation-triangle-fill me-2"></i>
                {{ formError }}
              </div>
              <div v-if="formSuccess" class="alert alert-success">
                <i class="bi bi-check-circle-fill me-2"></i>
                {{ formSuccess }}
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              @click="closeModal"
              :disabled="formLoading"
            >
              Hủy
            </button>
            <button
              type="button"
              class="btn btn-primary"
              @click="showCreateModal ? handleCreate() : handleUpdate()"
              :disabled="formLoading"
            >
              <span v-if="formLoading">
                <span class="spinner-border spinner-border-sm me-2"></span>
                Đang xử lý...
              </span>
              <span v-else>
                <i :class="showCreateModal ? 'bi bi-check-lg' : 'bi bi-save'" class="me-1"></i>
                {{ showCreateModal ? 'Thêm nhân viên' : 'Cập nhật' }}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- View Detail Modal -->
    <div
      v-if="showViewModal && selectedStaff"
      class="modal fade show d-block"
      tabindex="-1"
      style="background-color: rgba(0, 0, 0, 0.5)"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header btn-gradient text-white">
            <h5 class="modal-title">
              <i class="bi bi-person-circle me-2"></i>
              Chi tiết nhân viên
            </h5>
            <button
              type="button"
              class="btn-close btn-close-white"
              @click="showViewModal = false"
            ></button>
          </div>
          <div class="modal-body">
            <div class="row g-3">
              <div class="col-12">
                <div class="d-flex align-items-center mb-3">
                  <div class="avatar-circle bg-primary text-white me-3">
                    {{ getInitials(selectedStaff.HoTenNV) }}
                  </div>
                  <div>
                    <h5 class="mb-0">{{ selectedStaff.HoTenNV }}</h5>
                    <small class="text-muted">@{{ selectedStaff.TenTaiKhoan }}</small>
                  </div>
                </div>
              </div>
              <div class="col-12">
                <hr />
              </div>
              <div class="col-6">
                <small class="text-muted d-block">MSNV</small>
                <strong>{{ selectedStaff.MSNV }}</strong>
              </div>
              <div class="col-6">
                <small class="text-muted d-block">Email</small>
                <strong>{{ selectedStaff.Email }}</strong>
              </div>
              <div class="col-6">
                <small class="text-muted d-block">Số điện thoại</small>
                <strong>{{ selectedStaff.SoDienThoai }}</strong>
              </div>
              <div class="col-6">
                <small class="text-muted d-block">Giới tính</small>
                <strong>{{ selectedStaff.Phai || 'Chưa cập nhật' }}</strong>
              </div>
              <div class="col-12">
                <small class="text-muted d-block">Địa chỉ</small>
                <strong>{{ selectedStaff.DiaChi }}</strong>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              @click="showViewModal = false"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div
      v-if="showDeleteModal && selectedStaff"
      class="modal fade show d-block"
      tabindex="-1"
      style="background-color: rgba(0, 0, 0, 0.5)"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header bg-danger text-white">
            <h5 class="modal-title">
              <i class="bi bi-exclamation-triangle-fill me-2"></i>
              Xác nhận xóa
            </h5>
            <button
              type="button"
              class="btn-close btn-close-white"
              @click="showDeleteModal = false"
            ></button>
          </div>
          <div class="modal-body">
            <p>Bạn có chắc chắn muốn xóa nhân viên <strong>{{ selectedStaff.HoTenNV }}</strong>?</p>
            <p class="text-danger mb-0">
              <i class="bi bi-info-circle me-1"></i>
              Hành động này không thể hoàn tác!
            </p>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              @click="showDeleteModal = false"
              :disabled="deleteLoading"
            >
              Hủy
            </button>
            <button
              type="button"
              class="btn btn-danger"
              @click="handleDelete"
              :disabled="deleteLoading"
            >
              <span v-if="deleteLoading">
                <span class="spinner-border spinner-border-sm me-2"></span>
                Đang xóa...
              </span>
              <span v-else>
                <i class="bi bi-trash me-1"></i>
                Xóa nhân viên
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { nhanVienService, type NhanVien, type CreateNhanVienRequest, type UpdateNhanVienRequest } from '../services/nhanVienService';

// State
const staffList = ref<NhanVien[]>([]);
const filteredStaff = ref<NhanVien[]>([]);
const searchQuery = ref('');
const loading = ref(false);
const error = ref('');

// Modal states
const showCreateModal = ref(false);
const showEditModal = ref(false);
const showViewModal = ref(false);
const showDeleteModal = ref(false);
const selectedStaff = ref<NhanVien | null>(null);

// Form states
const formData = ref<any>({
  HoTenNV: '',
  TenTaiKhoan: '',
  MatKhau: '',
  NgaySinh: '',
  Phai: 'nam',
  DiaChi: '',
  SoDienThoai: '',
  Email: '',
  ChucVu: 'NHAN_VIEN'
});

const showPassword = ref(false);
const formLoading = ref(false);
const formError = ref('');
const formSuccess = ref('');
const deleteLoading = ref(false);

// Load staff list
const loadStaff = async () => {
  loading.value = true;
  error.value = '';
  try {
    staffList.value = await nhanVienService.getAllNhanVien();
    filteredStaff.value = staffList.value;
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Không thể tải danh sách nhân viên';
    console.error('Error loading staff:', err);
  } finally {
    loading.value = false;
  }
};

// Filter staff
const filterStaff = () => {
  const query = searchQuery.value.toLowerCase().trim();
  if (!query) {
    filteredStaff.value = staffList.value;
    return;
  }

  filteredStaff.value = staffList.value.filter(
    (staff) =>
      staff.HoTenNV.toLowerCase().includes(query) ||
      staff.Email.toLowerCase().includes(query) ||
      staff.SoDienThoai.includes(query) ||
      staff.TenTaiKhoan.toLowerCase().includes(query) ||
      staff.MSNV.toLowerCase().includes(query)
  );
};

// View staff details
const viewStaff = (staff: NhanVien) => {
  selectedStaff.value = staff;
  showViewModal.value = true;
};

// Edit staff
const editStaff = (staff: NhanVien) => {
  selectedStaff.value = staff;
  formData.value = {
    HoTenNV: staff.HoTenNV,
    DiaChi: staff.DiaChi,
    SoDienThoai: staff.SoDienThoai,
    Email: staff.Email,
    NgaySinh: staff.NgaySinh || '',
    Phai: staff.Phai || 'nam',
    TenTaiKhoan: '',
    MatKhau: '',
    ChucVu: 'NHAN_VIEN'
  };
  showEditModal.value = true;
};

// Confirm delete
const confirmDelete = (staff: NhanVien) => {
  selectedStaff.value = staff;
  showDeleteModal.value = true;
};

// Handle create
const handleCreate = async () => {
  formError.value = '';
  formSuccess.value = '';
  formLoading.value = true;

  try {
    const createData: CreateNhanVienRequest = {
      HoTenNV: formData.value.HoTenNV,
      TenTaiKhoan: formData.value.TenTaiKhoan,
      MatKhau: formData.value.MatKhau,
      NgaySinh: formData.value.NgaySinh,
      Phai: formData.value.Phai,
      DiaChi: formData.value.DiaChi,
      SoDienThoai: formData.value.SoDienThoai,
      Email: formData.value.Email,
      ChucVu: formData.value.ChucVu || 'NHAN_VIEN'
    };

    await nhanVienService.createNhanVien(createData);
    formSuccess.value = 'Thêm nhân viên thành công!';

    setTimeout(async () => {
      await loadStaff();
      closeModal();
    }, 1500);
  } catch (err: any) {
    formError.value = err.response?.data?.message || 'Thêm nhân viên thất bại';
    console.error('Error creating staff:', err);
  } finally {
    formLoading.value = false;
  }
};

// Handle update
const handleUpdate = async () => {
  if (!selectedStaff.value) return;

  formError.value = '';
  formSuccess.value = '';
  formLoading.value = true;

  try {
    const updateData: UpdateNhanVienRequest = {
      HoTenNV: formData.value.HoTenNV,
      DiaChi: formData.value.DiaChi,
      SoDienThoai: formData.value.SoDienThoai,
      Email: formData.value.Email,
      NgaySinh: formData.value.NgaySinh,
      Phai: formData.value.Phai
    };

    await nhanVienService.updateNhanVien(selectedStaff.value._id, updateData);
    formSuccess.value = 'Cập nhật nhân viên thành công!';

    setTimeout(async () => {
      await loadStaff();
      closeModal();
    }, 1500);
  } catch (err: any) {
    formError.value = err.response?.data?.message || 'Cập nhật nhân viên thất bại';
    console.error('Error updating staff:', err);
  } finally {
    formLoading.value = false;
  }
};

// Handle delete
const handleDelete = async () => {
  if (!selectedStaff.value) return;

  deleteLoading.value = true;
  try {
    await nhanVienService.deleteNhanVien(selectedStaff.value._id);
    await loadStaff();
    showDeleteModal.value = false;
  } catch (err: any) {
    alert(err.response?.data?.message || 'Xóa nhân viên thất bại');
    console.error('Error deleting staff:', err);
  } finally {
    deleteLoading.value = false;
  }
};

// Close modal and reset form
const closeModal = () => {
  showCreateModal.value = false;
  showEditModal.value = false;
  formData.value = {
    HoTenNV: '',
    TenTaiKhoan: '',
    MatKhau: '',
    NgaySinh: '',
    Phai: 'nam',
    DiaChi: '',
    SoDienThoai: '',
    Email: '',
    ChucVu: 'NHAN_VIEN'
  };
  formError.value = '';
  formSuccess.value = '';
  showPassword.value = false;
  selectedStaff.value = null;
};

// Get initials for avatar
const getInitials = (name: string): string => {
  if (!name) return '??';
  const words = name.split(' ').filter(word => word.length > 0);
  if (words.length >= 2) {
    const firstChar = words[0]?.[0];
    const lastChar = words[words.length - 1]?.[0];
    if (firstChar && lastChar) {
      return (firstChar + lastChar).toUpperCase();
    }
  }
  return name.substring(0, 2).toUpperCase();
};

// Load staff on mount
onMounted(() => {
  loadStaff();
});
</script>

<style scoped>
.staff-management {
  padding: 1rem;
}

.card {
  border: none;
  border-radius: 12px;
}

.table {
  font-size: 0.9rem;
}

.table thead th {
  font-weight: 600;
  color: #344767;
  border-bottom: 2px solid #dee2e6;
  padding: 1rem;
}

.table tbody td {
  padding: 1rem;
  vertical-align: middle;
}

.table-hover tbody tr:hover {
  background-color: rgba(102, 126, 234, 0.05);
}

.btn-group-sm .btn {
  padding: 0.25rem 0.5rem;
  font-size: 0.875rem;
}

.modal.show {
  display: block;
}

.modal-content {
  border: none;
  border-radius: 12px;
  overflow: hidden;
}

.modal-header {
  padding: 1.25rem 1.5rem;
}

.modal-body {
  padding: 1.5rem;
}

.form-label {
  font-weight: 600;
  color: #344767;
  margin-bottom: 0.5rem;
}

.form-control,
.form-select {
  border-radius: 8px;
  border: 1px solid #d2d6da;
  padding: 0.625rem 0.875rem;
  transition: all 0.2s;
}

.form-control:focus,
.form-select:focus {
  border-color: #667eea;
  box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.15);
}

.avatar-circle {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: bold;
}

.badge {
  padding: 0.4rem 0.8rem;
  font-weight: 600;
  font-size: 0.75rem;
}

.shadow-sm {
  box-shadow: 0 0.125rem 0.5rem rgba(0, 0, 0, 0.08) !important;
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

