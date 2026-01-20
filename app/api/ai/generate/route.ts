// app/api/ai/generate/route.ts
// ULTIMATE AI Website Generation v3.0 - $100K Elite Websites
// Enhanced with complete component library, 12 industries, and premium effects

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// ============================================================================
// MASTER SYSTEM PROMPT - Enhanced with Component Library
// ============================================================================
const MASTER_SYSTEM_PROMPT = `You are an elite creative director who has won every Awwwards Site of the Day, FWA, and CSS Design Award. Companies pay you $100,000+ per website because your work is THAT good.

## THE 7 LAWS OF ELITE WEBSITES

**LAW 1: TYPOGRAPHY IS POWER**
- Hero headlines: clamp(56px, 8vw, 120px) - MASSIVE, CONFIDENT
- Letter-spacing: -0.03em on headlines (tighter = premium)
- Font weight contrast: 300 vs 800 creates visual tension
- Line-height: 1.05-1.1 for headlines, 1.7 for body

**LAW 2: COLOR WITH INTENTION**
- Maximum 3 colors: dominant, supporting, accent
- Dark themes = premium (#0a0a0a, #0f0f0f)
- Light themes need warmth (#fafaf9, not pure white)
- Accent color used SURGICALLY - only for CTAs

**LAW 3: WHITESPACE IS LUXURY**
- Section padding: 120px-200px vertical
- Expensive websites have MORE space, not less
- Cramped = cheap, spacious = premium

**LAW 4: MOTION CREATES EMOTION**
- Every transition: 0.3s cubic-bezier(0.4, 0, 0.2, 1)
- Scroll-triggered reveals (staggered, elegant)
- Hover states that feel ALIVE

**LAW 5: THE "WOW" ELEMENT**
Every elite website needs ONE memorable element:
- Animated gradient mesh background
- Glassmorphism cards with backdrop-blur
- Floating decorative blob shapes
- Gradient text on hero headlines
- Bento grid layouts
- Glowing buttons on dark backgrounds

**LAW 6: COPY THAT CONVERTS**
- Headlines create EMOTION, not describe features
- Benefits over features, always
- Social proof everywhere

**LAW 7: DETAILS NOBODY NOTICES (BUT EVERYONE FEELS)**
- Custom selection color
- Smooth scroll-behavior
- Focus states for accessibility
- Custom scrollbar on webkit

## REQUIRED CSS ARCHITECTURE

\`\`\`css
:root {
  --primary: #HEX;
  --primary-rgb: R, G, B;
  --primary-dark: #HEX;
  --secondary: #HEX;
  --secondary-rgb: R, G, B;
  --accent: #HEX;
  --bg-primary: #HEX;
  --bg-secondary: #HEX;
  --bg-tertiary: #HEX;
  --text-primary: #HEX;
  --text-secondary: #HEX;
  --text-muted: #HEX;
  --border-color: #HEX;
  --font-display: 'Font', sans-serif;
  --font-body: 'Font', sans-serif;
  --transition: 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  --shadow-sm: 0 1px 2px rgba(0,0,0,0.05);
  --shadow-md: 0 4px 6px -1px rgba(0,0,0,0.1);
  --shadow-lg: 0 10px 15px -3px rgba(0,0,0,0.1);
  --shadow-xl: 0 20px 25px -5px rgba(0,0,0,0.1);
  --shadow-glow: 0 0 30px rgba(var(--primary-rgb), 0.3);
}

*, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
html { scroll-behavior: smooth; }
body { 
  font-family: var(--font-body); 
  background: var(--bg-primary); 
  color: var(--text-primary);
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
  opacity: 0;
  transition: opacity 0.5s ease;
}
body.loaded { opacity: 1; }
::selection { background: var(--primary); color: white; }
img { max-width: 100%; height: auto; }
a { text-decoration: none; color: inherit; }

.container { 
  max-width: 1280px; 
  margin: 0 auto; 
  padding: 0 24px; 
}
@media (min-width: 768px) { .container { padding: 0 48px; } }
@media (min-width: 1200px) { .container { padding: 0 80px; } }

section { padding: 120px 0; }
@media (max-width: 768px) { section { padding: 80px 0; } }
\`\`\`

## REQUIRED ANIMATIONS

\`\`\`css
/* Reveal on Scroll */
.reveal {
  opacity: 0;
  transform: translateY(40px);
  transition: opacity 0.8s ease, transform 0.8s ease;
}
.reveal.active { opacity: 1; transform: translateY(0); }

.reveal-left { opacity: 0; transform: translateX(-40px); transition: opacity 0.8s ease, transform 0.8s ease; }
.reveal-left.active { opacity: 1; transform: translateX(0); }

.reveal-right { opacity: 0; transform: translateX(40px); transition: opacity 0.8s ease, transform 0.8s ease; }
.reveal-right.active { opacity: 1; transform: translateX(0); }

.reveal-scale { opacity: 0; transform: scale(0.95); transition: opacity 0.8s ease, transform 0.8s ease; }
.reveal-scale.active { opacity: 1; transform: scale(1); }

/* Stagger Children */
.stagger-children > * { opacity: 0; transform: translateY(20px); transition: opacity 0.5s ease, transform 0.5s ease; }
.stagger-children.active > *:nth-child(1) { transition-delay: 0.1s; }
.stagger-children.active > *:nth-child(2) { transition-delay: 0.15s; }
.stagger-children.active > *:nth-child(3) { transition-delay: 0.2s; }
.stagger-children.active > *:nth-child(4) { transition-delay: 0.25s; }
.stagger-children.active > *:nth-child(5) { transition-delay: 0.3s; }
.stagger-children.active > *:nth-child(6) { transition-delay: 0.35s; }
.stagger-children.active > * { opacity: 1; transform: translateY(0); }

/* Glassmorphism */
.glass {
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
}

/* Gradient Text */
.gradient-text {
  background: linear-gradient(135deg, var(--primary), var(--secondary));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* Keyframes */
@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-20px); }
}

@keyframes blobMorph {
  0%, 100% { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; }
  50% { border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%; }
}

@keyframes gradientShift {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

@keyframes glow {
  0%, 100% { box-shadow: 0 0 20px rgba(var(--primary-rgb), 0.4); }
  50% { box-shadow: 0 0 40px rgba(var(--primary-rgb), 0.6); }
}
\`\`\`

## REQUIRED JAVASCRIPT

\`\`\`javascript
document.addEventListener('DOMContentLoaded', () => {
  // Page Load
  document.body.classList.add('loaded');
  
  // Scroll Reveal
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
  
  document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale, .stagger-children').forEach(el => {
    revealObserver.observe(el);
  });
  
  // Navbar Scroll
  const nav = document.querySelector('nav, .navbar');
  let lastScroll = 0;
  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    if (nav) {
      nav.classList.toggle('scrolled', currentScroll > 50);
      nav.classList.toggle('nav-hidden', currentScroll > lastScroll && currentScroll > 500);
    }
    lastScroll = currentScroll;
  });
  
  // Smooth Scroll
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        const navHeight = document.querySelector('nav')?.offsetHeight || 0;
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight - 20;
        window.scrollTo({ top: targetPosition, behavior: 'smooth' });
      }
      // Close mobile menu
      document.querySelector('.mobile-menu')?.classList.remove('active');
      document.querySelector('.menu-toggle')?.classList.remove('active');
    });
  });
  
  // Animated Counters
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
        entry.target.classList.add('counted');
        const el = entry.target;
        const target = parseInt(el.getAttribute('data-count'));
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;
        const timer = setInterval(() => {
          current += step;
          if (current >= target) {
            el.textContent = target.toLocaleString();
            clearInterval(timer);
          } else {
            el.textContent = Math.floor(current).toLocaleString();
          }
        }, 16);
      }
    });
  }, { threshold: 0.5 });
  
  document.querySelectorAll('[data-count]').forEach(el => counterObserver.observe(el));
  
  // Mobile Menu
  const menuToggle = document.querySelector('.menu-toggle');
  const mobileMenu = document.querySelector('.mobile-menu, .nav-links');
  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', () => {
      menuToggle.classList.toggle('active');
      mobileMenu.classList.toggle('active');
      document.body.classList.toggle('menu-open');
    });
  }
  
  // FAQ Accordion
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const isOpen = item.classList.contains('active');
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));
      if (!isOpen) item.classList.add('active');
    });
  });
  
  // Back to Top
  const backToTop = document.getElementById('backToTop');
  if (backToTop) {
    window.addEventListener('scroll', () => {
      backToTop.classList.toggle('visible', window.pageYOffset > 500);
    });
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
  
  // Form Handling
  document.querySelectorAll('form').forEach(form => {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"]');
      const originalText = btn?.innerHTML;
      if (btn) {
        btn.disabled = true;
        btn.innerHTML = '<span class="spinner"></span> Sending...';
      }
      await new Promise(r => setTimeout(r, 1500));
      if (btn) {
        btn.innerHTML = '✓ Sent!';
        btn.classList.add('btn-success');
        setTimeout(() => {
          form.reset();
          btn.disabled = false;
          btn.innerHTML = originalText;
          btn.classList.remove('btn-success');
        }, 3000);
      }
    });
  });
});
\`\`\`

## PREMIUM FONTS (Google Fonts)

Modern: \`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap');\`
Elegant: \`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600;700&family=Lato:wght@400;500;700&display=swap');\`
Bold: \`@import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=Work+Sans:wght@400;500;600&display=swap');\`
Premium: \`@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=DM+Sans:wght@400;500;600&display=swap');\`
Luxury: \`@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=Quicksand:wght@400;500;600&display=swap');\`

## OUTPUT FORMAT

Return ONLY the complete HTML file:
- Start with <!DOCTYPE html>
- End with </html>
- NO explanations, NO markdown blocks
- ALL CSS in <style> in <head>
- ALL JavaScript in <script> before </body>
- Must be 100% complete and functional
- Must include mobile responsive design
- Must include ALL animations and interactions`;

