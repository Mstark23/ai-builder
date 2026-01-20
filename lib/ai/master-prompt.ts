// /lib/ai/master-prompt.ts
// Core design system - The foundation for all premium websites

export const MASTER_SYSTEM_PROMPT = `You are an elite creative director who has won every Awwwards Site of the Day, FWA, and CSS Design Award. You've designed for Apple, Stripe, Linear, and Vercel. Companies pay you $100,000+ per website.

## THE 7 LAWS OF ELITE WEBSITES

**LAW 1: TYPOGRAPHY IS POWER**
- Hero headlines: clamp(48px, 7vw, 84px) - MASSIVE, CONFIDENT
- Letter-spacing: -0.025em on headlines (tighter = premium)
- Font weight contrast: 400 vs 800 creates visual tension
- Line-height: 1.08 for headlines, 1.65 for body
- Never use default system fonts - always Google Fonts

**LAW 2: COLOR WITH INTENTION**
- Maximum 3 colors: primary, secondary, accent
- Dark themes instantly feel premium (#09090b, #0a0a0a, #111111)
- Light themes need warmth (#fafaf9, #fefce8, not pure #ffffff)
- Accent color used SURGICALLY - only for CTAs and key moments
- Always define --primary-rgb for rgba() usage

**LAW 3: WHITESPACE IS LUXURY**
- Section padding: 100px-160px vertical (yes, that much)
- Container max-width: 1200px-1400px
- Expensive websites have MORE space, not less
- Let headline sections breathe with 60-80px margin-bottom
- Card padding: 32-48px minimum

**LAW 4: MOTION CREATES EMOTION**
- Base transition: 0.3s cubic-bezier(0.4, 0, 0.2, 1)
- Scroll-triggered reveals with staggered delays
- Hover states: translateY(-4px) + enhanced shadow
- Page load: fade in body over 0.5s
- Respect prefers-reduced-motion

**LAW 5: THE "WOW" ELEMENT (REQUIRED)**
Every elite website has ONE thing that makes people stop:
- Gradient text on hero headlines (linear-gradient + background-clip)
- Animated gradient mesh backgrounds
- Glassmorphism cards (backdrop-filter: blur(20px))
- Floating decorative blob shapes with border-radius animation
- Glowing CTAs (box-shadow with primary color at 40% opacity)
- Bento grid layouts for features
- Oversized section numbers or decorative typography

**LAW 6: COPY THAT CONVERTS**
- Headlines create EMOTION, not describe features
- "Transform Your Business" not "Our Services"
- "Join 10,000+ Happy Customers" not "We have customers"
- Benefits over features, always
- Social proof in hero (stats, avatars, ratings)
- CTAs that create desire: "Start Free Trial" not "Submit"

**LAW 7: DETAILS NOBODY NOTICES (BUT EVERYONE FEELS)**
- Custom ::selection color matching brand
- Smooth scroll-behavior: smooth on html
- Focus-visible states for accessibility
- Custom scrollbar on webkit (subtle, matches theme)
- Placeholder text styling
- Consistent 8px spacing grid
- Image border-radius matching card radius

## OUTPUT REQUIREMENTS

Return ONLY the complete HTML file:
- Start with <!DOCTYPE html>
- End with </html>
- NO explanations, NO markdown code blocks, NO preamble
- ALL CSS in a single <style> tag in <head>
- ALL JavaScript in a single <script> tag before </body>
- Must be 100% complete and functional
- Must be fully mobile responsive
- Must include all requested sections`;

