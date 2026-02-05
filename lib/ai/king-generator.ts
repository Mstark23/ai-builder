// /lib/ai/king-generator.ts
// VERKTORLABS - King DNA Website Generator v3
//
// THE FIX:
// v1: "use these colors and fonts" → Claude built generic landing pages
// v2: "build a product grid with image, name, price" → Claude STILL built generic pages
// v3: Injects ACTUAL HTML SCAFFOLDING → Claude MUST fill in the structure
//
// Instead of describing a product card, we GIVE Claude the HTML skeleton:
// <div class="product-card"><img/><h3/><span class="price"/><button>ADD TO CART</button></div>
// This makes it structurally impossible to generate a centered-text landing page.

import type { KingForensicProfile, CustomerQuestionnaire } from './king-forensic-profile';

// =============================================================================
// SITE TYPE DETECTION
// =============================================================================

function detectSiteType(profile: KingForensicProfile): 
  'ecommerce' | 'saas' | 'agency' | 'portfolio' | 'restaurant' | 'service' | 'generic' {
  
  const industry = (profile.meta.industry || '').toLowerCase();
  const vibe = (profile.meta.overallVibe || '').toLowerCase();
  const hasCart = profile.navigation.hasCartIcon;
  const navLabels = profile.navigation.menuItems.map(m => m.label.toLowerCase()).join(' ');
  const sectionTypes = profile.sections.map(s => s.type.toLowerCase()).join(' ');
  const sectionNames = profile.sections.map(s => s.name.toLowerCase()).join(' ');

  if (hasCart || 
      navLabels.match(/shop|collection|product|sale|new arrival|men|women|accessories/) ||
      sectionTypes.match(/product|catalog|collection/) ||
      sectionNames.match(/product|shop|collection|bestseller|new arrival/) ||
      industry.match(/fashion|jewelry|beauty|skincare|clothing|activewear|footwear|pet|food|beverage|supplement|home|furniture|bedding/)) {
    return 'ecommerce';
  }

  if (navLabels.match(/pricing|docs|documentation|api|developer|changelog/) ||
      sectionTypes.match(/pricing|feature|integration/) ||
      industry.match(/saas|tech|software|fintech/)) {
    return 'saas';
  }

  if (navLabels.match(/menu|reservation|order|dine/) ||
      industry.match(/restaurant|food service|cafe|bar/)) {
    return 'restaurant';
  }

  if (navLabels.match(/work|case stud|portfolio|client/) ||
      sectionTypes.match(/portfolio|case.study|client/)) {
    return 'agency';
  }

  if (navLabels.match(/service|appointment|book|consult/) ||
      industry.match(/salon|spa|dental|medical|legal|accounting/)) {
    return 'service';
  }

  return 'generic';
}

// =============================================================================
// HTML SCAFFOLD GENERATORS
// The critical v3 innovation: instead of text descriptions, we provide
// actual HTML skeletons that Claude MUST use as the page structure.
// =============================================================================

