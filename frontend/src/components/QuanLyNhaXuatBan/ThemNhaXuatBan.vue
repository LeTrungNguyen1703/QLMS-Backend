<template>
  <div class="them-nha-xuat-ban">
    <div class="card shadow-sm">
      <div class="card-header bg-gradient text-white">
        <h5 class="mb-0">
          <i class="bi bi-plus-circle me-2"></i>
          Thêm nhà xuất bản mới
        </h5>
      </div>
      <div class="card-body">
        <form @submit.prevent="handleSubmit">
          <!-- Tên nhà xuất bản -->
          <div class="mb-3">
            <label for="tenNXB" class="form-label">
              Tên nhà xuất bản <span class="text-danger">*</span>
            </label>
            <input
              id="tenNXB"
              v-model="formData.TenNXB"
              type="text"
              class="form-control"
              placeholder="Nhập tên nhà xuất bản"
              required
            />
          </div>

          <!-- Địa chỉ -->
          <div class="mb-4">
            <label for="diaChi" class="form-label">
              Địa chỉ <span class="text-danger">*</span>
            </label>
            <textarea
              id="diaChi"
              v-model="formData.DiaChi"
              class="form-control"
              rows="3"
              placeholder="Nhập địa chỉ nhà xuất bản"
              required
            ></textarea>
          </div>

          <!-- Error Message -->
          <div v-if="errorMessage" class="alert alert-danger">
            <i class="bi bi-exclamation-triangle me-2"></i>
            {{ errorMessage }}
          </div>

          <!-- Success Message -->
          <div v-if="successMessage" class="alert alert-success">
            <i class="bi bi-check-circle me-2"></i>
            {{ successMessage }}
          </div>

          <!-- Buttons -->
          <div class="d-flex gap-2">
            <button
              type="submit"
              class="btn btn-gradient"
              :disabled="isSubmitting"
            >
              <span v-if="isSubmitting">
                <span class="spinner-border spinner-border-sm me-2"></span>
                Đang thêm...
              </span>
              <span v-else>
                <i class="bi bi-plus-circle me-2"></i>
                Thêm nhà xuất bản
              </span>
            </button>
            <button
              type="button"
              class="btn btn-secondary"
              @click="resetForm"
              :disabled="isSubmitting"
            >
              <i class="bi bi-arrow-clockwise me-2"></i>
              Làm mới
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { nhaXuatBanService } from '../../services/nhaXuatBanService';

const emit = defineEmits<{
  success: [];
}>();

const formData = ref({
  TenNXB: '',
  DiaChi: ''
});

const isSubmitting = ref(false);
const errorMessage = ref('');
const successMessage = ref('');

const handleSubmit = async () => {
  errorMessage.value = '';
  successMessage.value = '';

  if (!formData.value.TenNXB.trim() || !formData.value.DiaChi.trim()) {
    errorMessage.value = 'Vui lòng điền đầy đủ thông tin';
    return;
  }

  isSubmitting.value = true;

  try {
    await nhaXuatBanService.createNhaXuatBan({
      TenNXB: formData.value.TenNXB.trim(),
      DiaChi: formData.value.DiaChi.trim()
    });

    successMessage.value = 'Thêm nhà xuất bản thành công!';
    resetForm();

    setTimeout(() => {
      emit('success');
    }, 1500);
  } catch (error: any) {
    errorMessage.value = error.message || 'Không thể thêm nhà xuất bản';
  } finally {
    isSubmitting.value = false;
  }
};

const resetForm = () => {
  formData.value = {
    TenNXB: '',
    DiaChi: ''
  };
  errorMessage.value = '';
  successMessage.value = '';
};
</script>

<style scoped>
.card {
  border: none;
  border-radius: 12px;
}

.bg-gradient {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.form-label {
  font-weight: 600;
  color: #495057;
}

.form-control:focus,
.form-select:focus {
  border-color: #667eea;
  box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.25);
}

.btn-gradient {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  color: white;
  font-weight: 600;
  transition: all 0.3s;
}

.btn-gradient:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}

.btn-gradient:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.alert {
  border-radius: 10px;
  border: none;
}
</style>

