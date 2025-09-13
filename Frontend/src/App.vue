<template>
  <Header v-if="token"></Header>
  <div class="mt-3">
    <router-view />
  </div>
</template>

<script setup>
import { ref, provide } from "vue";
import Header from "./components/Header.vue";

const token = ref(localStorage.getItem("token"));

provide("token", token); //Truyền token xuống component
</script>