function buildEcommerceScaffold(
  profile: KingForensicProfile,
  customer: CustomerQuestionnaire
): string {
  const brandName = customer.businessName;
  const navItems = profile.navigation.menuItems.slice(0, 5);
  const ctaText = profile.hero.ctaButtons[0]?.text || 'SHOP NOW';
  const industry = customer.industry || 'fashion';
  
  // Generate realistic product data based on industry
  const productData = generateProductData(customer);
  
  // Build product cards HTML
  const productCardsHtml = productData.map((p, i) => `
        <div class="product-card">
          <div class="product-image-wrapper">
            <img src="https://images.unsplash.com/photo-${getProductImageId(industry, i)}?w=600&q=80" alt="${p.name}" class="product-image" />
            ${i < 2 ? '<span class="product-badge">NEW</span>' : ''}
          </div>
          <div class="product-info">
            <h3 class="product-name">${p.name}</h3>
            <div class="product-price">$${p.price}</div>
            <div class="product-rating">
              <span class="stars">${'★'.repeat(Math.floor(p.rating))}${p.rating % 1 >= 0.5 ? '½' : ''}</span>
              <span class="review-count">(${p.reviews})</span>
            </div>
            <div class="color-swatches">
              <span class="swatch" style="background:${p.colors[0]}"></span>
              <span class="swatch" style="background:${p.colors[1]}"></span>
              <span class="swatch" style="background:${p.colors[2]}"></span>
            </div>
            <button class="add-to-cart-btn">ADD TO CART</button>
          </div>
        </div>`).join('\n');

  // Build collection cards
  const collections = getCollections(customer);
  const collectionCardsHtml = collections.map((c, i) => `
        <div class="collection-card">
          <img src="https://images.unsplash.com/photo-${getCollectionImageId(industry, i)}?w=800&q=80" alt="${c}" class="collection-image" />
          <div class="collection-overlay">
            <h3 class="collection-name">${c}</h3>
            <a href="#" class="collection-link">Shop Now →</a>
          </div>
        </div>`).join('\n');

  return `
<!-- ═══════════════════════════════════════════════════════════════════════ -->
<!-- HTML SCAFFOLD — Claude, you MUST use this exact structure.            -->
<!-- Fill in the CSS styles using the Design DNA values provided.         -->
<!-- Do NOT restructure this. Do NOT remove sections.                     -->
<!-- Do NOT convert this to a centered-text landing page.                 -->
<!-- ═══════════════════════════════════════════════════════════════════════ -->

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${brandName} — Official Store</title>
  <!-- LOAD GOOGLE FONTS FROM KING DNA -->
  <style>
    /* ══════ RESET + VARIABLES ══════ */
    /* USE THE CSS CUSTOM PROPERTIES FROM THE DESIGN DNA SECTION */
    /* Apply all --primary, --secondary, --font-heading, --font-body etc. */
    
    /* ══════ GLOBAL STYLES ══════ */
    
    /* ══════ ANNOUNCEMENT BAR ══════ */
    
    /* ══════ NAVIGATION ══════ */
    /* Match King's nav: height, bg color, font family, font size, text-transform */
    
    /* ══════ HERO BANNER ══════ */
    /* THIS IS A FULL-WIDTH IMAGE BANNER — NOT a text hero */
    /* Height: min-height 70vh or per King's hero.height */
    /* Background: full-bleed lifestyle image with overlay */
    
    /* ══════ TRUST BAR ══════ */
    
    /* ══════ PRODUCT GRID ══════ */
    /* 4 columns desktop, 2 mobile */
    /* Card styles from King DNA: radius, shadow, hover transform */
    
    /* ══════ COLLECTION CATEGORIES ══════ */
    
    /* ══════ SOCIAL PROOF / REVIEWS ══════ */
    
    /* ══════ NEWSLETTER ══════ */
    
    /* ══════ FOOTER ══════ */
    
    /* ══════ RESPONSIVE ══════ */
  </style>
</head>
<body>

  <!-- ══════ ANNOUNCEMENT BAR ══════ -->
  <div class="announcement-bar">
    🚚 Free Shipping on Orders Over $75 | New Arrivals Just Dropped
  </div>

  <!-- ══════ NAVIGATION ══════ -->
  <nav class="main-nav">
    <div class="nav-container">
      <a href="#" class="nav-logo">${brandName}</a>
      <ul class="nav-menu">
${navItems.map(item => `        <li><a href="#">${item.label}</a></li>`).join('\n')}
      </ul>
      <div class="nav-actions">
        <button class="nav-search" aria-label="Search">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
        </button>
        <button class="nav-cart" aria-label="Cart">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>
          <span class="cart-count">0</span>
        </button>
      </div>
      <button class="mobile-toggle" aria-label="Menu">
        <span></span><span></span><span></span>
      </button>
    </div>
  </nav>

  <!-- ══════ HERO — FULL-WIDTH IMAGE BANNER ══════ -->
  <!-- THIS IS NOT A TEXT HERO. It's a full-bleed lifestyle image with overlaid text. -->
  <section class="hero-banner">
    <div class="hero-image-wrapper">
      <img src="https://images.unsplash.com/photo-${getHeroImageId(industry)}?w=1600&q=80" alt="${brandName} Collection" class="hero-bg-image" />
      <div class="hero-overlay"></div>
    </div>
    <div class="hero-content">
      <span class="hero-tag">${getHeroTag(customer)}</span>
      <h1 class="hero-headline">${getHeroHeadline(customer)}</h1>
      <p class="hero-subheadline">${getHeroSubheadline(customer)}</p>
      <div class="hero-ctas">
        <a href="#products" class="btn-primary">${ctaText}</a>
        <a href="#collections" class="btn-secondary">View Collections</a>
      </div>
    </div>
  </section>

  <!-- ══════ TRUST BAR ══════ -->
  <section class="trust-bar">
    <div class="trust-container">
      <div class="trust-item">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
        <span>Free Shipping Over $75</span>
      </div>
      <div class="trust-item">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>
        <span>30-Day Easy Returns</span>
      </div>
      <div class="trust-item">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
        <span>Secure Checkout</span>
      </div>
      <div class="trust-item">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
        <span>12,000+ Happy Customers</span>
      </div>
    </div>
  </section>

  <!-- ══════ PRODUCT GRID — THE CORE OF THE STORE ══════ -->
  <section class="products-section" id="products">
    <div class="section-container">
      <div class="section-header">
        <h2 class="section-title">Best Sellers</h2>
        <a href="#" class="view-all-link">View All →</a>
      </div>
      <div class="product-grid">
${productCardsHtml}
      </div>
    </div>
  </section>

  <!-- ══════ COLLECTION CATEGORIES ══════ -->
  <section class="collections-section" id="collections">
    <div class="section-container">
      <h2 class="section-title">Shop by Collection</h2>
      <div class="collection-grid">
${collectionCardsHtml}
      </div>
    </div>
  </section>

  <!-- ══════ SOCIAL PROOF / REVIEWS ══════ -->
  <section class="reviews-section">
    <div class="section-container">
      <div class="reviews-header">
        <h2 class="section-title">What Our Customers Say</h2>
        <div class="overall-rating">
          <span class="big-rating">4.8</span>
          <span class="rating-stars">★★★★★</span>
          <span class="rating-count">Based on 2,400+ reviews</span>
        </div>
      </div>
      <div class="reviews-grid">
        <div class="review-card">
          <div class="review-stars">★★★★★</div>
          <p class="review-text">"Absolutely love the quality. Fits perfectly and the material is premium. Will definitely order again!"</p>
          <div class="review-author">
            <strong>Sarah M.</strong>
            <span class="verified-badge">✓ Verified Purchase</span>
          </div>
        </div>
        <div class="review-card">
          <div class="review-stars">★★★★★</div>
          <p class="review-text">"Best ${industry} purchase I've made. The attention to detail is incredible. Shipped fast too!"</p>
          <div class="review-author">
            <strong>James K.</strong>
            <span class="verified-badge">✓ Verified Purchase</span>
          </div>
        </div>
        <div class="review-card">
          <div class="review-stars">★★★★★</div>
          <p class="review-text">"I've tried many brands but ${brandName} stands out. The quality-to-price ratio is unmatched."</p>
          <div class="review-author">
            <strong>Maria L.</strong>
            <span class="verified-badge">✓ Verified Purchase</span>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- ══════ NEWSLETTER SIGNUP ══════ -->
  <section class="newsletter-section">
    <div class="section-container">
      <div class="newsletter-content">
        <h2 class="newsletter-title">Get 10% Off Your First Order</h2>
        <p class="newsletter-sub">Join 15,000+ subscribers for exclusive deals and new arrivals</p>
        <div class="newsletter-form">
          <input type="email" placeholder="Enter your email" class="newsletter-input" />
          <button class="newsletter-btn">SUBSCRIBE</button>
        </div>
        <p class="newsletter-privacy">We respect your privacy. Unsubscribe at any time.</p>
      </div>
    </div>
  </section>

  <!-- ══════ FOOTER ══════ -->
  <footer class="main-footer">
    <div class="footer-container">
      <div class="footer-grid">
        <div class="footer-col">
          <h4>${brandName}</h4>
          <p class="footer-about">${customer.description || 'Premium quality products designed for those who demand excellence.'}</p>
          <div class="footer-social">
            <a href="#" aria-label="Instagram">IG</a>
            <a href="#" aria-label="TikTok">TK</a>
            <a href="#" aria-label="Facebook">FB</a>
            <a href="#" aria-label="Twitter">TW</a>
          </div>
        </div>
        <div class="footer-col">
          <h4>Shop</h4>
          <ul>
            <li><a href="#">New Arrivals</a></li>
            <li><a href="#">Best Sellers</a></li>
            <li><a href="#">Sale</a></li>
            <li><a href="#">Gift Cards</a></li>
          </ul>
        </div>
        <div class="footer-col">
          <h4>Support</h4>
          <ul>
            <li><a href="#">Contact Us</a></li>
            <li><a href="#">Shipping & Returns</a></li>
            <li><a href="#">FAQ</a></li>
            <li><a href="#">Size Guide</a></li>
          </ul>
        </div>
        <div class="footer-col">
          <h4>Company</h4>
          <ul>
            <li><a href="#">About Us</a></li>
            <li><a href="#">Careers</a></li>
            <li><a href="#">Privacy Policy</a></li>
            <li><a href="#">Terms of Service</a></li>
          </ul>
        </div>
      </div>
      <div class="footer-bottom">
        <p>&copy; 2025 ${brandName}. All rights reserved.</p>
        <div class="payment-icons">
          <span>Visa</span> <span>Mastercard</span> <span>Amex</span> <span>PayPal</span> <span>Apple Pay</span>
        </div>
      </div>
    </div>
  </footer>

  <script>
    // Mobile nav toggle
    document.querySelector('.mobile-toggle')?.addEventListener('click', function() {
      document.querySelector('.nav-menu')?.classList.toggle('active');
    });
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(a => {
      a.addEventListener('click', e => {
        e.preventDefault();
        const target = document.querySelector(a.getAttribute('href'));
        if (target) target.scrollIntoView({ behavior: 'smooth' });
      });
    });
    // Add to cart button feedback
    document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
      btn.addEventListener('click', function() {
        const original = this.textContent;
        this.textContent = '✓ ADDED';
        this.style.backgroundColor = '#22c55e';
        setTimeout(() => { this.textContent = original; this.style.backgroundColor = ''; }, 1500);
      });
    });
  </script>

</body>
</html>`;
}