// ============================================================================
// COMPONENT LIBRARY - Premium Sections
// ============================================================================
const COMPONENT_LIBRARY = `
## COMPONENT LIBRARY - Use These Patterns

### HERO PATTERNS

**HERO TYPE 1: Split Layout (Services)**
\`\`\`html
<section class="hero">
  <div class="hero-bg"><div class="blob blob-1"></div><div class="blob blob-2"></div></div>
  <div class="container hero-grid">
    <div class="hero-content">
      <span class="hero-badge"><span class="pulse-dot"></span>Award-Winning Since 2010</span>
      <h1 class="hero-title">Transform Your Vision Into <span class="gradient-text">Reality</span></h1>
      <p class="hero-subtitle">We craft exceptional digital experiences that drive growth and inspire action.</p>
      <div class="hero-buttons">
        <a href="#contact" class="btn btn-primary">Start Your Project <svg>→</svg></a>
        <a href="#work" class="btn btn-outline">View Our Work</a>
      </div>
      <div class="hero-stats">
        <div class="stat"><span class="stat-number" data-count="500">0</span>+<span class="stat-label">Projects</span></div>
        <div class="stat"><span class="stat-number" data-count="98">0</span>%<span class="stat-label">Satisfaction</span></div>
        <div class="stat"><span class="stat-number" data-count="12">0</span><span class="stat-label">Years</span></div>
      </div>
    </div>
    <div class="hero-visual">
      <div class="hero-image-wrapper">
        <img src="[IMAGE]" alt="" class="hero-image">
        <div class="float-card glass">...</div>
      </div>
    </div>
  </div>
</section>
\`\`\`

**HERO TYPE 2: Centered (SaaS/Tech)**
\`\`\`html
<section class="hero hero-centered">
  <div class="hero-bg"><div class="blob blob-1"></div><div class="blob blob-2"></div><div class="grid-pattern"></div></div>
  <div class="container">
    <div class="hero-content text-center">
      <span class="hero-badge">✨ Trusted by 10,000+ Teams</span>
      <h1 class="hero-title">Build Something<br><span class="gradient-text-animated">Extraordinary</span></h1>
      <p class="hero-subtitle">The all-in-one platform that empowers you to create, launch, and scale.</p>
      <div class="hero-buttons centered">
        <a href="#" class="btn btn-primary btn-glow">Get Started Free</a>
        <a href="#" class="btn btn-outline"><svg class="play-icon"></svg>Watch Demo</a>
      </div>
      <div class="avatar-stack">
        <img src="avatar1"><img src="avatar2"><img src="avatar3"><span>+2k</span>
        <span class="rating">★★★★★ 4.9/5</span>
      </div>
    </div>
    <div class="product-preview">
      <div class="browser-frame"><img src="[PRODUCT_SCREENSHOT]"></div>
    </div>
  </div>
</section>
\`\`\`

### SERVICES/FEATURES

**BENTO GRID (Modern)**
\`\`\`html
<section class="section-services">
  <div class="container">
    <div class="section-header">
      <span class="section-badge">Services</span>
      <h2 class="section-title">What We <span class="gradient-text">Offer</span></h2>
      <p class="section-subtitle">Comprehensive solutions tailored to your needs</p>
    </div>
    <div class="bento-grid stagger-children">
      <div class="bento-card bento-large">
        <div class="bento-icon">🎯</div>
        <h3>Strategic Consulting</h3>
        <p>Data-driven strategies that deliver measurable results.</p>
        <a href="#" class="bento-link">Learn more →</a>
      </div>
      <div class="bento-card">
        <div class="bento-icon">⚡</div>
        <h3>Development</h3>
        <p>Clean, fast, scalable solutions.</p>
      </div>
      <div class="bento-card">
        <div class="bento-icon">📈</div>
        <h3>Growth Marketing</h3>
        <p>Reach customers ready to buy.</p>
      </div>
      <div class="bento-card bento-wide bento-featured">
        <div class="bento-content">
          <h3>End-to-End Solutions</h3>
          <p>From concept to execution, we handle everything.</p>
          <div class="bento-stats"><span>150+ Projects</span><span>98% Success</span></div>
        </div>
        <img src="[IMAGE]" class="bento-image">
      </div>
    </div>
  </div>
</section>
\`\`\`

### TESTIMONIALS

**FEATURED TESTIMONIAL**
\`\`\`html
<section class="section-testimonial">
  <div class="container">
    <div class="testimonial-featured reveal">
      <div class="quote-mark">"</div>
      <blockquote>Working with this team completely transformed our business. We saw a 300% increase in conversions within the first three months.</blockquote>
      <div class="testimonial-author">
        <img src="[AVATAR]" class="testimonial-avatar">
        <div>
          <strong>Sarah Chen</strong>
          <span>CEO, TechVentures Inc.</span>
          <div class="rating">★★★★★</div>
        </div>
      </div>
      <div class="testimonial-metrics">
        <div class="metric"><span>300%</span><label>Conversion Increase</label></div>
        <div class="metric"><span>$2.4M</span><label>Revenue Generated</label></div>
      </div>
    </div>
  </div>
</section>
\`\`\`

**TESTIMONIAL GRID**
\`\`\`html
<div class="testimonials-grid stagger-children">
  <div class="testimonial-card">
    <div class="rating">★★★★★</div>
    <p>"Absolutely incredible results. Our revenue doubled."</p>
    <div class="author"><img src="[AVATAR]"><div><strong>Name</strong><span>Title</span></div></div>
  </div>
  <!-- Repeat 2-3 more -->
</div>
\`\`\`

### PRICING

\`\`\`html
<section class="section-pricing">
  <div class="container">
    <div class="section-header text-center">
      <span class="section-badge">Pricing</span>
      <h2 class="section-title">Simple, Transparent <span class="gradient-text">Pricing</span></h2>
    </div>
    <div class="pricing-toggle">
      <span>Monthly</span>
      <label class="switch"><input type="checkbox" id="pricingToggle"><span class="slider"></span></label>
      <span>Yearly <span class="save-badge">Save 20%</span></span>
    </div>
    <div class="pricing-grid stagger-children">
      <div class="pricing-card">
        <h3>Starter</h3>
        <p class="pricing-desc">Perfect for individuals</p>
        <div class="price"><span class="currency">$</span><span class="amount" data-monthly="29" data-yearly="23">29</span><span class="period">/mo</span></div>
        <ul class="features">
          <li><svg class="check"></svg>Up to 5 projects</li>
          <li><svg class="check"></svg>Basic analytics</li>
          <li><svg class="check"></svg>Email support</li>
        </ul>
        <a href="#" class="btn btn-outline btn-block">Get Started</a>
      </div>
      <div class="pricing-card popular">
        <span class="popular-badge">Most Popular</span>
        <h3>Professional</h3>
        <p class="pricing-desc">Best for growing businesses</p>
        <div class="price"><span class="currency">$</span><span class="amount" data-monthly="79" data-yearly="63">79</span><span class="period">/mo</span></div>
        <ul class="features">
          <li><svg class="check"></svg><strong>Unlimited</strong> projects</li>
          <li><svg class="check"></svg>Advanced analytics</li>
          <li><svg class="check"></svg>Priority support</li>
          <li><svg class="check"></svg>Custom integrations</li>
        </ul>
        <a href="#" class="btn btn-primary btn-block btn-glow">Get Started</a>
      </div>
      <div class="pricing-card">
        <h3>Enterprise</h3>
        <p class="pricing-desc">For large organizations</p>
        <div class="price"><span class="currency">$</span><span class="amount" data-monthly="199" data-yearly="159">199</span><span class="period">/mo</span></div>
        <ul class="features">
          <li><svg class="check"></svg>Everything in Pro</li>
          <li><svg class="check"></svg>Dedicated manager</li>
          <li><svg class="check"></svg>99.99% SLA</li>
        </ul>
        <a href="#" class="btn btn-outline btn-block">Contact Sales</a>
      </div>
    </div>
    <p class="pricing-guarantee"><svg class="shield"></svg>30-day money-back guarantee</p>
  </div>
</section>
\`\`\`

### FAQ ACCORDION

\`\`\`html
<section class="section-faq">
  <div class="container container-narrow">
    <div class="section-header text-center">
      <span class="section-badge">FAQ</span>
      <h2 class="section-title">Frequently Asked <span class="gradient-text">Questions</span></h2>
    </div>
    <div class="faq-list">
      <div class="faq-item reveal">
        <button class="faq-question">
          <span>How do I get started?</span>
          <span class="faq-icon"><svg class="plus"></svg><svg class="minus"></svg></span>
        </button>
        <div class="faq-answer"><p>Getting started is easy! Simply sign up and you'll be guided through our onboarding.</p></div>
      </div>
      <!-- Repeat 4-5 more questions -->
    </div>
  </div>
</section>
\`\`\`

### CONTACT SECTION

\`\`\`html
<section class="section-contact">
  <div class="container">
    <div class="contact-grid">
      <div class="contact-info reveal-left">
        <span class="section-badge">Get in Touch</span>
        <h2 class="section-title">Let's Start a <span class="gradient-text">Conversation</span></h2>
        <p>Have a project in mind? We'd love to hear from you.</p>
        <div class="contact-details">
          <div class="contact-item"><svg class="icon-phone"></svg><div><strong>Phone</strong><a href="tel:">(123) 456-7890</a></div></div>
          <div class="contact-item"><svg class="icon-mail"></svg><div><strong>Email</strong><a href="mailto:">hello@company.com</a></div></div>
          <div class="contact-item"><svg class="icon-pin"></svg><div><strong>Address</strong><span>123 Business Ave, City</span></div></div>
        </div>
        <div class="social-links">
          <a href="#" class="social-link"><svg>Instagram</svg></a>
          <a href="#" class="social-link"><svg>LinkedIn</svg></a>
          <a href="#" class="social-link"><svg>Twitter</svg></a>
        </div>
      </div>
      <div class="contact-form-wrapper reveal-right">
        <form class="contact-form">
          <div class="form-row">
            <div class="form-group"><label>First Name</label><input type="text" required></div>
            <div class="form-group"><label>Last Name</label><input type="text" required></div>
          </div>
          <div class="form-group"><label>Email</label><input type="email" required></div>
          <div class="form-group"><label>Phone</label><input type="tel"></div>
          <div class="form-group"><label>Message</label><textarea rows="4" required></textarea></div>
          <button type="submit" class="btn btn-primary btn-block">Send Message</button>
        </form>
      </div>
    </div>
  </div>
</section>
\`\`\`

### CTA SECTION

\`\`\`html
<section class="section-cta">
  <div class="cta-bg"><div class="cta-gradient"></div><div class="cta-pattern"></div></div>
  <div class="container">
    <div class="cta-content text-center reveal">
      <h2 class="cta-title">Ready to Transform Your Business?</h2>
      <p class="cta-subtitle">Join thousands of successful companies. Let's build something amazing.</p>
      <div class="cta-buttons">
        <a href="#contact" class="btn btn-white btn-lg">Get Started Now</a>
        <a href="#" class="btn btn-outline-white btn-lg">Schedule a Call</a>
      </div>
    </div>
  </div>
</section>
\`\`\`

### FOOTER

\`\`\`html
<footer class="footer">
  <div class="container">
    <div class="footer-grid">
      <div class="footer-brand">
        <a href="#" class="footer-logo">[LOGO]</a>
        <p>Building the future, one project at a time.</p>
        <div class="footer-social">
          <a href="#"><svg>Instagram</svg></a>
          <a href="#"><svg>LinkedIn</svg></a>
          <a href="#"><svg>Twitter</svg></a>
        </div>
      </div>
      <div class="footer-column">
        <h4>Company</h4>
        <ul><li><a href="#">About</a></li><li><a href="#">Team</a></li><li><a href="#">Careers</a></li></ul>
      </div>
      <div class="footer-column">
        <h4>Services</h4>
        <ul><li><a href="#">Service 1</a></li><li><a href="#">Service 2</a></li></ul>
      </div>
      <div class="footer-column">
        <h4>Legal</h4>
        <ul><li><a href="#">Privacy</a></li><li><a href="#">Terms</a></li></ul>
      </div>
    </div>
    <div class="footer-bottom">
      <p>© 2024 [Business]. All rights reserved.</p>
    </div>
  </div>
</footer>
\`\`\`
`;
// ============================================================================
// INDUSTRY BRIEFS - 12 Complete Templates
// ============================================================================
const INDUSTRY_BRIEFS: Record<string, string> = {

'restaurant': `
## 🍽️ RESTAURANT / FOOD & BEVERAGE

**EMOTIONAL GOAL:** Mouth-watering anticipation. "I NEED to eat there tonight."

**COLOR PALETTE:** Rich burgundy (#7f1d1d), warm gold (#d97706), cream (#fefce8), charcoal
**FONTS:** Playfair Display (headlines), Lato (body)

**REQUIRED SECTIONS:**
1. **Hero** - Full-bleed food photography, dark overlay, "Reserve a Table" CTA glowing warmly
2. **About/Story** - Chef's story, restaurant history, passion for food
3. **Menu Highlights** - 4-6 signature dishes with photos and poetic descriptions
4. **Gallery** - 8+ images of food, interior, and ambiance in masonry grid
5. **Testimonials** - 3 reviews with 5 stars and photos
6. **Private Events** - Catering and event space info
7. **Location** - Map, hours, phone HUGE and clickable
8. **Footer** - Reservation CTA, social links

**IMAGES:**
- Hero: https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1920&q=80
- Food 1: https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80
- Food 2: https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80
- Interior: https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80
- Chef: https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=600&q=80

**COPY STYLE:** Sensual, appetizing. "Hand-rolled pasta crafted daily with love" not "We serve pasta"`,

'local-services': `
## 🔧 LOCAL SERVICES (Plumber, Electrician, HVAC, Cleaning)

**EMOTIONAL GOAL:** Relief and trust. "Finally, someone reliable I can call."

**COLOR PALETTE:** Trust blue (#1e40af), safety orange (#ea580c), clean white, professional gray
**FONTS:** Poppins (headlines), Inter (body)

**REQUIRED SECTIONS:**
1. **Hero** - Team photo, trust badges (Licensed, Insured, 5★), HUGE phone number, "Get Free Quote" CTA
2. **Services** - 6 services with icons and clear descriptions
3. **Why Choose Us** - 4 differentiators (24/7, Same-Day, Warranty, Licensed)
4. **Work Gallery** - Before/After photos or project gallery
5. **Testimonials** - 3+ reviews with photos and names
6. **Service Areas** - Map or list of areas served
7. **Contact** - Form + HUGE phone + hours + emergency number
8. **Footer** - License numbers, guarantees

**IMAGES:**
- Hero: https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=1920&q=80
- Work: https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&q=80
- Team: https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80

**SPECIAL:** Sticky "Call Now" button on mobile, emergency service banner

**COPY STYLE:** Confident, reassuring. "We'll be there in 60 minutes or it's free"`,

'professional': `
## 💼 PROFESSIONAL SERVICES (Law, Consulting, Finance)

**EMOTIONAL GOAL:** "These are EXPERTS. I'm in capable hands."

**COLOR PALETTE:** Navy (#1e3a5f), gold accent (#b8860b), white, charcoal
**FONTS:** Libre Baskerville (headlines), Inter (body)

**REQUIRED SECTIONS:**
1. **Hero** - Sophisticated gradient, outcome-focused headline, "Schedule Consultation" CTA
2. **Practice Areas** - Services with elegant icons
3. **About Firm** - Story, credentials, years of experience
4. **Team** - Professional headshots with bios
5. **Results** - Case studies, numbers, outcomes
6. **Testimonials** - Client quotes with company names
7. **Contact** - Multiple methods, office locations
8. **Footer** - Bar numbers, certifications, associations

**IMAGES:**
- Hero: https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1920&q=80
- Team: https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80
- Office: https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80

**COPY STYLE:** Authoritative but approachable. "$50M recovered for clients"`,

'health-beauty': `
## 💆 SPA / HEALTH & BEAUTY / WELLNESS

**EMOTIONAL GOAL:** Instant calm. A visual deep breath. "I DESERVE this."

**COLOR PALETTE:** Sage green (#84a98c), blush pink (#f4a5a4), cream (#fefcf3), soft gold
**FONTS:** Cormorant Garamond (headlines), Quicksand (body)

**REQUIRED SECTIONS:**
1. **Hero** - Serene spa imagery, soft overlay, "Book Your Experience" CTA
2. **Services/Treatments** - Menu with prices and poetic descriptions
3. **About** - Philosophy, what makes this spa different
4. **Team** - Therapists with warm photos
5. **Gallery** - Peaceful space and treatment photos
6. **Testimonials** - Client experiences
7. **Packages** - Treatment bundles with prices
8. **Contact** - Location, parking, booking info

**IMAGES:**
- Hero: https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=1920&q=80
- Treatment: https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&q=80
- Interior: https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?w=800&q=80

**COPY STYLE:** Soothing, indulgent. "Melt away tension with our signature hot stone ritual"`,

'real-estate': `
## 🏠 REAL ESTATE / PROPERTY

**EMOTIONAL GOAL:** "This is THE ONE." Dream home energy meets professional guidance.

**COLOR PALETTE:** Navy (#1e3a5f), gold (#b8860b), white, warm gray
**FONTS:** Poppins (headlines), Inter (body)

**REQUIRED SECTIONS:**
1. **Hero** - Stunning property photo, search or agent value prop
2. **Featured Listings** - 3-4 property cards with photos, price, beds/baths
3. **Agent Profile** - Photo, bio, credentials, sold count
4. **Why Choose Us** - Market expertise, negotiation skills
5. **Testimonials** - Happy homeowner stories
6. **Areas Served** - Neighborhoods with descriptions
7. **Contact** - Multiple methods, response time promise
8. **Footer** - License, MLS info

**IMAGES:**
- Hero: https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920&q=80
- Property: https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80
- Agent: https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&q=80

**COPY STYLE:** Aspirational yet trustworthy. "Your dream home is waiting. Let's find it together."`,

'fitness': `
## 💪 FITNESS / GYM / PERSONAL TRAINING

**EMOTIONAL GOAL:** "This is where I become my BEST self." Raw energy and motivation.

**COLOR PALETTE:** Black (#0a0a0a), electric blue (#00d4ff) or lime (#84cc16), white
**FONTS:** Oswald or Bebas Neue (headlines), Inter (body)

**REQUIRED SECTIONS:**
1. **Hero** - High-energy action shot, dark bg, motivational headline, "Start Free Trial" CTA
2. **Programs/Classes** - Types with energy and descriptions
3. **Transformations** - Before/after with testimonials
4. **Trainers** - Team with credentials and specialties
5. **Facility** - Gym photos showing equipment
6. **Pricing** - Membership tiers clearly displayed
7. **Free Trial CTA** - Strong conversion push
8. **Contact** - Location, hours, parking

**IMAGES:**
- Hero: https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1920&q=80
- Training: https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&q=80
- Gym: https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=800&q=80

**COPY STYLE:** Motivational, challenging. "Your strongest self is waiting. Let's go get it."`,

'tech-startup': `
## 🚀 TECH STARTUP / SAAS

**EMOTIONAL GOAL:** "This will SOLVE my problem." Modern, innovative, trustworthy.

**COLOR PALETTE:** Purple-blue gradient (#6366f1 to #8b5cf6), dark bg (#0f0f0f), white text
**FONTS:** Space Grotesk (headlines), Inter (body)

**REQUIRED SECTIONS:**
1. **Hero** - Product visual, gradient bg, clear value prop, social proof, "Start Free" CTA
2. **Logos** - "Trusted by" company logos
3. **Features** - 3-4 key benefits with visuals, bento grid
4. **How It Works** - 3 simple steps
5. **Pricing** - Clear tiers with monthly/yearly toggle
6. **Testimonials** - User quotes with photos
7. **FAQ** - Common questions
8. **CTA** - Final push with urgency

**IMAGES:**
- Use CSS gradients and abstract shapes
- Dashboard: https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80

**COPY STYLE:** Clear, benefit-focused. "Save 10 hours every week"`,

'medical': `
## ⚕️ MEDICAL / HEALTHCARE / DENTAL

**EMOTIONAL GOAL:** "I'm in EXPERT, caring hands." Trust, competence, compassion.

**COLOR PALETTE:** Calming teal (#0d9488), clean white, warm gray, soft blue
**FONTS:** Inter (professional), Source Sans Pro (body)

**REQUIRED SECTIONS:**
1. **Hero** - Reassuring message, booking CTA, trust badges
2. **Services** - Medical services with clear descriptions
3. **Doctors** - Team with credentials, education, specialties
4. **Why Us** - Technology, experience, patient care
5. **Patient Stories** - Testimonials about care
6. **Insurance** - Accepted plans, payment options
7. **Location** - Office photos, map, accessibility
8. **Contact** - Easy booking, emergency info

**IMAGES:**
- Hero: https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1920&q=80
- Doctor: https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=600&q=80
- Office: https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=800&q=80

**COPY STYLE:** Warm but professional. "Your health journey, guided by experts who care."`,

'construction': `
## 🏗️ CONSTRUCTION / CONTRACTOR / HOME IMPROVEMENT

**EMOTIONAL GOAL:** "These guys will get it done RIGHT." Strength, reliability, craftsmanship.

**COLOR PALETTE:** Construction orange (#d97706), dark gray (#1f2937), yellow accent, white
**FONTS:** Oswald (headlines), Inter (body)

**REQUIRED SECTIONS:**
1. **Hero** - Impressive project photo, quote CTA, trust badges
2. **Services** - Residential, commercial offerings
3. **Project Gallery** - Completed work with categories
4. **About** - Company history, team, experience
5. **Why Us** - Warranty, experience, licensing
6. **Process** - How you work
7. **Testimonials** - Homeowner reviews
8. **Contact** - Quote form, phone

**IMAGES:**
- Hero: https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1920&q=80
- Project: https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&q=80
- Team: https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800&q=80

**COPY STYLE:** Straightforward, confident. "Built to last. Guaranteed."`,

'ecommerce': `
## 🛍️ E-COMMERCE / ONLINE STORE

**EMOTIONAL GOAL:** "I want that!" Create desire, make purchasing effortless.

**COLOR PALETTE:** Clean black (#000), accent color, white, light gray
**FONTS:** DM Sans (headlines), Inter (body)

**REQUIRED SECTIONS:**
1. **Hero** - Product/lifestyle imagery, "Shop Now" CTA, promo banner
2. **Trust Badges** - Free shipping, returns, secure checkout
3. **Featured Products** - 4-8 product cards
4. **Categories** - Visual category showcase
5. **Bestsellers** - Top-selling items
6. **Reviews** - Customer testimonials
7. **Newsletter** - Discount signup
8. **Footer** - Policies, payment icons

**IMAGES:**
- Hero: https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1920&q=80
- Product: https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80

**COPY STYLE:** Concise, benefit-focused, urgency. "Bestselling. Limited stock."`,

'portfolio': `
## 🎨 PORTFOLIO / CREATIVE AGENCY / FREELANCER

**EMOTIONAL GOAL:** "I NEED to work with them." Let the work speak.

**COLOR PALETTE:** Near black (#18181b), creative accent (#a855f7 or custom), white
**FONTS:** Space Grotesk (headlines), Inter (body)

**REQUIRED SECTIONS:**
1. **Hero** - Bold, minimal, name/tagline, "View Work" CTA
2. **Selected Works** - Project grid with hover reveals
3. **About** - Photo, story, philosophy
4. **Services** - What you offer
5. **Process** - How you work
6. **Testimonials** - Client quotes
7. **Contact** - Simple, direct
8. **Footer** - Minimal

**IMAGES:**
- Use project mockups and work samples
- Portrait: https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80

**COPY STYLE:** Minimal, confident. "I create digital experiences that convert."`,

'education': `
## 📚 EDUCATION / COACHING / ONLINE COURSE

**EMOTIONAL GOAL:** "This will transform my life/career." Aspiration meets credibility.

**COLOR PALETTE:** Indigo (#4f46e5), purple accent, light purple bg (#f5f3ff)
**FONTS:** Plus Jakarta Sans (headlines), Inter (body)

**REQUIRED SECTIONS:**
1. **Hero** - Instructor photo, transformation promise, enroll CTA
2. **Who It's For** - Target audience description
3. **Curriculum** - What you'll learn (accordion)
4. **Instructor** - Bio, credentials, story
5. **Success Stories** - Student testimonials with results
6. **Format** - Course details, schedule
7. **Pricing** - Packages with bonuses
8. **FAQ** - Common objections addressed
9. **Enrollment CTA** - Final push with guarantee

**IMAGES:**
- Hero: https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=1920&q=80
- Teaching: https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&q=80

**COPY STYLE:** Transformational, encouraging. "By the end, you'll be able to..."`,
};

