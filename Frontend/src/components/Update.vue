<template>
  <div class="container">
    <div v-if="users">
      <form @submit.prevent="updateInfo">
        <h1 class="text-center text-success">CẬP NHẬT THÔNG TIN</h1>
        <div class="mt-3">
          <div class="mb-3">
            <input
              type="text"
              name="hotennv"
              class="form-control w-25 d-block mx-auto"
              v-model="users.hotennv"
              placeholder="Nhập họ và tên"
            />
          </div>
          <div class="mb-3">
            <input
              type="text"
              name="diachi"
              class="form-control w-25 d-block mx-auto"
              v-model="users.diachi"
              placeholder="Nhập địa chỉ"
            />
          </div>
          <div class="mb-3">
            <input
              type="text"
              name="sodienthoai"
              class="form-control w-25 d-block mx-auto"
              v-model="users.sodienthoai"
              disabled
            />
          </div>
          <div class="mb-3">
            <input
              type="text"
              name="chucvu"
              class="form-control w-25 d-block mx-auto"
              v-model="users.chucvu"
              disabled
            />
          </div>
          <button
            class="form-control bg-success text-white text-center w-25 d-block mx-auto"
            type="submit"
          >
            Cập nhật
          </button>
        </div>
      </form>
    </div>
    <div class="mt-3" v-else>
      <p class="text-center">Đang tải....</p>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import axios from "axios";

const router = useRouter();
const route = useRoute();
const users = ref(null);

//Lấy thông tin nhân viên
const getInfo = async () => {
  try {
    const id = route.params.id;
    const res = await axios.get(
      `http://localhost:8080/api/nhanvien/get-nv/${id}`
    );
    users.value = res.data.data;
  } catch (error) {
    alert(error.response?.data?.message || "Lấy thông tin nhân viên không thành công");
  }
};
//Cập nhật nhân viên
const updateInfo = async () => {
  try {
    const id = route.params.id;
    const res = await axios.put(
      `http://localhost:8080/api/nhanvien/update-nv/${id}`,
      users.value
    );
    alert(res.data.message || "Cập nhật thông tin nhân viên thành công");
    setTimeout(() => {
        router.push(`/infomation-nv/${id}`);
    }, 500)
  } catch (error) {
    alert(error.response?.data?.message || "Cập nhật thông tin nhân viên không thành công");
  }
};

onMounted(getInfo);
</script>
