<template>
  <div class="welcome-page" :class="{ 'transitioning': isTransitioning }">
    <!-- Animated background with floating books -->
    <div class="floating-books">
      <div v-for="i in 15" :key="i" :class="'book book-' + i">📚</div>
    </div>

    <!-- Main content -->
    <div class="welcome-content">
      <div class="logo-container">
        <div class="book-logo">
          <div class="book-spine"></div>
          <div class="book-cover">
            <div class="book-title">Books</div>
          </div>
        </div>
      </div>

      <h1 class="welcome-title">
        <span class="title-line">Chào mừng đến với</span>
        <span class="title-highlight">Hệ Thống Quản Lý Thư Viện</span>
      </h1>

      <p class="welcome-subtitle">
        Khám phá thế giới tri thức với hàng ngàn đầu sách phong phú
      </p>

      <div class="features-preview">
        <div class="feature-item">
          <i class="bi bi-book"></i>
          <span>Kho sách đa dạng</span>
        </div>
        <div class="feature-item">
          <i class="bi bi-search"></i>
          <span>Tìm kiếm dễ dàng</span>
        </div>
        <div class="feature-item">
          <i class="bi bi-clock-history"></i>
          <span>Quản lý mượn trả</span>
        </div>
      </div>

      <div class="action-buttons">
        <button
          class="btn btn-action btn-login"
          @click="goToLogin"
        >
          <i class="bi bi-box-arrow-in-right me-2"></i>
          <span>Đăng nhập</span>
        </button>
        <button
          class="btn btn-action btn-register"
          @click="goToRegister"
        >
          <i class="bi bi-person-plus me-2"></i>
          <span>Đăng ký tài khoản</span>
        </button>
      </div>

      <div class="text-center mt-4">
        <button
          class="btn btn-link text-white text-decoration-none"
          @click="goToSearchBooks"
        >
          <i class="bi bi-search me-2"></i>
          Hoặc duyệt sách mà không cần đăng nhập
        </button>
      </div>
    </div>

    <!-- Decorative elements -->
    <div class="decorative-circle circle-1"></div>
    <div class="decorative-circle circle-2"></div>
    <div class="decorative-circle circle-3"></div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { ref } from 'vue';

const router = useRouter();
const isTransitioning = ref(false);

const goToLogin = () => {
  isTransitioning.value = true;
  setTimeout(() => {
    router.push('/login');
  }, 600);
};

const goToRegister = () => {
  isTransitioning.value = true;
  setTimeout(() => {
    router.push('/register');
  }, 600);
};

const goToSearchBooks = () => {
  isTransitioning.value = true;
  setTimeout(() => {
    router.push('/docgia/search-books');
  }, 600);
};
</script>

<style scoped>
.welcome-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  position: relative;
  overflow: hidden;
}

/* Floating books animation */
.floating-books {
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: 1;
}

.book {
  position: absolute;
  font-size: 2rem;
  opacity: 0.15;
  animation: float linear infinite;
}

@keyframes float {
  0% {
    transform: translateY(100vh) rotate(0deg);
  }
  100% {
    transform: translateY(-100vh) rotate(360deg);
  }
}

.book-1 { left: 5%; animation-duration: 20s; animation-delay: 0s; }
.book-2 { left: 15%; animation-duration: 25s; animation-delay: 2s; }
.book-3 { left: 25%; animation-duration: 22s; animation-delay: 4s; }
.book-4 { left: 35%; animation-duration: 28s; animation-delay: 1s; }
.book-5 { left: 45%; animation-duration: 24s; animation-delay: 3s; }
.book-6 { left: 55%; animation-duration: 26s; animation-delay: 5s; }
.book-7 { left: 65%; animation-duration: 23s; animation-delay: 2s; }
.book-8 { left: 75%; animation-duration: 27s; animation-delay: 4s; }
.book-9 { left: 85%; animation-duration: 21s; animation-delay: 1s; }
.book-10 { left: 10%; animation-duration: 29s; animation-delay: 3s; }
.book-11 { left: 30%; animation-duration: 24s; animation-delay: 5s; }
.book-12 { left: 50%; animation-duration: 26s; animation-delay: 2s; }
.book-13 { left: 70%; animation-duration: 22s; animation-delay: 4s; }
.book-14 { left: 90%; animation-duration: 25s; animation-delay: 1s; }
.book-15 { left: 20%; animation-duration: 27s; animation-delay: 3s; }

/* Decorative circles */
.decorative-circle {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  animation: pulse 4s ease-in-out infinite;
}

.circle-1 {
  width: 300px;
  height: 300px;
  top: -100px;
  left: -100px;
  animation-delay: 0s;
}

.circle-2 {
  width: 200px;
  height: 200px;
  bottom: -50px;
  right: -50px;
  animation-delay: 1s;
}

.circle-3 {
  width: 150px;
  height: 150px;
  top: 50%;
  right: 10%;
  animation-delay: 2s;
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
    opacity: 0.1;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.2;
  }
}

