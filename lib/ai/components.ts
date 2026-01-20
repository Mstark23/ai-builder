// /lib/ai/components.ts
// Complete section templates for premium websites

// ============================================================================
// HERO SECTIONS
// ============================================================================

export const HERO_COMPONENTS = {
  // Split Layout Hero - Image on right, content on left
  splitHero: `
<!-- HERO: Split Layout -->
<section class="hero" id="home">
  <div class="hero-bg">
    <div class="hero-blob hero-blob-1"></div>
    <div class="hero-blob hero-blob-2"></div>
  </div>
  <div class="container">
    <div class="hero-grid">
      <div class="hero-content reveal-left">
        <span class="hero-badge">
          <span class="badge-dot"></span>
          [BADGE_TEXT]
        </span>
        <h1 class="hero-title">[HEADLINE_PART1] <span class="gradient-text">[HEADLINE_HIGHLIGHT]</span></h1>
        <p class="hero-subtitle">[SUBTITLE_TEXT]</p>
        <div class="hero-buttons">
          <a href="#contact" class="btn btn-primary btn-lg">[PRIMARY_CTA]</a>
          <a href="#services" class="btn btn-secondary btn-lg">[SECONDARY_CTA]</a>
        </div>
        <div class="hero-stats">
          <div class="stat">
            <span class="stat-number" data-count="[STAT1_NUMBER]">0</span>+
            <span class="stat-label">[STAT1_LABEL]</span>
          </div>
          <div class="stat">
            <span class="stat-number" data-count="[STAT2_NUMBER]">0</span>%
            <span class="stat-label">[STAT2_LABEL]</span>
          </div>
          <div class="stat">
            <span class="stat-number" data-count="[STAT3_NUMBER]">0</span>
            <span class="stat-label">[STAT3_LABEL]</span>
          </div>
        </div>
      </div>
      <div class="hero-visual reveal-right">
        <div class="hero-image-wrapper">
          <img src="[HERO_IMAGE]" alt="[IMAGE_ALT]" class="hero-image">
          <div class="hero-float-card glass">
            <span class="float-icon">[FLOAT_ICON]</span>
            <span class="float-text">[FLOAT_TEXT]</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<style>
.hero {
  min-height: 100vh;
  display: flex;
  align-items: center;
  padding: 120px 0 80px;
  position: relative;
  overflow: hidden;
}
.hero-bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
}
.hero-blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.4;
  animation: blobMorph 8s ease-in-out infinite;
}
.hero-blob-1 {
  width: 600px;
  height: 600px;
  background: var(--primary);
  top: -200px;
  right: -100px;
}
.hero-blob-2 {
  width: 400px;
  height: 400px;
  background: var(--secondary);
  bottom: -100px;
  left: -100px;
  animation-delay: -4s;
}
.hero-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 80px;
  align-items: center;
}
.hero-content {
  position: relative;
  z-index: 1;
}
.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: rgba(var(--primary-rgb), 0.1);
  border: 1px solid rgba(var(--primary-rgb), 0.2);
  border-radius: 100px;
  font-size: 14px;
  font-weight: 600;
  color: var(--primary);
  margin-bottom: 24px;
}
.badge-dot {
  width: 8px;
  height: 8px;
  background: var(--primary);
  border-radius: 50%;
  animation: pulse 2s ease-in-out infinite;
}
.hero-title {
  margin-bottom: 24px;
}
.hero-subtitle {
  font-size: 20px;
  color: var(--text-secondary);
  line-height: 1.7;
  margin-bottom: 40px;
  max-width: 540px;
}
.hero-buttons {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  margin-bottom: 48px;
}
.hero-stats {
  display: flex;
  gap: 48px;
}
.stat {
  text-align: left;
}
.stat-number {
  display: block;
  font-family: var(--font-display);
  font-size: 48px;
  font-weight: 800;
  color: var(--text-primary);
  line-height: 1;
}
.stat-label {
  font-size: 14px;
  color: var(--text-muted);
  margin-top: 4px;
  display: block;
}
.hero-visual {
  position: relative;
}
.hero-image-wrapper {
  position: relative;
}
.hero-image {
  width: 100%;
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-2xl);
}
.hero-float-card {
  position: absolute;
  bottom: 40px;
  left: -40px;
  padding: 16px 24px;
  display: flex;
  align-items: center;
  gap: 12px;
  animation: float 3s ease-in-out infinite;
}
.float-icon {
  font-size: 24px;
}
.float-text {
  font-weight: 600;
  color: var(--text-primary);
}

@media (max-width: 1024px) {
  .hero-grid {
    grid-template-columns: 1fr;
    gap: 48px;
    text-align: center;
  }
  .hero-subtitle {
    margin-left: auto;
    margin-right: auto;
  }
  .hero-buttons {
    justify-content: center;
  }
  .hero-stats {
    justify-content: center;
  }
  .hero-float-card {
    left: 50%;
    transform: translateX(-50%);
  }
}

@media (max-width: 640px) {
  .hero {
    padding: 100px 0 60px;
  }
  .hero-stats {
    flex-direction: column;
    gap: 24px;
    align-items: center;
  }
  .stat {
    text-align: center;
  }
}
</style>
`,

  // Centered Hero - Content centered, ideal for SaaS
  centeredHero: `
<!-- HERO: Centered -->
<section class="hero hero-centered" id="home">
  <div class="hero-bg">
    <div class="hero-gradient"></div>
    <div class="hero-grid-pattern"></div>
  </div>
  <div class="container">
    <div class="hero-content text-center reveal">
      <span class="hero-badge">[BADGE_TEXT]</span>
      <h1 class="hero-title">[HEADLINE_PART1]<br><span class="gradient-text-animated">[HEADLINE_HIGHLIGHT]</span></h1>
      <p class="hero-subtitle">[SUBTITLE_TEXT]</p>
      <div class="hero-buttons centered">
        <a href="#contact" class="btn btn-primary btn-lg btn-glow">[PRIMARY_CTA]</a>
        <a href="#demo" class="btn btn-secondary btn-lg">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polygon points="5 3 19 12 5 21 5 3"></polygon>
          </svg>
          [SECONDARY_CTA]
        </a>
      </div>
      <div class="hero-social-proof">
        <div class="avatar-stack">
          <img src="https://i.pravatar.cc/100?img=1" alt="User" class="avatar">
          <img src="https://i.pravatar.cc/100?img=2" alt="User" class="avatar">
          <img src="https://i.pravatar.cc/100?img=3" alt="User" class="avatar">
          <img src="https://i.pravatar.cc/100?img=4" alt="User" class="avatar">
          <span class="avatar-count">+[USER_COUNT]</span>
        </div>
        <div class="rating">
          <span class="stars">★★★★★</span>
          <span class="rating-text">[RATING] from [REVIEW_COUNT] reviews</span>
        </div>
      </div>
    </div>
    <div class="hero-product reveal" style="transition-delay: 0.3s;">
      <div class="product-frame">
        <img src="[PRODUCT_IMAGE]" alt="Product Preview">
      </div>
    </div>
  </div>
</section>

<style>
.hero-centered {
  min-height: 100vh;
  padding: 140px 0 100px;
  position: relative;
  overflow: hidden;
}
.hero-gradient {
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse at top, rgba(var(--primary-rgb), 0.15), transparent 70%);
}
.hero-grid-pattern {
  position: absolute;
  inset: 0;
  background-image: linear-gradient(rgba(var(--primary-rgb), 0.03) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(var(--primary-rgb), 0.03) 1px, transparent 1px);
  background-size: 60px 60px;
}
.hero-centered .hero-content {
  max-width: 900px;
  margin: 0 auto;
}
.hero-centered .hero-subtitle {
  font-size: 20px;
  max-width: 700px;
  margin: 0 auto 40px;
}
.hero-buttons.centered {
  justify-content: center;
}
.hero-social-proof {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 24px;
  margin-top: 48px;
}
.avatar-stack {
  display: flex;
  align-items: center;
}
.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 3px solid var(--bg-primary);
  margin-left: -12px;
  object-fit: cover;
}
.avatar:first-child {
  margin-left: 0;
}
.avatar-count {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--primary);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 700;
  margin-left: -12px;
  border: 3px solid var(--bg-primary);
}
.rating {
  display: flex;
  align-items: center;
  gap: 8px;
}
.stars {
  color: #facc15;
  font-size: 18px;
}
.rating-text {
  font-size: 14px;
  color: var(--text-muted);
}
.hero-product {
  margin-top: 64px;
  max-width: 1000px;
  margin-left: auto;
  margin-right: auto;
}
.product-frame {
  background: var(--bg-secondary);
  border-radius: var(--radius-xl);
  padding: 8px;
  box-shadow: var(--shadow-2xl);
  border: 1px solid var(--border-light);
}
.product-frame img {
  width: 100%;
  border-radius: var(--radius-lg);
}

@media (max-width: 768px) {
  .hero-social-proof {
    flex-direction: column;
    gap: 16px;
  }
}
</style>
`,

  // Full-Screen Image Hero - Great for restaurants, real estate
  fullImageHero: `
<!-- HERO: Full Image -->
<section class="hero hero-fullimage" id="home">
  <div class="hero-bg-image" style="background-image: url('[HERO_IMAGE]')"></div>
  <div class="hero-overlay"></div>
  <div class="container">
    <div class="hero-content reveal">
      <span class="hero-badge">[BADGE_TEXT]</span>
      <h1 class="hero-title">[HEADLINE]</h1>
      <p class="hero-subtitle">[SUBTITLE_TEXT]</p>
      <div class="hero-buttons">
        <a href="#contact" class="btn btn-white btn-lg">[PRIMARY_CTA]</a>
        <a href="#about" class="btn btn-ghost-white btn-lg">[SECONDARY_CTA]</a>
      </div>
    </div>
  </div>
  <a href="#about" class="scroll-indicator">
    <span>Scroll</span>
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M12 5v14M19 12l-7 7-7-7"/>
    </svg>
  </a>
</section>

<style>
.hero-fullimage {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  color: white;
}
.hero-bg-image {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center;
}
.hero-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, rgba(0,0,0,0.4), rgba(0,0,0,0.7));
}
.hero-fullimage .container {
  position: relative;
  z-index: 1;
  text-align: center;
}
.hero-fullimage .hero-badge {
  background: rgba(255,255,255,0.15);
  border-color: rgba(255,255,255,0.3);
  color: white;
}
.hero-fullimage .hero-title {
  color: white;
  text-shadow: 0 4px 30px rgba(0,0,0,0.3);
}
.hero-fullimage .hero-subtitle {
  color: rgba(255,255,255,0.9);
  max-width: 600px;
  margin: 0 auto 40px;
}
.btn-ghost-white {
  background: transparent;
  color: white;
  border: 2px solid rgba(255,255,255,0.5);
}
.btn-ghost-white:hover {
  background: white;
  color: var(--text-primary);
}
.scroll-indicator {
  position: absolute;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  color: white;
  font-size: 14px;
  opacity: 0.7;
  transition: var(--transition-base);
  text-decoration: none;
}
.scroll-indicator:hover {
  opacity: 1;
}
.scroll-indicator svg {
  animation: bounce 2s ease-in-out infinite;
}
</style>
`,
};

