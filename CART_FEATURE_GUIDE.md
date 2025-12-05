# 🛒 Cart Feature Implementation Guide

## Overview
This document describes the implementation of the shopping cart feature for the Library Management System (QLMS). The cart allows users to add multiple books before borrowing them all at once.

## Features Implemented

### 1. **Cart State Management** (`useCart.ts`)
A composable that manages cart state using Vue 3's Composition API with persistent storage.

**Key Features:**
- ✅ Add books to cart
- ✅ Remove books from cart
- ✅ Update book quantities
- ✅ Clear entire cart
- ✅ LocalStorage persistence (cart survives page refresh)
- ✅ Real-time cart count
- ✅ Total price calculation
- ✅ Check if book is in cart

**Usage:**
```typescript
import { useCart } from '@/composables/useCart'

const { 
  cartItems,      // Reactive list of cart items
  cartCount,      // Total number of books in cart
  totalPrice,     // Total price of all books
  addToCart,      // Function to add book
  removeFromCart, // Function to remove book
  clearCart,      // Function to clear cart
  isInCart,       // Check if book exists in cart
  toggleCart,     // Toggle cart drawer open/close
  openCart,       // Open cart drawer
  closeCart       // Close cart drawer
} = useCart()
```

### 2. **Cart Drawer Component** (`Cart.vue`)
A slide-in drawer that displays cart contents and allows batch borrowing.

**Features:**
- ✅ Smooth slide-in animation from the right
- ✅ Display all cart items with book details
- ✅ Adjust quantity for each item
- ✅ Remove individual items
- ✅ Clear entire cart
- ✅ Borrow all books at once
- ✅ Login prompt for unauthenticated users
- ✅ Success/error feedback
- ✅ Auto-redirect to borrowed books after successful borrow

**UI Components:**
- Cart header with count badge
- Individual cart item cards with:
  - Book image
  - Title and author
  - Price
  - Quantity controls (+/- buttons)
  - Remove button
- Cart footer with:
  - Total price
  - Total quantity
  - "Borrow All" button
  - "Clear Cart" button

### 3. **Cart Button Component** (`CartButton.vue`)
A floating cart icon button displayed in the app header.

**Features:**
- ✅ Animated cart icon
- ✅ Badge showing cart count
- ✅ Pulse animation when cart has items
- ✅ Click to toggle cart drawer
- ✅ Consistent styling with app theme

### 4. **SearchBooks Integration**
Enhanced the book search page with cart functionality.

**New Features:**
- ✅ "Add to Cart" button on each book card
- ✅ Visual feedback (checkmark) when book is in cart
- ✅ Disabled state for out-of-stock books
- ✅ Toast notification when adding to cart
- ✅ Auto-hide notification after 3 seconds

**Button States:**
- 🛒 **Cart Plus Icon**: Book not in cart
- ✅ **Check Icon**: Book already in cart
- 🚫 **Disabled**: Out of stock

## File Structure

```
frontend/src/
├── composables/
│   └── useCart.ts              # Cart state management
├── components/
│   ├── Cart.vue                # Cart drawer component
│   └── CartButton.vue          # Cart button component
├── views/
│   └── docgia/
│       └── SearchBooks.vue     # Updated with cart integration
└── App.vue                     # Updated with Cart & CartButton
```

## Data Flow

```
┌─────────────────────────────────────────────────────┐
│                   useCart.ts                        │
│  (Shared State - Reactive Singleton Pattern)       │
│  - cartItems: CartItem[]                           │
│  - localStorage sync                                │
└─────────────────┬───────────────────────────────────┘
                  │
        ┌─────────┴─────────┐
        │                   │
        ▼                   ▼
┌──────────────┐    ┌──────────────┐
│ CartButton   │    │ SearchBooks  │
│ (App.vue)    │    │              │
│              │    │ - Add to cart│
│ - Show count │    │ - Toast msg  │
│ - Open cart  │    └──────────────┘
└──────────────┘
        │
        ▼
┌──────────────┐
│   Cart.vue   │
│              │
│ - Show items │
│ - Adjust qty │
│ - Remove     │
│ - Borrow all │
└──────────────┘
```

## API Integration

### Borrow Books from Cart
When "Borrow All" is clicked:

```typescript
// Cart.vue - handleBorrowAll()
const borrowPromises = cartItems.value.map(item => 
  bookService.borrowBook({
    MaSach: item.book._id,
    SoQuyen: item.quantity
  })
)

await Promise.all(borrowPromises)
```

**Request Format:**
```json
{
  "MaSach": "book_id",
  "SoQuyen": 2
}
```