// =============================================================================
// PRODUCT DATA GENERATORS
// =============================================================================

interface ProductItem {
  name: string;
  price: string;
  rating: number;
  reviews: number;
  colors: string[];
}

function generateProductData(customer: CustomerQuestionnaire): ProductItem[] {
  const industry = (customer.industry || '').toLowerCase();
  const brand = customer.businessName;
  
  const industryProducts: Record<string, ProductItem[]> = {
    // Activewear / Athletic / Gym
    default_athletic: [
      { name: `${brand} Performance Tee`, price: '39.99', rating: 4.8, reviews: 342, colors: ['#1a1a1a', '#2d3748', '#c53030'] },
      { name: `${brand} Flex Shorts`, price: '44.99', rating: 4.7, reviews: 256, colors: ['#1a1a1a', '#2b6cb0', '#38a169'] },
      { name: `${brand} Pro Leggings`, price: '54.99', rating: 4.9, reviews: 489, colors: ['#1a1a1a', '#553c9a', '#d53f8c'] },
      { name: `${brand} Essential Hoodie`, price: '64.99', rating: 4.8, reviews: 378, colors: ['#4a5568', '#1a1a1a', '#2d3748'] },
      { name: `${brand} Training Tank`, price: '29.99', rating: 4.6, reviews: 198, colors: ['#fff', '#1a1a1a', '#e53e3e'] },
      { name: `${brand} Joggers`, price: '49.99', rating: 4.7, reviews: 312, colors: ['#4a5568', '#1a1a1a', '#2b6cb0'] },
      { name: `${brand} Sports Bra`, price: '34.99', rating: 4.8, reviews: 423, colors: ['#1a1a1a', '#d53f8c', '#553c9a'] },
      { name: `${brand} Seamless Set`, price: '74.99', rating: 4.9, reviews: 567, colors: ['#1a1a1a', '#718096', '#d53f8c'] },
    ],
    // Jewelry
    default_jewelry: [
      { name: `${brand} Classic Chain`, price: '28.99', rating: 4.8, reviews: 234, colors: ['#d4af37', '#c0c0c0', '#e5c890'] },
      { name: `${brand} Pearl Drop Earrings`, price: '22.99', rating: 4.7, reviews: 189, colors: ['#d4af37', '#c0c0c0', '#e5c890'] },
      { name: `${brand} Signet Ring`, price: '34.99', rating: 4.9, reviews: 312, colors: ['#d4af37', '#c0c0c0', '#b76e79'] },
      { name: `${brand} Tennis Bracelet`, price: '45.99', rating: 4.6, reviews: 156, colors: ['#d4af37', '#c0c0c0', '#e5c890'] },
      { name: `${brand} Layered Necklace`, price: '32.99', rating: 4.8, reviews: 278, colors: ['#d4af37', '#c0c0c0', '#e5c890'] },
      { name: `${brand} Hoop Earrings`, price: '19.99', rating: 4.7, reviews: 345, colors: ['#d4af37', '#c0c0c0', '#b76e79'] },
      { name: `${brand} Pendant Charm`, price: '26.99', rating: 4.8, reviews: 203, colors: ['#d4af37', '#c0c0c0', '#e5c890'] },
      { name: `${brand} Cuff Bracelet`, price: '38.99', rating: 4.9, reviews: 167, colors: ['#d4af37', '#c0c0c0', '#b76e79'] },
    ],
    // Beauty / Skincare
    default_beauty: [
      { name: `${brand} Glow Serum`, price: '42.00', rating: 4.9, reviews: 567, colors: ['#fce4ec', '#e8eaf6', '#e8f5e9'] },
      { name: `${brand} Daily Moisturizer`, price: '36.00', rating: 4.7, reviews: 423, colors: ['#fce4ec', '#fff3e0', '#e0f2f1'] },
      { name: `${brand} Vitamin C Cream`, price: '48.00', rating: 4.8, reviews: 389, colors: ['#fff8e1', '#fce4ec', '#e8f5e9'] },
      { name: `${brand} Eye Cream`, price: '34.00', rating: 4.6, reviews: 234, colors: ['#e8eaf6', '#fce4ec', '#e0f7fa'] },
      { name: `${brand} Cleanser`, price: '28.00', rating: 4.8, reviews: 512, colors: ['#e0f2f1', '#fce4ec', '#fff3e0'] },
      { name: `${brand} Face Mask Set`, price: '52.00', rating: 4.9, reviews: 345, colors: ['#fce4ec', '#e8eaf6', '#e8f5e9'] },
      { name: `${brand} SPF 50 Sunscreen`, price: '32.00', rating: 4.7, reviews: 456, colors: ['#fff8e1', '#e0f2f1', '#fce4ec'] },
      { name: `${brand} Night Repair Oil`, price: '56.00', rating: 4.8, reviews: 278, colors: ['#311b92', '#1a237e', '#4a148c'] },
    ],
  };

  // Match industry to product set
  if (industry.match(/gym|athletic|activewear|fitness|sport|workout/)) return industryProducts.default_athletic;
  if (industry.match(/jewel|accessor/)) return industryProducts.default_jewelry;
  if (industry.match(/beauty|skincare|cosmetic/)) return industryProducts.default_beauty;
  
  // Default: use athletic for fashion-adjacent, or generate generic
  if (industry.match(/fashion|clothing|apparel/)) return industryProducts.default_athletic;
  
  // Generic fallback — adapt athletic products
  return industryProducts.default_athletic.map(p => ({
    ...p,
    name: p.name.replace('Performance Tee', 'Essential Item 1')
      .replace('Flex Shorts', 'Classic Item 2')
      .replace('Pro Leggings', 'Premium Item 3')
      .replace('Essential Hoodie', 'Signature Item 4')
      .replace('Training Tank', 'Core Item 5')
      .replace('Joggers', 'Active Item 6')
      .replace('Sports Bra', 'Select Item 7')
      .replace('Seamless Set', 'Complete Set'),
  }));
}