// ============================================================================
// SERVICES / FEATURES SECTIONS
// ============================================================================

export const SERVICE_COMPONENTS = {
  // Bento Grid - Modern feature display
  bentoGrid: `
<!-- SERVICES: Bento Grid -->
<section class="section-services" id="services">
  <div class="container">
    <div class="section-header centered reveal">
      <span class="section-badge">[SECTION_BADGE]</span>
      <h2 class="section-title">[SECTION_TITLE] <span class="gradient-text">[TITLE_HIGHLIGHT]</span></h2>
      <p class="section-subtitle">[SECTION_SUBTITLE]</p>
    </div>
    <div class="bento-grid stagger">
      <div class="bento-card bento-large">
        <div class="bento-icon">[ICON_1]</div>
        <h3>[SERVICE_1_TITLE]</h3>
        <p>[SERVICE_1_DESC]</p>
        <a href="#" class="bento-link">Learn more →</a>
      </div>
      <div class="bento-card">
        <div class="bento-icon">[ICON_2]</div>
        <h3>[SERVICE_2_TITLE]</h3>
        <p>[SERVICE_2_DESC]</p>
      </div>
      <div class="bento-card">
        <div class="bento-icon">[ICON_3]</div>
        <h3>[SERVICE_3_TITLE]</h3>
        <p>[SERVICE_3_DESC]</p>
      </div>
      <div class="bento-card bento-wide bento-featured">
        <div class="bento-content">
          <h3>[SERVICE_4_TITLE]</h3>
          <p>[SERVICE_4_DESC]</p>
          <div class="bento-stats">
            <span>[STAT_1]</span>
            <span>[STAT_2]</span>
          </div>
        </div>
        <img src="[SERVICE_IMAGE]" alt="" class="bento-image">
      </div>
      <div class="bento-card">
        <div class="bento-icon">[ICON_5]</div>
        <h3>[SERVICE_5_TITLE]</h3>
        <p>[SERVICE_5_DESC]</p>
      </div>
      <div class="bento-card">
        <div class="bento-icon">[ICON_6]</div>
        <h3>[SERVICE_6_TITLE]</h3>
        <p>[SERVICE_6_DESC]</p>
      </div>
    </div>
  </div>
</section>

<style>
.bento-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}
.bento-card {
  background: var(--bg-card);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-xl);
  padding: 32px;
  transition: var(--transition-base);
}
.bento-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
  border-color: rgba(var(--primary-rgb), 0.2);
}
.bento-large {
  grid-column: span 2;
}
.bento-wide {
  grid-column: span 2;
  display: flex;
  align-items: center;
  gap: 40px;
  overflow: hidden;
}
.bento-icon {
  width: 56px;
  height: 56px;
  background: linear-gradient(135deg, var(--primary), var(--secondary));
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  margin-bottom: 20px;
}
.bento-card h3 {
  font-size: 22px;
  margin-bottom: 12px;
}
.bento-card p {
  color: var(--text-secondary);
  line-height: 1.7;
}
.bento-link {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  margin-top: 16px;
  font-weight: 600;
  color: var(--primary);
}
.bento-featured {
  background: linear-gradient(135deg, rgba(var(--primary-rgb), 0.05), rgba(var(--secondary-rgb), 0.05));
}
.bento-content {
  flex: 1;
}
.bento-stats {
  display: flex;
  gap: 24px;
  margin-top: 20px;
}
.bento-stats span {
  font-weight: 700;
  color: var(--primary);
}
.bento-image {
  width: 250px;
  border-radius: var(--radius-lg);
}

@media (max-width: 1024px) {
  .bento-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .bento-large {
    grid-column: span 2;
  }
}

@media (max-width: 640px) {
  .bento-grid {
    grid-template-columns: 1fr;
  }
  .bento-large,
  .bento-wide {
    grid-column: span 1;
  }
  .bento-wide {
    flex-direction: column;
  }
  .bento-image {
    width: 100%;
  }
}
</style>
`,

  // Simple Cards Grid
  cardsGrid: `
<!-- SERVICES: Cards Grid -->
<section class="section-services" id="services">
  <div class="container">
    <div class="section-header reveal">
      <span class="section-badge">[SECTION_BADGE]</span>
      <h2 class="section-title">[SECTION_TITLE]</h2>
      <p class="section-subtitle">[SECTION_SUBTITLE]</p>
    </div>
    <div class="services-grid stagger">
      <div class="service-card">
        <div class="service-icon">[ICON_1]</div>
        <h3>[SERVICE_1_TITLE]</h3>
        <p>[SERVICE_1_DESC]</p>
        <a href="#contact" class="service-link">Get Started →</a>
      </div>
      <div class="service-card">
        <div class="service-icon">[ICON_2]</div>
        <h3>[SERVICE_2_TITLE]</h3>
        <p>[SERVICE_2_DESC]</p>
        <a href="#contact" class="service-link">Get Started →</a>
      </div>
      <div class="service-card">
        <div class="service-icon">[ICON_3]</div>
        <h3>[SERVICE_3_TITLE]</h3>
        <p>[SERVICE_3_DESC]</p>
        <a href="#contact" class="service-link">Get Started →</a>
      </div>
      <div class="service-card">
        <div class="service-icon">[ICON_4]</div>
        <h3>[SERVICE_4_TITLE]</h3>
        <p>[SERVICE_4_DESC]</p>
        <a href="#contact" class="service-link">Get Started →</a>
      </div>
    </div>
  </div>
</section>

<style>
.services-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
}
.service-card {
  background: var(--bg-card);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-lg);
  padding: 32px;
  text-align: center;
  transition: var(--transition-base);
}
.service-card:hover {
  transform: translateY(-8px);
  box-shadow: var(--shadow-xl);
  border-color: transparent;
}
.service-icon {
  width: 72px;
  height: 72px;
  margin: 0 auto 24px;
  background: rgba(var(--primary-rgb), 0.1);
  border-radius: var(--radius-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  transition: var(--transition-base);
}
.service-card:hover .service-icon {
  background: var(--primary);
  transform: scale(1.1);
}
.service-card h3 {
  font-size: 20px;
  margin-bottom: 12px;
}
.service-card p {
  color: var(--text-secondary);
  font-size: 15px;
  line-height: 1.7;
}
.service-link {
  display: inline-block;
  margin-top: 20px;
  font-weight: 600;
  color: var(--primary);
  opacity: 0;
  transform: translateY(10px);
  transition: var(--transition-base);
}
.service-card:hover .service-link {
  opacity: 1;
  transform: translateY(0);
}

@media (max-width: 1024px) {
  .services-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .services-grid {
    grid-template-columns: 1fr;
  }
}
</style>
`,
};