export const REQUIRED_CSS = `
/* ============================================
   REQUIRED CSS ARCHITECTURE
   ============================================ */

@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Outfit:wght@400;500;600;700;800&display=swap');

:root {
  /* Colors - Override these per industry */
  --primary: #6366f1;
  --primary-rgb: 99, 102, 241;
  --primary-dark: #4f46e5;
  --secondary: #8b5cf6;
  --secondary-rgb: 139, 92, 246;
  --accent: #f59e0b;
  --accent-rgb: 245, 158, 11;
  
  /* Backgrounds */
  --bg-primary: #ffffff;
  --bg-secondary: #f8fafc;
  --bg-tertiary: #f1f5f9;
  --bg-dark: #09090b;
  --bg-card: #ffffff;
  
  /* Text */
  --text-primary: #0f172a;
  --text-secondary: #475569;
  --text-muted: #94a3b8;
  --text-inverse: #ffffff;
  
  /* Borders */
  --border-light: #e2e8f0;
  --border-dark: #334155;
  
  /* Typography */
  --font-display: 'Outfit', sans-serif;
  --font-body: 'Inter', sans-serif;
  
  /* Transitions */
  --transition-fast: 0.15s ease;
  --transition-base: 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  --transition-slow: 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  
  /* Shadows */
  --shadow-xs: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  --shadow-2xl: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  --shadow-glow: 0 0 40px rgba(var(--primary-rgb), 0.3);
  
  /* Spacing */
  --section-padding: 120px;
  --section-padding-mobile: 80px;
  --container-max: 1200px;
  --container-padding: 24px;
  
  /* Border Radius */
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;
  --radius-xl: 24px;
  --radius-full: 9999px;
}

/* Reset & Base */
*, *::before, *::after {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
  -webkit-text-size-adjust: 100%;
}

body {
  font-family: var(--font-body);
  font-size: 16px;
  line-height: 1.65;
  color: var(--text-primary);
  background-color: var(--bg-primary);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  overflow-x: hidden;
}

/* Page Load Animation */
body {
  opacity: 0;
  transition: opacity 0.5s ease;
}
body.loaded {
  opacity: 1;
}

/* Selection */
::selection {
  background-color: var(--primary);
  color: white;
}

/* Focus States */
:focus-visible {
  outline: 2px solid var(--primary);
  outline-offset: 2px;
}

/* Images */
img {
  max-width: 100%;
  height: auto;
  display: block;
}

/* Links */
a {
  color: inherit;
  text-decoration: none;
  transition: var(--transition-base);
}

/* Container */
.container {
  width: 100%;
  max-width: var(--container-max);
  margin: 0 auto;
  padding: 0 var(--container-padding);
}

/* Section */
section {
  padding: var(--section-padding) 0;
  position: relative;
}

@media (max-width: 768px) {
  section {
    padding: var(--section-padding-mobile) 0;
  }
  :root {
    --container-padding: 20px;
  }
}

/* Typography */
h1, h2, h3, h4, h5, h6 {
  font-family: var(--font-display);
  font-weight: 700;
  line-height: 1.1;
  color: var(--text-primary);
}

h1 {
  font-size: clamp(44px, 7vw, 84px);
  font-weight: 800;
  letter-spacing: -0.025em;
  line-height: 1.05;
}

h2 {
  font-size: clamp(32px, 5vw, 56px);
  letter-spacing: -0.02em;
}

h3 {
  font-size: clamp(24px, 3vw, 36px);
  letter-spacing: -0.01em;
}

h4 {
  font-size: clamp(20px, 2vw, 24px);
}

p {
  color: var(--text-secondary);
}

.lead {
  font-size: 1.25rem;
  line-height: 1.7;
  color: var(--text-secondary);
}

/* Gradient Text */
.gradient-text {
  background: linear-gradient(135deg, var(--primary), var(--secondary));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.gradient-text-animated {
  background: linear-gradient(90deg, var(--primary), var(--secondary), var(--primary));
  background-size: 200% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: gradientShift 3s ease infinite;
}

/* Section Headers */
.section-header {
  margin-bottom: 64px;
}

.section-header.centered {
  text-align: center;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
}

.section-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: rgba(var(--primary-rgb), 0.1);
  border: 1px solid rgba(var(--primary-rgb), 0.2);
  border-radius: var(--radius-full);
  font-size: 14px;
  font-weight: 600;
  color: var(--primary);
  margin-bottom: 20px;
}

.section-title {
  margin-bottom: 20px;
}

.section-subtitle {
  font-size: 18px;
  color: var(--text-secondary);
  max-width: 600px;
  line-height: 1.7;
}

.section-header.centered .section-subtitle {
  margin-left: auto;
  margin-right: auto;
}

/* Buttons */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 16px 32px;
  font-family: var(--font-body);
  font-size: 16px;
  font-weight: 600;
  line-height: 1;
  border-radius: var(--radius-md);
  border: none;
  cursor: pointer;
  transition: var(--transition-base);
  text-decoration: none;
  white-space: nowrap;
}

.btn-primary {
  background: var(--primary);
  color: white;
  box-shadow: 0 4px 14px rgba(var(--primary-rgb), 0.4);
}

.btn-primary:hover {
  background: var(--primary-dark);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(var(--primary-rgb), 0.5);
}

.btn-secondary {
  background: transparent;
  color: var(--text-primary);
  border: 2px solid var(--border-light);
}

.btn-secondary:hover {
  border-color: var(--primary);
  color: var(--primary);
  background: rgba(var(--primary-rgb), 0.05);
}

.btn-white {
  background: white;
  color: var(--text-primary);
  box-shadow: var(--shadow-md);
}

.btn-white:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

.btn-ghost {
  background: transparent;
  color: var(--text-primary);
  padding: 12px 20px;
}

.btn-ghost:hover {
  background: var(--bg-secondary);
}

.btn-lg {
  padding: 20px 40px;
  font-size: 18px;
  border-radius: var(--radius-lg);
}

.btn-glow {
  animation: glow 2s ease-in-out infinite alternate;
}

/* Cards */
.card {
  background: var(--bg-card);
  border-radius: var(--radius-lg);
  padding: 32px;
  border: 1px solid var(--border-light);
  transition: var(--transition-base);
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
  border-color: transparent;
}

.card-dark {
  background: var(--bg-dark);
  border-color: var(--border-dark);
  color: var(--text-inverse);
}

/* Glass Effect */
.glass {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: var(--radius-lg);
}

.glass-dark {
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

/* Navigation */
nav, .navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  padding: 20px 0;
  transition: var(--transition-base);
}

nav.scrolled, .navbar.scrolled {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  box-shadow: var(--shadow-sm);
  padding: 12px 0;
}

.nav-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.nav-logo {
  font-family: var(--font-display);
  font-size: 24px;
  font-weight: 800;
  color: var(--text-primary);
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 40px;
  list-style: none;
}

.nav-links a {
  font-size: 15px;
  font-weight: 500;
  color: var(--text-secondary);
  transition: var(--transition-base);
}

.nav-links a:hover {
  color: var(--text-primary);
}

/* Mobile Menu Toggle */
.menu-toggle {
  display: none;
  flex-direction: column;
  gap: 6px;
  padding: 8px;
  background: none;
  border: none;
  cursor: pointer;
}

.menu-toggle span {
  display: block;
  width: 24px;
  height: 2px;
  background: var(--text-primary);
  transition: var(--transition-base);
}

.menu-toggle.active span:nth-child(1) {
  transform: rotate(45deg) translate(6px, 6px);
}

.menu-toggle.active span:nth-child(2) {
  opacity: 0;
}

.menu-toggle.active span:nth-child(3) {
  transform: rotate(-45deg) translate(6px, -6px);
}

@media (max-width: 768px) {
  .menu-toggle {
    display: flex;
  }
  
  .nav-links {
    position: fixed;
    top: 70px;
    left: 0;
    right: 0;
    bottom: 0;
    flex-direction: column;
    background: var(--bg-primary);
    padding: 40px 24px;
    gap: 24px;
    opacity: 0;
    visibility: hidden;
    transition: var(--transition-base);
  }
  
  .nav-links.active {
    opacity: 1;
    visibility: visible;
  }
  
  .nav-links a {
    font-size: 18px;
  }
}

/* Forms */
.form-group {
  margin-bottom: 20px;
}

.form-label {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 8px;
}

.form-input,
.form-textarea {
  width: 100%;
  padding: 14px 18px;
  font-family: var(--font-body);
  font-size: 16px;
  color: var(--text-primary);
  background: var(--bg-secondary);
  border: 2px solid transparent;
  border-radius: var(--radius-md);
  transition: var(--transition-base);
}

.form-input:focus,
.form-textarea:focus {
  outline: none;
  border-color: var(--primary);
  background: white;
}

.form-input::placeholder,
.form-textarea::placeholder {
  color: var(--text-muted);
}

.form-textarea {
  min-height: 150px;
  resize: vertical;
}

/* Grid Layouts */
.grid-2 {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 32px;
}

.grid-3 {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 32px;
}

.grid-4 {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
}

@media (max-width: 1024px) {
  .grid-4 {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .grid-2,
  .grid-3,
  .grid-4 {
    grid-template-columns: 1fr;
  }
}

/* Flex Utilities */
.flex {
  display: flex;
}

.flex-col {
  flex-direction: column;
}

.items-center {
  align-items: center;
}

.justify-center {
  justify-content: center;
}

.justify-between {
  justify-content: space-between;
}

.gap-sm { gap: 8px; }
.gap-md { gap: 16px; }
.gap-lg { gap: 24px; }
.gap-xl { gap: 32px; }

/* Text Utilities */
.text-center { text-align: center; }
.text-left { text-align: left; }
.text-right { text-align: right; }

/* Spacing Utilities */
.mt-sm { margin-top: 16px; }
.mt-md { margin-top: 32px; }
.mt-lg { margin-top: 48px; }
.mt-xl { margin-top: 64px; }

.mb-sm { margin-bottom: 16px; }
.mb-md { margin-bottom: 32px; }
.mb-lg { margin-bottom: 48px; }
.mb-xl { margin-bottom: 64px; }
`;

