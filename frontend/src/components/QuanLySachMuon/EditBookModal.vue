<template>
  <Transition name="modal-fade">
    <div v-if="show" class="modal-backdrop" @click="handleClose">
      <Transition name="modal-slide">
        <div v-if="show" class="modal-dialog-custom" @click.stop>
          <div class="modal-content-custom">
            <!-- Header -->
            <div class="modal-header-custom">
              <h5 class="modal-title">
                <i class="bi bi-pencil-square me-2"></i>
                Cập nhật thông tin sách
              </h5>
              <button type="button" class="btn-close-custom" @click="handleClose">
                <i class="bi bi-x-lg"></i>
              </button>
            </div>

            <!-- Body -->
            <div class="modal-body-custom">
              <form @submit.prevent="handleSubmit">
                <!-- Book Image Preview -->
                <div class="form-group mb-3">
                  <label class="form-label">Hình ảnh sách</label>
                  <div class="image-preview-container">
                    <img
                      :src="imagePreview || book?.HinhAnh || '/placeholder-book.jpg'"
                      alt="Book preview"
                      class="image-preview"
                    />
                    <input
                      type="file"
                      class="form-control mt-2"
                      accept="image/*"
                      @change="handleImageChange"
                    />
                  </div>
                </div>

                <!-- Book Name -->
                <div class="form-group mb-3">
                  <label class="form-label">
                    Tên sách <span class="text-danger">*</span>
                  </label>
                  <input
                    v-model="formData.TenSach"
                    type="text"
                    class="form-control"
                    placeholder="Nhập tên sách"
                    required
                  />
                </div>

                <!-- Author -->
                <div class="form-group mb-3">
                  <label class="form-label">
                    Tác giả <span class="text-danger">*</span>
                  </label>
                  <input
                    v-model="formData.TacGia"
                    type="text"
                    class="form-control"
                    placeholder="Nhập tên tác giả"
                    required
                  />
                </div>

                <!-- Price and Quantity Row -->
                <div class="row mb-3">
                  <div class="col-md-6">
                    <label class="form-label">
                      Đơn giá (VNĐ) <span class="text-danger">*</span>
                    </label>
                    <input
                      v-model.number="formData.DonGia"
                      type="number"
                      class="form-control"
                      placeholder="Nhập đơn giá"
                      min="0"
                      required
                    />
                  </div>
                  <div class="col-md-6">
                    <label class="form-label">
                      Số lượng <span class="text-danger">*</span>
                    </label>
                    <input
                      v-model.number="formData.SoQuyen"
                      type="number"
                      class="form-control"
                      placeholder="Nhập số lượng"
                      min="0"
                      required
                    />
                  </div>
                </div>

                <!-- Publication Year -->
                <div class="form-group mb-3">
                  <label class="form-label">
                    Năm xuất bản <span class="text-danger">*</span>
                  </label>
                  <input
                    v-model="formData.NamXuatBan"
                    type="date"
                    class="form-control"
                    required
                  />
                </div>

                <!-- Publisher -->
                <div class="form-group mb-3">
                  <label class="form-label">
                    Nhà xuất bản <span class="text-danger">*</span>
                  </label>
                  <select
                    v-model="formData.IdNxb"
                    class="form-control"
                    required
                  >
                    <option value="">-- Chọn nhà xuất bản --</option>
                    <option v-for="nxb in publishers" :key="nxb._id" :value="nxb._id">
                      {{ nxb.TenNXB }}
                    </option>
                  </select>
                </div>

                <!-- Buttons -->
                <div class="modal-footer-custom">
                  <button
                    type="button"
                    class="btn btn-secondary"
                    @click="handleClose"
                    :disabled="isSubmitting"
                  >
                    <i class="bi bi-x-circle me-1"></i>
                    Hủy
                  </button>
                  <button
                    type="submit"
                    class="btn btn-primary"
                    :disabled="isSubmitting"
                  >
                    <span v-if="isSubmitting">
                      <span class="spinner-border spinner-border-sm me-2"></span>
                      Đang lưu...
                    </span>
                    <span v-else>
                      <i class="bi bi-check-circle me-1"></i>
                      Cập nhật
                    </span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </Transition>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import type { NhaXuatBan } from '../../types/book';
import { bookService } from '../../services/bookService';
import { apiClient } from '../../services/base-url';

interface Props {
  show: boolean;
  book: any | null;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  close: [];
  updated: [];
}>();