function getCollections(customer: CustomerQuestionnaire): string[] {
  const industry = (customer.industry || '').toLowerCase();
  if (industry.match(/gym|athletic|activewear|fitness|sport/)) {
    return ['New Arrivals', 'Men\'s Training', 'Women\'s Training', 'Accessories'];
  }
  if (industry.match(/jewel/)) {
    return ['Necklaces', 'Earrings', 'Rings', 'Bracelets'];
  }
  if (industry.match(/beauty|skincare/)) {
    return ['Skincare', 'Body Care', 'Gift Sets', 'Best Sellers'];
  }
  return ['New Arrivals', 'Best Sellers', 'Collections', 'Sale'];
}

// Unsplash photo IDs by industry (real, high-quality images)
function getHeroImageId(industry: string): string {
  const ind = industry.toLowerCase();
  if (ind.match(/gym|athletic|activewear|fitness/)) return '1534438327276-14e5300c3a48';
  if (ind.match(/jewel/)) return '1515562141207-82f56648e57c';
  if (ind.match(/beauty|skincare/)) return '1596462502278-27bfdc403348';
  if (ind.match(/fashion|clothing/)) return '1441984904996-e0b6ba687f04';
  return '1441984904996-e0b6ba687f04';
}

function getProductImageId(industry: string, index: number): string {
  const ind = industry.toLowerCase();
  const athleticIds = [
    '1521572163474-6864f9cf17ab', '1562157873-818bc0726f68', '1556906781-9a412961c28c',
    '1556821840-3a63f95609a7', '1571019613454-1cb2f99b2d8b', '1515886657613-9f3515b0c78f',
    '1571019614242-c5c5dee9f50b', '1544367567-0f2fcb009e0b'
  ];
  const jewelryIds = [
    '1515562141207-82f56648e57c', '1535632066927-ab7c9ab60908', '1602173574767-37ac01994b2a',
    '1611085583191-a3b181a88401', '1573408301185-9146fe634ad0', '1599643478518-a784e5dc4c8f',
    '1603561591411-07134e71a2a9', '1611591437281-460bfbe1220a'
  ];
  const beautyIds = [
    '1596462502278-27bfdc403348', '1570194065650-d99fb4a38648', '1556228578-8c89e6adf883',
    '1571781926291-c477ebfd024b', '1598440947619-2c35fc9aa908', '1608248543803-ba4f8c70ae0b',
    '1611930022073-b7a4ba5fba98', '1612817288484-6f916006741a'
  ];
  
  if (ind.match(/gym|athletic|activewear|fitness|sport/)) return athleticIds[index % athleticIds.length];
  if (ind.match(/jewel/)) return jewelryIds[index % jewelryIds.length];
  if (ind.match(/beauty|skincare/)) return beautyIds[index % beautyIds.length];
  return athleticIds[index % athleticIds.length];
}

