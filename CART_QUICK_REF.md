# 🛒 Cart Feature - Quick Reference

## Quick Start

### 1. Using the Cart in Your Component
```typescript
import { useCart } from '@/composables/useCart'

const { cartItems, cartCount, addToCart, removeFromCart } = useCart()
```

### 2. Add Book to Cart
```typescript
addToCart(book, quantity)
```

### 3. Check if Book in Cart
```typescript
if (isInCart(bookId)) {
  // Book is already in cart
}
```

### 4. Remove from Cart
```typescript
removeFromCart(bookId)
```

## Components

### Cart Button (Header)
- **Location**: `App.vue` header navigation
- **Shows**: Cart icon with badge count
- **Action**: Opens cart drawer on click

### Cart Drawer
- **Location**: Teleported to body (overlay)
- **Trigger**: Click cart button
- **Features**: View items, adjust quantities, borrow all

### Search Books
- **Updated**: Add to cart button on each book card
- **Notification**: Toast message when added

## User Flow

```
Browse Books → Add to Cart → View Cart → Borrow All → Success
                    ↓              ↓
              Toast Shows    Adjust Qty
                            Remove Items
```

## Key Functions

| Function | Purpose | Parameters |
|----------|---------|------------|
| `addToCart(book, qty)` | Add book to cart | book: Sach, qty: number |
| `removeFromCart(id)` | Remove book | id: string |
| `updateQuantity(id, qty)` | Change quantity | id: string, qty: number |
| `clearCart()` | Empty cart | none |
| `isInCart(id)` | Check existence | id: string |
| `toggleCart()` | Open/close drawer | none |

## States

### Cart Item
```typescript
interface CartItem {
  book: Sach          // Full book object
  quantity: number    // Number of copies
}
```

### Computed Values
- `cartCount`: Total items in cart
- `totalPrice`: Sum of all book prices × quantities
- `isEmpty`: Boolean - cart has no items

## Storage

**Key**: `libraryCart`  
**Type**: localStorage  
**Format**: JSON array of CartItem objects  
**Persistence**: Survives page refresh

## Styling

### Cart Button
- Gradient purple background
- Pulse animation when has items
- Red badge with white text

### Cart Drawer
- Slides from right
- 420px wide (90vw mobile)
- Semi-transparent backdrop
- Smooth transitions

### Toast Notification
- Top-right corner
- Auto-hide after 3 seconds
- Green accent border

## API Calls

### Borrow All Books
```typescript
// Endpoint: POST /muonsach/add-muonsach
// Body: { MaSach: string, SoQuyen: number }
// Multiple parallel requests for cart items
```

## Validation

✅ Quantity > 0  
✅ Quantity ≤ Available stock  
✅ Cannot add out-of-stock books  
✅ Login required to borrow  

## Common Scenarios

### Scenario 1: Add Book
```typescript
// In SearchBooks.vue
const handleAddToCart = (book: Sach) => {
  addToCart(book, 1)
  showNotification(`Added ${book.TenSach}`)
}
```

### Scenario 2: Show Cart Count
```vue
<template>
  <span class="badge">{{ cartCount }}</span>
</template>
```

### Scenario 3: Borrow All
```typescript
// In Cart.vue
for (const item of cartItems.value) {
  await bookService.borrowBook({
    MaSach: item.book._id,
    SoQuyen: item.quantity
  })
}
clearCart()
router.push('/docgia/borrowed-books')
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Cart not saving | Check localStorage enabled |
| Can't add to cart | Verify book has _id and SoQuyen |
| Borrow fails | Check authentication token |
| Count wrong | Clear localStorage cache |

## Files Changed

✅ `frontend/src/composables/useCart.ts` - NEW  
✅ `frontend/src/components/Cart.vue` - NEW  
✅ `frontend/src/components/CartButton.vue` - NEW  
✅ `frontend/src/views/docgia/SearchBooks.vue` - UPDATED  
✅ `frontend/src/App.vue` - UPDATED  

## Testing Commands

```bash
# Start dev server
npm run dev

# Build for production
npm run build
```

## Browser Support

✅ Chrome 90+  
✅ Firefox 88+  
✅ Safari 14+  
✅ Edge 90+  

Requires:
- localStorage support
- ES6 support
- CSS Grid support

---

**Quick Tips:**
- Cart persists across page reloads
- Use Chrome DevTools → Application → Local Storage to inspect
- Clear cart with `localStorage.removeItem('libraryCart')`
- Max quantity per book = available stock (SoQuyen)

