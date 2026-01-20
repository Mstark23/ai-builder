// /lib/ai/components-heroes.ts
// Complete Hero Section Library - 15 Variations

export const HERO_SECTIONS = {
  // ============================================================================
  // 1. SPLIT HERO - Image right, content left
  // ============================================================================
  splitHero: `
<section class="hero hero-split">
  <div class="container">
    <div class="hero-grid">
      <div class="hero-content">
        <span class="hero-badge">[BADGE_TEXT]</span>
        <h1 class="hero-title">[HEADLINE]</h1>
        <p class="hero-description">[SUBHEADLINE]</p>
        <div class="hero-cta-group">
          <a href="#contact" class="btn btn-primary btn-lg">[CTA_PRIMARY]</a>
          <a href="#services" class="btn btn-outline btn-lg">[CTA_SECONDARY]</a>
        </div>
        <div class="hero-stats">
          <div class="stat">
            <span class="stat-number" data-count="[STAT1_NUMBER]">0</span>
            <span class="stat-label">[STAT1_LABEL]</span>
          </div>
          <div class="stat">
            <span class="stat-number" data-count="[STAT2_NUMBER]">0</span>
            <span class="stat-label">[STAT2_LABEL]</span>
          </div>
          <div class="stat">
            <span class="stat-number" data-count="[STAT3_NUMBER]">0</span>
            <span class="stat-label">[STAT3_LABEL]</span>
          </div>
        </div>
      </div>
      <div class="hero-image">
        <img src="[HERO_IMAGE]" alt="[IMAGE_ALT]" loading="eager">
        <div class="hero-image-decoration"></div>
      </div>
    </div>
  </div>
</section>

<style>
.hero-split {
  padding: 120px 0;
  min-height: 100vh;
  display: flex;
  align-items: center;
}
.hero-split .hero-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 80px;
  align-items: center;
}
.hero-badge {
  display: inline-block;
  padding: 8px 16px;
  background: rgba(var(--primary-rgb), 0.1);
  color: var(--primary);
  border-radius: 100px;
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 24px;
}
.hero-title {
  font-size: clamp(48px, 6vw, 72px);
  font-weight: 800;
  line-height: 1.1;
  margin-bottom: 24px;
  letter-spacing: -0.02em;
}
.hero-description {
  font-size: 20px;
  color: var(--text-secondary);
  line-height: 1.6;
  margin-bottom: 32px;
  max-width: 500px;
}
.hero-cta-group {
  display: flex;
  gap: 16px;
  margin-bottom: 48px;
}
.hero-stats {
  display: flex;
  gap: 48px;
}
.stat-number {
  display: block;
  font-size: 48px;
  font-weight: 800;
  color: var(--primary);
}
.stat-label {
  font-size: 14px;
  color: var(--text-muted);
}
.hero-image {
  position: relative;
}
.hero-image img {
  width: 100%;
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-2xl);
}
.hero-image-decoration {
  position: absolute;
  inset: -20px;
  border: 2px solid var(--primary);
  border-radius: var(--radius-xl);
  z-index: -1;
  opacity: 0.3;
}
@media (max-width: 968px) {
  .hero-split .hero-grid {
    grid-template-columns: 1fr;
    gap: 48px;
    text-align: center;
  }
  .hero-description { max-width: 100%; }
  .hero-cta-group { justify-content: center; }
  .hero-stats { justify-content: center; }
}
</style>
`,

  // ============================================================================
  // 2. CENTERED HERO - Content centered with background
  // ============================================================================
  centeredHero: `
<section class="hero hero-centered">
  <div class="hero-bg-decoration">
    <div class="blob blob-1"></div>
    <div class="blob blob-2"></div>
  </div>
  <div class="container">
    <div class="hero-content text-center">
      <div class="hero-social-proof">
        <div class="avatar-stack">
          <img src="https://i.pravatar.cc/100?img=1" alt="Customer">
          <img src="https://i.pravatar.cc/100?img=2" alt="Customer">
          <img src="https://i.pravatar.cc/100?img=3" alt="Customer">
          <img src="https://i.pravatar.cc/100?img=4" alt="Customer">
        </div>
        <span>[SOCIAL_PROOF_TEXT]</span>
      </div>
      <h1 class="hero-title">[HEADLINE]</h1>
      <p class="hero-description">[SUBHEADLINE]</p>
      <div class="hero-cta-group">
        <a href="#contact" class="btn btn-primary btn-lg">[CTA_PRIMARY]</a>
        <a href="#demo" class="btn btn-ghost btn-lg">
          <span class="play-icon">▶</span> [CTA_SECONDARY]
        </a>
      </div>
      <div class="hero-image-wrapper">
        <img src="[HERO_IMAGE]" alt="[IMAGE_ALT]" class="hero-screenshot">
        <div class="hero-glow"></div>
      </div>
    </div>
  </div>
</section>

<style>
.hero-centered {
  padding: 140px 0 80px;
  position: relative;
  overflow: hidden;
}
.hero-bg-decoration {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
}
.hero-centered .blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.4;
}
.hero-centered .blob-1 {
  width: 600px;
  height: 600px;
  background: var(--primary);
  top: -200px;
  right: -100px;
}
.hero-centered .blob-2 {
  width: 400px;
  height: 400px;
  background: var(--secondary);
  bottom: 0;
  left: -100px;
}
.hero-social-proof {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-bottom: 32px;
}
.avatar-stack {
  display: flex;
}
.avatar-stack img {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 3px solid white;
  margin-left: -12px;
}
.avatar-stack img:first-child { margin-left: 0; }
.hero-social-proof span {
  font-size: 14px;
  color: var(--text-secondary);
}
.hero-centered .hero-title {
  font-size: clamp(48px, 7vw, 84px);
  font-weight: 800;
  line-height: 1.05;
  margin-bottom: 24px;
  letter-spacing: -0.025em;
  max-width: 900px;
  margin-left: auto;
  margin-right: auto;
}
.hero-centered .hero-description {
  font-size: 20px;
  color: var(--text-secondary);
  line-height: 1.6;
  margin-bottom: 40px;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}
.hero-centered .hero-cta-group {
  display: flex;
  gap: 16px;
  justify-content: center;
  margin-bottom: 64px;
}
.play-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  background: var(--primary);
  color: white;
  border-radius: 50%;
  font-size: 10px;
  margin-right: 8px;
}
.hero-image-wrapper {
  position: relative;
  max-width: 1000px;
  margin: 0 auto;
}
.hero-screenshot {
  width: 100%;
  border-radius: var(--radius-xl);
  box-shadow: 0 40px 80px rgba(0,0,0,0.2);
}
.hero-glow {
  position: absolute;
  inset: 20%;
  background: var(--primary);
  filter: blur(100px);
  opacity: 0.3;
  z-index: -1;
}
</style>
`,

  // ============================================================================
  // 3. FULL IMAGE HERO - Full screen background image
  // ============================================================================
  fullImageHero: `
<section class="hero hero-fullimage" style="background-image: url('[HERO_IMAGE]')">
  <div class="hero-overlay"></div>
  <div class="container">
    <div class="hero-content">
      <h1 class="hero-title">[HEADLINE]</h1>
      <p class="hero-description">[SUBHEADLINE]</p>
      <div class="hero-cta-group">
        <a href="#contact" class="btn btn-white btn-lg">[CTA_PRIMARY]</a>
        <a href="#about" class="btn btn-outline-white btn-lg">[CTA_SECONDARY]</a>
      </div>
    </div>
  </div>
  <div class="scroll-indicator">
    <span>Scroll</span>
    <div class="scroll-line"></div>
  </div>
</section>

<style>
.hero-fullimage {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  position: relative;
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
}
.hero-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, rgba(0,0,0,0.5), rgba(0,0,0,0.7));
}
.hero-fullimage .container {
  position: relative;
  z-index: 1;
}
.hero-fullimage .hero-title {
  font-size: clamp(48px, 8vw, 96px);
  font-weight: 800;
  color: white;
  line-height: 1.05;
  margin-bottom: 24px;
  letter-spacing: -0.025em;
  text-shadow: 0 4px 20px rgba(0,0,0,0.3);
}
.hero-fullimage .hero-description {
  font-size: 22px;
  color: rgba(255,255,255,0.9);
  line-height: 1.6;
  margin-bottom: 40px;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}
.hero-fullimage .hero-cta-group {
  display: flex;
  gap: 16px;
  justify-content: center;
}
.btn-white {
  background: white;
  color: var(--text-primary);
}
.btn-white:hover {
  background: rgba(255,255,255,0.9);
}
.btn-outline-white {
  border: 2px solid white;
  color: white;
  background: transparent;
}
.btn-outline-white:hover {
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
  gap: 12px;
  color: white;
  font-size: 12px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}
.scroll-line {
  width: 1px;
  height: 60px;
  background: linear-gradient(to bottom, white, transparent);
  animation: scrollPulse 2s ease-in-out infinite;
}
@keyframes scrollPulse {
  0%, 100% { opacity: 1; height: 60px; }
  50% { opacity: 0.5; height: 40px; }
}
</style>
`,

  // ============================================================================
  // 4. VIDEO HERO - Background video
  // ============================================================================
  videoHero: `
<section class="hero hero-video">
  <video autoplay muted loop playsinline class="hero-video-bg">
    <source src="[VIDEO_URL]" type="video/mp4">
  </video>
  <div class="hero-overlay"></div>
  <div class="container">
    <div class="hero-content text-center">
      <span class="hero-label">[LABEL_TEXT]</span>
      <h1 class="hero-title">[HEADLINE]</h1>
      <p class="hero-description">[SUBHEADLINE]</p>
      <div class="hero-cta-group">
        <a href="#contact" class="btn btn-primary btn-lg">[CTA_PRIMARY]</a>
      </div>
    </div>
  </div>
</section>

<style>
.hero-video {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}
.hero-video-bg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.hero-video .hero-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0,0,0,0.6);
}
.hero-video .container {
  position: relative;
  z-index: 1;
}
.hero-label {
  display: inline-block;
  padding: 8px 20px;
  background: rgba(255,255,255,0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255,255,255,0.2);
  border-radius: 100px;
  color: white;
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 24px;
}
.hero-video .hero-title {
  font-size: clamp(48px, 7vw, 80px);
  font-weight: 800;
  color: white;
  line-height: 1.1;
  margin-bottom: 24px;
  max-width: 900px;
  margin-left: auto;
  margin-right: auto;
}
.hero-video .hero-description {
  font-size: 20px;
  color: rgba(255,255,255,0.8);
  margin-bottom: 40px;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}
.hero-video .hero-cta-group {
  display: flex;
  gap: 16px;
  justify-content: center;
}
</style>
`,

  // ============================================================================
  // 5. GRADIENT HERO - Animated gradient background
  // ============================================================================
  gradientHero: `
<section class="hero hero-gradient">
  <div class="gradient-bg"></div>
  <div class="container">
    <div class="hero-content text-center">
      <div class="hero-eyebrow">
        <span class="dot"></span>
        [EYEBROW_TEXT]
      </div>
      <h1 class="hero-title">
        [HEADLINE_PART1]
        <span class="gradient-text">[HEADLINE_HIGHLIGHT]</span>
        [HEADLINE_PART2]
      </h1>
      <p class="hero-description">[SUBHEADLINE]</p>
      <div class="hero-cta-group">
        <a href="#contact" class="btn btn-primary btn-lg btn-glow">[CTA_PRIMARY]</a>
        <a href="#features" class="btn btn-ghost btn-lg">[CTA_SECONDARY] →</a>
      </div>
      <div class="hero-clients">
        <span>Trusted by</span>
        <div class="client-logos">
          [CLIENT_LOGOS]
        </div>
      </div>
    </div>
  </div>
</section>

<style>
.hero-gradient {
  min-height: 100vh;
  display: flex;
  align-items: center;
  position: relative;
  overflow: hidden;
  background: var(--bg-primary);
}
.gradient-bg {
  position: absolute;
  inset: 0;
  background: linear-gradient(-45deg, 
    rgba(var(--primary-rgb), 0.1), 
    rgba(var(--secondary-rgb), 0.1), 
    rgba(var(--accent-rgb), 0.1),
    rgba(var(--primary-rgb), 0.1)
  );
  background-size: 400% 400%;
  animation: gradientMove 15s ease infinite;
}
@keyframes gradientMove {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}
.hero-eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: var(--bg-secondary);
  border-radius: 100px;
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 32px;
}
.hero-eyebrow .dot {
  width: 8px;
  height: 8px;
  background: #10b981;
  border-radius: 50%;
  animation: pulse 2s ease infinite;
}
.hero-gradient .hero-title {
  font-size: clamp(48px, 7vw, 84px);
  font-weight: 800;
  line-height: 1.05;
  margin-bottom: 24px;
  letter-spacing: -0.025em;
}
.gradient-text {
  background: linear-gradient(135deg, var(--primary), var(--secondary));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
.hero-gradient .hero-description {
  font-size: 20px;
  color: var(--text-secondary);
  margin-bottom: 40px;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}
.hero-gradient .hero-cta-group {
  display: flex;
  gap: 16px;
  justify-content: center;
  margin-bottom: 64px;
}
.btn-glow {
  position: relative;
}
.btn-glow::before {
  content: '';
  position: absolute;
  inset: -3px;
  background: linear-gradient(135deg, var(--primary), var(--secondary));
  border-radius: inherit;
  filter: blur(20px);
  opacity: 0.5;
  z-index: -1;
  transition: opacity 0.3s ease;
}
.btn-glow:hover::before {
  opacity: 0.8;
}
.hero-clients {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}
.hero-clients span {
  font-size: 14px;
  color: var(--text-muted);
}
.client-logos {
  display: flex;
  gap: 40px;
  align-items: center;
  opacity: 0.6;
}
.client-logos img {
  height: 32px;
  filter: grayscale(100%);
}
</style>
`,

  // ============================================================================
  // 6. MINIMAL HERO - Clean, typography focused
  // ============================================================================
  minimalHero: `
<section class="hero hero-minimal">
  <div class="container container-narrow">
    <div class="hero-content">
      <h1 class="hero-title">[HEADLINE]</h1>
      <div class="hero-divider"></div>
      <p class="hero-description">[SUBHEADLINE]</p>
      <a href="#contact" class="btn btn-primary btn-lg">[CTA_PRIMARY]</a>
    </div>
  </div>
</section>

<style>
.hero-minimal {
  min-height: 100vh;
  display: flex;
  align-items: center;
  padding: 120px 0;
}
.container-narrow {
  max-width: 800px;
}
.hero-minimal .hero-title {
  font-size: clamp(56px, 8vw, 120px);
  font-weight: 300;
  line-height: 1;
  letter-spacing: -0.03em;
  margin-bottom: 40px;
}
.hero-divider {
  width: 80px;
  height: 1px;
  background: var(--text-primary);
  margin-bottom: 40px;
}
.hero-minimal .hero-description {
  font-size: 24px;
  color: var(--text-secondary);
  line-height: 1.6;
  margin-bottom: 48px;
  max-width: 500px;
}
</style>
`,

  // ============================================================================
  // 7. CARD HERO - Content in floating card
  // ============================================================================
  cardHero: `
<section class="hero hero-card" style="background-image: url('[HERO_IMAGE]')">
  <div class="hero-overlay"></div>
  <div class="container">
    <div class="hero-card-wrapper glass">
      <span class="hero-badge">[BADGE_TEXT]</span>
      <h1 class="hero-title">[HEADLINE]</h1>
      <p class="hero-description">[SUBHEADLINE]</p>
      <div class="hero-cta-group">
        <a href="#contact" class="btn btn-primary btn-lg">[CTA_PRIMARY]</a>
        <a href="#services" class="btn btn-outline btn-lg">[CTA_SECONDARY]</a>
      </div>
    </div>
  </div>
</section>

<style>
.hero-card {
  min-height: 100vh;
  display: flex;
  align-items: center;
  background-size: cover;
  background-position: center;
  position: relative;
}
.hero-card .hero-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0,0,0,0.3);
}
.hero-card .container {
  position: relative;
  z-index: 1;
}
.hero-card-wrapper {
  max-width: 600px;
  padding: 60px;
  background: rgba(255,255,255,0.95);
  backdrop-filter: blur(20px);
  border-radius: var(--radius-xl);
  box-shadow: 0 40px 80px rgba(0,0,0,0.2);
}
.hero-card .hero-badge {
  display: inline-block;
  padding: 6px 14px;
  background: var(--primary);
  color: white;
  border-radius: 100px;
  font-size: 13px;
  font-weight: 600;
  margin-bottom: 24px;
}
.hero-card .hero-title {
  font-size: clamp(36px, 5vw, 56px);
  font-weight: 800;
  line-height: 1.1;
  margin-bottom: 20px;
  color: var(--text-primary);
}
.hero-card .hero-description {
  font-size: 18px;
  color: var(--text-secondary);
  line-height: 1.6;
  margin-bottom: 32px;
}
.hero-card .hero-cta-group {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}
@media (max-width: 640px) {
  .hero-card-wrapper {
    padding: 40px 24px;
  }
}
</style>
`,

  // ============================================================================
  // 8. ASYMMETRIC HERO - Creative off-grid layout
  // ============================================================================
  asymmetricHero: `
<section class="hero hero-asymmetric">
  <div class="container">
    <div class="hero-layout">
      <div class="hero-col-left">
        <div class="hero-image-stack">
          <img src="[IMAGE_1]" alt="" class="stack-img stack-img-1">
          <img src="[IMAGE_2]" alt="" class="stack-img stack-img-2">
        </div>
      </div>
      <div class="hero-col-right">
        <span class="hero-number">01</span>
        <h1 class="hero-title">[HEADLINE]</h1>
        <p class="hero-description">[SUBHEADLINE]</p>
        <a href="#contact" class="btn btn-primary btn-lg">[CTA_PRIMARY] →</a>
      </div>
    </div>
  </div>
  <div class="hero-marquee">
    <div class="marquee-content">
      [MARQUEE_TEXT] • [MARQUEE_TEXT] • [MARQUEE_TEXT] • [MARQUEE_TEXT] •
    </div>
  </div>
</section>

<style>
.hero-asymmetric {
  min-height: 100vh;
  padding: 120px 0 0;
  position: relative;
  overflow: hidden;
}
.hero-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 80px;
  align-items: center;
  min-height: 80vh;
}
.hero-image-stack {
  position: relative;
  height: 600px;
}
.stack-img {
  position: absolute;
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-2xl);
}
.stack-img-1 {
  width: 70%;
  top: 0;
  left: 0;
  z-index: 2;
}
.stack-img-2 {
  width: 60%;
  bottom: 0;
  right: 0;
  z-index: 1;
}
.hero-number {
  display: block;
  font-size: 120px;
  font-weight: 800;
  color: var(--bg-secondary);
  line-height: 1;
  margin-bottom: -20px;
}
.hero-asymmetric .hero-title {
  font-size: clamp(48px, 5vw, 64px);
  font-weight: 800;
  line-height: 1.1;
  margin-bottom: 24px;
}
.hero-asymmetric .hero-description {
  font-size: 18px;
  color: var(--text-secondary);
  line-height: 1.7;
  margin-bottom: 32px;
  max-width: 400px;
}
.hero-marquee {
  position: absolute;
  bottom: 40px;
  left: 0;
  right: 0;
  overflow: hidden;
  padding: 20px 0;
  border-top: 1px solid var(--border-light);
  border-bottom: 1px solid var(--border-light);
}
.marquee-content {
  display: inline-block;
  white-space: nowrap;
  animation: marquee 30s linear infinite;
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--text-muted);
}
@keyframes marquee {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}
@media (max-width: 968px) {
  .hero-layout {
    grid-template-columns: 1fr;
    text-align: center;
  }
  .hero-image-stack { display: none; }
  .hero-asymmetric .hero-description { max-width: 100%; }
}
</style>
`,

  // ============================================================================
  // 9. PARALLAX HERO - Layered parallax effect
  // ============================================================================
  parallaxHero: `
<section class="hero hero-parallax">
  <div class="parallax-layer parallax-bg" data-parallax="0.2" style="background-image: url('[BG_IMAGE]')"></div>
  <div class="parallax-layer parallax-mid" data-parallax="0.5">
    <img src="[MID_IMAGE]" alt="">
  </div>
  <div class="parallax-layer parallax-front" data-parallax="0.8">
    <div class="container">
      <div class="hero-content text-center">
        <h1 class="hero-title">[HEADLINE]</h1>
        <p class="hero-description">[SUBHEADLINE]</p>
        <a href="#contact" class="btn btn-white btn-lg">[CTA_PRIMARY]</a>
      </div>
    </div>
  </div>
</section>

<style>
.hero-parallax {
  min-height: 100vh;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}
.parallax-layer {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}
.parallax-bg {
  background-size: cover;
  background-position: center;
  transform: scale(1.1);
}
.parallax-mid img {
  max-width: 50%;
  opacity: 0.3;
}
.parallax-front {
  position: relative;
  z-index: 10;
}
.hero-parallax::before {
  content: '';
  position: absolute;
  inset: 0;
  background: rgba(0,0,0,0.5);
  z-index: 5;
}
.hero-parallax .hero-title {
  font-size: clamp(48px, 8vw, 100px);
  font-weight: 800;
  color: white;
  margin-bottom: 24px;
  text-shadow: 0 4px 20px rgba(0,0,0,0.3);
}
.hero-parallax .hero-description {
  font-size: 20px;
  color: rgba(255,255,255,0.9);
  margin-bottom: 40px;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}
</style>
`,

  // ============================================================================
  // 10. BENTO HERO - Bento grid layout
  // ============================================================================
  bentoHero: `
<section class="hero hero-bento">
  <div class="container">
    <div class="bento-grid">
      <div class="bento-item bento-main">
        <h1 class="hero-title">[HEADLINE]</h1>
        <p class="hero-description">[SUBHEADLINE]</p>
        <a href="#contact" class="btn btn-primary btn-lg">[CTA_PRIMARY]</a>
      </div>
      <div class="bento-item bento-image">
        <img src="[IMAGE_1]" alt="">
      </div>
      <div class="bento-item bento-stats">
        <div class="stat">
          <span class="stat-number">[STAT1_NUMBER]</span>
          <span class="stat-label">[STAT1_LABEL]</span>
        </div>
      </div>
      <div class="bento-item bento-testimonial">
        <p>"[TESTIMONIAL_TEXT]"</p>
        <div class="testimonial-author">
          <img src="[AUTHOR_IMAGE]" alt="">
          <span>[AUTHOR_NAME]</span>
        </div>
      </div>
      <div class="bento-item bento-image-2">
        <img src="[IMAGE_2]" alt="">
      </div>
    </div>
  </div>
</section>

<style>
.hero-bento {
  padding: 120px 0;
  min-height: 100vh;
  display: flex;
  align-items: center;
}
.bento-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: auto auto;
  gap: 24px;
}
.bento-item {
  background: var(--bg-card);
  border-radius: var(--radius-xl);
  padding: 40px;
  border: 1px solid var(--border-light);
}
.bento-main {
  grid-column: span 2;
  grid-row: span 2;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.bento-main .hero-title {
  font-size: clamp(40px, 5vw, 64px);
  font-weight: 800;
  line-height: 1.1;
  margin-bottom: 20px;
}
.bento-main .hero-description {
  font-size: 18px;
  color: var(--text-secondary);
  margin-bottom: 32px;
}
.bento-image, .bento-image-2 {
  padding: 0;
  overflow: hidden;
}
.bento-image img, .bento-image-2 img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.bento-stats {
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--primary);
  color: white;
}
.bento-stats .stat-number {
  font-size: 64px;
  font-weight: 800;
  display: block;
}
.bento-stats .stat-label {
  font-size: 16px;
  opacity: 0.8;
}
.bento-testimonial {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.bento-testimonial p {
  font-size: 16px;
  font-style: italic;
  color: var(--text-secondary);
  margin-bottom: 20px;
}
.testimonial-author {
  display: flex;
  align-items: center;
  gap: 12px;
}
.testimonial-author img {
  width: 40px;
  height: 40px;
  border-radius: 50%;
}
@media (max-width: 968px) {
  .bento-grid {
    grid-template-columns: 1fr 1fr;
  }
}
@media (max-width: 640px) {
  .bento-grid {
    grid-template-columns: 1fr;
  }
  .bento-main { grid-column: span 1; grid-row: span 1; }
}
</style>
`,

  // ============================================================================
  // 11. DARK HERO - Dark theme with glow effects
  // ============================================================================
  darkHero: `
<section class="hero hero-dark">
  <div class="grid-bg"></div>
  <div class="glow-effects">
    <div class="glow glow-1"></div>
    <div class="glow glow-2"></div>
  </div>
  <div class="container">
    <div class="hero-content text-center">
      <div class="hero-chip">
        <span class="chip-dot"></span>
        [CHIP_TEXT]
      </div>
      <h1 class="hero-title">
        [HEADLINE_PART1]
        <span class="text-glow">[HEADLINE_HIGHLIGHT]</span>
      </h1>
      <p class="hero-description">[SUBHEADLINE]</p>
      <div class="hero-cta-group">
        <a href="#contact" class="btn btn-primary btn-lg btn-glow">[CTA_PRIMARY]</a>
        <a href="#features" class="btn btn-outline-light btn-lg">[CTA_SECONDARY]</a>
      </div>
    </div>
  </div>
</section>

<style>
.hero-dark {
  min-height: 100vh;
  display: flex;
  align-items: center;
  background: #09090b;
  position: relative;
  overflow: hidden;
}
.grid-bg {
  position: absolute;
  inset: 0;
  background-image: 
    linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
  background-size: 60px 60px;
}
.glow-effects {
  position: absolute;
  inset: 0;
  pointer-events: none;
}
.glow {
  position: absolute;
  border-radius: 50%;
  filter: blur(100px);
}
.glow-1 {
  width: 600px;
  height: 600px;
  background: var(--primary);
  opacity: 0.15;
  top: -200px;
  right: 10%;
}
.glow-2 {
  width: 400px;
  height: 400px;
  background: var(--secondary);
  opacity: 0.1;
  bottom: -100px;
  left: 20%;
}
.hero-dark .container {
  position: relative;
  z-index: 1;
}
.hero-chip {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 100px;
  color: rgba(255,255,255,0.8);
  font-size: 14px;
  margin-bottom: 32px;
}
.chip-dot {
  width: 8px;
  height: 8px;
  background: #10b981;
  border-radius: 50%;
  box-shadow: 0 0 10px #10b981;
}
.hero-dark .hero-title {
  font-size: clamp(48px, 7vw, 84px);
  font-weight: 800;
  color: white;
  line-height: 1.05;
  margin-bottom: 24px;
}
.text-glow {
  color: var(--primary);
  text-shadow: 0 0 40px rgba(var(--primary-rgb), 0.5);
}
.hero-dark .hero-description {
  font-size: 20px;
  color: rgba(255,255,255,0.6);
  margin-bottom: 40px;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}
.hero-dark .hero-cta-group {
  display: flex;
  gap: 16px;
  justify-content: center;
}
.btn-outline-light {
  border: 1px solid rgba(255,255,255,0.2);
  color: white;
  background: transparent;
}
.btn-outline-light:hover {
  background: rgba(255,255,255,0.1);
}
</style>
`,

  // ============================================================================
  // 12. PRODUCT HERO - Product showcase focus
  // ============================================================================
  productHero: `
<section class="hero hero-product">
  <div class="container">
    <div class="hero-content text-center">
      <span class="hero-tag">[TAG_TEXT]</span>
      <h1 class="hero-title">[HEADLINE]</h1>
      <p class="hero-description">[SUBHEADLINE]</p>
      <div class="hero-cta-group">
        <a href="#buy" class="btn btn-primary btn-lg">[CTA_PRIMARY] - [PRICE]</a>
        <a href="#features" class="btn btn-outline btn-lg">[CTA_SECONDARY]</a>
      </div>
    </div>
    <div class="product-showcase">
      <div class="product-image-main">
        <img src="[PRODUCT_IMAGE]" alt="[PRODUCT_NAME]">
      </div>
      <div class="product-features">
        <div class="feature-point" style="--x: 20%; --y: 30%;">
          <span class="feature-dot"></span>
          <div class="feature-label">[FEATURE_1]</div>
        </div>
        <div class="feature-point" style="--x: 80%; --y: 40%;">
          <span class="feature-dot"></span>
          <div class="feature-label">[FEATURE_2]</div>
        </div>
        <div class="feature-point" style="--x: 50%; --y: 70%;">
          <span class="feature-dot"></span>
          <div class="feature-label">[FEATURE_3]</div>
        </div>
      </div>
    </div>
  </div>
</section>

<style>
.hero-product {
  padding: 120px 0 80px;
  background: linear-gradient(to bottom, var(--bg-secondary), var(--bg-primary));
}
.hero-tag {
  display: inline-block;
  padding: 6px 14px;
  background: var(--primary);
  color: white;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 20px;
}
.hero-product .hero-title {
  font-size: clamp(40px, 6vw, 72px);
  font-weight: 800;
  line-height: 1.1;
  margin-bottom: 20px;
}
.hero-product .hero-description {
  font-size: 20px;
  color: var(--text-secondary);
  margin-bottom: 32px;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}
.hero-product .hero-cta-group {
  display: flex;
  gap: 16px;
  justify-content: center;
  margin-bottom: 64px;
}
.product-showcase {
  position: relative;
  max-width: 800px;
  margin: 0 auto;
}
.product-image-main img {
  width: 100%;
  border-radius: var(--radius-xl);
  box-shadow: 0 40px 80px rgba(0,0,0,0.15);
}
.feature-point {
  position: absolute;
  left: var(--x);
  top: var(--y);
  transform: translate(-50%, -50%);
}
.feature-dot {
  width: 20px;
  height: 20px;
  background: var(--primary);
  border: 3px solid white;
  border-radius: 50%;
  display: block;
  cursor: pointer;
  animation: pulse 2s ease infinite;
  box-shadow: 0 4px 15px rgba(var(--primary-rgb), 0.4);
}
.feature-label {
  position: absolute;
  left: 30px;
  top: 50%;
  transform: translateY(-50%);
  background: white;
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  white-space: nowrap;
  box-shadow: var(--shadow-lg);
  opacity: 0;
  transition: opacity 0.3s ease;
}
.feature-point:hover .feature-label {
  opacity: 1;
}
</style>
`,

  // ============================================================================
  // 13. TESTIMONIAL HERO - Lead with social proof
  // ============================================================================
  testimonialHero: `
<section class="hero hero-testimonial">
  <div class="container">
    <div class="hero-grid">
      <div class="hero-content">
        <div class="hero-rating">
          <div class="stars">★★★★★</div>
          <span>[RATING_TEXT]</span>
        </div>
        <h1 class="hero-title">[HEADLINE]</h1>
        <blockquote class="hero-quote">
          "[TESTIMONIAL_TEXT]"
          <cite>
            <img src="[AUTHOR_IMAGE]" alt="[AUTHOR_NAME]">
            <div>
              <strong>[AUTHOR_NAME]</strong>
              <span>[AUTHOR_TITLE]</span>
            </div>
          </cite>
        </blockquote>
        <div class="hero-cta-group">
          <a href="#contact" class="btn btn-primary btn-lg">[CTA_PRIMARY]</a>
        </div>
      </div>
      <div class="hero-image">
        <img src="[HERO_IMAGE]" alt="">
        <div class="floating-card glass">
          <span class="floating-stat">[FLOATING_STAT]</span>
          <span class="floating-label">[FLOATING_LABEL]</span>
        </div>
      </div>
    </div>
  </div>
</section>

<style>
.hero-testimonial {
  padding: 120px 0;
  min-height: 100vh;
  display: flex;
  align-items: center;
}
.hero-testimonial .hero-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 80px;
  align-items: center;
}
.hero-rating {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
}
.stars {
  color: #fbbf24;
  font-size: 20px;
  letter-spacing: 2px;
}
.hero-rating span {
  font-size: 14px;
  color: var(--text-secondary);
}
.hero-testimonial .hero-title {
  font-size: clamp(40px, 5vw, 60px);
  font-weight: 800;
  line-height: 1.1;
  margin-bottom: 32px;
}
.hero-quote {
  font-size: 20px;
  line-height: 1.6;
  color: var(--text-secondary);
  margin-bottom: 32px;
  padding-left: 24px;
  border-left: 3px solid var(--primary);
}
.hero-quote cite {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-top: 20px;
  font-style: normal;
}
.hero-quote cite img {
  width: 56px;
  height: 56px;
  border-radius: 50%;
}
.hero-quote cite strong {
  display: block;
  font-weight: 600;
  color: var(--text-primary);
}
.hero-quote cite span {
  font-size: 14px;
  color: var(--text-muted);
}
.hero-testimonial .hero-image {
  position: relative;
}
.hero-testimonial .hero-image img {
  width: 100%;
  border-radius: var(--radius-xl);
}
.floating-card {
  position: absolute;
  bottom: -30px;
  left: -30px;
  padding: 24px 32px;
  background: white;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-xl);
  text-align: center;
}
.floating-stat {
  display: block;
  font-size: 36px;
  font-weight: 800;
  color: var(--primary);
}
.floating-label {
  font-size: 14px;
  color: var(--text-muted);
}
@media (max-width: 968px) {
  .hero-testimonial .hero-grid {
    grid-template-columns: 1fr;
  }
}
</style>
`,

  // ============================================================================
  // 14. APP HERO - Mobile app showcase
  // ============================================================================
  appHero: `
<section class="hero hero-app">
  <div class="container">
    <div class="hero-grid">
      <div class="hero-content">
        <div class="app-badge">
          <img src="[APP_ICON]" alt="App Icon">
          <div>
            <strong>[APP_NAME]</strong>
            <span>★★★★★ [RATING]</span>
          </div>
        </div>
        <h1 class="hero-title">[HEADLINE]</h1>
        <p class="hero-description">[SUBHEADLINE]</p>
        <div class="app-store-buttons">
          <a href="#" class="store-btn">
            <svg viewBox="0 0 24 24" width="24" height="24"><path fill="currentColor" d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.53 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/></svg>
            <div>
              <small>Download on the</small>
              <span>App Store</span>
            </div>
          </a>
          <a href="#" class="store-btn">
            <svg viewBox="0 0 24 24" width="24" height="24"><path fill="currentColor" d="M3 20.5v-17c0-.83.67-1.5 1.5-1.5.34 0 .67.12.93.34L18.14 12 5.43 21.66c-.26.22-.59.34-.93.34-.83 0-1.5-.67-1.5-1.5zm15.14-8.5L6.14 4.25 14.5 12l-8.36 7.75L18.14 12zm-3.64 5.5l3.97-5.5-3.97-5.5L21 12l-6.5 5.5z"/></svg>
            <div>
              <small>Get it on</small>
              <span>Google Play</span>
            </div>
          </a>
        </div>
      </div>
      <div class="hero-phones">
        <div class="phone phone-1">
          <img src="[PHONE_SCREEN_1]" alt="App Screenshot">
        </div>
        <div class="phone phone-2">
          <img src="[PHONE_SCREEN_2]" alt="App Screenshot">
        </div>
      </div>
    </div>
  </div>
</section>

<style>
.hero-app {
  padding: 120px 0;
  min-height: 100vh;
  display: flex;
  align-items: center;
  overflow: hidden;
}
.hero-app .hero-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 80px;
  align-items: center;
}
.app-badge {
  display: inline-flex;
  align-items: center;
  gap: 16px;
  padding: 12px 20px;
  background: var(--bg-secondary);
  border-radius: var(--radius-lg);
  margin-bottom: 32px;
}
.app-badge img {
  width: 48px;
  height: 48px;
  border-radius: 12px;
}
.app-badge strong {
  display: block;
  font-weight: 600;
}
.app-badge span {
  font-size: 14px;
  color: #fbbf24;
}
.hero-app .hero-title {
  font-size: clamp(40px, 5vw, 64px);
  font-weight: 800;
  line-height: 1.1;
  margin-bottom: 20px;
}
.hero-app .hero-description {
  font-size: 18px;
  color: var(--text-secondary);
  margin-bottom: 32px;
  max-width: 450px;
}
.app-store-buttons {
  display: flex;
  gap: 16px;
}
.store-btn {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 24px;
  background: var(--text-primary);
  color: white;
  border-radius: var(--radius-md);
  text-decoration: none;
  transition: transform 0.3s ease;
}
.store-btn:hover {
  transform: scale(1.05);
}
.store-btn small {
  display: block;
  font-size: 11px;
  opacity: 0.8;
}
.store-btn span {
  font-weight: 600;
  font-size: 16px;
}
.hero-phones {
  position: relative;
  height: 600px;
}
.phone {
  position: absolute;
  width: 280px;
  padding: 12px;
  background: #1a1a1a;
  border-radius: 40px;
  box-shadow: 0 40px 80px rgba(0,0,0,0.3);
}
.phone img {
  width: 100%;
  border-radius: 30px;
}
.phone-1 {
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  z-index: 2;
}
.phone-2 {
  right: 0;
  top: 60%;
  transform: translateY(-50%) rotate(5deg);
  z-index: 1;
}
@media (max-width: 968px) {
  .hero-app .hero-grid {
    grid-template-columns: 1fr;
    text-align: center;
  }
  .hero-app .hero-description { max-width: 100%; }
  .app-store-buttons { justify-content: center; }
  .hero-phones { display: none; }
}
</style>
`,

  // ============================================================================
  // 15. ANIMATED HERO - Heavy animation focus
  // ============================================================================
  animatedHero: `
<section class="hero hero-animated">
  <div class="animated-bg">
    <div class="floating-shape shape-1"></div>
    <div class="floating-shape shape-2"></div>
    <div class="floating-shape shape-3"></div>
    <div class="floating-shape shape-4"></div>
  </div>
  <div class="container">
    <div class="hero-content text-center">
      <h1 class="hero-title animate-title">
        <span class="word">[WORD_1]</span>
        <span class="word">[WORD_2]</span>
        <span class="word highlight">[WORD_3]</span>
      </h1>
      <p class="hero-description animate-fade">[SUBHEADLINE]</p>
      <div class="hero-cta-group animate-fade">
        <a href="#contact" class="btn btn-primary btn-lg magnetic">[CTA_PRIMARY]</a>
        <a href="#work" class="btn btn-outline btn-lg">[CTA_SECONDARY]</a>
      </div>
    </div>
  </div>
  <div class="scroll-prompt">
    <div class="mouse">
      <div class="mouse-wheel"></div>
    </div>
  </div>
</section>

<style>
.hero-animated {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}
.animated-bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
}
.floating-shape {
  position: absolute;
  border-radius: 50%;
  animation: floatShape 20s ease-in-out infinite;
}
.shape-1 {
  width: 300px;
  height: 300px;
  background: linear-gradient(135deg, var(--primary), var(--secondary));
  opacity: 0.1;
  top: 10%;
  left: 10%;
  animation-delay: 0s;
}
.shape-2 {
  width: 200px;
  height: 200px;
  background: var(--primary);
  opacity: 0.08;
  top: 60%;
  right: 15%;
  animation-delay: -5s;
}
.shape-3 {
  width: 150px;
  height: 150px;
  background: var(--secondary);
  opacity: 0.1;
  bottom: 20%;
  left: 20%;
  animation-delay: -10s;
}
.shape-4 {
  width: 100px;
  height: 100px;
  background: var(--accent);
  opacity: 0.15;
  top: 30%;
  right: 30%;
  animation-delay: -15s;
}
@keyframes floatShape {
  0%, 100% {
    transform: translate(0, 0) rotate(0deg);
  }
  25% {
    transform: translate(50px, -50px) rotate(90deg);
  }
  50% {
    transform: translate(0, -100px) rotate(180deg);
  }
  75% {
    transform: translate(-50px, -50px) rotate(270deg);
  }
}
.hero-animated .hero-title {
  font-size: clamp(56px, 10vw, 140px);
  font-weight: 800;
  line-height: 1;
  letter-spacing: -0.03em;
}
.hero-animated .word {
  display: block;
  opacity: 0;
  transform: translateY(100px);
  animation: wordReveal 0.8s ease forwards;
}
.hero-animated .word:nth-child(1) { animation-delay: 0.2s; }
.hero-animated .word:nth-child(2) { animation-delay: 0.4s; }
.hero-animated .word:nth-child(3) { animation-delay: 0.6s; }
.hero-animated .word.highlight {
  color: var(--primary);
}
@keyframes wordReveal {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.hero-animated .hero-description {
  font-size: 20px;
  color: var(--text-secondary);
  margin: 32px auto 40px;
  max-width: 500px;
  opacity: 0;
  animation: fadeIn 0.8s ease forwards;
  animation-delay: 1s;
}
.hero-animated .hero-cta-group {
  display: flex;
  gap: 16px;
  justify-content: center;
  opacity: 0;
  animation: fadeIn 0.8s ease forwards;
  animation-delay: 1.2s;
}
@keyframes fadeIn {
  to { opacity: 1; }
}
.scroll-prompt {
  position: absolute;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
}
.mouse {
  width: 26px;
  height: 40px;
  border: 2px solid var(--text-muted);
  border-radius: 13px;
  position: relative;
}
.mouse-wheel {
  width: 4px;
  height: 8px;
  background: var(--text-muted);
  border-radius: 2px;
  position: absolute;
  top: 8px;
  left: 50%;
  transform: translateX(-50%);
  animation: scroll 2s ease infinite;
}
@keyframes scroll {
  0%, 100% { opacity: 1; top: 8px; }
  50% { opacity: 0; top: 20px; }
}
</style>
`,
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

export function getHeroSection(type: string): string {
  return HERO_SECTIONS[type as keyof typeof HERO_SECTIONS] || HERO_SECTIONS.splitHero;
}

export function getAllHeroTypes(): string[] {
  return Object.keys(HERO_SECTIONS);
}

export function getHeroReference(): string {
  return `
## HERO SECTION VARIATIONS (15 total)

1. **splitHero** - Image right, content left, stats row
2. **centeredHero** - Centered content with avatar stack social proof
3. **fullImageHero** - Full-screen background image with overlay
4. **videoHero** - Background video with content overlay
5. **gradientHero** - Animated gradient background with glow effects
6. **minimalHero** - Clean typography-focused, minimal design
7. **cardHero** - Content in floating glass card over image
8. **asymmetricHero** - Creative off-grid layout with image stack
9. **parallaxHero** - Layered parallax scrolling effect
10. **bentoHero** - Bento grid layout with multiple cards
11. **darkHero** - Dark theme with grid background and glow
12. **productHero** - Product showcase with feature hotspots
13. **testimonialHero** - Lead with customer quote and rating
14. **appHero** - Mobile app showcase with phone mockups
15. **animatedHero** - Heavy animation with floating shapes

### Usage
Each hero includes complete HTML and CSS. Replace placeholders like [HEADLINE], [CTA_PRIMARY], [HERO_IMAGE] with actual content.
`;
}

export function getRecommendedHero(industry: string): string {
  const recommendations: Record<string, string> = {
    'restaurant': 'fullImageHero',
    'local-services': 'splitHero',
    'professional': 'centeredHero',
    'health-beauty': 'cardHero',
    'real-estate': 'splitHero',
    'fitness': 'videoHero',
    'tech-startup': 'darkHero',
    'medical': 'testimonialHero',
    'construction': 'fullImageHero',
    'ecommerce': 'productHero',
    'portfolio': 'animatedHero',
    'education': 'gradientHero',
  };
  return recommendations[industry] || 'splitHero';
}
