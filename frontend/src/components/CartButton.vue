<template>
  <button
    class="cart-button"
    @click="toggleCart"
    :class="{ 'has-items': cartCount > 0 }"
  >
    <i class="bi bi-cart3"></i>
    <span v-if="cartCount > 0" class="cart-badge">{{ cartCount }}</span>
  </button>
</template>

<script setup lang="ts">
import { useCart } from '../composables/useCart'

const { cartCount, toggleCart } = useCart()
</script>

<style scoped>
.cart-button {
  position: relative;
  background: rgba(255, 255, 255, 0.2);
  border: 2px solid rgba(255, 255, 255, 0.3);
  color: white;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 1.2rem;
}

.cart-button:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(1.1);
  border-color: rgba(255, 255, 255, 0.5);
}

.cart-button.has-items {
  animation: pulse 2s infinite;
}

.cart-badge {
  position: absolute;
  top: -5px;
  right: -5px;
  background: #dc3545;
  color: white;
  font-size: 0.7rem;
  font-weight: bold;
  min-width: 20px;
  height: 20px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 5px;
  border: 2px solid white;
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}
</style>