/* Main content */
.welcome-content {
  position: relative;
  z-index: 2;
  text-align: center;
  padding: 2rem;
  max-width: 800px;
  animation: fadeInUp 1s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Book logo */
.logo-container {
  margin-bottom: 2rem;
  animation: fadeInUp 1s ease-out 0.2s both;
}

.book-logo {
  display: inline-block;
  position: relative;
  perspective: 1000px;
  animation: bookOpen 2s ease-out;
}

@keyframes bookOpen {
  0% {
    transform: rotateY(-90deg);
  }
  100% {
    transform: rotateY(0deg);
  }
}

.book-spine {
  width: 10px;
  height: 120px;
  background: linear-gradient(to bottom, #fff, #e0e0e0);
  position: absolute;
  left: -5px;
  top: 0;
  border-radius: 2px 0 0 2px;
  box-shadow: -2px 0 5px rgba(0, 0, 0, 0.2);
}

.book-cover {
  width: 100px;
  height: 120px;
  background: linear-gradient(135deg, #fff 0%, #f0f0f0 100%);
  border-radius: 0 8px 8px 0;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.book-cover::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, transparent 0%, rgba(102, 126, 234, 0.1) 100%);
}

.book-title {
  font-size: 1.5rem;
  font-weight: bold;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  z-index: 1;
}

/* Welcome title */
.welcome-title {
  color: white;
  margin-bottom: 1.5rem;
  animation: fadeInUp 1s ease-out 0.4s both;
}

.title-line {
  display: block;
  font-size: 1.5rem;
  font-weight: 300;
  margin-bottom: 0.5rem;
  opacity: 0.9;
}

.title-highlight {
  display: block;
  font-size: 2.5rem;
  font-weight: bold;
  text-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

@media (max-width: 768px) {
  .title-line {
    font-size: 1.2rem;
  }
  .title-highlight {
    font-size: 1.8rem;
  }
}

/* Subtitle */
.welcome-subtitle {
  color: rgba(255, 255, 255, 0.9);
  font-size: 1.2rem;
  margin-bottom: 3rem;
  animation: fadeInUp 1s ease-out 0.6s both;
}

/* Features preview */
.features-preview {
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin-bottom: 3rem;
  flex-wrap: wrap;
  animation: fadeInUp 1s ease-out 0.8s both;
}

.feature-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  color: white;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  backdrop-filter: blur(10px);
  transition: all 0.3s;
  min-width: 150px;
}

.feature-item:hover {
  transform: translateY(-5px);
  background: rgba(255, 255, 255, 0.2);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.feature-item i {
  font-size: 2rem;
}

.feature-item span {
  font-size: 0.9rem;
  text-align: center;
}

/* Action buttons */
.action-buttons {
  display: flex;
  justify-content: center;
  gap: 1rem;
  flex-wrap: wrap;
  margin-bottom: 2rem;
  animation: fadeInUp 1s ease-out 1s both;
}

.btn-action {
  padding: 1rem 2.5rem;
  font-size: 1.1rem;
  font-weight: 600;
  border-radius: 12px;
  border: none;
  color: white;
  transition: all 0.3s;
  min-width: 200px;
  position: relative;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.btn-action::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.2);
  transition: all 0.4s;
}

.btn-action:hover::before {
  left: 100%;
}

.btn-login {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.btn-login:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.6);
  background: linear-gradient(135deg, #5568d3 0%, #6a3f8f 100%);
}

.btn-register {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.btn-register:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(245, 87, 108, 0.6);
  background: linear-gradient(135deg, #e87fe8 0%, #e14359 100%);
}

.btn-link {
  opacity: 0.8;
  transition: all 0.3s;
  font-size: 1rem;
}

.btn-link:hover {
  opacity: 1;
  text-decoration: underline !important;
}

/* Enter button */
.btn-enter {
  position: relative;
  padding: 1rem 3rem;
  font-size: 1.2rem;
  font-weight: 600;
  border-radius: 50px;
  overflow: hidden;
  animation: fadeInUp 1s ease-out 1s both;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.btn-gradient {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  color: white;
  transition: all 0.3s;
}

.btn-gradient:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 15px 40px rgba(102, 126, 234, 0.4);
}

.btn-shine {
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  animation: shine 3s infinite;
}

@keyframes shine {
  0% {
    left: -100%;
  }
  50%, 100% {
    left: 100%;
  }
}

/* Responsive adjustments */
@media (max-width: 576px) {
  .welcome-content {
    padding: 1rem;
  }

  .features-preview {
    gap: 1rem;
  }

  .feature-item {
    min-width: 120px;
    padding: 0.75rem;
  }

  .btn-enter {
    padding: 0.75rem 2rem;
    font-size: 1rem;
  }
}

/* Transition animations */
.welcome-page.transitioning .welcome-content {
  animation: zoomOut 1s ease-in forwards;
}

.welcome-page.transitioning .floating-books .book {
  animation: bookFlyAway 1s ease-in forwards;
}

.welcome-page.transitioning {
  animation: fadeOutScale 1s ease-in forwards;
}

@keyframes zoomOut {
  0% {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
  100% {
    opacity: 0;
    transform: scale(0.8) translateY(-50px);
  }
}

@keyframes bookFlyAway {
  0% {
    opacity: 0.15;
  }
  100% {
    opacity: 0;
    transform: translateY(-150vh) rotate(720deg) scale(0);
  }
}

@keyframes fadeOutScale {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}

/* Button clicked state */
.btn-enter.clicked {
  animation: buttonPulse 0.5s ease-out;
  transform: scale(1.05);
}

@keyframes buttonPulse {
  0% {
    transform: scale(1);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  }
  50% {
    transform: scale(1.1);
    box-shadow: 0 15px 50px rgba(102, 126, 234, 0.6);
  }
  100% {
    transform: scale(1.05);
    box-shadow: 0 20px 60px rgba(102, 126, 234, 0.8);
  }
}

/* Ripple effect on button click */
.btn-enter.clicked::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.5);
  transform: translate(-50%, -50%);
  animation: ripple 0.6s ease-out;
}

@keyframes ripple {
  0% {
    width: 0;
    height: 0;
    opacity: 1;
  }
  100% {
    width: 300px;
    height: 300px;
    opacity: 0;
  }
}
</style>