// ============================================================================
// TESTIMONIALS
// ============================================================================

export const TESTIMONIAL_COMPONENTS = {
  // Featured Testimonial - Large single quote
  featuredTestimonial: `
<!-- TESTIMONIALS: Featured -->
<section class="section-testimonials" id="testimonials">
  <div class="container">
    <div class="section-header centered reveal">
      <span class="section-badge">[SECTION_BADGE]</span>
      <h2 class="section-title">[SECTION_TITLE] <span class="gradient-text">[TITLE_HIGHLIGHT]</span></h2>
    </div>
    <div class="testimonial-featured reveal">
      <div class="quote-mark">"</div>
      <blockquote>[TESTIMONIAL_QUOTE]</blockquote>
      <div class="testimonial-author">
        <img src="[AUTHOR_IMAGE]" alt="[AUTHOR_NAME]" class="author-avatar">
        <div class="author-info">
          <strong class="author-name">[AUTHOR_NAME]</strong>
          <span class="author-role">[AUTHOR_ROLE]</span>
          <div class="author-rating">★★★★★</div>
        </div>
      </div>
      <div class="testimonial-metrics">
        <div class="metric">
          <span class="metric-value">[METRIC_1_VALUE]</span>
          <span class="metric-label">[METRIC_1_LABEL]</span>
        </div>
        <div class="metric">
          <span class="metric-value">[METRIC_2_VALUE]</span>
          <span class="metric-label">[METRIC_2_LABEL]</span>
        </div>
      </div>
    </div>
  </div>
</section>

<style>
.testimonial-featured {
  max-width: 900px;
  margin: 0 auto;
  background: var(--bg-card);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-xl);
  padding: 64px;
  text-align: center;
  position: relative;
}
.quote-mark {
  font-family: Georgia, serif;
  font-size: 120px;
  line-height: 1;
  color: var(--primary);
  opacity: 0.2;
  position: absolute;
  top: 20px;
  left: 40px;
}
.testimonial-featured blockquote {
  font-family: var(--font-display);
  font-size: 28px;
  font-weight: 500;
  line-height: 1.5;
  color: var(--text-primary);
  margin-bottom: 40px;
}
.testimonial-author {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
}
.author-avatar {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  object-fit: cover;
}
.author-info {
  text-align: left;
}
.author-name {
  display: block;
  font-size: 18px;
  color: var(--text-primary);
}
.author-role {
  display: block;
  font-size: 14px;
  color: var(--text-muted);
}
.author-rating {
  color: #facc15;
  font-size: 14px;
  margin-top: 4px;
}
.testimonial-metrics {
  display: flex;
  justify-content: center;
  gap: 64px;
  margin-top: 48px;
  padding-top: 48px;
  border-top: 1px solid var(--border-light);
}
.metric {
  text-align: center;
}
.metric-value {
  display: block;
  font-family: var(--font-display);
  font-size: 36px;
  font-weight: 700;
  color: var(--primary);
}
.metric-label {
  display: block;
  font-size: 14px;
  color: var(--text-muted);
  margin-top: 4px;
}

@media (max-width: 768px) {
  .testimonial-featured {
    padding: 40px 24px;
  }
  .testimonial-featured blockquote {
    font-size: 22px;
  }
  .testimonial-metrics {
    flex-direction: column;
    gap: 24px;
  }
}
</style>
`,

  // Testimonials Grid - Multiple testimonials
  testimonialsGrid: `
<!-- TESTIMONIALS: Grid -->
<section class="section-testimonials" id="testimonials">
  <div class="container">
    <div class="section-header centered reveal">
      <span class="section-badge">[SECTION_BADGE]</span>
      <h2 class="section-title">[SECTION_TITLE]</h2>
      <p class="section-subtitle">[SECTION_SUBTITLE]</p>
    </div>
    <div class="testimonials-grid stagger">
      <div class="testimonial-card">
        <div class="testimonial-rating">★★★★★</div>
        <p class="testimonial-text">"[TESTIMONIAL_1]"</p>
        <div class="testimonial-author">
          <img src="[AUTHOR_1_IMAGE]" alt="[AUTHOR_1_NAME]">
          <div>
            <strong>[AUTHOR_1_NAME]</strong>
            <span>[AUTHOR_1_ROLE]</span>
          </div>
        </div>
      </div>
      <div class="testimonial-card">
        <div class="testimonial-rating">★★★★★</div>
        <p class="testimonial-text">"[TESTIMONIAL_2]"</p>
        <div class="testimonial-author">
          <img src="[AUTHOR_2_IMAGE]" alt="[AUTHOR_2_NAME]">
          <div>
            <strong>[AUTHOR_2_NAME]</strong>
            <span>[AUTHOR_2_ROLE]</span>
          </div>
        </div>
      </div>
      <div class="testimonial-card">
        <div class="testimonial-rating">★★★★★</div>
        <p class="testimonial-text">"[TESTIMONIAL_3]"</p>
        <div class="testimonial-author">
          <img src="[AUTHOR_3_IMAGE]" alt="[AUTHOR_3_NAME]">
          <div>
            <strong>[AUTHOR_3_NAME]</strong>
            <span>[AUTHOR_3_ROLE]</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<style>
.testimonials-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 32px;
}
.testimonial-card {
  background: var(--bg-card);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-lg);
  padding: 32px;
  transition: var(--transition-base);
}
.testimonial-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
}
.testimonial-rating {
  color: #facc15;
  font-size: 18px;
  margin-bottom: 16px;
}
.testimonial-text {
  font-size: 16px;
  line-height: 1.7;
  color: var(--text-secondary);
  margin-bottom: 24px;
}
.testimonial-card .testimonial-author {
  display: flex;
  align-items: center;
  gap: 12px;
}
.testimonial-card .testimonial-author img {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
}
.testimonial-card .testimonial-author strong {
  display: block;
  font-size: 16px;
  color: var(--text-primary);
}
.testimonial-card .testimonial-author span {
  font-size: 14px;
  color: var(--text-muted);
}

@media (max-width: 1024px) {
  .testimonials-grid {
    grid-template-columns: 1fr;
    max-width: 600px;
    margin: 0 auto;
  }
}
</style>
`,
};

