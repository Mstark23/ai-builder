// /lib/ai/interactive-features.ts
// Makes generated websites interactive with working functionality
// Uses LocalStorage for persistence - no backend required

// ============================================================================
// E-COMMERCE FUNCTIONALITY
// ============================================================================

export const ECOMMERCE_JS = `
// ============================================
// E-COMMERCE FUNCTIONALITY
// ============================================

class ShoppingCart {
  constructor() {
    this.items = JSON.parse(localStorage.getItem('cart')) || [];
    this.init();
  }

  init() {
    this.updateCartUI();
    this.bindEvents();
  }

  bindEvents() {
    // Add to cart buttons
    document.querySelectorAll('[data-add-to-cart]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const productCard = btn.closest('[data-product]');
        if (productCard) {
          const product = {
            id: productCard.dataset.productId || Date.now(),
            name: productCard.dataset.productName || productCard.querySelector('.product-name')?.textContent || 'Product',
            price: parseFloat(productCard.dataset.productPrice || productCard.querySelector('.product-price')?.textContent?.replace(/[^0-9.]/g, '') || 0),
            image: productCard.querySelector('img')?.src || '',
            quantity: 1
          };
          this.addItem(product);
          this.showAddedFeedback(btn);
        }
      });
    });

    // Cart toggle
    document.querySelectorAll('[data-cart-toggle]').forEach(btn => {
      btn.addEventListener('click', () => this.toggleCartDrawer());
    });

    // Close cart
    document.querySelectorAll('[data-cart-close]').forEach(btn => {
      btn.addEventListener('click', () => this.closeCartDrawer());
    });

    // Quantity controls
    document.addEventListener('click', (e) => {
      if (e.target.matches('[data-quantity-minus]')) {
        const id = e.target.dataset.itemId;
        this.updateQuantity(id, -1);
      }
      if (e.target.matches('[data-quantity-plus]')) {
        const id = e.target.dataset.itemId;
        this.updateQuantity(id, 1);
      }
      if (e.target.matches('[data-remove-item]')) {
        const id = e.target.dataset.itemId;
        this.removeItem(id);
      }
    });

    // Checkout button
    document.querySelectorAll('[data-checkout]').forEach(btn => {
      btn.addEventListener('click', () => this.checkout());
    });
  }

  addItem(product) {
    const existing = this.items.find(item => item.id === product.id);
    if (existing) {
      existing.quantity += 1;
    } else {
      this.items.push(product);
    }
    this.save();
    this.updateCartUI();
  }

  removeItem(id) {
    this.items = this.items.filter(item => item.id != id);
    this.save();
    this.updateCartUI();
  }

  updateQuantity(id, delta) {
    const item = this.items.find(item => item.id == id);
    if (item) {
      item.quantity += delta;
      if (item.quantity <= 0) {
        this.removeItem(id);
      } else {
        this.save();
        this.updateCartUI();
      }
    }
  }

  getTotal() {
    return this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }

  getItemCount() {
    return this.items.reduce((sum, item) => sum + item.quantity, 0);
  }

  save() {
    localStorage.setItem('cart', JSON.stringify(this.items));
  }

  showAddedFeedback(btn) {
    const originalText = btn.innerHTML;
    btn.innerHTML = '✓ Added!';
    btn.classList.add('btn-success');
    btn.disabled = true;
    
    setTimeout(() => {
      btn.innerHTML = originalText;
      btn.classList.remove('btn-success');
      btn.disabled = false;
    }, 1500);

    // Animate cart icon
    const cartIcon = document.querySelector('[data-cart-count]');
    if (cartIcon) {
      cartIcon.classList.add('cart-bounce');
      setTimeout(() => cartIcon.classList.remove('cart-bounce'), 500);
    }
  }

  updateCartUI() {
    // Update cart count badges
    document.querySelectorAll('[data-cart-count]').forEach(el => {
      el.textContent = this.getItemCount();
      el.style.display = this.getItemCount() > 0 ? 'flex' : 'none';
    });

    // Update cart drawer content
    const cartItems = document.querySelector('[data-cart-items]');
    if (cartItems) {
      if (this.items.length === 0) {
        cartItems.innerHTML = '<p class="cart-empty">Your cart is empty</p>';
      } else {
        cartItems.innerHTML = this.items.map(item => \`
          <div class="cart-item" data-item-id="\${item.id}">
            <img src="\${item.image}" alt="\${item.name}" class="cart-item-image">
            <div class="cart-item-details">
              <h4 class="cart-item-name">\${item.name}</h4>
              <p class="cart-item-price">$\${item.price.toFixed(2)}</p>
              <div class="cart-item-quantity">
                <button data-quantity-minus data-item-id="\${item.id}">−</button>
                <span>\${item.quantity}</span>
                <button data-quantity-plus data-item-id="\${item.id}">+</button>
              </div>
            </div>
            <button class="cart-item-remove" data-remove-item data-item-id="\${item.id}">×</button>
          </div>
        \`).join('');
      }
    }

    // Update totals
    document.querySelectorAll('[data-cart-total]').forEach(el => {
      el.textContent = '$' + this.getTotal().toFixed(2);
    });

    // Update checkout button state
    document.querySelectorAll('[data-checkout]').forEach(btn => {
      btn.disabled = this.items.length === 0;
    });
  }

  toggleCartDrawer() {
    const drawer = document.querySelector('[data-cart-drawer]');
    const overlay = document.querySelector('[data-cart-overlay]');
    if (drawer) {
      drawer.classList.toggle('open');
      overlay?.classList.toggle('open');
      document.body.classList.toggle('cart-open');
    }
  }

  closeCartDrawer() {
    const drawer = document.querySelector('[data-cart-drawer]');
    const overlay = document.querySelector('[data-cart-overlay]');
    drawer?.classList.remove('open');
    overlay?.classList.remove('open');
    document.body.classList.remove('cart-open');
  }

  checkout() {
    if (this.items.length === 0) return;
    
    // Show checkout modal
    const modal = document.querySelector('[data-checkout-modal]');
    if (modal) {
      modal.classList.add('open');
      this.closeCartDrawer();
    } else {
      // Simple alert if no modal
      alert(\`Order Summary:\\n\\n\${this.items.map(i => \`\${i.name} x\${i.quantity} - $\${(i.price * i.quantity).toFixed(2)}\`).join('\\n')}\\n\\nTotal: $\${this.getTotal().toFixed(2)}\\n\\nThis is a demo. In production, this would redirect to checkout.\`);
    }
  }
}

// Initialize cart
const cart = new ShoppingCart();
`;

