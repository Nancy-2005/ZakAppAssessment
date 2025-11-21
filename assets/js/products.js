document.addEventListener('DOMContentLoaded', () => {
  const grid = document.getElementById('product-grid');
  const sortSelect = document.querySelector('.sort-select');
  const viewButtons = document.querySelectorAll('.view-btn');
  const filterToggleBtn = document.getElementById('filter-toggle-btn');
  const filterPanel = document.getElementById('filter-panel');
  const categoryCheckboxes = document.querySelectorAll('input[name="category"]');
  const typeCheckboxes = document.querySelectorAll('input[name="type"]');
  
  if (!grid) return;

  // Toggle filter panel
  if (filterToggleBtn && filterPanel) {
    filterToggleBtn.addEventListener('click', () => {
      filterPanel.classList.toggle('active');
      filterToggleBtn.classList.toggle('active');
    });
  }

  const generateStars = (rating) => {
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
  };

  const getActiveFilters = () => {
    const activeCategories = Array.from(categoryCheckboxes)
      .filter(cb => cb.checked)
      .map(cb => cb.value);
    
    const activeTypes = Array.from(typeCheckboxes)
      .filter(cb => cb.checked)
      .map(cb => cb.value);
    
    return {
      categories: activeCategories,
      types: activeTypes
    };
  };

  const filterProducts = (items) => {
    const filters = getActiveFilters();
    
    // If no filters are selected, return all products
    if (filters.categories.length === 0 && filters.types.length === 0) {
      return items;
    }
    
    return items.filter(product => {
      const categoryMatch = filters.categories.length === 0 || 
                           filters.categories.includes(product.category);
      const typeMatch = filters.types.length === 0 || 
                       filters.types.includes(product.type);
      
      return categoryMatch && typeMatch;
    });
  };

  const arrangeProductsMixed = (items) => {
    // Arrange products so no same image appears in same row or column
    // Row 1: okazu-set, chili-miso, instant-miso, matcha
    // Row 2: instant-miso, matcha, okazu-set, chili-miso
    
    const imageGroups = {
      'okazu-set': items.filter(p => p.image.includes('okazu-set')),
      'chili-miso': items.filter(p => p.image.includes('chili-miso')),
      'instant-miso': items.filter(p => p.image.includes('instant-miso')),
      'matcha': items.filter(p => p.image.includes('matcha'))
    };
    
    const arranged = [];
    
    // Row 1: okazu-set, chili-miso, instant-miso, matcha
    if (imageGroups['okazu-set'].length > 0) arranged.push(imageGroups['okazu-set'][0]);
    if (imageGroups['chili-miso'].length > 0) arranged.push(imageGroups['chili-miso'][0]);
    if (imageGroups['instant-miso'].length > 0) arranged.push(imageGroups['instant-miso'][0]);
    if (imageGroups['matcha'].length > 0) arranged.push(imageGroups['matcha'][0]);
    
    // Row 2: instant-miso, matcha, okazu-set, chili-miso (shifted to avoid column duplicates)
    if (imageGroups['instant-miso'].length > 1) {
      arranged.push(imageGroups['instant-miso'][1]);
    } else if (imageGroups['instant-miso'].length > 0) {
      arranged.push(imageGroups['instant-miso'][0]);
    }
    
    if (imageGroups['matcha'].length > 1) {
      arranged.push(imageGroups['matcha'][1]);
    } else if (imageGroups['matcha'].length > 0) {
      arranged.push(imageGroups['matcha'][0]);
    }
    
    if (imageGroups['okazu-set'].length > 1) {
      arranged.push(imageGroups['okazu-set'][1]);
    } else if (imageGroups['okazu-set'].length > 0) {
      arranged.push(imageGroups['okazu-set'][0]);
    }
    
    if (imageGroups['chili-miso'].length > 1) {
      arranged.push(imageGroups['chili-miso'][1]);
    } else if (imageGroups['chili-miso'].length > 0) {
      arranged.push(imageGroups['chili-miso'][0]);
    }
    
    return arranged;
  };

  const sortProducts = (items) => {
    if (!sortSelect) {
      // If no sort select exists, return items as-is
      return items;
    }
    
    const mode = sortSelect.value;
    const sorted = [...items];
    
    // Apply sorting based on selected mode
    switch (mode) {
      case 'price-low':
        sorted.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        sorted.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'alphabetical':
      default:
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;
    }
    
    // Return sorted products in the exact sort order (no rearranging)
    return sorted;
  };

  const renderProducts = () => {
    if (!PRODUCTS || !Array.isArray(PRODUCTS)) {
      grid.innerHTML = '<p>No products available.</p>';
      return;
    }

    // Filter products first
    const filtered = filterProducts(PRODUCTS);
    
    // Then sort filtered products
    const items = sortProducts(filtered);
    const productCount = items.length;
    
    // Update product count
    const countElement = document.querySelector('.products-count');
    if (countElement) {
      countElement.textContent = `Products (${productCount})`;
    }

    if (!items.length) {
      grid.innerHTML = '<p class="no-products">No products match your filters. Try adjusting your selection.</p>';
      return;
    }

    grid.innerHTML = items
      .map(
        (product) => `
        <article class="product-card">
          <img src="${product.image}" alt="${product.name}" />
          <h3>${product.name}</h3>
          <div class="product-price">
            $${product.price.toFixed(2)}
            ${product.oldPrice ? `<span class="product-old-price">$${product.oldPrice.toFixed(2)}</span>` : ''}
          </div>
          <div class="product-rating">
            <span class="stars">${generateStars(product.rating || 0)}</span>
            <span class="reviews">${product.reviews || 0} Reviews</span>
          </div>
        </article>
      `
      )
      .join('');

    // Add click handlers to product cards
    grid.querySelectorAll('.product-card').forEach((card, index) => {
      card.addEventListener('click', () => {
        window.location.href = `product-detail.html?id=${items[index].id}`;
      });
    });
  };

  // Sort handler
  if (sortSelect) {
    sortSelect.addEventListener('change', renderProducts);
  }

  // Filter handlers
  categoryCheckboxes.forEach(checkbox => {
    checkbox.addEventListener('change', renderProducts);
  });

  typeCheckboxes.forEach(checkbox => {
    checkbox.addEventListener('change', renderProducts);
  });

  // View toggle handlers
  viewButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      viewButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const view = btn.dataset.view;
      
      if (view === 'list') {
        grid.classList.add('list-view');
        grid.style.gridTemplateColumns = '1fr';
      } else {
        grid.classList.remove('list-view');
        grid.style.gridTemplateColumns = 'repeat(4, 1fr)';
      }
    });
  });

  renderProducts();
});