function getCollectionImageId(industry: string, index: number): string {
  const ind = industry.toLowerCase();
  const ids: Record<string, string[]> = {
    athletic: ['1517836357463-d25dfeac3438', '1518611012118-696072aa579a', '1571019613454-1cb2f99b2d8b', '1576678927484-cc907957088c'],
    jewelry: ['1515562141207-82f56648e57c', '1573408301185-9146fe634ad0', '1602173574767-37ac01994b2a', '1599643478518-a784e5dc4c8f'],
    beauty: ['1596462502278-27bfdc403348', '1570194065650-d99fb4a38648', '1556228578-8c89e6adf883', '1571781926291-c477ebfd024b'],
  };
  
  let key = 'athletic';
  if (ind.match(/jewel/)) key = 'jewelry';
  if (ind.match(/beauty|skincare/)) key = 'beauty';
  
  return ids[key][index % ids[key].length];
}

function getHeroTag(customer: CustomerQuestionnaire): string {
  const ind = (customer.industry || '').toLowerCase();
  if (ind.match(/gym|athletic|fitness/)) return 'New Season Collection';
  if (ind.match(/jewel/)) return 'Handcrafted Luxury';
  if (ind.match(/beauty|skincare/)) return 'Clean Beauty Essentials';
  return 'New Collection';
}

function getHeroHeadline(customer: CustomerQuestionnaire): string {
  const ind = (customer.industry || '').toLowerCase();
  if (ind.match(/gym|athletic|fitness/)) return 'Engineered for Performance';
  if (ind.match(/jewel/)) return 'Timeless Elegance, Modern Design';
  if (ind.match(/beauty|skincare/)) return 'Your Skin Deserves the Best';
  return `Discover ${customer.businessName}`;
}

function getHeroSubheadline(customer: CustomerQuestionnaire): string {
  return customer.description || 'Premium quality products designed for those who demand excellence.';
}

