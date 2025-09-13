<script setup>
import { useRouter } from "vue-router";
import { inject } from "vue";

const token = inject("token"); //lấy token từ app.vue
const router = useRouter();

const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("_id");
  token.value = null;
  router.push("/");
  alert("Đăng xuất thành công");
};

const id = localStorage.getItem("_id");
</script>
<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light">
    <div class="container-fluid">
      <a class="navbar-brand" href="#">Navbar</a>
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
            <a class="nav-link active" aria-current="page" href="#">Home</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="#">Link</a>
          </li>
          <li class="nav-item dropdown">
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
            <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
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