export const REQUIRED_JS = `
/* ============================================
   REQUIRED JAVASCRIPT
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  // Page Load Animation
  document.body.classList.add('loaded');

  // Scroll Reveal Observer
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  // Observe all reveal elements
  document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale, .stagger').forEach(el => {
    revealObserver.observe(el);
  });

  // Navbar Scroll Effect
  const nav = document.querySelector('nav, .navbar');
  let lastScrollY = window.scrollY;

  window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;
    
    if (nav) {
      // Add scrolled class
      nav.classList.toggle('scrolled', currentScrollY > 50);
      
      // Hide/show on scroll direction (optional)
      if (currentScrollY > lastScrollY && currentScrollY > 500) {
        nav.style.transform = 'translateY(-100%)';
      } else {
        nav.style.transform = 'translateY(0)';
      }
    }
    
    lastScrollY = currentScrollY;
  });

  // Smooth Scroll for Anchor Links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const target = document.querySelector(targetId);
      if (target) {
        const navHeight = document.querySelector('nav, .navbar')?.offsetHeight || 0;
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight - 20;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
        
        // Close mobile menu if open
        document.querySelector('.mobile-menu, .nav-links')?.classList.remove('active');
        document.querySelector('.menu-toggle')?.classList.remove('active');
      }
    });
  });

  // Mobile Menu Toggle
  const menuToggle = document.querySelector('.menu-toggle');
  const mobileMenu = document.querySelector('.mobile-menu, .nav-links');

  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', () => {
      menuToggle.classList.toggle('active');
      mobileMenu.classList.toggle('active');
      document.body.classList.toggle('menu-open');
    });
  }

  // Animated Counters
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
        entry.target.classList.add('counted');
        const target = parseInt(entry.target.dataset.count);
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;

        const updateCounter = () => {
          current += step;
          if (current < target) {
            entry.target.textContent = Math.floor(current).toLocaleString();
            requestAnimationFrame(updateCounter);
          } else {
            entry.target.textContent = target.toLocaleString();
          }
        };
        
        updateCounter();
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('[data-count]').forEach(el => {
    counterObserver.observe(el);
  });

  // Form Handling
  document.querySelectorAll('form').forEach(form => {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const submitBtn = this.querySelector('button[type="submit"]');
      if (!submitBtn) return;
      
      const originalText = submitBtn.innerHTML;
      submitBtn.innerHTML = '<span class="spinner"></span> Sending...';
      submitBtn.disabled = true;

      // Simulate form submission
      setTimeout(() => {
        submitBtn.innerHTML = '✓ Sent Successfully!';
        submitBtn.classList.add('btn-success');
        this.reset();

        setTimeout(() => {
          submitBtn.innerHTML = originalText;
          submitBtn.disabled = false;
          submitBtn.classList.remove('btn-success');
        }, 3000);
      }, 1500);
    });
  });

  // FAQ Accordion
  document.querySelectorAll('.faq-question').forEach(button => {
    button.addEventListener('click', () => {
      const faqItem = button.closest('.faq-item');
      const isActive = faqItem.classList.contains('active');
      
      // Close all other FAQ items
      document.querySelectorAll('.faq-item').forEach(item => {
        item.classList.remove('active');
      });
      
      // Toggle current item
      if (!isActive) {
        faqItem.classList.add('active');
      }
    });
  });

  // Testimonial Slider (if exists)
  const testimonialSlider = document.querySelector('.testimonial-slider');
  if (testimonialSlider) {
    let currentSlide = 0;
    const slides = testimonialSlider.querySelectorAll('.testimonial-slide');
    const totalSlides = slides.length;

    const showSlide = (index) => {
      slides.forEach((slide, i) => {
        slide.style.transform = \`translateX(\${(i - index) * 100}%)\`;
      });
    };

    // Auto-advance slides
    setInterval(() => {
      currentSlide = (currentSlide + 1) % totalSlides;
      showSlide(currentSlide);
    }, 5000);

    showSlide(0);
  }

  // Back to Top Button
  const backToTop = document.getElementById('backToTop');
  if (backToTop) {
    window.addEventListener('scroll', () => {
      backToTop.classList.toggle('visible', window.scrollY > 500);
    });

    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Typing Effect (for hero headlines)
  const typingElements = document.querySelectorAll('[data-typing]');
  typingElements.forEach(el => {
    const text = el.dataset.typing;
    el.textContent = '';
    let i = 0;
    
    const typeChar = () => {
      if (i < text.length) {
        el.textContent += text.charAt(i);
        i++;
        setTimeout(typeChar, 50);
      }
    };
    
    // Start typing when element is visible
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        typeChar();
        observer.disconnect();
      }
    });
    observer.observe(el);
  });
});
`;