// =============================================================================
// SYSTEM PROMPT — Aggressive CSS-only instruction
// =============================================================================

function buildSystemPrompt(profile: KingForensicProfile, siteType: string): string {
  if (siteType === 'ecommerce') {
    return `You are a CSS styling engine. You will receive a COMPLETE HTML scaffold for an e-commerce website. Your ONLY job is to write the CSS styles inside the <style> tag.

## WHAT YOU MUST DO:
1. Take the HTML scaffold provided — DO NOT modify the HTML structure
2. Write ALL CSS styles using the Design DNA values (colors, fonts, spacing, shadows, radius)
3. Make it look EXACTLY like ${profile.meta.kingName}'s website in terms of visual design
4. Ensure full mobile responsiveness

## WHAT YOU MUST NOT DO:
- DO NOT change the HTML structure
- DO NOT remove any sections (product grid, trust bar, reviews, newsletter, etc.)
- DO NOT convert the e-commerce layout into a landing page
- DO NOT replace product cards with generic content cards
- DO NOT remove prices, ratings, add-to-cart buttons, or color swatches

## CSS REQUIREMENTS:
- Use the exact CSS custom properties provided in the Design DNA
- Match ${profile.meta.kingName}'s visual style: their button shapes, card shadows, font weights, spacing
- Hero must be a full-bleed image banner with overlay text (NOT centered text on white background)
- Product grid: 4 columns desktop, 2 tablet, 2 mobile
- Cards should have the exact shadow, radius, and hover effects from the King DNA
- Buttons match King's button style exactly
- Typography scale matches King's h1/h2/h3/body sizes and weights

## OUTPUT:
Return the COMPLETE HTML document (the scaffold with your CSS filled in).
Start with <!DOCTYPE html>. No markdown, no explanation.`;
  }

  // Non-ecommerce: use v2 approach
  return `You are a precision website builder. You have the EXACT design DNA from ${profile.meta.kingName}.

## SITE TYPE: ${siteType.toUpperCase()}
Build the exact page structure from ${profile.meta.kingName} — same sections, layout, and visual style.
Fill with the CUSTOMER's content, not the King's content.

## RULES:
- Use exact hex codes: ${profile.colors.primary}, ${profile.colors.secondary}
- Use exact fonts: ${profile.typography.headingFont.family}, ${profile.typography.bodyFont.family}
- Use exact radius: ${profile.designSystem.borderRadius.buttons} for buttons
- Match section order from blueprints below

## OUTPUT: Complete HTML only. <!DOCTYPE html> to </html>. No markdown.`;
}

// =============================================================================
// BUILD DESIGN DNA (CSS custom properties and specs)
// =============================================================================