export const ECOMMERCE_CSS = `
/* ============================================
   E-COMMERCE STYLES
   ============================================ */

/* Product Grid */
.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 32px;
}

.product-card {
  background: var(--bg-card, #fff);
  border-radius: var(--radius-lg, 16px);
  overflow: hidden;
  border: 1px solid var(--border-light, #e5e7eb);
  transition: all 0.3s ease;
}

.product-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(0,0,0,0.1);
}

.product-image {
  position: relative;
  aspect-ratio: 1;
  overflow: hidden;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.product-card:hover .product-image img {
  transform: scale(1.05);
}

.product-badge {
  position: absolute;
  top: 12px;
  left: 12px;
  padding: 6px 12px;
  background: var(--primary, #000);
  color: white;
  font-size: 12px;
  font-weight: 600;
  border-radius: 100px;
}

.product-actions {
  position: absolute;
  bottom: 12px;
  left: 12px;
  right: 12px;
  display: flex;
  gap: 8px;
  opacity: 0;
  transform: translateY(10px);
  transition: all 0.3s ease;
}

.product-card:hover .product-actions {
  opacity: 1;
  transform: translateY(0);
}

.product-info {
  padding: 20px;
}

.product-category {
  font-size: 12px;
  color: var(--text-muted, #9ca3af);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 4px;
}

.product-name {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 8px;
  color: var(--text-primary, #111);
}

.product-price {
  font-size: 20px;
  font-weight: 700;
  color: var(--text-primary, #111);
}

.product-price-original {
  font-size: 14px;
  color: var(--text-muted, #9ca3af);
  text-decoration: line-through;
  margin-left: 8px;
}

/* Quick View Button */
.btn-quick-view {
  flex: 1;
  padding: 12px;
  background: white;
  color: var(--text-primary, #111);
  border: none;
  border-radius: var(--radius-md, 8px);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-quick-view:hover {
  background: var(--bg-secondary, #f3f4f6);
}

.btn-add-cart {
  flex: 1;
  padding: 12px;
  background: var(--primary, #000);
  color: white;
  border: none;
  border-radius: var(--radius-md, 8px);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-add-cart:hover {
  opacity: 0.9;
  transform: scale(1.02);
}

.btn-success {
  background: #10b981 !important;
}

/* Cart Icon */
.cart-icon-wrapper {
  position: relative;
}

[data-cart-count] {
  position: absolute;
  top: -8px;
  right: -8px;
  width: 20px;
  height: 20px;
  background: var(--primary, #ef4444);
  color: white;
  font-size: 11px;
  font-weight: 700;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.cart-bounce {
  animation: cartBounce 0.5s ease;
}

@keyframes cartBounce {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.3); }
}

/* Cart Drawer */
[data-cart-drawer] {
  position: fixed;
  top: 0;
  right: -400px;
  width: 400px;
  max-width: 100%;
  height: 100vh;
  background: white;
  box-shadow: -10px 0 40px rgba(0,0,0,0.1);
  z-index: 1001;
  transition: right 0.3s ease;
  display: flex;
  flex-direction: column;
}

[data-cart-drawer].open {
  right: 0;
}

[data-cart-overlay] {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.5);
  z-index: 1000;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
}

[data-cart-overlay].open {
  opacity: 1;
  visibility: visible;
}

.cart-header {
  padding: 20px;
  border-bottom: 1px solid var(--border-light, #e5e7eb);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.cart-header h3 {
  font-size: 18px;
  font-weight: 700;
}

[data-cart-close] {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: var(--text-muted, #9ca3af);
}

[data-cart-items] {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
}

.cart-empty {
  text-align: center;
  color: var(--text-muted, #9ca3af);
  padding: 40px 0;
}

.cart-item {
  display: flex;
  gap: 16px;
  padding: 16px 0;
  border-bottom: 1px solid var(--border-light, #e5e7eb);
}

.cart-item-image {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: var(--radius-md, 8px);
}

.cart-item-details {
  flex: 1;
}

.cart-item-name {
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 4px;
}

.cart-item-price {
  font-size: 14px;
  color: var(--text-secondary, #6b7280);
  margin-bottom: 8px;
}

.cart-item-quantity {
  display: flex;
  align-items: center;
  gap: 12px;
}

.cart-item-quantity button {
  width: 28px;
  height: 28px;
  border: 1px solid var(--border-light, #e5e7eb);
  background: white;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}

.cart-item-quantity button:hover {
  background: var(--bg-secondary, #f3f4f6);
}

.cart-item-remove {
  background: none;
  border: none;
  font-size: 20px;
  color: var(--text-muted, #9ca3af);
  cursor: pointer;
}

.cart-item-remove:hover {
  color: #ef4444;
}

.cart-footer {
  padding: 20px;
  border-top: 1px solid var(--border-light, #e5e7eb);
}

.cart-total {
  display: flex;
  justify-content: space-between;
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 16px;
}

/* Checkout Modal */
[data-checkout-modal] {
  position: fixed;
  inset: 0;
  z-index: 1002;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0,0,0,0.5);
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
}

[data-checkout-modal].open {
  opacity: 1;
  visibility: visible;
}

.checkout-modal-content {
  background: white;
  border-radius: var(--radius-xl, 24px);
  padding: 40px;
  max-width: 500px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
}

body.cart-open {
  overflow: hidden;
}
`;