const DEFAULT_BRIEF = `
## ✨ PROFESSIONAL WEBSITE

**EMOTIONAL GOAL:** Trust, professionalism, and value.

**REQUIRED SECTIONS:**
1. Hero - Value prop + CTA
2. About - Story and credentials  
3. Services - What you offer
4. Why Us - Differentiators
5. Testimonials - Social proof
6. Contact - Easy to reach
7. Footer - Links and info

**FONTS:** Inter (versatile), Poppins (headlines)`;

// ============================================================================
// STYLE & COLOR CONFIGURATION
// ============================================================================
const STYLE_MODIFIERS: Record<string, string> = {
  'modern': `**STYLE: MODERN** - Clean lines, strategic whitespace, subtle gradients, card layouts, smooth animations`,
  'elegant': `**STYLE: ELEGANT** - Refined serif fonts, generous whitespace, muted palette, gold accents, thin lines`,
  'bold': `**STYLE: BOLD** - Oversized typography, high contrast, heavy shadows, maximum impact`,
  'minimal': `**STYLE: MINIMAL** - Maximum whitespace, 2-3 colors, typography-focused, essential elements only`,
  'playful': `**STYLE: PLAYFUL** - Rounded corners, bright colors, bouncy animations, friendly fonts`,
  'dark': `**STYLE: DARK PREMIUM** - Dark backgrounds (#0a0a0a), light text, glowing accents, glassmorphism`,
  'corporate': `**STYLE: CORPORATE** - Professional, structured, conservative colors, clear hierarchy`
};

