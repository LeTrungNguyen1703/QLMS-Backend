<template>
  <Teleport to="body">
    <!-- Backdrop -->
    <Transition name="fade">
      <div
        v-if="isCartOpen"
        class="cart-backdrop"
        @click="closeCart"
      ></div>
    </Transition>

    <!-- Cart Drawer -->
    <Transition name="slide">
      <div v-if="isCartOpen" class="cart-drawer">
        <div class="cart-header">
          <h5 class="mb-0">
            <i class="bi bi-cart3 me-2"></i>
            Giỏ sách
            <span v-if="cartCount > 0" class="badge bg-primary ms-2">{{ cartCount }}</span>
          </h5>
          <button class="btn-close-cart" @click="closeCart">
            <i class="bi bi-x-lg"></i>
          </button>
        </div>

        <div class="cart-body">
          <!-- Empty Cart -->
          <div v-if="isEmpty" class="empty-cart">
            <i class="bi bi-cart-x fs-1 text-muted"></i>
            <p class="text-muted mt-3">Giỏ sách trống</p>
            <p class="text-muted small">Thêm sách vào giỏ để mượn nhiều cùng lúc</p>
          </div>

          <!-- Cart Items -->
          <div v-else class="cart-items">
            <div
              v-for="item in cartItems"
              :key="item.book._id"
              class="cart-item"
            >
              <div class="cart-item-image">
                <img
                  :src="item.book.HinhAnh || '/placeholder-book.jpg'"
                  :alt="item.book.TenSach"
                />
              </div>

              <div class="cart-item-details">
                <h6 class="cart-item-title">{{ item.book.TenSach }}</h6>
                <p class="cart-item-author text-muted small mb-1">
                  <i class="bi bi-person me-1"></i>{{ item.book.TacGia }}
                </p>
                <p class="cart-item-price text-primary fw-bold mb-2">
                  {{ formatPrice(item.book.DonGia) }}
                </p>

                <div class="cart-item-quantity">
                  <button
                    class="btn btn-sm btn-outline-secondary"
                    @click="decrementQuantity(item.book._id)"
                    :disabled="item.quantity <= 1"
                  >
                    <i class="bi bi-dash"></i>
                  </button>
                  <input
                    type="number"
                    class="form-control form-control-sm quantity-input"
                    :value="item.quantity"
                    @change="handleQuantityChange(item.book._id, $event)"
                    :max="item.book.SoQuyen"
                    min="1"
                  />
                  <button
                    class="btn btn-sm btn-outline-secondary"
                    @click="incrementQuantity(item.book._id, item.book.SoQuyen)"
                    :disabled="item.quantity >= item.book.SoQuyen"
                  >
                    <i class="bi bi-plus"></i>
                  </button>
                </div>

                <p class="text-muted small mt-1">
                  Còn lại: {{ item.book.SoQuyen }} quyển
                </p>
              </div>

              <button
                class="btn-remove-item"
                @click="removeFromCart(item.book._id)"
                title="Xóa khỏi giỏ"
              >
                <i class="bi bi-trash"></i>
              </button>
            </div>
          </div>
        </div>

        <div v-if="!isEmpty" class="cart-footer">
          <div class="cart-total">
            <span class="fw-bold">Tổng cộng:</span>
            <span class="text-primary fw-bold fs-5">{{ formatPrice(totalPrice) }}</span>
          </div>
          <div class="cart-summary mb-3">
            <small class="text-muted">
              Tổng số sách: {{ cartCount }} quyển
            </small>
          </div>

          <button
            class="btn btn-gradient w-100 mb-2"
            @click="handleBorrowAll"
            :disabled="isBorrowing"
          >
            <span v-if="isBorrowing">
              <span class="spinner-border spinner-border-sm me-2"></span>
              Đang xử lý...
            </span>
            <span v-else>
              <i class="bi bi-bookmark-check me-2"></i>
              Mượn tất cả
            </span>
          </button>

          <button
            class="btn btn-outline-danger w-100"
            @click="confirmClearCart"
          >
            <i class="bi bi-trash me-2"></i>
            Xóa giỏ sách
          </button>

          <!-- Success/Error Messages -->
          <div v-if="borrowSuccess" class="alert alert-success mt-3 mb-0">
            <i class="bi bi-check-circle-fill me-2"></i>
            {{ borrowSuccess }}
          </div>
          <div v-if="borrowError" class="alert alert-danger mt-3 mb-0">
            <i class="bi bi-exclamation-triangle-fill me-2"></i>
            {{ borrowError }}
          </div>
        </div>
      </div>
    </Transition>

    <!-- Login Prompt Modal -->
    <Transition name="modal-fade">
      <div v-if="showLoginPrompt" class="modal-backdrop" @click="closeLoginPrompt">
        <div class="modal-dialog-wrapper-small" @click.stop>
          <div class="modal-content-custom">
            <div class="login-prompt-content">
              <div class="login-prompt-icon">
                <i class="bi bi-lock-fill"></i>
              </div>
              <h4>Cần đăng nhập</h4>
              <p class="text-muted">Bạn cần đăng nhập để mượn sách</p>
              <div class="d-flex gap-2 justify-content-center">
                <button class="btn btn-secondary" @click="closeLoginPrompt">
                  <i class="bi bi-x-circle me-1"></i>
                  Hủy
                </button>
                <button class="btn btn-primary" @click="goToLogin">
                  <i class="bi bi-box-arrow-in-right me-1"></i>
                  Đăng nhập
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useCart } from '../composables/useCart'
import { bookService } from '../services/bookService'
import { authService } from '../services/authService'