export const ECOMMERCE_HTML_COMPONENTS = `
<!-- Cart Drawer (add before closing body tag) -->
<div data-cart-overlay></div>
<div data-cart-drawer>
  <div class="cart-header">
    <h3>Your Cart (<span data-cart-count>0</span>)</h3>
    <button data-cart-close>×</button>
  </div>
  <div data-cart-items>
    <p class="cart-empty">Your cart is empty</p>
  </div>
  <div class="cart-footer">
    <div class="cart-total">
      <span>Total</span>
      <span data-cart-total>$0.00</span>
    </div>
    <button class="btn btn-primary btn-block" data-checkout>Checkout</button>
  </div>
</div>

<!-- Product Card Template -->
<!--
<div class="product-card" data-product data-product-id="1" data-product-name="Product Name" data-product-price="99.00">
  <div class="product-image">
    <img src="IMAGE_URL" alt="Product Name">
    <span class="product-badge">New</span>
    <div class="product-actions">
      <button class="btn-quick-view" data-quick-view>Quick View</button>
      <button class="btn-add-cart" data-add-to-cart>Add to Cart</button>
    </div>
  </div>
  <div class="product-info">
    <p class="product-category">Category</p>
    <h3 class="product-name">Product Name</h3>
    <p class="product-price">$99.00</p>
  </div>
</div>
-->

<!-- Cart Icon (add to navbar) -->
<!--
<button class="cart-icon-wrapper" data-cart-toggle>
  <svg>...</svg>
  <span data-cart-count style="display:none">0</span>
</button>
-->
`;

// ============================================================================
// RESTAURANT FUNCTIONALITY (Reservations, Menu)
// ============================================================================

export const RESTAURANT_JS = `
// ============================================
// RESTAURANT FUNCTIONALITY
// ============================================

class ReservationSystem {
  constructor() {
    this.reservations = JSON.parse(localStorage.getItem('reservations')) || [];
    this.init();
  }

  init() {
    this.bindEvents();
    this.initDatePicker();
  }

  bindEvents() {
    const form = document.querySelector('[data-reservation-form]');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleReservation(form);
      });
    }

    // Time slot selection
    document.querySelectorAll('[data-time-slot]').forEach(slot => {
      slot.addEventListener('click', () => {
        document.querySelectorAll('[data-time-slot]').forEach(s => s.classList.remove('selected'));
        slot.classList.add('selected');
        const hiddenInput = document.querySelector('[name="time"]');
        if (hiddenInput) hiddenInput.value = slot.dataset.timeSlot;
      });
    });

    // Party size buttons
    document.querySelectorAll('[data-party-size]').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('[data-party-size]').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        const hiddenInput = document.querySelector('[name="party_size"]');
        if (hiddenInput) hiddenInput.value = btn.dataset.partySize;
      });
    });
  }

  initDatePicker() {
    const dateInput = document.querySelector('[data-reservation-date]');
    if (dateInput) {
      // Set min date to today
      const today = new Date().toISOString().split('T')[0];
      dateInput.setAttribute('min', today);
      
      // Set max date to 30 days from now
      const maxDate = new Date();
      maxDate.setDate(maxDate.getDate() + 30);
      dateInput.setAttribute('max', maxDate.toISOString().split('T')[0]);
    }
  }

  handleReservation(form) {
    const formData = new FormData(form);
    const reservation = {
      id: Date.now(),
      name: formData.get('name'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      date: formData.get('date'),
      time: formData.get('time'),
      partySize: formData.get('party_size'),
      specialRequests: formData.get('special_requests'),
      createdAt: new Date().toISOString()
    };

    // Validate
    if (!reservation.name || !reservation.date || !reservation.time) {
      this.showMessage('Please fill in all required fields', 'error');
      return;
    }

    // Save
    this.reservations.push(reservation);
    localStorage.setItem('reservations', JSON.stringify(this.reservations));

    // Show confirmation
    this.showConfirmation(reservation);
    form.reset();
  }

  showConfirmation(reservation) {
    const modal = document.querySelector('[data-reservation-confirmation]');
    if (modal) {
      modal.querySelector('[data-confirm-name]').textContent = reservation.name;
      modal.querySelector('[data-confirm-date]').textContent = new Date(reservation.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
      modal.querySelector('[data-confirm-time]').textContent = reservation.time;
      modal.querySelector('[data-confirm-party]').textContent = reservation.partySize + ' guests';
      modal.classList.add('open');
    } else {
      alert(\`Reservation Confirmed!\\n\\nName: \${reservation.name}\\nDate: \${reservation.date}\\nTime: \${reservation.time}\\nParty: \${reservation.partySize} guests\\n\\nWe'll send a confirmation to \${reservation.email}\`);
    }
  }

  showMessage(message, type = 'info') {
    // Could show a toast notification
    alert(message);
  }
}

// Menu filtering
class MenuFilter {
  constructor() {
    this.init();
  }

  init() {
    document.querySelectorAll('[data-menu-filter]').forEach(btn => {
      btn.addEventListener('click', () => {
        const category = btn.dataset.menuFilter;
        
        // Update active button
        document.querySelectorAll('[data-menu-filter]').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        // Filter items
        document.querySelectorAll('[data-menu-item]').forEach(item => {
          if (category === 'all' || item.dataset.menuCategory === category) {
            item.style.display = '';
            item.classList.add('reveal', 'active');
          } else {
            item.style.display = 'none';
          }
        });
      });
    });
  }
}

// Initialize
const reservations = new ReservationSystem();
const menuFilter = new MenuFilter();
`;