// ============================================================================
// PRICING
// ============================================================================

export const PRICING_COMPONENTS = {
  // Pricing Table with Toggle
  pricingTable: `
<!-- PRICING -->
<section class="section-pricing" id="pricing">
  <div class="container">
    <div class="section-header centered reveal">
      <span class="section-badge">[SECTION_BADGE]</span>
      <h2 class="section-title">Simple, Transparent <span class="gradient-text">Pricing</span></h2>
      <p class="section-subtitle">Choose the plan that's right for you</p>
    </div>
    <div class="pricing-toggle reveal">
      <span class="toggle-label">Monthly</span>
      <label class="toggle-switch">
        <input type="checkbox" id="pricingToggle">
        <span class="toggle-slider"></span>
      </label>
      <span class="toggle-label">Yearly <span class="save-badge">Save 20%</span></span>
    </div>
    <div class="pricing-grid stagger">
      <div class="pricing-card">
        <h3 class="pricing-name">[PLAN_1_NAME]</h3>
        <p class="pricing-desc">[PLAN_1_DESC]</p>
        <div class="pricing-price">
          <span class="price-currency">$</span>
          <span class="price-amount" data-monthly="[PLAN_1_MONTHLY]" data-yearly="[PLAN_1_YEARLY]">[PLAN_1_MONTHLY]</span>
          <span class="price-period">/month</span>
        </div>
        <ul class="pricing-features">
          <li><svg class="check-icon" viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5"/></svg>[FEATURE_1]</li>
          <li><svg class="check-icon" viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5"/></svg>[FEATURE_2]</li>
          <li><svg class="check-icon" viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5"/></svg>[FEATURE_3]</li>
        </ul>
        <a href="#contact" class="btn btn-secondary btn-block">Get Started</a>
      </div>
      <div class="pricing-card pricing-popular">
        <span class="popular-badge">Most Popular</span>
        <h3 class="pricing-name">[PLAN_2_NAME]</h3>
        <p class="pricing-desc">[PLAN_2_DESC]</p>
        <div class="pricing-price">
          <span class="price-currency">$</span>
          <span class="price-amount" data-monthly="[PLAN_2_MONTHLY]" data-yearly="[PLAN_2_YEARLY]">[PLAN_2_MONTHLY]</span>
          <span class="price-period">/month</span>
        </div>
        <ul class="pricing-features">
          <li><svg class="check-icon" viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5"/></svg><strong>Everything in [PLAN_1_NAME]</strong></li>
          <li><svg class="check-icon" viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5"/></svg>[FEATURE_4]</li>
          <li><svg class="check-icon" viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5"/></svg>[FEATURE_5]</li>
          <li><svg class="check-icon" viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5"/></svg>[FEATURE_6]</li>
        </ul>
        <a href="#contact" class="btn btn-primary btn-block btn-glow">Get Started</a>
      </div>
      <div class="pricing-card">
        <h3 class="pricing-name">[PLAN_3_NAME]</h3>
        <p class="pricing-desc">[PLAN_3_DESC]</p>
        <div class="pricing-price">
          <span class="price-currency">$</span>
          <span class="price-amount" data-monthly="[PLAN_3_MONTHLY]" data-yearly="[PLAN_3_YEARLY]">[PLAN_3_MONTHLY]</span>
          <span class="price-period">/month</span>
        </div>
        <ul class="pricing-features">
          <li><svg class="check-icon" viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5"/></svg><strong>Everything in [PLAN_2_NAME]</strong></li>
          <li><svg class="check-icon" viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5"/></svg>[FEATURE_7]</li>
          <li><svg class="check-icon" viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5"/></svg>[FEATURE_8]</li>
        </ul>
        <a href="#contact" class="btn btn-secondary btn-block">Contact Sales</a>
      </div>
    </div>
    <p class="pricing-guarantee reveal">
      <svg viewBox="0 0 24 24" width="20" height="20"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" fill="none" stroke="currentColor" stroke-width="2"/></svg>
      30-day money-back guarantee. No questions asked.
    </p>
  </div>
</section>

<style>
.pricing-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  margin-bottom: 48px;
}
.toggle-label {
  font-size: 15px;
  color: var(--text-secondary);
}
.save-badge {
  display: inline-block;
  padding: 4px 8px;
  background: rgba(var(--primary-rgb), 0.1);
  color: var(--primary);
  font-size: 12px;
  font-weight: 600;
  border-radius: 100px;
  margin-left: 8px;
}
.toggle-switch {
  position: relative;
  width: 56px;
  height: 28px;
}
.toggle-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}
.toggle-slider {
  position: absolute;
  cursor: pointer;
  inset: 0;
  background: var(--border-light);
  border-radius: 100px;
  transition: var(--transition-base);
}
.toggle-slider:before {
  content: "";
  position: absolute;
  height: 22px;
  width: 22px;
  left: 3px;
  bottom: 3px;
  background: white;
  border-radius: 50%;
  transition: var(--transition-base);
  box-shadow: var(--shadow-sm);
}
.toggle-switch input:checked + .toggle-slider {
  background: var(--primary);
}
.toggle-switch input:checked + .toggle-slider:before {
  transform: translateX(28px);
}
.pricing-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 32px;
  max-width: 1100px;
  margin: 0 auto;
}
.pricing-card {
  background: var(--bg-card);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-xl);
  padding: 40px;
  position: relative;
  transition: var(--transition-base);
}
.pricing-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
}
.pricing-popular {
  border-color: var(--primary);
  box-shadow: 0 0 0 1px var(--primary);
}
.popular-badge {
  position: absolute;
  top: -12px;
  left: 50%;
  transform: translateX(-50%);
  padding: 6px 16px;
  background: var(--primary);
  color: white;
  font-size: 13px;
  font-weight: 600;
  border-radius: 100px;
}
.pricing-name {
  font-size: 24px;
  margin-bottom: 8px;
}
.pricing-desc {
  font-size: 15px;
  color: var(--text-muted);
  margin-bottom: 24px;
}
.pricing-price {
  margin-bottom: 32px;
}
.price-currency {
  font-size: 24px;
  font-weight: 600;
  vertical-align: top;
}
.price-amount {
  font-family: var(--font-display);
  font-size: 56px;
  font-weight: 700;
  line-height: 1;
}
.price-period {
  font-size: 16px;
  color: var(--text-muted);
}
.pricing-features {
  list-style: none;
  margin-bottom: 32px;
}
.pricing-features li {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px 0;
  font-size: 15px;
  color: var(--text-secondary);
  border-bottom: 1px solid var(--border-light);
}
.pricing-features li:last-child {
  border-bottom: none;
}
.check-icon {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
  stroke: var(--primary);
  stroke-width: 3;
  fill: none;
}
.btn-block {
  display: block;
  width: 100%;
  text-align: center;
}
.pricing-guarantee {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 48px;
  font-size: 15px;
  color: var(--text-muted);
}
.pricing-guarantee svg {
  color: var(--primary);
}

@media (max-width: 1024px) {
  .pricing-grid {
    grid-template-columns: 1fr;
    max-width: 400px;
  }
  .pricing-popular {
    order: -1;
  }
}
</style>

<script>
// Pricing Toggle
document.getElementById('pricingToggle')?.addEventListener('change', function() {
  const isYearly = this.checked;
  document.querySelectorAll('.price-amount').forEach(el => {
    el.textContent = isYearly ? el.dataset.yearly : el.dataset.monthly;
  });
});
</script>
`,
};

