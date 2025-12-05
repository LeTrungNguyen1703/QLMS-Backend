import { ref, computed } from 'vue'
import type { Sach } from '../types/book'

export interface CartItem {
  book: Sach
  quantity: number
}

// Shared cart state (reactive singleton pattern)
const cartItems = ref<CartItem[]>([])
const isCartOpen = ref(false)

// Load cart from localStorage on initialization
const loadCartFromStorage = () => {
  try {
    const savedCart = localStorage.getItem('libraryCart')
    if (savedCart) {
      cartItems.value = JSON.parse(savedCart)
    }
  } catch (error) {
    console.error('Error loading cart from localStorage:', error)
    cartItems.value = []
  }
}

// Save cart to localStorage
const saveCartToStorage = () => {
  try {
    localStorage.setItem('libraryCart', JSON.stringify(cartItems.value))
  } catch (error) {
    console.error('Error saving cart to localStorage:', error)
  }
}

// Initialize cart
loadCartFromStorage()

export function useCart() {
  // Add item to cart
  const addToCart = (book: Sach, quantity: number = 1) => {
    const existingItem = cartItems.value.find(item => item.book._id === book._id)

    if (existingItem) {
      // Update quantity but don't exceed available stock
      const newQuantity = Math.min(existingItem.quantity + quantity, book.SoQuyen)
      existingItem.quantity = newQuantity
    } else {
      // Add new item
      cartItems.value.push({
        book,
        quantity: Math.min(quantity, book.SoQuyen)
      })
    }

    saveCartToStorage()
  }

  // Remove item from cart
  const removeFromCart = (bookId: string) => {
    const index = cartItems.value.findIndex(item => item.book._id === bookId)
    if (index !== -1) {
      cartItems.value.splice(index, 1)
      saveCartToStorage()
    }
  }

  // Update item quantity
  const updateQuantity = (bookId: string, quantity: number) => {
    const item = cartItems.value.find(item => item.book._id === bookId)
    if (item) {
      if (quantity <= 0) {
        removeFromCart(bookId)
      } else {
        item.quantity = Math.min(quantity, item.book.SoQuyen)
        saveCartToStorage()
      }
    }
  }

  // Clear cart
  const clearCart = () => {
    cartItems.value = []
    saveCartToStorage()
  }

  // Check if book is in cart
  const isInCart = (bookId: string): boolean => {
    return cartItems.value.some(item => item.book._id === bookId)
  }

  // Get item quantity in cart
  const getCartItemQuantity = (bookId: string): number => {
    const item = cartItems.value.find(item => item.book._id === bookId)
    return item ? item.quantity : 0
  }

  // Toggle cart drawer
  const toggleCart = () => {
    isCartOpen.value = !isCartOpen.value
  }

  const openCart = () => {
    isCartOpen.value = true
  }

  const closeCart = () => {
    isCartOpen.value = false
  }

  // Computed properties
  const cartCount = computed(() => {
    return cartItems.value.reduce((total, item) => total + item.quantity, 0)
  })

  const totalPrice = computed(() => {
    return cartItems.value.reduce((total, item) => {
      return total + (item.book.DonGia * item.quantity)
    }, 0)
  })

  const isEmpty = computed(() => cartItems.value.length === 0)

  return {
    // State
    cartItems: computed(() => cartItems.value),
    isCartOpen: computed(() => isCartOpen.value),

    // Computed
    cartCount,
    totalPrice,
    isEmpty,

    // Actions
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    isInCart,
    getCartItemQuantity,
    toggleCart,
    openCart,
    closeCart
  }
}