export const RESTAURANT_CSS = `
/* ============================================
   RESTAURANT STYLES
   ============================================ */

/* Reservation Form */
.reservation-widget {
  background: var(--bg-card, #fff);
  border-radius: var(--radius-xl, 24px);
  padding: 40px;
  box-shadow: 0 20px 40px rgba(0,0,0,0.1);
}

.time-slots {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  margin-bottom: 24px;
}

[data-time-slot] {
  padding: 12px;
  border: 2px solid var(--border-light, #e5e7eb);
  border-radius: var(--radius-md, 8px);
  background: white;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
  text-align: center;
}

[data-time-slot]:hover {
  border-color: var(--primary);
}

[data-time-slot].selected {
  background: var(--primary);
  color: white;
  border-color: var(--primary);
}

[data-time-slot].unavailable {
  opacity: 0.5;
  cursor: not-allowed;
  text-decoration: line-through;
}

.party-size-selector {
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
}

[data-party-size] {
  width: 48px;
  height: 48px;
  border: 2px solid var(--border-light, #e5e7eb);
  border-radius: 50%;
  background: white;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
}

[data-party-size]:hover {
  border-color: var(--primary);
}

[data-party-size].selected {
  background: var(--primary);
  color: white;
  border-color: var(--primary);
}

/* Menu */
.menu-filters {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  margin-bottom: 40px;
}

[data-menu-filter] {
  padding: 10px 24px;
  border: 1px solid var(--border-light, #e5e7eb);
  border-radius: 100px;
  background: white;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
}

[data-menu-filter]:hover,
[data-menu-filter].active {
  background: var(--primary);
  color: white;
  border-color: var(--primary);
}

.menu-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 32px;
}

.menu-item {
  display: flex;
  gap: 20px;
  padding: 24px;
  background: var(--bg-card, #fff);
  border-radius: var(--radius-lg, 16px);
  border: 1px solid var(--border-light, #e5e7eb);
}

.menu-item-image {
  width: 100px;
  height: 100px;
  border-radius: var(--radius-md, 8px);
  object-fit: cover;
}

.menu-item-content {
  flex: 1;
}

.menu-item-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 8px;
}

.menu-item-name {
  font-size: 18px;
  font-weight: 600;
}

.menu-item-price {
  font-size: 18px;
  font-weight: 700;
  color: var(--primary);
}

.menu-item-description {
  font-size: 14px;
  color: var(--text-secondary, #6b7280);
  line-height: 1.6;
}

.menu-item-tags {
  display: flex;
  gap: 8px;
  margin-top: 12px;
}

.menu-tag {
  font-size: 11px;
  padding: 4px 8px;
  background: var(--bg-secondary, #f3f4f6);
  border-radius: 4px;
  color: var(--text-muted, #9ca3af);
}

/* Reservation Confirmation Modal */
[data-reservation-confirmation] {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0,0,0,0.5);
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
}

[data-reservation-confirmation].open {
  opacity: 1;
  visibility: visible;
}

.confirmation-content {
  background: white;
  border-radius: var(--radius-xl, 24px);
  padding: 48px;
  text-align: center;
  max-width: 450px;
}

.confirmation-icon {
  width: 80px;
  height: 80px;
  background: #10b981;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 24px;
  font-size: 40px;
  color: white;
}

@media (max-width: 640px) {
  .time-slots {
    grid-template-columns: repeat(2, 1fr);
  }
}
`;

// ============================================================================
// BOOKING/APPOINTMENT FUNCTIONALITY (Spa, Medical, Services)
// ============================================================================

export const BOOKING_JS = `
// ============================================
// BOOKING/APPOINTMENT FUNCTIONALITY
// ============================================

class BookingSystem {
  constructor() {
    this.selectedService = null;
    this.selectedDate = null;
    this.selectedTime = null;
    this.init();
  }

  init() {
    this.bindEvents();
    this.generateCalendar();
  }

  bindEvents() {
    // Service selection
    document.querySelectorAll('[data-service]').forEach(card => {
      card.addEventListener('click', () => {
        document.querySelectorAll('[data-service]').forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        this.selectedService = {
          id: card.dataset.serviceId,
          name: card.dataset.serviceName || card.querySelector('.service-name')?.textContent,
          price: card.dataset.servicePrice,
          duration: card.dataset.serviceDuration
        };
        this.updateSummary();
        this.scrollToStep(2);
      });
    });

    // Date selection
    document.addEventListener('click', (e) => {
      if (e.target.matches('[data-calendar-day]:not(.disabled)')) {
        document.querySelectorAll('[data-calendar-day]').forEach(d => d.classList.remove('selected'));
        e.target.classList.add('selected');
        this.selectedDate = e.target.dataset.date;
        this.updateSummary();
        this.loadTimeSlots();
        this.scrollToStep(3);
      }
    });

    // Time selection
    document.addEventListener('click', (e) => {
      if (e.target.matches('[data-booking-time]:not(.unavailable)')) {
        document.querySelectorAll('[data-booking-time]').forEach(t => t.classList.remove('selected'));
        e.target.classList.add('selected');
        this.selectedTime = e.target.dataset.bookingTime;
        this.updateSummary();
        this.scrollToStep(4);
      }
    });

    // Form submission
    const form = document.querySelector('[data-booking-form]');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        this.submitBooking(form);
      });
    }

    // Month navigation
    document.querySelector('[data-calendar-prev]')?.addEventListener('click', () => this.changeMonth(-1));
    document.querySelector('[data-calendar-next]')?.addEventListener('click', () => this.changeMonth(1));
  }

  currentMonth = new Date();

  generateCalendar() {
    const container = document.querySelector('[data-calendar]');
    if (!container) return;

    const year = this.currentMonth.getFullYear();
    const month = this.currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Update header
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                        'July', 'August', 'September', 'October', 'November', 'December'];
    document.querySelector('[data-calendar-month]').textContent = \`\${monthNames[month]} \${year}\`;

    // Generate days
    let html = '';
    
    // Empty cells for days before first day of month
    for (let i = 0; i < firstDay.getDay(); i++) {
      html += '<div class="calendar-day empty"></div>';
    }

    // Days of the month
    for (let day = 1; day <= lastDay.getDate(); day++) {
      const date = new Date(year, month, day);
      const dateStr = date.toISOString().split('T')[0];
      const isPast = date < today;
      const isToday = date.getTime() === today.getTime();
      
      html += \`
        <div class="calendar-day \${isPast ? 'disabled' : ''} \${isToday ? 'today' : ''}" 
             data-calendar-day 
             data-date="\${dateStr}"
             \${isPast ? 'disabled' : ''}>
          \${day}
        </div>
      \`;
    }

    container.innerHTML = html;
  }

  changeMonth(delta) {
    this.currentMonth.setMonth(this.currentMonth.getMonth() + delta);
    this.generateCalendar();
  }

  loadTimeSlots() {
    const container = document.querySelector('[data-time-slots]');
    if (!container) return;

    // Generate time slots (9 AM to 6 PM)
    const slots = [];
    for (let hour = 9; hour <= 17; hour++) {
      slots.push(\`\${hour}:00\`);
      slots.push(\`\${hour}:30\`);
    }

    // Randomly mark some as unavailable for demo
    const unavailable = new Set();
    for (let i = 0; i < 4; i++) {
      unavailable.add(slots[Math.floor(Math.random() * slots.length)]);
    }

    container.innerHTML = slots.map(slot => {
      const isUnavailable = unavailable.has(slot);
      const hour = parseInt(slot);
      const displayTime = hour > 12 ? \`\${hour - 12}:\${slot.split(':')[1]} PM\` : \`\${slot} AM\`;
      
      return \`
        <button class="time-slot \${isUnavailable ? 'unavailable' : ''}" 
                data-booking-time="\${slot}"
                \${isUnavailable ? 'disabled' : ''}>
          \${displayTime}
        </button>
      \`;
    }).join('');
  }

  updateSummary() {
    const summary = document.querySelector('[data-booking-summary]');
    if (!summary) return;

    summary.innerHTML = \`
      \${this.selectedService ? \`<p><strong>Service:</strong> \${this.selectedService.name} - $\${this.selectedService.price}</p>\` : ''}
      \${this.selectedDate ? \`<p><strong>Date:</strong> \${new Date(this.selectedDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>\` : ''}
      \${this.selectedTime ? \`<p><strong>Time:</strong> \${this.selectedTime}</p>\` : ''}
    \`;
  }

  scrollToStep(step) {
    const el = document.querySelector(\`[data-booking-step="\${step}"]\`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  submitBooking(form) {
    if (!this.selectedService || !this.selectedDate || !this.selectedTime) {
      alert('Please complete all booking steps');
      return;
    }

    const formData = new FormData(form);
    const booking = {
      id: Date.now(),
      service: this.selectedService,
      date: this.selectedDate,
      time: this.selectedTime,
      name: formData.get('name'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      notes: formData.get('notes'),
      createdAt: new Date().toISOString()
    };

    // Save to localStorage
    const bookings = JSON.parse(localStorage.getItem('bookings')) || [];
    bookings.push(booking);
    localStorage.setItem('bookings', JSON.stringify(bookings));

    // Show confirmation
    alert(\`Booking Confirmed!\\n\\n\${booking.service.name}\\n\${new Date(booking.date).toLocaleDateString()} at \${booking.time}\\n\\nWe'll send a confirmation to \${booking.email}\`);
    
    // Reset
    form.reset();
    this.selectedService = null;
    this.selectedDate = null;
    this.selectedTime = null;
    document.querySelectorAll('.selected').forEach(el => el.classList.remove('selected'));
    this.updateSummary();
  }
}

const booking = new BookingSystem();
`;