const COLOR_PALETTES: Record<string, any> = {
  'auto': { primary: '#6366f1', primaryRgb: '99, 102, 241', secondary: '#8b5cf6', accent: '#f59e0b', background: '#ffffff', surface: '#f8fafc', text: '#0f172a', textMuted: '#64748b' },
  'blue': { primary: '#1e40af', primaryRgb: '30, 64, 175', secondary: '#3b82f6', accent: '#f59e0b', background: '#ffffff', surface: '#f0f9ff', text: '#0f172a', textMuted: '#64748b' },
  'green': { primary: '#166534', primaryRgb: '22, 101, 52', secondary: '#22c55e', accent: '#f59e0b', background: '#ffffff', surface: '#f0fdf4', text: '#0f172a', textMuted: '#64748b' },
  'purple': { primary: '#7c3aed', primaryRgb: '124, 58, 237', secondary: '#a855f7', accent: '#f59e0b', background: '#ffffff', surface: '#faf5ff', text: '#0f172a', textMuted: '#64748b' },
  'red': { primary: '#dc2626', primaryRgb: '220, 38, 38', secondary: '#f87171', accent: '#fbbf24', background: '#ffffff', surface: '#fef2f2', text: '#0f172a', textMuted: '#64748b' },
  'orange': { primary: '#ea580c', primaryRgb: '234, 88, 12', secondary: '#f97316', accent: '#6366f1', background: '#ffffff', surface: '#fff7ed', text: '#0f172a', textMuted: '#64748b' },
  'dark': { primary: '#6366f1', primaryRgb: '99, 102, 241', secondary: '#ec4899', accent: '#22d3ee', background: '#0a0a0a', surface: '#141414', text: '#fafafa', textMuted: '#a3a3a3' },
  'gold': { primary: '#b8860b', primaryRgb: '184, 134, 11', secondary: '#d97706', accent: '#1e40af', background: '#ffffff', surface: '#fffbeb', text: '#0f172a', textMuted: '#64748b' }
};

