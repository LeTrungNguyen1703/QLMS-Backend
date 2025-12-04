<template>
  <!-- Modal Backdrop -->
  <Transition name="modal-fade">
    <div v-if="show" class="modal-backdrop" @click.self="handleClose">
      <Transition name="modal-slide">
        <div v-if="show" class="modal-dialog-wrapper">
          <div class="modal-content-custom">
            <!-- Modal Header -->
            <div class="modal-header-custom">
              <h5 class="modal-title">
                <i class="bi bi-pencil-square me-2"></i>
                Chỉnh sửa nhà xuất bản
              </h5>
              <button type="button" class="btn-close" @click="handleClose"></button>
            </div>

            <!-- Modal Body -->
            <div class="modal-body-custom">
              <form @submit.prevent="handleSubmit">
                <!-- Mã NXB (Read-only) -->
                <div class="mb-3">
                  <label class="form-label">Mã nhà xuất bản</label>
                  <input
                    type="text"
                    class="form-control"
                    :value="formData.MaNXB"
                    disabled
                  />
                </div>

                <!-- Tên nhà xuất bản -->
                <div class="mb-3">
                  <label for="editTenNXB" class="form-label">
                    Tên nhà xuất bản <span class="text-danger">*</span>
                  </label>
                  <input
                    id="editTenNXB"
                    v-model="formData.TenNXB"
                    type="text"
                    class="form-control"
                    placeholder="Nhập tên nhà xuất bản"
                    required
                  />
                </div>

                <!-- Địa chỉ -->
                <div class="mb-4">
                  <label for="editDiaChi" class="form-label">
                    Địa chỉ <span class="text-danger">*</span>
                  </label>
                  <textarea
                    id="editDiaChi"
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
                <div class="modal-actions">
                  <button
                    type="button"
                    class="btn btn-secondary"
                    @click="handleClose"
                    :disabled="isSubmitting"
                  >
                    <i class="bi bi-x-circle me-2"></i>
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
                      <i class="bi bi-check-circle me-2"></i>
                      Lưu thay đổi
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
import { ref, watch } from 'vue';
import { nhaXuatBanService } from '../../services/nhaXuatBanService';
import type { NhaXuatBan } from '../../types/book';

interface Props {
  show: boolean;
  nhaXuatBan: NhaXuatBan | null;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  close: [];
  updated: [];
}>();

const formData = ref({
  _id: '',
  MaNXB: '',
  TenNXB: '',
  DiaChi: ''
});

const isSubmitting = ref(false);
const errorMessage = ref('');
const successMessage = ref('');

watch(
  () => props.nhaXuatBan,
  (newVal) => {
    if (newVal) {
      formData.value = {
        _id: newVal._id,
        MaNXB: newVal.MaNXB,
        TenNXB: newVal.TenNXB,
        DiaChi: newVal.DiaChi
      };
      errorMessage.value = '';
      successMessage.value = '';
    }
  },
  { immediate: true }
);

const handleSubmit = async () => {
  errorMessage.value = '';
  successMessage.value = '';

  if (!formData.value.TenNXB.trim() || !formData.value.DiaChi.trim()) {
    errorMessage.value = 'Vui lòng điền đầy đủ thông tin';
    return;
  }

  isSubmitting.value = true;

  try {
    await nhaXuatBanService.updateNhaXuatBan(formData.value._id, {
      TenNXB: formData.value.TenNXB.trim(),
      DiaChi: formData.value.DiaChi.trim()
    });

    successMessage.value = 'Cập nhật nhà xuất bản thành công!';

    setTimeout(() => {
      emit('updated');
      handleClose();
    }, 1500);
  } catch (error: any) {
    errorMessage.value = error.message || 'Không thể cập nhật nhà xuất bản';
  } finally {
    isSubmitting.value = false;
  }
};

const handleClose = () => {
  if (!isSubmitting.value) {
    errorMessage.value = '';
    successMessage.value = '';
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
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1050;
  padding: 20px;
}

.modal-dialog-wrapper {
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-content-custom {
  background: white;
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  overflow: hidden;
}

.modal-header-custom {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-title {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
}

.btn-close {
  filter: brightness(0) invert(1);
  opacity: 0.8;
}

.btn-close:hover {
  opacity: 1;
}

.modal-body-custom {
  padding: 2rem;
}

.form-label {
  font-weight: 600;
  color: #495057;
  margin-bottom: 0.5rem;
}

.form-control:focus,
.form-select:focus {
  border-color: #667eea;
  box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.25);
}

.form-control:disabled {
  background-color: #e9ecef;
  cursor: not-allowed;
}

.modal-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 1.5rem;
}

.modal-actions .btn {
  padding: 0.5rem 1.5rem;
  font-weight: 600;
  border-radius: 8px;
  transition: all 0.3s;
}

.modal-actions .btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  color: white;
}

.modal-actions .btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}

.modal-actions .btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.alert {
  border-radius: 10px;
  border: none;
}

/* Transitions */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-slide-enter-active {
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.modal-slide-leave-active {
  transition: all 0.3s ease;
}

.modal-slide-enter-from {
  transform: translateY(-100vh);
  opacity: 0;
}

.modal-slide-leave-to {
  transform: translateY(-50px);
  opacity: 0;
}

@media (max-width: 768px) {
  .modal-dialog-wrapper {
    max-width: 95%;
  }

  .modal-body-custom {
    padding: 1.5rem;
  }
}
</style>