export const BOOKING_CSS = `
/* ============================================
   BOOKING STYLES
   ============================================ */

.booking-steps {
  display: grid;
  gap: 48px;
}

.booking-step {
  scroll-margin-top: 100px;
}

.step-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
}

.step-number {
  width: 40px;
  height: 40px;
  background: var(--primary);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
}

.services-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
}

[data-service] {
  padding: 24px;
  border: 2px solid var(--border-light, #e5e7eb);
  border-radius: var(--radius-lg, 16px);
  cursor: pointer;
  transition: all 0.3s ease;
}

[data-service]:hover {
  border-color: var(--primary);
  transform: translateY(-4px);
}

[data-service].selected {
  border-color: var(--primary);
  background: rgba(var(--primary-rgb), 0.05);
}

.service-name {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 8px;
}

.service-duration {
  font-size: 14px;
  color: var(--text-muted, #9ca3af);
  margin-bottom: 12px;
}

.service-price {
  font-size: 24px;
  font-weight: 700;
  color: var(--primary);
}

/* Calendar */
.calendar-container {
  max-width: 400px;
}

.calendar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

.calendar-nav {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  padding: 8px;
  color: var(--text-secondary);
}

.calendar-nav:hover {
  color: var(--primary);
}

.calendar-weekdays {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
  margin-bottom: 8px;
}

.calendar-weekday {
  text-align: center;
  font-size: 12px;
  font-weight: 600;
  color: var(--text-muted, #9ca3af);
  padding: 8px;
}

[data-calendar] {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
}

.calendar-day {
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-md, 8px);
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;
}

.calendar-day:not(.disabled):not(.empty):hover {
  background: var(--bg-secondary, #f3f4f6);
}

.calendar-day.today {
  border: 2px solid var(--primary);
}

.calendar-day.selected {
  background: var(--primary);
  color: white;
}

.calendar-day.disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.calendar-day.empty {
  cursor: default;
}

/* Time Slots */
[data-time-slots] {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
}

.time-slot {
  padding: 14px;
  border: 2px solid var(--border-light, #e5e7eb);
  border-radius: var(--radius-md, 8px);
  background: white;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;
}

.time-slot:hover:not(.unavailable) {
  border-color: var(--primary);
}

.time-slot.selected {
  background: var(--primary);
  color: white;
  border-color: var(--primary);
}

.time-slot.unavailable {
  opacity: 0.4;
  cursor: not-allowed;
  text-decoration: line-through;
}

/* Booking Summary */
[data-booking-summary] {
  background: var(--bg-secondary, #f3f4f6);
  padding: 24px;
  border-radius: var(--radius-lg, 16px);
  margin-bottom: 24px;
}

@media (max-width: 640px) {
  [data-time-slots] {
    grid-template-columns: repeat(2, 1fr);
  }
}
`;

// ============================================================================
// REAL ESTATE FUNCTIONALITY
// ============================================================================

