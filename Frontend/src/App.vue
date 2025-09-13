<template>
  <Header></Header>
  <div class="mt-3">
    <router-view />
  </div>
</template>

<script setup>
  import Header from './components/layout/Header.vue';
</script>