const router = useRouter()
const {
  cartItems,
  isCartOpen,
  cartCount,
  totalPrice,
  isEmpty,
  removeFromCart,
  updateQuantity,
  clearCart,
  closeCart
} = useCart()

const isBorrowing = ref(false)
const borrowSuccess = ref('')
const borrowError = ref('')
const showLoginPrompt = ref(false)

// Format price
const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(price)
}

// Quantity handlers
const incrementQuantity = (bookId: string, maxQuantity: number) => {
  const item = cartItems.value.find(item => item.book._id === bookId)
  if (item && item.quantity < maxQuantity) {
    updateQuantity(bookId, item.quantity + 1)
  }
}

const decrementQuantity = (bookId: string) => {
  const item = cartItems.value.find(item => item.book._id === bookId)
  if (item && item.quantity > 1) {
    updateQuantity(bookId, item.quantity - 1)
  }
}

const handleQuantityChange = (bookId: string, event: Event) => {
  const target = event.target as HTMLInputElement
  const value = parseInt(target.value)
  if (!isNaN(value) && value > 0) {
    updateQuantity(bookId, value)
  }
}

// Clear cart with confirmation
const confirmClearCart = () => {
  if (confirm('Bạn có chắc muốn xóa tất cả sách trong giỏ?')) {
    clearCart()
    borrowSuccess.value = ''
    borrowError.value = ''
  }
}

// Borrow all books in cart
const handleBorrowAll = async () => {
  // Check login
  const isLoggedIn = await authService.isAuthenticated()
  if (!isLoggedIn) {
    showLoginPrompt.value = true
    return
  }

  isBorrowing.value = true
  borrowError.value = ''
  borrowSuccess.value = ''

  try {
    const borrowPromises = cartItems.value.map(item =>
      bookService.borrowBook({
        MaSach: item.book._id,
        SoQuyen: item.quantity
      })
    )

    await Promise.all(borrowPromises)

    borrowSuccess.value = `Đã gửi yêu cầu mượn ${cartCount.value} quyển sách thành công!`

    // Clear cart after 2 seconds
    setTimeout(() => {
      clearCart()
      borrowSuccess.value = ''
      closeCart()
      router.push('/docgia/borrowed-books')
    }, 2000)

  } catch (error: any) {
    console.error('Error borrowing books:', error)
    borrowError.value = error.response?.data?.message || 'Có lỗi xảy ra khi mượn sách'
  } finally {
    isBorrowing.value = false
  }
}

const closeLoginPrompt = () => {
  showLoginPrompt.value = false
}

const goToLogin = () => {
  closeLoginPrompt()
  closeCart()
  router.push('/login')
}
</script>

<style scoped>
.cart-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1040;
}

.cart-drawer {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  width: 420px;
  max-width: 90vw;
  background: white;
  box-shadow: -2px 0 20px rgba(0, 0, 0, 0.15);
  z-index: 1050;
  display: flex;
  flex-direction: column;
}

.cart-header {
  padding: 1.5rem;
  border-bottom: 1px solid #e9ecef;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-close-cart {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: white;
  transition: all 0.3s;
}

.btn-close-cart:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(1.1);
}

.cart-body {
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
}

.empty-cart {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 2rem;
}

.cart-items {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.cart-item {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
  position: relative;
}

.cart-item-image {
  width: 80px;
  height: 100px;
  flex-shrink: 0;
  border-radius: 4px;
  overflow: hidden;
}

.cart-item-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.cart-item-details {
  flex: 1;
  min-width: 0;
}

.cart-item-title {
  font-size: 0.9rem;
  margin-bottom: 0.25rem;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.cart-item-author {
  font-size: 0.8rem;
}

.cart-item-price {
  font-size: 0.95rem;
}

.cart-item-quantity {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.quantity-input {
  width: 60px;
  text-align: center;
}

.btn-remove-item {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  background: none;
  border: none;
  color: #dc3545;
  cursor: pointer;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  transition: all 0.3s;
}

.btn-remove-item:hover {
  background: rgba(220, 53, 69, 0.1);
}

.cart-footer {
  padding: 1.5rem;
  border-top: 1px solid #e9ecef;
  background: white;
}

.cart-total {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.cart-summary {
  text-align: center;
}

.btn-gradient {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  color: white;
  padding: 0.75rem;
  font-weight: 600;
  transition: all 0.3s;
}

.btn-gradient:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}

.btn-gradient:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
  transform: translateX(100%);
}

/* Login Prompt Modal */
.modal-dialog-wrapper-small {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1060;
  width: 90%;
  max-width: 400px;
}

.modal-content-custom {
  background: white;
  border-radius: 12px;
  padding: 2rem;
}

.login-prompt-content {
  text-align: center;
}

.login-prompt-icon {
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
}

.login-prompt-icon i {
  font-size: 2.5rem;
  color: white;
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

/* Responsive */
@media (max-width: 576px) {
  .cart-drawer {
    width: 100%;
    max-width: 100%;
  }
}
</style>