export const REALESTATE_JS = `
// ============================================
// REAL ESTATE FUNCTIONALITY
// ============================================

class PropertySearch {
  constructor() {
    this.filters = {
      minPrice: 0,
      maxPrice: Infinity,
      beds: 'any',
      baths: 'any',
      type: 'any'
    };
    this.init();
  }

  init() {
    this.bindEvents();
    this.initPriceSlider();
  }

  bindEvents() {
    // Filter buttons
    document.querySelectorAll('[data-filter-beds]').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('[data-filter-beds]').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.filters.beds = btn.dataset.filterBeds;
        this.applyFilters();
      });
    });

    document.querySelectorAll('[data-filter-type]').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('[data-filter-type]').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.filters.type = btn.dataset.filterType;
        this.applyFilters();
      });
    });

    // Search form
    document.querySelector('[data-property-search]')?.addEventListener('submit', (e) => {
      e.preventDefault();
      this.applyFilters();
    });

    // Property cards - schedule tour
    document.querySelectorAll('[data-schedule-tour]').forEach(btn => {
      btn.addEventListener('click', () => {
        const propertyId = btn.dataset.propertyId;
        const propertyName = btn.closest('[data-property]')?.querySelector('.property-address')?.textContent || 'this property';
        this.openTourModal(propertyId, propertyName);
      });
    });

    // Favorite toggle
    document.querySelectorAll('[data-favorite]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        btn.classList.toggle('active');
        const propertyId = btn.dataset.propertyId;
        this.toggleFavorite(propertyId);
      });
    });
  }

  initPriceSlider() {
    const minSlider = document.querySelector('[data-price-min]');
    const maxSlider = document.querySelector('[data-price-max]');
    
    if (minSlider && maxSlider) {
      const updatePrice = () => {
        const minVal = parseInt(minSlider.value);
        const maxVal = parseInt(maxSlider.value);
        
        document.querySelector('[data-price-min-display]').textContent = '$' + minVal.toLocaleString();
        document.querySelector('[data-price-max-display]').textContent = '$' + maxVal.toLocaleString();
        
        this.filters.minPrice = minVal;
        this.filters.maxPrice = maxVal;
      };
      
      minSlider.addEventListener('input', updatePrice);
      maxSlider.addEventListener('input', updatePrice);
    }
  }

  applyFilters() {
    document.querySelectorAll('[data-property]').forEach(card => {
      const price = parseInt(card.dataset.price) || 0;
      const beds = card.dataset.beds;
      const type = card.dataset.type;
      
      let show = true;
      
      if (price < this.filters.minPrice || price > this.filters.maxPrice) show = false;
      if (this.filters.beds !== 'any' && beds !== this.filters.beds) show = false;
      if (this.filters.type !== 'any' && type !== this.filters.type) show = false;
      
      card.style.display = show ? '' : 'none';
    });

    // Update count
    const visibleCount = document.querySelectorAll('[data-property]:not([style*="display: none"])').length;
    const countEl = document.querySelector('[data-results-count]');
    if (countEl) countEl.textContent = visibleCount + ' properties found';
  }

  toggleFavorite(propertyId) {
    let favorites = JSON.parse(localStorage.getItem('favoriteProperties')) || [];
    
    if (favorites.includes(propertyId)) {
      favorites = favorites.filter(id => id !== propertyId);
    } else {
      favorites.push(propertyId);
    }
    
    localStorage.setItem('favoriteProperties', JSON.stringify(favorites));
  }

  openTourModal(propertyId, propertyName) {
    const modal = document.querySelector('[data-tour-modal]');
    if (modal) {
      modal.querySelector('[data-tour-property-name]').textContent = propertyName;
      modal.querySelector('[name="property_id"]').value = propertyId;
      modal.classList.add('open');
    } else {
      alert(\`Schedule a tour for \${propertyName}\\n\\nThis would open a booking form in production.\`);
    }
  }
}

// Image Gallery for property details
class PropertyGallery {
  constructor() {
    this.currentIndex = 0;
    this.init();
  }

  init() {
    const gallery = document.querySelector('[data-property-gallery]');
    if (!gallery) return;

    this.images = gallery.querySelectorAll('.gallery-image');
    this.thumbnails = gallery.querySelectorAll('.gallery-thumb');
    this.total = this.images.length;

    document.querySelector('[data-gallery-prev]')?.addEventListener('click', () => this.navigate(-1));
    document.querySelector('[data-gallery-next]')?.addEventListener('click', () => this.navigate(1));

    this.thumbnails.forEach((thumb, i) => {
      thumb.addEventListener('click', () => this.goTo(i));
    });
  }

  navigate(delta) {
    this.goTo(this.currentIndex + delta);
  }

  goTo(index) {
    this.currentIndex = (index + this.total) % this.total;
    
    this.images.forEach((img, i) => {
      img.classList.toggle('active', i === this.currentIndex);
    });
    
    this.thumbnails.forEach((thumb, i) => {
      thumb.classList.toggle('active', i === this.currentIndex);
    });
  }
}

const propertySearch = new PropertySearch();
const propertyGallery = new PropertyGallery();
`;

// ============================================================================
// GENERAL INTERACTIVE FEATURES
// ============================================================================