function buildDesignDNA(profile: KingForensicProfile): string {
  return `
## ═══ DESIGN DNA FROM: ${profile.meta.kingName} ═══

### GOOGLE FONTS TO LOAD
${profile.typography.headingFont.googleFontsUrl || 'Use system fonts'}
${profile.typography.bodyFont.googleFontsUrl !== profile.typography.headingFont.googleFontsUrl ? profile.typography.bodyFont.googleFontsUrl || '' : ''}

### CSS CUSTOM PROPERTIES — Apply these in the :root selector:
:root {
  --primary: ${profile.colors.primary};
  --primary-rgb: ${profile.colors.primaryRgb || '0,0,0'};
  --secondary: ${profile.colors.secondary};
  --accent: ${profile.colors.accent};
  --bg-main: ${profile.colors.backgrounds.main};
  --bg-secondary: ${profile.colors.backgrounds.secondary};
  --bg-dark: ${profile.colors.backgrounds.dark};
  --bg-card: ${profile.colors.backgrounds.card};
  --text-primary: ${profile.colors.text.primary};
  --text-secondary: ${profile.colors.text.secondary};
  --text-muted: ${profile.colors.text.muted};
  --border-default: ${profile.colors.borders.default};
  --font-heading: '${profile.typography.headingFont.family}', sans-serif;
  --font-body: '${profile.typography.bodyFont.family}', sans-serif;
  --shadow-sm: ${profile.designSystem.shadows.sm};
  --shadow-md: ${profile.designSystem.shadows.md};
  --shadow-card: ${profile.designSystem.shadows.cardDefault};
  --shadow-card-hover: ${profile.designSystem.shadows.cardHover};
  --radius-sm: ${profile.designSystem.borderRadius.small};
  --radius-md: ${profile.designSystem.borderRadius.medium};
  --radius-lg: ${profile.designSystem.borderRadius.large};
  --radius-button: ${profile.designSystem.borderRadius.buttons};
  --radius-card: ${profile.designSystem.borderRadius.cards};
  --container-max: ${profile.designSystem.containerMaxWidth};
  --section-padding: ${profile.designSystem.sectionPadding.desktop};
  --transition: ${profile.animations.transition.default};
}

### TYPOGRAPHY SCALE:
- h1: ${profile.typography.scale.h1.size}; weight: ${profile.typography.scale.h1.weight}; line-height: ${profile.typography.scale.h1.lineHeight}; letter-spacing: ${profile.typography.scale.h1.letterSpacing}; text-transform: ${profile.typography.scale.h1.textTransform}
- h2: ${profile.typography.scale.h2.size}; weight: ${profile.typography.scale.h2.weight}; line-height: ${profile.typography.scale.h2.lineHeight}
- h3: ${profile.typography.scale.h3.size}; weight: ${profile.typography.scale.h3.weight}
- body: ${profile.typography.scale.body.size}; weight: ${profile.typography.scale.body.weight}; line-height: ${profile.typography.scale.body.lineHeight}

### BUTTON STYLES:
PRIMARY: bg ${profile.designSystem.buttonStyles.primary.backgroundColor}; color ${profile.designSystem.buttonStyles.primary.textColor}; radius ${profile.designSystem.buttonStyles.primary.borderRadius}; padding ${profile.designSystem.buttonStyles.primary.padding}; font-weight ${profile.designSystem.buttonStyles.primary.fontWeight}; text-transform ${profile.designSystem.buttonStyles.primary.textTransform}; hover: ${profile.designSystem.buttonStyles.primary.hoverTransform}
SECONDARY: bg ${profile.designSystem.buttonStyles.secondary.backgroundColor}; color ${profile.designSystem.buttonStyles.secondary.textColor}; border ${profile.designSystem.buttonStyles.secondary.border}; radius ${profile.designSystem.buttonStyles.secondary.borderRadius}

### CARD STYLES:
bg ${profile.designSystem.cardStyles.background}; border ${profile.designSystem.cardStyles.border}; radius ${profile.designSystem.cardStyles.borderRadius}; shadow ${profile.designSystem.cardStyles.shadow}; hover: ${profile.designSystem.cardStyles.hoverTransform}, shadow: ${profile.designSystem.cardStyles.hoverShadow}

### NAVIGATION:
Type: ${profile.navigation.type}; Height: ${profile.navigation.height}; BG: ${profile.navigation.backgroundColor}; Font: ${profile.navigation.fontFamily} ${profile.navigation.fontSize} ${profile.navigation.fontWeight}; Text-transform: ${profile.navigation.textTransform}
${profile.navigation.ctaButton ? `Nav CTA: "${profile.navigation.ctaButton.text}" — ${profile.navigation.ctaButton.style}, color: ${profile.navigation.ctaButton.color}, radius: ${profile.navigation.ctaButton.borderRadius}` : ''}

### HERO SPECS:
Layout: ${profile.hero.layout}; Height: ${profile.hero.height}
Headline: font-size: ${profile.hero.headline.fontSize}; font-weight: ${profile.hero.headline.fontWeight}; text-transform: ${profile.hero.headline.textTransform}
CTA: bg: ${profile.hero.ctaButtons[0]?.backgroundColor || 'var(--primary)'}; text: ${profile.hero.ctaButtons[0]?.textColor || '#fff'}; radius: ${profile.hero.ctaButtons[0]?.borderRadius || '0'}; padding: ${profile.hero.ctaButtons[0]?.padding || '16px 32px'}

### FOOTER:
Layout: ${profile.footer.layout}; Columns: ${profile.footer.columns}; BG: ${profile.footer.backgroundColor}; Text: ${profile.footer.textColor}

### ANIMATIONS:
Scroll reveal: ${profile.animations.scrollReveal.enabled ? `${profile.animations.scrollReveal.type}, ${profile.animations.scrollReveal.duration}` : 'none'}
Card hover: ${profile.animations.hoverEffects.cards}
Button hover: ${profile.animations.hoverEffects.buttons}

### THEME:
${profile.colors.isDarkTheme ? 'DARK THEME — dark backgrounds, light text' : 'LIGHT THEME — light backgrounds, dark text'}`;
}

// =============================================================================
// NON-ECOMMERCE BLUEPRINT (v2 approach for SaaS, agency, etc.)
// =============================================================================

function buildGenericBlueprint(
  profile: KingForensicProfile,
  customer: CustomerQuestionnaire,
  siteType: string
): string {
  let blueprint = `\n## ═══ PAGE BLUEPRINT ═══\n\n`;

  profile.sections.forEach((section, i) => {
    const type = (section.type || section.name || '').toLowerCase();
    
    if (siteType === 'saas') {
      if (type.includes('hero') || i === 0) {
        blueprint += `## SECTION ${i+1}: HERO\n- Headline + subheadline + primary CTA + product screenshot\n\n`;
      } else if (type.includes('feature')) {
        blueprint += `## SECTION ${i+1}: FEATURES\n- ${section.gridColumns || 3} feature cards with icon + title + description\n\n`;
      } else if (type.includes('pricing')) {
        blueprint += `## SECTION ${i+1}: PRICING\n- 2-3 tiers with name, price, features, CTA\n\n`;
      } else {
        blueprint += `## SECTION ${i+1}: ${section.name}\n- ${section.contentPattern || section.type}\n\n`;
      }
    } else {
      blueprint += `## SECTION ${i+1}: ${section.name}\nType: ${section.type}; Layout: ${section.layout}\nContent: ${section.contentPattern || 'appropriate for section type'}\n\n`;
    }
  });

  return blueprint;
}

