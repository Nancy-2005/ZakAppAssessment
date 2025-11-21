document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const productId = Number(params.get('id')) || PRODUCTS[0].id;
  const product = PRODUCTS.find((item) => item.id === productId) || PRODUCTS[0];

  if (!product) {
    window.location.href = 'products.html';
    return;
  }

  // Update breadcrumb
  const breadcrumbEl = document.getElementById('breadcrumb-product-name');
  if (breadcrumbEl) {
    breadcrumbEl.textContent = product.name;
  }

  // Update product title
  const titleEl = document.getElementById('product-title');
  if (titleEl) {
    titleEl.textContent = product.name;
  }

  // Update price
  const currentPriceEl = document.getElementById('current-price');
  const oldPriceEl = document.getElementById('old-price');
  if (currentPriceEl) {
    currentPriceEl.textContent = `$${product.price.toFixed(2)}`;
  }
  if (oldPriceEl && product.oldPrice) {
    oldPriceEl.textContent = `$${product.oldPrice.toFixed(2)}`;
    oldPriceEl.style.display = 'inline';
  } else if (oldPriceEl) {
    oldPriceEl.style.display = 'none';
  }

  // Update rating
  const starsEl = document.getElementById('product-stars');
  const reviewsEl = document.getElementById('reviews-count');
  if (starsEl) {
    starsEl.textContent = generateStars(product.rating || 0);
  }
  if (reviewsEl) {
    reviewsEl.textContent = `${product.reviews || 0} Reviews`;
  }

  // Update short description
  const shortDescEl = document.getElementById('product-short-desc');
  if (shortDescEl) {
    shortDescEl.textContent = product.description || 'Your new cooking BFF! You can add this to virtually everything. Try it on rice, on meat or tofu, in your burger, ramen and pretty much anything.';
  }

  // Setup image gallery
  setupImageGallery(product);

  // Setup product description
  setupProductDescription(product);

  // Setup tabs
  setupTabs();

  // Add to cart button
  const addToCartBtn = document.getElementById('add-to-cart');
  if (addToCartBtn) {
    addToCartBtn.addEventListener('click', () => {
      const newCount = getCartCount() + 1;
      setCartCount(newCount);
      addToCartBtn.textContent = 'ADDED TO CART!';
      addToCartBtn.style.opacity = '0.7';
      setTimeout(() => {
        addToCartBtn.textContent = 'ADD TO CART';
        addToCartBtn.style.opacity = '1';
      }, 2000);
    });
  }

  // Buy now button
  const buyNowBtn = document.getElementById('buy-now');
  if (buyNowBtn) {
    buyNowBtn.addEventListener('click', () => {
      const orderData = {
        productId: product.id,
        productName: product.name,
        timestamp: Date.now(),
      };
      localStorage.setItem(ORDER_KEY, JSON.stringify(orderData));
      window.location.href = `order.html?id=${product.id}`;
    });
  }
});

function generateStars(rating) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  let stars = '';
  
  for (let i = 0; i < fullStars; i++) {
    stars += '★';
  }
  
  if (hasHalfStar && fullStars < 5) {
    stars += '☆';
  }
  
  while (stars.length < 5) {
    stars += '☆';
  }
  
  return stars;
}

function setupImageGallery(product) {
  const mainImgEl = document.getElementById('product-main-img');
  const thumbnailListEl = document.getElementById('thumbnail-list');
  
  if (!mainImgEl || !thumbnailListEl) return;

  // Create thumbnail images (using the same image multiple times for demo)
  const thumbnails = [
    product.image,
    product.image,
    product.image
  ];

  // Set main image
  mainImgEl.src = product.image;
  mainImgEl.alt = product.name;

  // Create thumbnails
  thumbnailListEl.innerHTML = thumbnails.map((thumb, index) => `
    <img 
      src="${thumb}" 
      alt="Thumbnail ${index + 1}" 
      class="thumbnail ${index === 0 ? 'active' : ''}"
      data-index="${index}"
    />
  `).join('');

  // Thumbnail click handlers
  thumbnailListEl.querySelectorAll('.thumbnail').forEach(thumb => {
    thumb.addEventListener('click', () => {
      mainImgEl.src = thumb.src;
      thumbnailListEl.querySelectorAll('.thumbnail').forEach(t => t.classList.remove('active'));
      thumb.classList.add('active');
    });
  });

  // Thumbnail navigation arrows
  const thumbPrev = document.getElementById('thumb-prev');
  const thumbNext = document.getElementById('thumb-next');
  let currentThumbIndex = 0;

  if (thumbPrev) {
    thumbPrev.addEventListener('click', () => {
      currentThumbIndex = (currentThumbIndex - 1 + thumbnails.length) % thumbnails.length;
      updateThumbnailView();
    });
  }

  if (thumbNext) {
    thumbNext.addEventListener('click', () => {
      currentThumbIndex = (currentThumbIndex + 1) % thumbnails.length;
      updateThumbnailView();
    });
  }

  function updateThumbnailView() {
    const thumbs = thumbnailListEl.querySelectorAll('.thumbnail');
    if (thumbs[currentThumbIndex]) {
      mainImgEl.src = thumbs[currentThumbIndex].src;
      thumbs.forEach(t => t.classList.remove('active'));
      thumbs[currentThumbIndex].classList.add('active');
    }
  }
}

function setupProductDescription(product) {
  const descContentEl = document.getElementById('product-description-content');
  if (!descContentEl) return;

  // Create detailed description based on product
  const description = `
    <p>${product.description || 'Your new cooking BFF! You can add this to virtually everything. Try it on rice, on meat or tofu, in your burger, ramen and pretty much anything.'}</p>
    <p>Chili OKAZU is an umami-rich chili, miso, and sesame oil based condiment often eaten with rice in Japan. It's also perfect for chicken, burgers, fish, eggs, potatoes, and as a marinade or salad dressing.</p>
    <p>OKAZU gained popularity at farmers' markets in Toronto and has been featured in various publications and won a "Foodie Pick Awards."</p>
    <p><strong>HEAT LEVEL: MILD-MEDIUM</strong></p>
    <p><strong>INGREDIENTS:</strong> SUNFLOWER OIL, SESAME OIL, GARLIC, MISO PASTE (ORGANIC SOYBEANS, RICE, SALT), TAMARI SOY SAUCE (NON-GMO SOYBEANS, SALT, SUGAR), SUGAR, CHILI POWDER, WHITE SESAME SEEDS.</p>
    <p><strong>Allergen information:</strong> CHILI & SPICY OKAZU CONTAINS: SESAME, SOYBEANS. MAY CONTAIN: MUSTARD. CURRY OKAZU CONTAINS: SESAME, SOYBEANS, MUSTARD.</p>
    <p><em>PRODUCT SEPARATION IS NORMAL. REFRIGERATE AFTER OPENING.</em></p>
  `;

  descContentEl.innerHTML = description;
}

function setupTabs() {
  const tabs = document.querySelectorAll('.product-tab');
  const panes = document.querySelectorAll('.tab-pane');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetTab = tab.dataset.tab;

      // Remove active class from all tabs and panes
      tabs.forEach(t => t.classList.remove('active'));
      panes.forEach(p => p.classList.remove('active'));

      // Add active class to clicked tab and corresponding pane
      tab.classList.add('active');
      const targetPane = document.getElementById(`tab-${targetTab}`);
      if (targetPane) {
        targetPane.classList.add('active');
      }
    });
  });
}
