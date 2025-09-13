<script setup>
import { useRouter } from "vue-router";

const router = useRouter();

const token = localStorage.getItem("token");

const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("_id");
  window.location.href = "/"; //chuyển trang và reload
  alert("Đăng xuất thành công");
};

const id = localStorage.getItem("_id");
</script>
<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light">
    <div class="container-fluid">
      <a class="navbar-brand" href="/Home">QLMS</a>
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="nav-item">
            <a class="nav-link active" aria-current="page" href="/table-dg">Đọc giả</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="#">Nhà xuất bản</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="#">Sách</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="#">Thời gian mượn sách</a>
          </li>
          <li class="nav-item dropdown" v-if="token">
            <a
              class="nav-link dropdown-toggle"
              href="#"
              id="navbarDropdown"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              Chức năng
            </a>
            <ul
              class="dropdown-menu"
              aria-labelledby="navbarDropdown"
              v-if="token"
            >
              <li>
                <RouterLink class="dropdown-item" :to="`/infomation-nv/${id}`">
                  Thông tin nhân viên
                </RouterLink>
              </li>
              <li><a class="dropdown-item" href="#">Nội quy nhân viên</a></li>
              <li><hr class="dropdown-divider" /></li>
              <li>
                <a class="dropdown-item" v-on:click="logout">Đăng xuất</a>
              </li>
            </ul>
          </li>
          <!-- Khi chưa login -->
          <li v-else>
            <ul class="d-flex gap-2 ms-3 list-unstyled">
              <li class="nav-item">
                <a class="nav-link" href="/register">Đăng ký</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="/">Đăng nhập</a>
              </li>
            </ul>
          </li>
        </ul>
        <form class="d-flex">
          <input
            class="form-control me-2"
            type="search"
            placeholder="Search"
            aria-label="Search"
          />
          <button class="btn btn-outline-success" type="submit">Search</button>
        </form>
      </div>
    </div>
  </nav>
</template>