// ============================================================================
// FAQ
// ============================================================================

export const FAQ_COMPONENTS = {
  faqAccordion: `
<!-- FAQ -->
<section class="section-faq" id="faq">
  <div class="container">
    <div class="faq-grid">
      <div class="faq-header reveal-left">
        <span class="section-badge">[SECTION_BADGE]</span>
        <h2 class="section-title">Frequently Asked <span class="gradient-text">Questions</span></h2>
        <p class="section-subtitle">Everything you need to know about our services.</p>
        <a href="#contact" class="btn btn-primary mt-md">Still have questions? Contact us</a>
      </div>
      <div class="faq-list reveal-right">
        <div class="faq-item">
          <button class="faq-question">
            <span>[FAQ_1_QUESTION]</span>
            <span class="faq-icon">
              <svg class="icon-plus" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>
              <svg class="icon-minus" viewBox="0 0 24 24"><path d="M5 12h14"/></svg>
            </span>
          </button>
          <div class="faq-answer">
            <p>[FAQ_1_ANSWER]</p>
          </div>
        </div>
        <div class="faq-item">
          <button class="faq-question">
            <span>[FAQ_2_QUESTION]</span>
            <span class="faq-icon">
              <svg class="icon-plus" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>
              <svg class="icon-minus" viewBox="0 0 24 24"><path d="M5 12h14"/></svg>
            </span>
          </button>
          <div class="faq-answer">
            <p>[FAQ_2_ANSWER]</p>
          </div>
        </div>
        <div class="faq-item">
          <button class="faq-question">
            <span>[FAQ_3_QUESTION]</span>
            <span class="faq-icon">
              <svg class="icon-plus" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>
              <svg class="icon-minus" viewBox="0 0 24 24"><path d="M5 12h14"/></svg>
            </span>
          </button>
          <div class="faq-answer">
            <p>[FAQ_3_ANSWER]</p>
          </div>
        </div>
        <div class="faq-item">
          <button class="faq-question">
            <span>[FAQ_4_QUESTION]</span>
            <span class="faq-icon">
              <svg class="icon-plus" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>
              <svg class="icon-minus" viewBox="0 0 24 24"><path d="M5 12h14"/></svg>
            </span>
          </button>
          <div class="faq-answer">
            <p>[FAQ_4_ANSWER]</p>
          </div>
        </div>
        <div class="faq-item">
          <button class="faq-question">
            <span>[FAQ_5_QUESTION]</span>
            <span class="faq-icon">
              <svg class="icon-plus" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>
              <svg class="icon-minus" viewBox="0 0 24 24"><path d="M5 12h14"/></svg>
            </span>
          </button>
          <div class="faq-answer">
            <p>[FAQ_5_ANSWER]</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<style>
.faq-grid {
  display: grid;
  grid-template-columns: 1fr 1.5fr;
  gap: 80px;
  align-items: start;
}
.faq-header {
  position: sticky;
  top: 120px;
}
.faq-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.faq-item {
  background: var(--bg-card);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-lg);
  overflow: hidden;
  transition: var(--transition-base);
}
.faq-item:hover {
  border-color: rgba(var(--primary-rgb), 0.3);
}
.faq-question {
  width: 100%;
  padding: 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  background: none;
  border: none;
  cursor: pointer;
  font-family: var(--font-body);
  font-size: 17px;
  font-weight: 600;
  color: var(--text-primary);
  text-align: left;
}
.faq-icon {
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  position: relative;
}
.faq-icon svg {
  position: absolute;
  inset: 0;
  stroke: var(--text-muted);
  stroke-width: 2;
  fill: none;
  transition: var(--transition-base);
}
.faq-icon .icon-minus {
  opacity: 0;
  transform: rotate(-90deg);
}
.faq-item.active .icon-plus {
  opacity: 0;
  transform: rotate(90deg);
}
.faq-item.active .icon-minus {
  opacity: 1;
  transform: rotate(0);
}
.faq-answer {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.3s ease, padding 0.3s ease;
}
.faq-item.active .faq-answer {
  max-height: 500px;
}
.faq-answer p {
  padding: 0 24px 24px;
  color: var(--text-secondary);
  line-height: 1.7;
}

@media (max-width: 1024px) {
  .faq-grid {
    grid-template-columns: 1fr;
    gap: 48px;
  }
  .faq-header {
    position: static;
    text-align: center;
  }
  .faq-header .section-subtitle {
    margin-left: auto;
    margin-right: auto;
  }
}
</style>
`,
};

