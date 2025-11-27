<template>
  <div class="them-sach-moi">
    <div class="card shadow-sm">
      <div class="card-body">
        <form @submit.prevent="handleSubmit">
          <!-- Tên sách -->
          <div class="mb-3">
            <label class="form-label">Tên sách <span class="text-danger">*</span></label>
            <input
              v-model="bookForm.TenSach"
              type="text"
              class="form-control"
              placeholder="Nhập tên sách"
              required
            />
          </div>

          <!-- Tác giả -->
          <div class="mb-3">
            <label class="form-label">Tác giả <span class="text-danger">*</span></label>
            <input
              v-model="bookForm.TacGia"
              type="text"
              class="form-control"
              placeholder="Nhập tên tác giả"
              required
            />
          </div>

          <!-- Đơn giá và Số quyển -->
          <div class="row mb-3">
            <div class="col-md-6">
              <label class="form-label">Đơn giá (VNĐ) <span class="text-danger">*</span></label>
              <input
                v-model.number="bookForm.DonGia"
                type="number"
                class="form-control"
                placeholder="Nhập đơn giá"
                min="0"
                step="1000"
                required
              />
            </div>
            <div class="col-md-6">
              <label class="form-label">Số lượng <span class="text-danger">*</span></label>
              <input
                v-model.number="bookForm.SoQuyen"
                type="number"
                class="form-control"
                placeholder="Nhập số lượng"
                min="1"
                required
              />
            </div>
          </div>

          <!-- Năm xuất bản và Nhà xuất bản -->
          <div class="row mb-3">
            <div class="col-md-6">
              <label class="form-label">Năm xuất bản <span class="text-danger">*</span></label>
              <input
                v-model="bookForm.NamXuatBan"
                type="date"
                class="form-control"
                required
              />
            </div>
            <div class="col-md-6">
              <label class="form-label">Nhà xuất bản <span class="text-danger">*</span></label>
              <select v-model="bookForm.IdNxb" class="form-select" required>
                <option value="">-- Chọn nhà xuất bản --</option>
                <option v-for="nxb in nhaXuatBanList" :key="nxb._id" :value="nxb._id">
                  {{ nxb.TenNXB }}
                </option>
              </select>
            </div>
          </div>

          <!-- Hình ảnh -->
          <div class="mb-3">
            <label class="form-label">Hình ảnh sách</label>
            <input
              type="file"
              class="form-control"
              accept="image/*"
              @change="handleFileChange"
            />
            <small class="text-muted">Chỉ chấp nhận file ảnh (JPG, PNG, GIF), tối đa 2MB</small>

            <!-- Preview hình ảnh -->
            <div v-if="imagePreview" class="mt-3 text-center">
              <img :src="imagePreview" alt="Preview" class="img-preview" />
            </div>
          </div>

          <!-- Alerts -->
          <div v-if="errorMessage" class="alert alert-danger" role="alert">
            <i class="bi bi-exclamation-triangle-fill me-2"></i>
            {{ errorMessage }}
          </div>
          <div v-if="successMessage" class="alert alert-success" role="alert">
            <i class="bi bi-check-circle-fill me-2"></i>
            {{ successMessage }}
          </div>

          <!-- Buttons -->
          <div class="d-flex gap-2 mt-4">
            <button class="btn btn-primary flex-grow-1" type="submit" :disabled="isLoading">
              <span v-if="isLoading">
                <span class="spinner-border spinner-border-sm me-2"></span>
                Đang thêm...
              </span>
              <span v-else>
                <i class="bi bi-check-lg me-1"></i>
                Thêm sách
              </span>
            </button>
            <button class="btn btn-outline-secondary" type="button" @click="resetForm">
              <i class="bi bi-arrow-clockwise me-1"></i>
              Làm mới
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { bookService } from '../../services/bookService';
import { nhaXuatBanService } from '../../services/nhaXuatBanService';
import type { NhaXuatBan } from '../../types/book';

const emit = defineEmits<{
  success: [];
}>();

interface BookFormData {
  TenSach: string;
  TacGia: string;
  DonGia: number;
  SoQuyen: number;
  NamXuatBan: string;
  IdNxb: string;
}

const bookForm = ref<BookFormData>({
  TenSach: '',
  TacGia: '',
  DonGia: 0,
  SoQuyen: 1,
  NamXuatBan: '',
  IdNxb: ''
});

const selectedFile = ref<File | null>(null);
const imagePreview = ref<string>('');
const nhaXuatBanList = ref<NhaXuatBan[]>([]);
const isLoading = ref(false);
const errorMessage = ref('');
const successMessage = ref('');

onMounted(async () => {
  try {
    nhaXuatBanList.value = await nhaXuatBanService.getAllNhaXuatBan();
  } catch (error: any) {
    errorMessage.value = error.message || 'Không thể tải danh sách nhà xuất bản';
  }
});

const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];

  if (file) {
    if (file.size > 2 * 1024 * 1024) {
      errorMessage.value = 'Kích thước file không được vượt quá 2MB';
      target.value = '';
      return;
    }

    if (!file.type.startsWith('image/')) {
      errorMessage.value = 'Chỉ chấp nhận file hình ảnh';
      target.value = '';
      return;
    }

    selectedFile.value = file;
    errorMessage.value = '';

    const reader = new FileReader();
    reader.onload = (e) => {
      imagePreview.value = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }
};

const handleSubmit = async () => {
  errorMessage.value = '';
  successMessage.value = '';
  isLoading.value = true;

  try {
    const formData = new FormData();
    formData.append('TenSach', bookForm.value.TenSach);
    formData.append('TacGia', bookForm.value.TacGia);
    formData.append('DonGia', bookForm.value.DonGia.toString());
    formData.append('SoQuyen', bookForm.value.SoQuyen.toString());
    formData.append('NamXuatBan', bookForm.value.NamXuatBan);
    formData.append('IdNxb', bookForm.value.IdNxb);

    if (selectedFile.value) {
      formData.append('HinhAnh', selectedFile.value);
    }

    await bookService.createBook(formData);
    successMessage.value = 'Thêm sách thành công!';

    setTimeout(() => {
      resetForm();
      successMessage.value = '';
      emit('success');
    }, 1500);
  } catch (error: any) {
    errorMessage.value = error.message || 'Thêm sách thất bại. Vui lòng thử lại!';
  } finally {
    isLoading.value = false;
  }
};

const resetForm = () => {
  bookForm.value = {
    TenSach: '',
    TacGia: '',
    DonGia: 0,
    SoQuyen: 1,
    NamXuatBan: '',
    IdNxb: ''
  };
  selectedFile.value = null;
  imagePreview.value = '';
  errorMessage.value = '';
  successMessage.value = '';

  const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
  if (fileInput) {
    fileInput.value = '';
  }
};
</script>

<style scoped>
.them-sach-moi {
  max-width: 800px;
  margin: 0 auto;
}

.card {
  border: none;
  border-radius: 12px;
}

.bg-gradient {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1.25rem 1.5rem;
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

.img-preview {
  max-width: 250px;
  max-height: 350px;
  border-radius: 8px;
  border: 2px solid #d2d6da;
  object-fit: cover;
}

.btn {
  border-radius: 8px;
  padding: 0.625rem 1.25rem;
  font-weight: 600;
  transition: all 0.2s;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.btn-outline-secondary {
  border-color: #d2d6da;
  color: #344767;
}

.btn-outline-secondary:hover {
  background-color: #f8f9fa;
  border-color: #d2d6da;
  color: #344767;
}

.alert {
  border-radius: 8px;
  border: none;
}

.text-danger {
  color: #ea0606 !important;
}
</style>

