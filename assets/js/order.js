document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const productId = Number(params.get('id'));
  const product = PRODUCTS.find((item) => item.id === productId);

  const orderName = document.getElementById('order-product-name');
  if (product) {
    orderName.textContent = product.name;
  } else {
    orderName.textContent = 'your items';
  }

  // Reset cart for demo purposes after placing an order
  setCartCount(0);

  const storedOrder = localStorage.getItem(ORDER_KEY);
  if (storedOrder) {
    const { timestamp } = JSON.parse(storedOrder);
    const timeEl = document.createElement('p');
    const date = new Date(timestamp);
    timeEl.textContent = `Placed on ${date.toLocaleString()}`;
    document.querySelector('.order-card').appendChild(timeEl);
  }
});
