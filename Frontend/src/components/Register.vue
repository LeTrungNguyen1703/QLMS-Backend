<script setup>
    import { ref } from 'vue';
    import axios from 'axios';
    import { useRouter } from 'vue-router';

    const router = useRouter();
    const form = ref({
        sodienthoai: "",
        matkhau: "",
    });

    const register = async() => {
        try {
            const res = await axios.post("http://localhost:8080/api/nhanvien/register", form.value);
            alert( res.data.message || "Đăng ký thành công" );
            form.value.sodienthoai = "";
            form.value.matkhau = "";
            setTimeout(() => {
                router.push("/");
            }, 500);
        } catch (error) {
            alert( error.response?.data?.message || "Đăng ký không thành công" );
        }
    }
</script>

<template>
  <div class="container">
    <form @submit.prevent="register">
      <h1 class="text-success text-center">ĐĂNG KÝ</h1>
      <div>
        <div class="mb-3">
          <input
            type="text"
            v-model="form.sodienthoai"
            class="form-control w-25 d-block mx-auto"
            placeholder="Nhập số điện thoại"
          />
        </div>
        <div class="mb-3">
          <input
            type="password"
            v-model="form.matkhau"
            class="form-control w-25 d-block mx-auto"
            placeholder="Nhập mật khẩu"
          />
        </div>
        <button
          type="submit"
          class="form-control bg-success text-white text-center w-25 d-block mx-auto">
          Đăng ký
        </button>
        <p class="mt-3 text-center">Bạn đã có tài khoản? <a href="/">đăng nhập tại đây </a></p>
      </div>
    </form>
  </div>
</template>