// ============================================================================
// CONTACT
// ============================================================================

export const CONTACT_COMPONENTS = {
  contactSplit: `
<!-- CONTACT -->
<section class="section-contact" id="contact">
  <div class="container">
    <div class="contact-grid">
      <div class="contact-info reveal-left">
        <span class="section-badge">[SECTION_BADGE]</span>
        <h2 class="section-title">Let's Start a <span class="gradient-text">Conversation</span></h2>
        <p class="section-subtitle">Have a project in mind? We'd love to hear from you. Send us a message and we'll respond as soon as possible.</p>
        
        <div class="contact-details">
          <div class="contact-item">
            <div class="contact-icon">📞</div>
            <div>
              <strong>Phone</strong>
              <a href="tel:[PHONE]">[PHONE]</a>
            </div>
          </div>
          <div class="contact-item">
            <div class="contact-icon">✉️</div>
            <div>
              <strong>Email</strong>
              <a href="mailto:[EMAIL]">[EMAIL]</a>
            </div>
          </div>
          <div class="contact-item">
            <div class="contact-icon">📍</div>
            <div>
              <strong>Address</strong>
              <span>[ADDRESS]</span>
            </div>
          </div>
        </div>
        
        <div class="contact-social">
          <a href="#" class="social-link" aria-label="Instagram">
            <svg viewBox="0 0 24 24" width="20" height="20"><rect x="2" y="2" width="20" height="20" rx="5" stroke="currentColor" stroke-width="2" fill="none"/><circle cx="12" cy="12" r="4" stroke="currentColor" stroke-width="2" fill="none"/></svg>
          </a>
          <a href="#" class="social-link" aria-label="LinkedIn">
            <svg viewBox="0 0 24 24" width="20" height="20"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2zM4 6a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" stroke="currentColor" stroke-width="2" fill="none"/></svg>
          </a>
          <a href="#" class="social-link" aria-label="Twitter">
            <svg viewBox="0 0 24 24" width="20" height="20"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" stroke="currentColor" stroke-width="2" fill="none"/></svg>
          </a>
        </div>
      </div>
      
      <div class="contact-form-wrapper reveal-right">
        <form class="contact-form">
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">First Name</label>
              <input type="text" class="form-input" placeholder="John" required>
            </div>
            <div class="form-group">
              <label class="form-label">Last Name</label>
              <input type="text" class="form-input" placeholder="Doe" required>
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">Email</label>
            <input type="email" class="form-input" placeholder="john@example.com" required>
          </div>
          <div class="form-group">
            <label class="form-label">Phone (optional)</label>
            <input type="tel" class="form-input" placeholder="(555) 123-4567">
          </div>
          <div class="form-group">
            <label class="form-label">Message</label>
            <textarea class="form-textarea" placeholder="Tell us about your project..." required></textarea>
          </div>
          <button type="submit" class="btn btn-primary btn-lg btn-block">Send Message</button>
        </form>
      </div>
    </div>
  </div>
</section>

<style>
.contact-grid {
  display: grid;
  grid-template-columns: 1fr 1.2fr;
  gap: 80px;
  align-items: start;
}
.contact-details {
  margin-top: 40px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}
.contact-item {
  display: flex;
  align-items: flex-start;
  gap: 16px;
}
.contact-icon {
  width: 48px;
  height: 48px;
  background: rgba(var(--primary-rgb), 0.1);
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  flex-shrink: 0;
}
.contact-item strong {
  display: block;
  font-size: 14px;
  color: var(--text-muted);
  margin-bottom: 4px;
}
.contact-item a,
.contact-item span {
  font-size: 16px;
  color: var(--text-primary);
}
.contact-item a:hover {
  color: var(--primary);
}
.contact-social {
  display: flex;
  gap: 12px;
  margin-top: 40px;
}
.social-link {
  width: 44px;
  height: 44px;
  border: 1px solid var(--border-light);
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary);
  transition: var(--transition-base);
}
.social-link:hover {
  background: var(--primary);
  border-color: var(--primary);
  color: white;
}
.contact-form-wrapper {
  background: var(--bg-card);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-xl);
  padding: 48px;
}
.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

@media (max-width: 1024px) {
  .contact-grid {
    grid-template-columns: 1fr;
    gap: 48px;
  }
}

@media (max-width: 640px) {
  .form-row {
    grid-template-columns: 1fr;
  }
  .contact-form-wrapper {
    padding: 32px 24px;
  }
}
</style>
`,
};

