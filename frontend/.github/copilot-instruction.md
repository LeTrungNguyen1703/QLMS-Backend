# Hướng dẫn Copilot cho giao diện component (Giao diện nhất quán như trang Login)

Mục đích: Khi tạo các component mới, dùng cùng một mẫu giao diện, cấu trúc script và style như `LoginForm.vue` để đảm bảo giao diện nhất quán cho toàn bộ frontend.

Nguyên tắc chung
- Dùng Vue 3 + Composition API với `script setup` và TypeScript: ` <script setup lang="ts">`.
- Sử dụng Bootstrap 5 cho layout & helpers (đã được import trong `main.ts`).
- Component nên là một `card` chính giữa (wrapper `.login-container`) hoặc áp dụng lại styles tương tự cho các form/chi tiết.
- Quản lý trạng thái form bằng `ref()`;
- Luôn có trạng thái `isLoading`, `errorMessage`, `successMessage` cho thao tác async.
- Sử dụng alerts Bootstrap cho thông báo lỗi/thành công.
- Kiến trúc API: gọi `authService` hoặc service tương ứng; trả về dữ liệu và lưu token vào `localStorage` nếu cần.

Checklist khi tạo component mới
- Template:
  - Wrapper có class chung: `container` / `login-container` hoặc `d-flex justify-content-center align-items-center` nếu muốn căn giữa.
  - Sử dụng `.card` với `card-body` cho nội dung chính.
  - Form bind hai-way bằng `v-model`.
  - Button chính: `.btn.btn-primary` và disable khi `isLoading`.
  - Hiển thị `errorMessage` và `successMessage` ở phía trên hoặc dưới form.

- Script:
  - `import { ref } from 'vue'`
  - Khai báo `const isLoading = ref(false)`, `const errorMessage = ref('')`, `const successMessage = ref('')`.
  - Hàm xử lý async nên có try/catch/finally để set states.
  - Sử dụng các service trong `src/services/*.ts` để gọi API.
  - Nếu component đăng nhập, mặc định `UserType` phù hợp (ví dụ `UserType.DOCGIA`).

- Style:
  - Đặt style scoped trong component nếu chỉ áp dụng cho component đó.
  - Dùng màu nền gradient, bo góc, shadow giống `LoginForm.vue` để nhất quán.

Mẫu boilerplate (dựa trên `LoginForm.vue`)

Dưới đây là mẫu chuẩn để copy/modify khi tạo trang/ảnh mới (mã đầy đủ đã sử dụng trong dự án):

---

Template mẫu (ví dụ component dạng form):

```vue
<template>
  <div class="login-container d-flex justify-content-center align-items-center">
    <div class="card p-4 shadow" style="width: 420px;">
      <div class="card-body">
        <h3 class="card-title text-center mb-3">[Tiêu đề]</h3>

        <form @submit.prevent="handleSubmit">
          <!-- Input example -->
          <div class="mb-3">
            <label class="form-label">Label</label>
            <input v-model="form.field" type="text" class="form-control" placeholder="Nhập ..." required />
          </div>

          <!-- Alerts -->
          <div v-if="errorMessage" class="alert alert-danger mt-2" role="alert">
            {{ errorMessage }}
          </div>
          <div v-if="successMessage" class="alert alert-success mt-2" role="alert">
            {{ successMessage }}
          </div>

          <div class="d-grid gap-2 mt-3">
            <button class="btn btn-primary" type="submit" :disabled="isLoading">
              <span v-if="isLoading">Đang xử lý...</span>
              <span v-else>[Hành động]</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  </div>
</template>
```

Script mẫu (pattern)

```ts
<script setup lang="ts">
import { ref } from 'vue';
// import service nếu cần, ví dụ: import { myService } from '../services/myService';

const form = ref({ field: '' });
const isLoading = ref(false);
const errorMessage = ref('');
const successMessage = ref('');

const handleSubmit = async () => {
  errorMessage.value = '';
  successMessage.value = '';
  isLoading.value = true;
  try {
    // await myService.call(form.value);
    successMessage.value = 'Thành công';
  } catch (err: any) {
    errorMessage.value = err.message || 'Lỗi';
  } finally {
    isLoading.value = false;
  }
};
</script>
```

Style mẫu (copy vào phần `<style scoped>` khi cần):

```css
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}
.card {
  border: none;
  border-radius: 15px;
}

.form-control:focus {
  border-color: #667eea;
  box-shadow: 0 0 0 0.25rem rgba(102, 126, 234, 0.25);
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  padding: 12px;
  font-weight: 600;
}
```

Lưu ý thêm
- Nếu cần icon, sử dụng `bootstrap-icons` (đã cài trong `package.json`).
- Nếu component lớn hơn, tách style chung ra `src/styles/common.css` và import trong `main.ts`.
- Giữ accessibility: thẻ `label` liên kết với input, đặt `aria-` khi cần.

Cách dùng
- Khi bạn yêu cầu Copilot tạo component mới, hãy nói rõ: "Tạo component X theo mẫu giao diện copilot-instruction" hoặc "dùng template login".
- Copilot sẽ đọc file này (`.github/copilot-instruction.md`) và cố gắng áp dụng các tiêu chuẩn khi sinh code.

---

Ví dụ nhanh (những phần quan trọng):
- Template: wrapper `.login-container` + `.card`
- Script: `script setup` + `ref` state + `handleSubmit` pattern
- Styles: gradient background, rounded card, primary button gradient

Kết thúc hướng dẫn.