const formData = ref({
  TenSach: '',
  TacGia: '',
  DonGia: 0,
  SoQuyen: 0,
  NamXuatBan: '',
  IdNxb: ''
});

const imageFile = ref<File | null>(null);
const imagePreview = ref<string>('');
const isSubmitting = ref(false);
const publishers = ref<NhaXuatBan[]>([]);

// Load publishers
onMounted(async () => {
  try {
    const response = await apiClient.get('/nhaxuatban/get-all-nxb');
    publishers.value = response.data.data || [];
  } catch (error) {
    console.error('Error loading publishers:', error);
  }
});

// Watch for book changes
watch(() => props.book, (newBook) => {
  if (newBook) {
    formData.value = {
      TenSach: newBook.MaSach?.TenSach || newBook.TenSach || '',
      TacGia: newBook.MaSach?.TacGia || newBook.TacGia || '',
      DonGia: newBook.MaSach?.DonGia || newBook.DonGia || 0,
      SoQuyen: newBook.MaSach?.SoQuyen || newBook.SoQuyen || 0,
      NamXuatBan: formatDateForInput(newBook.MaSach?.NamXuatBan || newBook.NamXuatBan || ''),
      IdNxb: newBook.MaSach?.IdNxb?._id || newBook.MaSach?.IdNxb || newBook.IdNxb || ''
    };
    imagePreview.value = '';
    imageFile.value = null;
  }
}, { immediate: true });

const formatDateForInput = (dateString: string): string => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const result = date.toISOString().split('T')[0];
  return result || '';
};

const handleImageChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];

  if (file) {
    imageFile.value = file;
    const reader = new FileReader();
    reader.onload = (e) => {
      imagePreview.value = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }
};

const handleSubmit = async () => {
  if (!props.book) return;

  isSubmitting.value = true;

  try {
    const formDataToSend = new FormData();
    formDataToSend.append('TenSach', formData.value.TenSach);
    formDataToSend.append('TacGia', formData.value.TacGia);
    formDataToSend.append('DonGia', formData.value.DonGia.toString());
    formDataToSend.append('SoQuyen', formData.value.SoQuyen.toString());
    formDataToSend.append('NamXuatBan', formData.value.NamXuatBan);
    formDataToSend.append('IdNxb', formData.value.IdNxb);

    if (imageFile.value) {
      formDataToSend.append('HinhAnh', imageFile.value);
    }

    // Get the book ID
    const bookId = props.book.MaSach?._id || props.book._id;
    await bookService.updateBook(bookId, formDataToSend);

    alert('Cập nhật sách thành công!');
    emit('updated');
    handleClose();
  } catch (error: any) {
    console.error('Error updating book:', error);
    alert(error.message || 'Có lỗi xảy ra khi cập nhật sách!');
  } finally {
    isSubmitting.value = false;
  }
};

const handleClose = () => {
  if (!isSubmitting.value) {
    emit('close');
  }
};
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  backdrop-filter: blur(4px);
}

.modal-dialog-custom {
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  animation: slideDown 0.3s ease-out;
}

.modal-content-custom {
  background: white;
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.modal-header-custom {
  padding: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
}

.btn-close-custom {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #6b7280;
  cursor: pointer;
  padding: 0.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  transition: all 0.2s;
}

.btn-close-custom:hover {
  background: #f3f4f6;
  color: #1f2937;
}

.modal-body-custom {
  padding: 1.5rem;
}

.form-label {
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.5rem;
  display: block;
}

.form-control {
  width: 100%;
  padding: 0.625rem 0.875rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 0.875rem;
  transition: all 0.2s;
}

.form-control:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.image-preview-container {
  text-align: center;
}

.image-preview {
  width: 200px;
  height: 280px;
  object-fit: cover;
  border-radius: 12px;
  border: 2px solid #e5e7eb;
  margin-bottom: 1rem;
}

.modal-footer-custom {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e5e7eb;
}

.btn {
  padding: 0.625rem 1.25rem;
  border-radius: 8px;
  font-weight: 500;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-secondary {
  background: #6b7280;
  color: white;
}

.btn-secondary:hover:not(:disabled) {
  background: #4b5563;
}

.btn-primary {
  background: #3b82f6;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: #2563eb;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Animations */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-slide-enter-active {
  transition: all 0.3s ease-out;
}

.modal-slide-leave-active {
  transition: all 0.2s ease-in;
}

.modal-slide-enter-from {
  opacity: 0;
  transform: translateY(-50px);
}

.modal-slide-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-50px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>