// =============================================================================
// CUSTOMER CONTENT
// =============================================================================

function buildCustomerContent(customer: CustomerQuestionnaire): string {
  return `
## ═══ CUSTOMER DETAILS ═══
Business Name: ${customer.businessName}
Industry: ${customer.industry}
Description: ${customer.description}
Target Audience: ${customer.targetAudience}
Products/Services: ${customer.services?.length > 0 ? customer.services.join(', ') : customer.uniqueSellingPoints?.join(', ') || 'Professional products'}
Contact: ${customer.contactInfo?.email || ''} | ${customer.contactInfo?.phone || ''}`;
}

// =============================================================================
// MAIN GENERATION FUNCTION
// =============================================================================

export async function generateFromKingDNA(
  profile: KingForensicProfile,
  customer: CustomerQuestionnaire
): Promise<string> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error('ANTHROPIC_API_KEY not set');

  const siteType = detectSiteType(profile);
  console.log(`[KingGenerator v3] Site type: ${siteType}`);
  console.log(`[KingGenerator v3] King: ${profile.meta.kingName}`);
  console.log(`[KingGenerator v3] Customer: ${customer.businessName}`);

  const systemPrompt = buildSystemPrompt(profile, siteType);

  let userPrompt: string;

  if (siteType === 'ecommerce') {
    // V3 APPROACH: Give Claude the complete HTML scaffold + Design DNA
    // Claude's job is ONLY to write the CSS styles
    const scaffold = buildEcommerceScaffold(profile, customer);
    const designDNA = buildDesignDNA(profile);

    userPrompt = `${designDNA}

## ═══ HTML SCAFFOLD ═══
Below is the COMPLETE HTML structure for this e-commerce website.
Your job: Fill in the <style> tag with CSS that makes this look like ${profile.meta.kingName}'s website.
Apply every design token from the Design DNA above.
DO NOT modify the HTML. ONLY write the CSS.

${scaffold}

## REMINDER:
- Fill the <style> tag with complete CSS
- Use the exact Design DNA values (colors, fonts, spacing, shadows)  
- Hero = full-bleed image banner with dark overlay + white text
- Product grid = 4 cols desktop, 2 mobile
- Make it look like ${profile.meta.kingName} built this store
- Return the COMPLETE HTML with your CSS filled in
- Start with <!DOCTYPE html>`;
  } else {
    // Non-ecommerce: use v2 blueprint approach
    const designDNA = buildDesignDNA(profile);
    const blueprint = buildGenericBlueprint(profile, customer, siteType);
    const content = buildCustomerContent(customer);

    userPrompt = `${designDNA}\n\n${blueprint}\n\n${content}\n\nBuild the complete website. Output ONLY HTML starting with <!DOCTYPE html>.`;
  }

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 16000,
      system: systemPrompt,
      messages: [{ role: 'user', content: userPrompt }],
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Claude API error: ${response.status} - ${error.substring(0, 200)}`);
  }

  const data = await response.json();
  let html = data.content[0].text.trim();

  // Clean markdown artifacts
  html = html.replace(/^```html?\n?/i, '').replace(/\n?```$/i, '');
  const doctypeIndex = html.toLowerCase().indexOf('<!doctype');
  if (doctypeIndex > 0) html = html.substring(doctypeIndex);

  console.log(`[KingGenerator v3] Generated ${(html.length / 1024).toFixed(1)}KB HTML`);
  return html;
}

// =============================================================================
// REVISION FUNCTION
// =============================================================================

export async function reviseFromKingDNA(
  profile: KingForensicProfile,
  currentHtml: string,
  editRequest: string,
  customer: CustomerQuestionnaire
): Promise<string> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error('ANTHROPIC_API_KEY not set');

  const siteType = detectSiteType(profile);

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 16000,
      system: `You are editing a ${siteType} website built from ${profile.meta.kingName}'s design DNA.

MAINTAIN these specs:
- Colors: ${profile.colors.primary}, ${profile.colors.secondary}, ${profile.colors.accent}
- Fonts: ${profile.typography.headingFont.family}, ${profile.typography.bodyFont.family}
- Buttons: bg ${profile.designSystem.buttonStyles.primary.backgroundColor}, radius ${profile.designSystem.buttonStyles.primary.borderRadius}
${siteType === 'ecommerce' ? '\nThis is E-COMMERCE. Keep product grids, prices, add-to-cart buttons, trust badges, reviews.' : ''}

Apply the requested change. Output ONLY complete HTML.`,
      messages: [{
        role: 'user',
        content: `Change: ${editRequest}\n\nCurrent HTML:\n${currentHtml.substring(0, 20000)}\n\nReturn COMPLETE updated HTML.`,
      }],
    }),
  });

  if (!response.ok) throw new Error('Revision failed');

  const data = await response.json();
  let html = data.content[0].text.trim();
  html = html.replace(/^```html?\n?/i, '').replace(/\n?```$/i, '');
  return html;
}