// ============================================================================
// API HELPER FUNCTIONS
// ============================================================================
async function callClaude(systemPrompt: string, userPrompt: string): Promise<string> {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY!,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 16000,
      temperature: 0.7,
      system: systemPrompt,
      messages: [{ role: 'user', content: userPrompt }],
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Claude API error: ${error}`);
  }

  const data = await response.json();
  return data.content[0].text;
}

function cleanHtmlResponse(response: string): string {
  let html = response.trim();
  html = html.replace(/^```html\s*\n?/i, '').replace(/\n?```\s*$/i, '');
  html = html.replace(/^```\s*\n?/, '').replace(/\n?```\s*$/, '');
  
  const doctypeIndex = html.toLowerCase().indexOf('<!doctype');
  if (doctypeIndex > 0) html = html.substring(doctypeIndex);
  
  const htmlEndIndex = html.toLowerCase().lastIndexOf('</html>');
  if (htmlEndIndex > 0) html = html.substring(0, htmlEndIndex + 7);
  
  return html;
}

// ============================================================================
// WEBSITE GENERATION
// ============================================================================
async function generateWebsite(project: any): Promise<string> {
  const industry = (project.industry || 'other').toLowerCase().replace(/\s+/g, '-');
  const style = (project.style || 'modern').toLowerCase();
  const colorPref = project.color_preference || 'auto';
  
  const industryBrief = INDUSTRY_BRIEFS[industry] || DEFAULT_BRIEF;
  const styleModifier = STYLE_MODIFIERS[style] || STYLE_MODIFIERS['modern'];
  const colors = COLOR_PALETTES[colorPref] || COLOR_PALETTES['auto'];
  
  const moodTags = project.mood_tags || [];
  const moodDescription = moodTags.length > 0 ? `The website should feel: ${moodTags.join(', ')}.` : '';

  const fullSystemPrompt = MASTER_SYSTEM_PROMPT + '\n\n' + COMPONENT_LIBRARY;

  const userPrompt = `
# CREATE A $100,000 ELITE WEBSITE

## CLIENT DETAILS
- **Business Name:** ${project.business_name}
- **Industry:** ${project.industry}
- **Description:** ${project.description || 'A professional business offering quality services'}
- **Website Goal:** ${project.website_goal || 'Generate leads and build trust'}
- **Target Customer:** ${project.target_customer || 'Professionals seeking quality'}
- **Unique Value:** ${project.unique_value || 'Quality, reliability, excellence'}
- **Contact Email:** ${project.contact_email || 'contact@business.com'}
- **Contact Phone:** ${project.contact_phone || '(555) 123-4567'}
- **Address:** ${project.address || 'City, State'}
${project.inspirations ? `- **Design Inspirations:** ${project.inspirations}` : ''}
${moodDescription}

## FEATURES TO INCLUDE
${(project.features || ['Contact Form', 'Testimonials', 'About Section']).map((f: string) => `- ${f}`).join('\n')}

${industryBrief}

${styleModifier}

## COLOR PALETTE TO USE
\`\`\`
Primary: ${colors.primary} (RGB: ${colors.primaryRgb})
Secondary: ${colors.secondary}
Accent: ${colors.accent}
Background: ${colors.background}
Surface: ${colors.surface}
Text: ${colors.text}
Text Muted: ${colors.textMuted}
\`\`\`

## CRITICAL REQUIREMENTS

1. **HERO MUST BE BREATHTAKING** - Full viewport, stunning imagery, massive headline, perfect CTA
2. **USE ALL ANIMATIONS** - .reveal class, hover effects, smooth transitions
3. **MOBILE RESPONSIVE** - Beautiful on all devices, hamburger menu
4. **ALL SECTIONS** - Every section from the industry brief
5. **REAL CONTENT** - Compelling copy for THIS business, no placeholders
6. **USE COMPONENT PATTERNS** - Use the component library patterns provided

## OUTPUT

Create a website that makes the client say "THIS IS INCREDIBLE!"

Output ONLY the complete HTML. Start with <!DOCTYPE html>, end with </html>. No explanations.`;

  const response = await callClaude(fullSystemPrompt, userPrompt);
  return cleanHtmlResponse(response);
}