// Animation keyframes to include in CSS
export const ANIMATION_KEYFRAMES = `
/* ============================================
   ANIMATION KEYFRAMES
   ============================================ */

/* Reveal Animations */
.reveal {
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 0.6s ease, transform 0.6s ease;
}

.reveal.active {
  opacity: 1;
  transform: translateY(0);
}

.reveal-left {
  opacity: 0;
  transform: translateX(-30px);
  transition: opacity 0.6s ease, transform 0.6s ease;
}

.reveal-left.active {
  opacity: 1;
  transform: translateX(0);
}

.reveal-right {
  opacity: 0;
  transform: translateX(30px);
  transition: opacity 0.6s ease, transform 0.6s ease;
}

.reveal-right.active {
  opacity: 1;
  transform: translateX(0);
}

.reveal-scale {
  opacity: 0;
  transform: scale(0.95);
  transition: opacity 0.6s ease, transform 0.6s ease;
}

.reveal-scale.active {
  opacity: 1;
  transform: scale(1);
}

/* Stagger Children */
.stagger > * {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.5s ease, transform 0.5s ease;
}

.stagger.active > *:nth-child(1) { transition-delay: 0.1s; opacity: 1; transform: translateY(0); }
.stagger.active > *:nth-child(2) { transition-delay: 0.15s; opacity: 1; transform: translateY(0); }
.stagger.active > *:nth-child(3) { transition-delay: 0.2s; opacity: 1; transform: translateY(0); }
.stagger.active > *:nth-child(4) { transition-delay: 0.25s; opacity: 1; transform: translateY(0); }
.stagger.active > *:nth-child(5) { transition-delay: 0.3s; opacity: 1; transform: translateY(0); }
.stagger.active > *:nth-child(6) { transition-delay: 0.35s; opacity: 1; transform: translateY(0); }
.stagger.active > *:nth-child(7) { transition-delay: 0.4s; opacity: 1; transform: translateY(0); }
.stagger.active > *:nth-child(8) { transition-delay: 0.45s; opacity: 1; transform: translateY(0); }

/* Keyframe Animations */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateX(-50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-20px);
  }
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

@keyframes glow {
  0%, 100% {
    box-shadow: 0 0 20px rgba(var(--primary-rgb), 0.4);
  }
  50% {
    box-shadow: 0 0 40px rgba(var(--primary-rgb), 0.6);
  }
}

@keyframes gradientShift {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

@keyframes blobMorph {
  0%, 100% {
    border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;
  }
  50% {
    border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%;
  }
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

/* Utility Classes for Animations */
.animate-fade-in { animation: fadeIn 0.6s ease forwards; }
.animate-fade-in-up { animation: fadeInUp 0.6s ease forwards; }
.animate-fade-in-down { animation: fadeInDown 0.6s ease forwards; }
.animate-slide-in-left { animation: slideInLeft 0.6s ease forwards; }
.animate-slide-in-right { animation: slideInRight 0.6s ease forwards; }
.animate-scale-in { animation: scaleIn 0.6s ease forwards; }
.animate-float { animation: float 3s ease-in-out infinite; }
.animate-pulse { animation: pulse 2s ease-in-out infinite; }
.animate-glow { animation: glow 2s ease-in-out infinite; }
.animate-bounce { animation: bounce 1s ease-in-out infinite; }
.animate-rotate { animation: rotate 10s linear infinite; }

/* Animation Delays */
.delay-100 { animation-delay: 0.1s; }
.delay-200 { animation-delay: 0.2s; }
.delay-300 { animation-delay: 0.3s; }
.delay-400 { animation-delay: 0.4s; }
.delay-500 { animation-delay: 0.5s; }

/* Reduced Motion */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

/* Spinner */
.spinner {
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: rotate 0.8s linear infinite;
}
`;

// Export helper to get full CSS
export function getFullCSS(): string {
  return REQUIRED_CSS + '\n' + ANIMATION_KEYFRAMES;
}

// Export helper to get full JS
export function getFullJS(): string {
  return REQUIRED_JS;
}

// Export the combined master prompt
export function getMasterPrompt(): string {
  return MASTER_SYSTEM_PROMPT;
}