export const GENERAL_INTERACTIVE_JS = `
// ============================================
// GENERAL INTERACTIVE FEATURES
// ============================================

// Tabs
class Tabs {
  constructor(container) {
    this.container = container;
    this.tabs = container.querySelectorAll('[data-tab]');
    this.panels = container.querySelectorAll('[data-tab-panel]');
    this.init();
  }

  init() {
    this.tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const target = tab.dataset.tab;
        this.activate(target);
      });
    });
  }

  activate(target) {
    this.tabs.forEach(t => t.classList.toggle('active', t.dataset.tab === target));
    this.panels.forEach(p => p.classList.toggle('active', p.dataset.tabPanel === target));
  }
}

document.querySelectorAll('[data-tabs]').forEach(el => new Tabs(el));

// Modals
class Modal {
  static open(id) {
    const modal = document.querySelector(\`[data-modal="\${id}"]\`);
    if (modal) {
      modal.classList.add('open');
      document.body.classList.add('modal-open');
    }
  }

  static close(id) {
    const modal = id 
      ? document.querySelector(\`[data-modal="\${id}"]\`)
      : document.querySelector('[data-modal].open');
    if (modal) {
      modal.classList.remove('open');
      document.body.classList.remove('modal-open');
    }
  }
}

// Open modal triggers
document.querySelectorAll('[data-modal-open]').forEach(btn => {
  btn.addEventListener('click', () => Modal.open(btn.dataset.modalOpen));
});

// Close modal triggers
document.querySelectorAll('[data-modal-close]').forEach(btn => {
  btn.addEventListener('click', () => Modal.close());
});

// Close on overlay click
document.querySelectorAll('[data-modal]').forEach(modal => {
  modal.addEventListener('click', (e) => {
    if (e.target === modal) Modal.close();
  });
});

// Close on escape
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') Modal.close();
});

// Accordion (enhanced)
document.querySelectorAll('[data-accordion]').forEach(accordion => {
  accordion.querySelectorAll('[data-accordion-trigger]').forEach(trigger => {
    trigger.addEventListener('click', () => {
      const item = trigger.closest('[data-accordion-item]');
      const isOpen = item.classList.contains('open');
      
      // Close others if single mode
      if (accordion.dataset.accordion === 'single') {
        accordion.querySelectorAll('[data-accordion-item]').forEach(i => i.classList.remove('open'));
      }
      
      item.classList.toggle('open', !isOpen);
    });
  });
});

// Image Lightbox
class Lightbox {
  constructor() {
    this.create();
    this.bind();
  }

  create() {
    if (document.querySelector('.lightbox')) return;
    
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.innerHTML = \`
      <button class="lightbox-close">&times;</button>
      <button class="lightbox-prev">&#10094;</button>
      <button class="lightbox-next">&#10095;</button>
      <img class="lightbox-image" src="" alt="">
    \`;
    document.body.appendChild(lightbox);
    this.lightbox = lightbox;
    this.image = lightbox.querySelector('.lightbox-image');
  }

  bind() {
    document.querySelectorAll('[data-lightbox]').forEach((img, index) => {
      img.style.cursor = 'pointer';
      img.addEventListener('click', () => this.open(img.src, index));
    });

    this.lightbox.querySelector('.lightbox-close').addEventListener('click', () => this.close());
    this.lightbox.querySelector('.lightbox-prev').addEventListener('click', () => this.navigate(-1));
    this.lightbox.querySelector('.lightbox-next').addEventListener('click', () => this.navigate(1));
    this.lightbox.addEventListener('click', (e) => {
      if (e.target === this.lightbox) this.close();
    });
  }

  open(src, index) {
    this.currentIndex = index;
    this.images = Array.from(document.querySelectorAll('[data-lightbox]'));
    this.image.src = src;
    this.lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  close() {
    this.lightbox.classList.remove('open');
    document.body.style.overflow = '';
  }

  navigate(delta) {
    this.currentIndex = (this.currentIndex + delta + this.images.length) % this.images.length;
    this.image.src = this.images[this.currentIndex].src;
  }
}

new Lightbox();

// Tooltips
document.querySelectorAll('[data-tooltip]').forEach(el => {
  const tip = document.createElement('span');
  tip.className = 'tooltip';
  tip.textContent = el.dataset.tooltip;
  el.style.position = 'relative';
  el.appendChild(tip);
});

// Copy to clipboard
document.querySelectorAll('[data-copy]').forEach(btn => {
  btn.addEventListener('click', () => {
    const text = btn.dataset.copy || btn.previousElementSibling?.textContent;
    navigator.clipboard.writeText(text).then(() => {
      const original = btn.textContent;
      btn.textContent = 'Copied!';
      setTimeout(() => btn.textContent = original, 2000);
    });
  });
});

// Number increment/decrement inputs
document.querySelectorAll('[data-number-input]').forEach(wrapper => {
  const input = wrapper.querySelector('input');
  const min = parseInt(input.min) || 0;
  const max = parseInt(input.max) || 999;
  
  wrapper.querySelector('[data-decrement]')?.addEventListener('click', () => {
    input.value = Math.max(min, parseInt(input.value) - 1);
    input.dispatchEvent(new Event('change'));
  });
  
  wrapper.querySelector('[data-increment]')?.addEventListener('click', () => {
    input.value = Math.min(max, parseInt(input.value) + 1);
    input.dispatchEvent(new Event('change'));
  });
});

// Form validation with visual feedback
document.querySelectorAll('form[data-validate]').forEach(form => {
  form.querySelectorAll('input, textarea, select').forEach(field => {
    field.addEventListener('blur', () => {
      validateField(field);
    });
  });

  form.addEventListener('submit', (e) => {
    let valid = true;
    form.querySelectorAll('[required]').forEach(field => {
      if (!validateField(field)) valid = false;
    });
    if (!valid) e.preventDefault();
  });
});

function validateField(field) {
  const isValid = field.checkValidity();
  field.classList.toggle('invalid', !isValid);
  field.classList.toggle('valid', isValid && field.value);
  
  // Show/hide error message
  let error = field.parentElement.querySelector('.field-error');
  if (!isValid && !error) {
    error = document.createElement('span');
    error.className = 'field-error';
    error.textContent = field.validationMessage;
    field.parentElement.appendChild(error);
  } else if (isValid && error) {
    error.remove();
  }
  
  return isValid;
}

// Scroll progress indicator
const progressBar = document.querySelector('[data-scroll-progress]');
if (progressBar) {
  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.body.scrollHeight - window.innerHeight;
    const progress = (scrollTop / docHeight) * 100;
    progressBar.style.width = progress + '%';
  });
}

// Reading time estimator
document.querySelectorAll('[data-reading-time]').forEach(el => {
  const article = document.querySelector(el.dataset.readingTime || 'article');
  if (article) {
    const text = article.textContent;
    const words = text.split(/\\s+/).length;
    const minutes = Math.ceil(words / 200);
    el.textContent = minutes + ' min read';
  }
});
`;