async function reviseWebsite(currentHtml: string, feedback: string, project: any): Promise<string> {
  const systemPrompt = `You are an elite web designer making revisions to a $100,000 website.

RULES:
- Maintain all existing animations and responsive behavior
- Keep the same quality level
- Implement ALL requested changes completely
- Output ONLY the complete HTML, no explanations`;

  const userPrompt = `
## REVISION REQUEST

**Client:** ${project.business_name}
**Feedback:** ${feedback}

**Current Website:**
${currentHtml}

Apply all changes while maintaining elite quality. Output COMPLETE HTML starting with <!DOCTYPE html>.`;

  const response = await callClaude(systemPrompt, userPrompt);
  return cleanHtmlResponse(response);
}

async function quickEdit(currentHtml: string, instruction: string): Promise<string> {
  const systemPrompt = `Make this specific edit while preserving everything else. Maintain all animations and styling. Output ONLY complete HTML.`;

  const userPrompt = `
**Edit:** ${instruction}

**Current HTML:**
${currentHtml}

Output COMPLETE HTML starting with <!DOCTYPE html>.`;

  const response = await callClaude(systemPrompt, userPrompt);
  return cleanHtmlResponse(response);
}

// ============================================================================
// API ROUTE HANDLER
// ============================================================================
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { projectId, action } = body;

    if (!projectId) {
      return NextResponse.json({ error: 'Project ID required' }, { status: 400 });
    }

    const { data: project, error: projectError } = await supabase
      .from('projects')
      .select('*, customers(name, email, phone, business_name)')
      .eq('id', projectId)
      .single();

    if (projectError || !project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    if (action === 'generate') {
      const html = await generateWebsite(project);
      
      await supabase
        .from('projects')
        .update({ 
          generated_html: html,
          status: 'PREVIEW_READY',
        })
        .eq('id', projectId);

      return NextResponse.json({ success: true, html, message: 'Elite website generated!' });
    }

    if (action === 'revise') {
      const { feedback, currentHtml } = body;
      
      if (!feedback) {
        return NextResponse.json({ error: 'Feedback required' }, { status: 400 });
      }

      const html = await reviseWebsite(currentHtml || project.generated_html, feedback, project);
      
      await supabase
        .from('projects')
        .update({ 
          generated_html: html,
          revision_count: (project.revision_count || 0) + 1,
        })
        .eq('id', projectId);

      return NextResponse.json({ success: true, html, message: 'Revisions applied' });
    }

    if (action === 'quick-edit') {
      const { instruction, currentHtml } = body;
      
      if (!instruction) {
        return NextResponse.json({ error: 'Instruction required' }, { status: 400 });
      }

      const html = await quickEdit(currentHtml || project.generated_html, instruction);
      
      await supabase
        .from('projects')
        .update({ generated_html: html })
        .eq('id', projectId);

      return NextResponse.json({ success: true, html, message: 'Edit applied' });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });

  } catch (error) {
    console.error('AI Generation Error:', error);
    return NextResponse.json(
      { error: 'Failed to process request', details: String(error) },
      { status: 500 }
    );
  }
}
