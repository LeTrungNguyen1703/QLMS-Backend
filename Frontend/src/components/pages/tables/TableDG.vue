<template>
  <div class="container">
    <h1 class="text-center text-success">BẢNG THÔNG TIN ĐỌC GIẢ</h1>
    <button class="btn btn-success" @click="goCreateDG">Thêm đọc giả mới</button>
    <table class="table">
      <thead>
        <tr>
          <th scope="col">id</th>
          <th scope="col">Họ lót</th>
          <th scope="col">Tên</th>
          <th scope="col">Ngày sinh</th>
          <th scope="col">Phái</th>
          <th scope="col">Địa chỉ</th>
          <th scope="col">Số điện thoại</th>
          <th scope="col">Chức năng</th>
        </tr>
      </thead>
      <tbody v-if="docgia.length > 0">
        <tr v-for="dg in docgia" :key="dg.id">
          <td>{{ dg._id }}</td>
          <td>{{ dg.holot }}</td>
          <td>{{ dg.ten }}</td>
          <td>{{ formatDate(dg.ngaysinh) }}</td>
          <td>{{ dg.phai }}</td>
          <td>{{ dg.diachi }}</td>
          <td>{{ dg.sodienthoai }}</td>
          <td>

          </td>
        </tr>
      </tbody>
      <tbody v-else>
        <td colspan="8" class="text-center">Không có đọc giả nào tồn tại</td>
      </tbody>
    </table>
  </div>
</template>
<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";

const router = useRouter();
const docgia = ref([]);
const getallDG = async () => {
  try {
    const res = await axios.get("http://localhost:8080/api/docgia/getall-dg");
    docgia.value = res.data.data;
  } catch (error) {
    alert(
      error.response?.data?.message || "Lấy tất cả đọc giả không thành công"
    );
  }
};

const formatDate = (dateStr) => {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  return date.toLocaleDateString("vi-VN"); 
};


const goCreateDG = () => {
    router.push("/create-dg")
}
onMounted(getallDG);
</script>