**Success Flow:**
1. All borrow requests sent in parallel
2. Success message displayed
3. Cart cleared after 2 seconds
4. Redirect to /docgia/borrowed-books

**Error Handling:**
- Display error message in cart drawer
- Cart remains intact on error
- User can retry or modify cart

## User Experience

### Adding to Cart
1. User clicks "Add to Cart" button (cart icon)
2. Toast notification appears: "Đã thêm [Book Title] vào giỏ"
3. Button icon changes to checkmark
4. Cart badge count updates
5. Notification auto-hides after 3 seconds

### Viewing Cart
1. User clicks cart button in header
2. Cart drawer slides in from right
3. Shows all cart items with details
4. Can adjust quantities or remove items

### Borrowing from Cart
1. User clicks "Mượn tất cả" button
2. If not logged in → login prompt appears
3. If logged in → borrow requests sent
4. Loading spinner during API calls
5. Success message shown
6. Auto-redirect to borrowed books page

### Cart Persistence
- Cart saved to `localStorage` as "libraryCart"
- Survives page refresh/reload
- Shared across browser tabs
- Cleared on successful borrow

## Styling & Animations

### Cart Drawer
- **Width**: 420px (90vw on mobile)
- **Animation**: Slide from right (0.3s ease)
- **Z-index**: 1050 (above backdrop)
- **Backdrop**: Semi-transparent with blur effect

### Cart Button
- **Pulse Animation**: When cart has items
- **Hover Effect**: Scale up & background change
- **Badge**: Red circular badge with white text

### Transitions
- ✅ Fade transitions for backdrop
- ✅ Slide transitions for drawer
- ✅ Toast slide-in from right

## Responsive Design

### Desktop (>768px)
- Cart drawer: 420px wide
- Full features visible
- Comfortable spacing

### Mobile (<768px)
- Cart drawer: Full width
- Stacked layout
- Touch-friendly buttons

## Security & Validation

### Client-side Validation
- ✅ Quantity cannot exceed available stock
- ✅ Quantity must be >= 1
- ✅ Cannot add out-of-stock books

### Authentication Check
- ✅ Login required to borrow
- ✅ Token validation before API calls
- ✅ Redirect to login if unauthorized

## Testing Checklist

- [ ] Add book to cart
- [ ] Increment/decrement quantity
- [ ] Remove individual item
- [ ] Clear entire cart
- [ ] Borrow all books (authenticated)
- [ ] Login prompt (unauthenticated)
- [ ] Cart persistence after refresh
- [ ] Multiple tabs sync
- [ ] Out of stock handling
- [ ] Error handling
- [ ] Mobile responsiveness
- [ ] Toast notifications

## Future Enhancements

### Potential Features
1. **Save Cart for Later** - Named carts that persist to user account
2. **Cart Sharing** - Share cart with others via link
3. **Recommended Books** - Show similar books in cart drawer
4. **Wishlist** - Separate wishlist feature
5. **Cart Analytics** - Track popular cart combinations
6. **Bulk Actions** - Select multiple items for actions
7. **Cart Expiry** - Auto-clear old cart items
8. **Price Filters** - Filter cart by price range

## Troubleshooting

### Cart not persisting
- Check localStorage is enabled
- Verify "libraryCart" key exists
- Check browser console for errors

### Books not adding to cart
- Verify `useCart()` is imported correctly
- Check if book has required fields (_id, SoQuyen)
- Inspect browser console for errors

### Borrow all failing
- Check authentication token
- Verify API endpoint is correct
- Check network tab for errors
- Ensure book IDs are valid

## Code Examples

### Add to Cart
```typescript
const handleAddToCart = (book: Sach) => {
  addToCart(book, 1)
  showNotification(`Đã thêm "${book.TenSach}" vào giỏ`)
}
```

### Check if in Cart
```vue
<button
  :disabled="isInCart(book._id)"
  @click="addToCart(book, 1)"
>
  <i :class="isInCart(book._id) ? 'bi-check' : 'bi-cart-plus'"></i>
</button>
```

### Update Quantity
```typescript
const incrementQuantity = (bookId: string, maxQty: number) => {
  const item = cartItems.value.find(i => i.book._id === bookId)
  if (item && item.quantity < maxQty) {
    updateQuantity(bookId, item.quantity + 1)
  }
}
```

## Summary

The Cart feature provides a seamless multi-book borrowing experience with:
- ✅ Persistent state management
- ✅ Smooth UI/UX with animations
- ✅ Mobile-responsive design
- ✅ Error handling & validation
- ✅ Integration with existing auth & book systems

This implementation follows Vue 3 best practices and maintains consistency with the existing QLMS codebase.