export const GENERAL_INTERACTIVE_CSS = `
/* ============================================
   GENERAL INTERACTIVE STYLES
   ============================================ */

/* Tabs */
.tabs-nav {
  display: flex;
  gap: 8px;
  border-bottom: 1px solid var(--border-light, #e5e7eb);
  margin-bottom: 24px;
}

[data-tab] {
  padding: 12px 24px;
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  cursor: pointer;
  font-weight: 500;
  color: var(--text-secondary, #6b7280);
  transition: all 0.3s ease;
}

[data-tab]:hover {
  color: var(--text-primary, #111);
}

[data-tab].active {
  color: var(--primary);
  border-bottom-color: var(--primary);
}

[data-tab-panel] {
  display: none;
}

[data-tab-panel].active {
  display: block;
  animation: fadeIn 0.3s ease;
}

/* Modals */
[data-modal] {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: rgba(0,0,0,0.5);
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
}

[data-modal].open {
  opacity: 1;
  visibility: visible;
}

.modal-content {
  background: white;
  border-radius: var(--radius-xl, 24px);
  padding: 40px;
  max-width: 500px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  transform: scale(0.95) translateY(20px);
  transition: transform 0.3s ease;
}

[data-modal].open .modal-content {
  transform: scale(1) translateY(0);
}

body.modal-open {
  overflow: hidden;
}

/* Accordion */
[data-accordion-item] {
  border: 1px solid var(--border-light, #e5e7eb);
  border-radius: var(--radius-lg, 16px);
  margin-bottom: 12px;
  overflow: hidden;
}

[data-accordion-trigger] {
  width: 100%;
  padding: 20px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: none;
  border: none;
  cursor: pointer;
  font-weight: 600;
  font-size: 16px;
  text-align: left;
}

[data-accordion-trigger]::after {
  content: '+';
  font-size: 24px;
  color: var(--text-muted, #9ca3af);
  transition: transform 0.3s ease;
}

[data-accordion-item].open [data-accordion-trigger]::after {
  content: '−';
}

[data-accordion-content] {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.3s ease;
}

[data-accordion-item].open [data-accordion-content] {
  max-height: 500px;
}

[data-accordion-content] > div {
  padding: 0 24px 24px;
  color: var(--text-secondary, #6b7280);
}

/* Lightbox */
.lightbox {
  position: fixed;
  inset: 0;
  z-index: 2000;
  background: rgba(0,0,0,0.95);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
}

.lightbox.open {
  opacity: 1;
  visibility: visible;
}

.lightbox-image {
  max-width: 90%;
  max-height: 90vh;
  object-fit: contain;
}

.lightbox-close,
.lightbox-prev,
.lightbox-next {
  position: absolute;
  background: none;
  border: none;
  color: white;
  font-size: 32px;
  cursor: pointer;
  padding: 20px;
  transition: opacity 0.3s ease;
}

.lightbox-close:hover,
.lightbox-prev:hover,
.lightbox-next:hover {
  opacity: 0.7;
}

.lightbox-close { top: 0; right: 0; }
.lightbox-prev { left: 0; top: 50%; transform: translateY(-50%); }
.lightbox-next { right: 0; top: 50%; transform: translateY(-50%); }

/* Tooltips */
[data-tooltip] {
  position: relative;
}

.tooltip {
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%) translateY(-8px);
  padding: 8px 12px;
  background: var(--text-primary, #111);
  color: white;
  font-size: 13px;
  border-radius: 6px;
  white-space: nowrap;
  opacity: 0;
  visibility: hidden;
  transition: all 0.2s ease;
  pointer-events: none;
}

[data-tooltip]:hover .tooltip {
  opacity: 1;
  visibility: visible;
  transform: translateX(-50%) translateY(-4px);
}

/* Form validation */
.form-input.invalid {
  border-color: #ef4444;
}

.form-input.valid {
  border-color: #10b981;
}

.field-error {
  display: block;
  font-size: 12px;
  color: #ef4444;
  margin-top: 4px;
}

/* Scroll progress */
[data-scroll-progress] {
  position: fixed;
  top: 0;
  left: 0;
  height: 3px;
  background: var(--primary);
  z-index: 9999;
  transition: width 0.1s ease;
}

/* Number input */
[data-number-input] {
  display: flex;
  align-items: center;
}

[data-number-input] input {
  width: 60px;
  text-align: center;
  border: none;
  font-size: 16px;
  font-weight: 600;
}

[data-decrement],
[data-increment] {
  width: 36px;
  height: 36px;
  border: 1px solid var(--border-light, #e5e7eb);
  background: white;
  border-radius: 50%;
  cursor: pointer;
  font-size: 18px;
}

[data-decrement]:hover,
[data-increment]:hover {
  background: var(--bg-secondary, #f3f4f6);
}
`;

// ============================================================================
// HELPER TO GET FEATURES BY INDUSTRY
// ============================================================================

export function getInteractiveFeaturesForIndustry(industry: string): {
  js: string;
  css: string;
  html?: string;
} {
  switch (industry) {
    case 'ecommerce':
    case 'e-commerce':
      return {
        js: ECOMMERCE_JS + '\n' + GENERAL_INTERACTIVE_JS,
        css: ECOMMERCE_CSS + '\n' + GENERAL_INTERACTIVE_CSS,
        html: ECOMMERCE_HTML_COMPONENTS,
      };
    
    case 'restaurant':
    case 'food':
      return {
        js: RESTAURANT_JS + '\n' + GENERAL_INTERACTIVE_JS,
        css: RESTAURANT_CSS + '\n' + GENERAL_INTERACTIVE_CSS,
      };
    
    case 'health-beauty':
    case 'spa':
    case 'medical':
    case 'fitness':
      return {
        js: BOOKING_JS + '\n' + GENERAL_INTERACTIVE_JS,
        css: BOOKING_CSS + '\n' + GENERAL_INTERACTIVE_CSS,
      };
    
    case 'real-estate':
      return {
        js: REALESTATE_JS + '\n' + GENERAL_INTERACTIVE_JS,
        css: GENERAL_INTERACTIVE_CSS,
      };
    
    default:
      return {
        js: GENERAL_INTERACTIVE_JS,
        css: GENERAL_INTERACTIVE_CSS,
      };
  }
}

export function getAllInteractiveFeatures(): { js: string; css: string } {
  return {
    js: [
      ECOMMERCE_JS,
      RESTAURANT_JS,
      BOOKING_JS,
      REALESTATE_JS,
      GENERAL_INTERACTIVE_JS,
    ].join('\n\n'),
    css: [
      ECOMMERCE_CSS,
      RESTAURANT_CSS,
      BOOKING_CSS,
      GENERAL_INTERACTIVE_CSS,
    ].join('\n\n'),
  };
}