// ============================================================================
// CTA SECTION
// ============================================================================

export const CTA_COMPONENTS = {
  ctaGradient: `
<!-- CTA -->
<section class="section-cta">
  <div class="container">
    <div class="cta-box reveal">
      <div class="cta-bg">
        <div class="cta-blob cta-blob-1"></div>
        <div class="cta-blob cta-blob-2"></div>
      </div>
      <div class="cta-content">
        <h2 class="cta-title">[CTA_TITLE]</h2>
        <p class="cta-subtitle">[CTA_SUBTITLE]</p>
        <div class="cta-buttons">
          <a href="#contact" class="btn btn-white btn-lg">[PRIMARY_CTA]</a>
          <a href="#" class="btn btn-ghost-white btn-lg">[SECONDARY_CTA]</a>
        </div>
      </div>
    </div>
  </div>
</section>

<style>
.section-cta {
  padding: 80px 0;
}
.cta-box {
  background: linear-gradient(135deg, var(--primary), var(--secondary));
  border-radius: var(--radius-xl);
  padding: 80px;
  text-align: center;
  position: relative;
  overflow: hidden;
}
.cta-bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
}
.cta-blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(60px);
  opacity: 0.3;
}
.cta-blob-1 {
  width: 400px;
  height: 400px;
  background: white;
  top: -200px;
  right: -100px;
}
.cta-blob-2 {
  width: 300px;
  height: 300px;
  background: var(--accent);
  bottom: -150px;
  left: -50px;
}
.cta-content {
  position: relative;
  z-index: 1;
}
.cta-title {
  font-size: clamp(32px, 5vw, 48px);
  color: white;
  margin-bottom: 16px;
}
.cta-subtitle {
  font-size: 18px;
  color: rgba(255,255,255,0.9);
  margin-bottom: 32px;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}
.cta-buttons {
  display: flex;
  justify-content: center;
  gap: 16px;
  flex-wrap: wrap;
}
.btn-ghost-white {
  background: transparent;
  color: white;
  border: 2px solid rgba(255,255,255,0.3);
}
.btn-ghost-white:hover {
  background: white;
  color: var(--primary);
  border-color: white;
}

@media (max-width: 768px) {
  .cta-box {
    padding: 48px 24px;
  }
}
</style>
`,
};

// ============================================================================
// FOOTER
// ============================================================================

