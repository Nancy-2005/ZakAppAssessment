const CART_KEY = 'abokichi_cart_count';
const ORDER_KEY = 'abokichi_latest_order';

const getCartCount = () => Number(localStorage.getItem(CART_KEY)) || 0;
const setCartCount = (count) => {
  localStorage.setItem(CART_KEY, String(count));
  updateCartBadge(count);
};

function updateCartBadge(forceCount) {
  const count = typeof forceCount === 'number' ? forceCount : getCartCount();
  document.querySelectorAll('[data-cart-count]').forEach((el) => {
    el.textContent = count;
    // Hide badge if count is 0
    if (count === 0) {
      el.style.display = 'none';
    } else {
      el.style.display = 'flex';
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  updateCartBadge();
  
  // Add click handlers to product cards on index page
  const productCards = document.querySelectorAll('.best-seller-card[data-product-id]');
  productCards.forEach(card => {
    card.style.cursor = 'pointer';
    card.addEventListener('click', () => {
      // Navigate to products listing page
      window.location.href = 'products.html';
    });
  });
});