export const FOOTER_COMPONENTS = {
  footerFull: `
<!-- FOOTER -->
<footer class="footer">
  <div class="container">
    <div class="footer-grid">
      <div class="footer-brand">
        <a href="#" class="footer-logo">[LOGO]</a>
        <p class="footer-tagline">[TAGLINE]</p>
        <div class="footer-social">
          <a href="#" aria-label="Instagram"><svg viewBox="0 0 24 24" width="20" height="20"><rect x="2" y="2" width="20" height="20" rx="5" stroke="currentColor" stroke-width="2" fill="none"/><circle cx="12" cy="12" r="4" stroke="currentColor" stroke-width="2" fill="none"/></svg></a>
          <a href="#" aria-label="LinkedIn"><svg viewBox="0 0 24 24" width="20" height="20"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2zM4 6a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" stroke="currentColor" stroke-width="2" fill="none"/></svg></a>
          <a href="#" aria-label="Twitter"><svg viewBox="0 0 24 24" width="20" height="20"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" stroke="currentColor" stroke-width="2" fill="none"/></svg></a>
        </div>
      </div>
      <div class="footer-column">
        <h4>Company</h4>
        <ul>
          <li><a href="#about">About</a></li>
          <li><a href="#services">Services</a></li>
          <li><a href="#testimonials">Testimonials</a></li>
          <li><a href="#contact">Contact</a></li>
        </ul>
      </div>
      <div class="footer-column">
        <h4>Services</h4>
        <ul>
          <li><a href="#">[SERVICE_1]</a></li>
          <li><a href="#">[SERVICE_2]</a></li>
          <li><a href="#">[SERVICE_3]</a></li>
          <li><a href="#">[SERVICE_4]</a></li>
        </ul>
      </div>
      <div class="footer-column">
        <h4>Contact</h4>
        <ul>
          <li><a href="tel:[PHONE]">[PHONE]</a></li>
          <li><a href="mailto:[EMAIL]">[EMAIL]</a></li>
          <li><span>[ADDRESS]</span></li>
        </ul>
      </div>
    </div>
    <div class="footer-bottom">
      <p>© 2024 [BUSINESS_NAME]. All rights reserved.</p>
      <div class="footer-links">
        <a href="#">Privacy Policy</a>
        <a href="#">Terms of Service</a>
      </div>
    </div>
  </div>
</footer>

<style>
.footer {
  background: var(--bg-secondary);
  padding: 80px 0 40px;
  border-top: 1px solid var(--border-light);
}
.footer-grid {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  gap: 60px;
  margin-bottom: 60px;
}
.footer-logo {
  font-family: var(--font-display);
  font-size: 24px;
  font-weight: 800;
  color: var(--text-primary);
  display: block;
  margin-bottom: 16px;
}
.footer-tagline {
  color: var(--text-secondary);
  line-height: 1.7;
  max-width: 300px;
}
.footer-social {
  display: flex;
  gap: 12px;
  margin-top: 24px;
}
.footer-social a {
  width: 40px;
  height: 40px;
  border: 1px solid var(--border-light);
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary);
  transition: var(--transition-base);
}
.footer-social a:hover {
  background: var(--primary);
  border-color: var(--primary);
  color: white;
}
.footer-column h4 {
  font-size: 14px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text-primary);
  margin-bottom: 20px;
}
.footer-column ul {
  list-style: none;
}
.footer-column li {
  margin-bottom: 12px;
}
.footer-column a,
.footer-column span {
  font-size: 15px;
  color: var(--text-secondary);
  transition: var(--transition-base);
}
.footer-column a:hover {
  color: var(--primary);
}
.footer-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 40px;
  border-top: 1px solid var(--border-light);
}
.footer-bottom p {
  font-size: 14px;
  color: var(--text-muted);
}
.footer-links {
  display: flex;
  gap: 24px;
}
.footer-links a {
  font-size: 14px;
  color: var(--text-muted);
}
.footer-links a:hover {
  color: var(--primary);
}

@media (max-width: 1024px) {
  .footer-grid {
    grid-template-columns: 1fr 1fr;
    gap: 40px;
  }
}

@media (max-width: 640px) {
  .footer-grid {
    grid-template-columns: 1fr;
    gap: 32px;
  }
  .footer-bottom {
    flex-direction: column;
    gap: 16px;
    text-align: center;
  }
}
</style>
`,
};

// ============================================================================
// NAVIGATION
// ============================================================================

export const NAV_COMPONENTS = {
  navStandard: `
<!-- NAVIGATION -->
<nav class="navbar">
  <div class="container nav-container">
    <a href="#" class="nav-logo">[LOGO]</a>
    <ul class="nav-links">
      <li><a href="#home">Home</a></li>
      <li><a href="#about">About</a></li>
      <li><a href="#services">Services</a></li>
      <li><a href="#testimonials">Testimonials</a></li>
      <li><a href="#contact">Contact</a></li>
    </ul>
    <a href="#contact" class="btn btn-primary nav-cta">[CTA_TEXT]</a>
    <button class="menu-toggle" aria-label="Toggle menu">
      <span></span>
      <span></span>
      <span></span>
    </button>
  </div>
</nav>
`,
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

export function getComponentsByType(type: string): Record<string, string> {
  switch (type) {
    case 'hero': return HERO_COMPONENTS;
    case 'services': return SERVICE_COMPONENTS;
    case 'testimonials': return TESTIMONIAL_COMPONENTS;
    case 'pricing': return PRICING_COMPONENTS;
    case 'faq': return FAQ_COMPONENTS;
    case 'contact': return CONTACT_COMPONENTS;
    case 'cta': return CTA_COMPONENTS;
    case 'footer': return FOOTER_COMPONENTS;
    case 'nav': return NAV_COMPONENTS;
    default: return {};
  }
}

export function getAllComponents(): Record<string, Record<string, string>> {
  return {
    hero: HERO_COMPONENTS,
    services: SERVICE_COMPONENTS,
    testimonials: TESTIMONIAL_COMPONENTS,
    pricing: PRICING_COMPONENTS,
    faq: FAQ_COMPONENTS,
    contact: CONTACT_COMPONENTS,
    cta: CTA_COMPONENTS,
    footer: FOOTER_COMPONENTS,
    nav: NAV_COMPONENTS,
  };
}

export function getComponentReference(): string {
  return `
## AVAILABLE COMPONENT PATTERNS

### Hero Sections
- splitHero: Split layout with image on right, content on left, stats, floating card
- centeredHero: Centered content, product screenshot below, social proof
- fullImageHero: Full-screen background image with overlay

### Services/Features
- bentoGrid: Modern bento grid layout with mixed card sizes
- cardsGrid: Simple 4-column cards with icons

### Testimonials
- featuredTestimonial: Large single testimonial with metrics
- testimonialsGrid: 3-column grid of testimonial cards

### Pricing
- pricingTable: 3-tier pricing with monthly/yearly toggle

### FAQ
- faqAccordion: Split layout with accordion

### Contact
- contactSplit: Split layout with info on left, form on right

### CTA
- ctaGradient: Gradient background with decorative blobs

### Footer
- footerFull: 4-column footer with social links

### Navigation
- navStandard: Fixed navigation with mobile menu toggle
`;
}
