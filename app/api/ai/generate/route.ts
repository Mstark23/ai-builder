// app/api/ai/generate/route.ts
// ULTIMATE AI Website Generation v2.0 - Elite Websites That Convert

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// ============================================================================
// THE ELITE SYSTEM PROMPT - Completely Rewritten for Maximum Quality
// ============================================================================
const MASTER_SYSTEM_PROMPT = `You are an elite creative director who has won every Awwwards Site of the Day, FWA, and CSS Design Award. You've designed for Apple, Stripe, Linear, and Vercel. Companies pay you $100,000+ per website because your work is THAT good.

## YOUR DESIGN PHILOSOPHY

You don't build websites. You build EXPERIENCES that make visitors feel something within 0.5 seconds. Every website you create could be featured on Awwwards.

### THE 7 LAWS OF ELITE WEBSITES

**LAW 1: TYPOGRAPHY IS POWER**
- Hero headlines: clamp(56px, 8vw, 120px) - MASSIVE, CONFIDENT
- Letter-spacing: -0.03em on headlines (tighter = premium)
- Font weight contrast: 300 vs 800 creates visual tension
- Line-height: 1.05-1.1 for headlines, 1.7 for body
- NEVER use Arial, Helvetica, or system fonts

**LAW 2: COLOR WITH INTENTION**
- Maximum 3 colors: dominant, supporting, accent
- Dark themes instantly feel premium (#0a0a0a, #0f0f0f, #141414)
- Light themes need warmth (#fafaf9, #f5f5f4, not pure white)
- Accent color used SURGICALLY - only for CTAs and key moments
- Gradients should be subtle, sophisticated, never garish

**LAW 3: WHITESPACE IS LUXURY**
- Section padding: 120px-200px vertical (yes, that much)
- Expensive websites have MORE space, not less
- Let single elements breathe alone
- Cramped = cheap, spacious = premium

**LAW 4: MOTION CREATES EMOTION**
- Every transition: 0.3s cubic-bezier(0.4, 0, 0.2, 1)
- Scroll-triggered reveals (staggered, elegant)
- Hover states that feel ALIVE (translateY, scale, glow)
- One signature animation that people remember
- Respect prefers-reduced-motion

**LAW 5: THE "WOW" ELEMENT (REQUIRED)**
Every elite website has ONE thing that makes people stop:
- Animated gradient mesh background
- Glassmorphism cards with backdrop-blur
- Floating decorative blob shapes
- Gradient text on hero headlines
- Bento grid layouts
- Glowing buttons on dark backgrounds
- Noise/grain texture overlay
- Oversized typography as design element

**LAW 6: COPY THAT CONVERTS**
- Headlines create EMOTION, not describe features
- "Transform Your Business" not "Our Services"
- Benefits over features, always
- Social proof everywhere (numbers, testimonials, logos)
- CTAs that make people WANT to click

**LAW 7: DETAILS NOBODY NOTICES (BUT EVERYONE FEELS)**
- Custom selection color matching brand
- Smooth scroll-behavior: smooth
- Consistent 8px spacing grid
- Focus states for accessibility
- Custom scrollbar on webkit
- Loading states and skeleton screens

## REQUIRED TECHNICAL IMPLEMENTATION

### CSS ARCHITECTURE (REQUIRED IN EVERY WEBSITE)
\`\`\`css
:root {
  --primary: #COLOR;
  --primary-rgb: R, G, B;
  --secondary: #COLOR;
  --accent: #COLOR;
  --background: #COLOR;
  --surface: #COLOR;
  --text: #COLOR;
  --text-muted: #COLOR;
  --font-display: 'CHOSEN_FONT', sans-serif;
  --font-body: 'CHOSEN_FONT', sans-serif;
  --transition: 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  --shadow-sm: 0 1px 2px rgba(0,0,0,0.05);
  --shadow-md: 0 4px 6px -1px rgba(0,0,0,0.1);
  --shadow-lg: 0 10px 15px -3px rgba(0,0,0,0.1);
  --shadow-xl: 0 20px 25px -5px rgba(0,0,0,0.1);
}

*, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
html { scroll-behavior: smooth; }
body { 
  font-family: var(--font-body); 
  background: var(--background); 
  color: var(--text);
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
}
::selection { background: var(--primary); color: white; }
\`\`\`

### ANIMATIONS (ALL REQUIRED)
\`\`\`css
/* Reveal on Scroll */
.reveal {
  opacity: 0;
  transform: translateY(40px);
  transition: opacity 0.8s var(--transition), transform 0.8s var(--transition);
}
.reveal.active {
  opacity: 1;
  transform: translateY(0);
}

/* Staggered Children */
.reveal-stagger > *:nth-child(1) { transition-delay: 0.1s; }
.reveal-stagger > *:nth-child(2) { transition-delay: 0.2s; }
.reveal-stagger > *:nth-child(3) { transition-delay: 0.3s; }
.reveal-stagger > *:nth-child(4) { transition-delay: 0.4s; }
.reveal-stagger > *:nth-child(5) { transition-delay: 0.5s; }
.reveal-stagger > *:nth-child(6) { transition-delay: 0.6s; }

/* Button Hover */
.btn {
  transition: all var(--transition);
  position: relative;
  overflow: hidden;
}
.btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 40px rgba(var(--primary-rgb), 0.3);
}

/* Card Hover */
.card {
  transition: all var(--transition);
}
.card:hover {
  transform: translateY(-8px);
  box-shadow: var(--shadow-xl);
}

/* Glassmorphism */
.glass {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

/* Gradient Text */
.gradient-text {
  background: linear-gradient(135deg, var(--primary), var(--secondary));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* Floating Animation */
@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-20px); }
}

/* Gradient Shift */
@keyframes gradientShift {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

/* Blob Morph */
@keyframes blobMorph {
  0%, 100% { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; }
  50% { border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%; }
}

/* Glow Pulse */
@keyframes glow {
  0%, 100% { box-shadow: 0 0 20px rgba(var(--primary-rgb), 0.4); }
  50% { box-shadow: 0 0 40px rgba(var(--primary-rgb), 0.6); }
}
\`\`\`

### JAVASCRIPT (REQUIRED)
\`\`\`javascript
document.addEventListener('DOMContentLoaded', () => {
  // Page Load
  document.body.classList.add('loaded');
  
  // Scroll Reveal
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
  
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
  
  // Navbar Scroll
  const nav = document.querySelector('nav');
  window.addEventListener('scroll', () => {
    nav?.classList.toggle('scrolled', window.scrollY > 50);
  });
  
  // Smooth Scroll
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      document.querySelector(this.getAttribute('href'))?.scrollIntoView({ behavior: 'smooth' });
    });
  });
  
  // Animated Counters
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.getAttribute('data-count'));
        let current = 0;
        const step = target / 50;
        const timer = setInterval(() => {
          current += step;
          if (current >= target) {
            el.textContent = target;
            clearInterval(timer);
          } else {
            el.textContent = Math.floor(current);
          }
        }, 30);
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  
  document.querySelectorAll('[data-count]').forEach(el => counterObserver.observe(el));
  
  // Mobile Menu
  const toggle = document.querySelector('.mobile-toggle');
  const menu = document.querySelector('.mobile-menu');
  toggle?.addEventListener('click', () => {
    toggle.classList.toggle('active');
    menu?.classList.toggle('active');
  });
  
  // Back to Top
  const backToTop = document.getElementById('backToTop');
  window.addEventListener('scroll', () => {
    backToTop?.classList.toggle('visible', window.scrollY > 500);
  });
  backToTop?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
});
\`\`\`

### FONTS TO USE (Google Fonts)
Modern: \`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap');\`
Elegant: \`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600;700&family=Lato:wght@400;500;700&display=swap');\`
Bold: \`@import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=Work+Sans:wght@400;500;600&display=swap');\`
Premium: \`@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=DM+Sans:wght@400;500;600&display=swap');\`

### IMAGE SOURCES (Use Real Images)
- Unsplash direct: https://images.unsplash.com/photo-[ID]?w=[WIDTH]&q=80
- Picsum (random): https://picsum.photos/[WIDTH]/[HEIGHT]?random=[N]

## OUTPUT FORMAT

Return ONLY the complete HTML file:
- Start with <!DOCTYPE html>
- End with </html>
- NO explanations, NO markdown code blocks, NO preamble
- ALL CSS in <style> tag in <head>
- ALL JavaScript in <script> tag before </body>
- Must be 100% complete and functional
- Must include mobile responsive design
- Must include all animations and interactions`;

// ============================================================================
// EXAMPLE WEBSITE (This dramatically improves output quality)
// ============================================================================
const EXAMPLE_WEBSITE = `
## HERE IS AN EXAMPLE OF THE QUALITY LEVEL YOU MUST MATCH OR EXCEED:

\`\`\`html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Apex Digital | Premium Web Design</title>
  <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=DM+Sans:wght@400;500;600&display=swap" rel="stylesheet">
  <style>
    :root {
      --primary: #6366f1;
      --primary-rgb: 99, 102, 241;
      --secondary: #ec4899;
      --accent: #22d3ee;
      --background: #0a0a0a;
      --surface: #141414;
      --text: #fafafa;
      --text-muted: #a3a3a3;
      --font-display: 'Outfit', sans-serif;
      --font-body: 'DM Sans', sans-serif;
      --transition: 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }
    
    *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
    html { scroll-behavior: smooth; }
    body { 
      font-family: var(--font-body); 
      background: var(--background); 
      color: var(--text);
      line-height: 1.6;
      opacity: 0;
      transition: opacity 0.5s ease;
    }
    body.loaded { opacity: 1; }
    ::selection { background: var(--primary); color: white; }
    
    .container { max-width: 1280px; margin: 0 auto; padding: 0 24px; }
    
    /* Navigation */
    nav {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 1000;
      padding: 20px 0;
      transition: var(--transition);
    }
    nav.scrolled {
      background: rgba(10, 10, 10, 0.9);
      backdrop-filter: blur(20px);
      padding: 12px 0;
      border-bottom: 1px solid rgba(255,255,255,0.1);
    }
    .nav-container { display: flex; align-items: center; justify-content: space-between; }
    .nav-logo { font-family: var(--font-display); font-size: 24px; font-weight: 800; }
    .nav-logo span { color: var(--primary); }
    .nav-links { display: flex; gap: 40px; list-style: none; }
    .nav-links a { color: var(--text-muted); font-size: 15px; transition: var(--transition); }
    .nav-links a:hover { color: var(--text); }
    
    /* Hero */
    .hero {
      min-height: 100vh;
      display: flex;
      align-items: center;
      padding: 140px 0 100px;
      position: relative;
      overflow: hidden;
    }
    .hero-blob {
      position: absolute;
      border-radius: 50%;
      filter: blur(80px);
      opacity: 0.4;
      animation: blobMorph 8s ease-in-out infinite;
    }
    .hero-blob-1 { width: 600px; height: 600px; background: var(--primary); top: -200px; right: -100px; }
    .hero-blob-2 { width: 400px; height: 400px; background: var(--secondary); bottom: -100px; left: -100px; animation-delay: -3s; }
    .hero-content { position: relative; z-index: 1; max-width: 800px; }
    .hero-tag {
      display: inline-flex;
      padding: 8px 16px;
      background: rgba(var(--primary-rgb), 0.15);
      border: 1px solid rgba(var(--primary-rgb), 0.3);
      border-radius: 100px;
      font-size: 14px;
      font-weight: 600;
      color: var(--primary);
      margin-bottom: 24px;
    }
    .hero-title {
      font-family: var(--font-display);
      font-size: clamp(48px, 8vw, 96px);
      font-weight: 800;
      line-height: 1.05;
      letter-spacing: -0.03em;
      margin-bottom: 24px;
    }
    .gradient-text {
      background: linear-gradient(135deg, var(--primary), var(--secondary), var(--accent));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .hero-description {
      font-size: 20px;
      color: var(--text-muted);
      max-width: 600px;
      margin-bottom: 40px;
      line-height: 1.7;
    }
    .hero-buttons { display: flex; gap: 16px; flex-wrap: wrap; margin-bottom: 60px; }
    
    /* Buttons */
    .btn {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 16px 32px;
      font-family: var(--font-display);
      font-size: 15px;
      font-weight: 600;
      border-radius: 12px;
      border: none;
      cursor: pointer;
      text-decoration: none;
      transition: var(--transition);
    }
    .btn-primary {
      background: linear-gradient(135deg, var(--primary), var(--secondary));
      color: white;
      box-shadow: 0 4px 15px rgba(var(--primary-rgb), 0.4);
    }
    .btn-primary:hover {
      transform: translateY(-3px);
      box-shadow: 0 8px 25px rgba(var(--primary-rgb), 0.5);
    }
    .btn-secondary {
      background: rgba(255,255,255,0.1);
      color: var(--text);
      border: 1px solid rgba(255,255,255,0.2);
    }
    .btn-secondary:hover { background: rgba(255,255,255,0.15); }
    
    /* Stats */
    .hero-stats { display: flex; gap: 48px; }
    .stat-number {
      font-family: var(--font-display);
      font-size: 48px;
      font-weight: 800;
      background: linear-gradient(135deg, var(--text), var(--text-muted));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .stat-label { font-size: 14px; color: var(--text-muted); }
    
    /* Sections */
    section { padding: 120px 0; }
    .section-header { margin-bottom: 60px; }
    .section-header.centered { text-align: center; max-width: 700px; margin-left: auto; margin-right: auto; }
    .section-tag {
      display: inline-block;
      padding: 6px 14px;
      background: rgba(var(--primary-rgb), 0.1);
      border: 1px solid rgba(var(--primary-rgb), 0.2);
      border-radius: 100px;
      font-size: 13px;
      font-weight: 600;
      color: var(--primary);
      margin-bottom: 20px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .section-title {
      font-family: var(--font-display);
      font-size: clamp(36px, 5vw, 56px);
      font-weight: 800;
      line-height: 1.1;
      letter-spacing: -0.02em;
      margin-bottom: 20px;
    }
    .section-description { font-size: 18px; color: var(--text-muted); max-width: 600px; }
    
    /* Bento Grid */
    .bento-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
    .bento-card {
      background: var(--surface);
      border: 1px solid rgba(255,255,255,0.05);
      border-radius: 24px;
      padding: 40px;
      transition: var(--transition);
    }
    .bento-card:hover {
      transform: translateY(-4px);
      border-color: rgba(var(--primary-rgb), 0.3);
    }
    .bento-large { grid-column: span 2; }
    .bento-icon {
      width: 56px;
      height: 56px;
      border-radius: 14px;
      background: linear-gradient(135deg, var(--primary), var(--secondary));
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 20px;
      font-size: 24px;
    }
    .bento-card h3 { font-family: var(--font-display); font-size: 22px; font-weight: 700; margin-bottom: 12px; }
    .bento-card p { color: var(--text-muted); line-height: 1.7; }
    
    /* Testimonial */
    .testimonial-card {
      background: var(--surface);
      border: 1px solid rgba(255,255,255,0.05);
      border-radius: 24px;
      padding: 48px;
      position: relative;
    }
    .testimonial-quote {
      font-family: var(--font-display);
      font-size: 24px;
      font-weight: 500;
      line-height: 1.5;
      margin-bottom: 32px;
    }
    .testimonial-author { display: flex; align-items: center; gap: 16px; }
    .testimonial-avatar {
      width: 56px;
      height: 56px;
      border-radius: 50%;
      object-fit: cover;
    }
    .testimonial-name { font-weight: 600; }
    .testimonial-role { color: var(--text-muted); font-size: 14px; }
    
    /* CTA */
    .cta {
      background: linear-gradient(135deg, rgba(var(--primary-rgb), 0.1), rgba(236, 72, 153, 0.1));
      border-radius: 32px;
      padding: 80px;
      text-align: center;
      position: relative;
      overflow: hidden;
    }
    .cta-title { font-family: var(--font-display); font-size: clamp(32px, 4vw, 48px); font-weight: 800; margin-bottom: 16px; }
    .cta-description { color: var(--text-muted); font-size: 18px; margin-bottom: 32px; }
    
    /* Footer */
    footer {
      padding: 60px 0 30px;
      border-top: 1px solid rgba(255,255,255,0.05);
    }
    .footer-grid { display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap: 60px; margin-bottom: 60px; }
    .footer-brand { max-width: 300px; }
    .footer-logo { font-family: var(--font-display); font-size: 24px; font-weight: 800; margin-bottom: 16px; display: block; }
    .footer-tagline { color: var(--text-muted); line-height: 1.7; }
    .footer-column h4 { font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 20px; }
    .footer-column ul { list-style: none; }
    .footer-column a { color: var(--text-muted); font-size: 15px; display: block; padding: 8px 0; transition: var(--transition); }
    .footer-column a:hover { color: var(--text); }
    .footer-bottom { display: flex; justify-content: space-between; padding-top: 30px; border-top: 1px solid rgba(255,255,255,0.05); }
    .footer-bottom p { color: var(--text-muted); font-size: 14px; }
    
    /* Reveal Animation */
    .reveal { opacity: 0; transform: translateY(40px); transition: opacity 0.8s ease, transform 0.8s ease; }
    .reveal.active { opacity: 1; transform: translateY(0); }
    
    /* Animations */
    @keyframes blobMorph {
      0%, 100% { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; }
      50% { border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%; }
    }
    
    /* Mobile */
    @media (max-width: 768px) {
      .nav-links { display: none; }
      .hero-title { font-size: 40px; }
      .hero-stats { flex-direction: column; gap: 24px; }
      .bento-grid { grid-template-columns: 1fr; }
      .bento-large { grid-column: span 1; }
      .footer-grid { grid-template-columns: 1fr 1fr; gap: 40px; }
      .cta { padding: 48px 24px; }
    }
  </style>
</head>
<body>
  <nav>
    <div class="container nav-container">
      <a href="#" class="nav-logo">APEX<span>.</span></a>
      <ul class="nav-links">
        <li><a href="#services">Services</a></li>
        <li><a href="#work">Work</a></li>
        <li><a href="#testimonials">Testimonials</a></li>
        <li><a href="#contact">Contact</a></li>
      </ul>
      <a href="#contact" class="btn btn-primary">Start Project</a>
    </div>
  </nav>

  <section class="hero">
    <div class="hero-blob hero-blob-1"></div>
    <div class="hero-blob hero-blob-2"></div>
    <div class="container">
      <div class="hero-content">
        <span class="hero-tag">✨ Award-Winning Digital Agency</span>
        <h1 class="hero-title">We Build Websites That <span class="gradient-text">Convert</span></h1>
        <p class="hero-description">Premium design meets powerful functionality. We craft exceptional digital experiences that elevate brands and drive real business results.</p>
        <div class="hero-buttons">
          <a href="#contact" class="btn btn-primary">Start Your Project</a>
          <a href="#work" class="btn btn-secondary">View Our Work</a>
        </div>
        <div class="hero-stats">
          <div><span class="stat-number" data-count="500">0</span><span class="stat-label">Projects Delivered</span></div>
          <div><span class="stat-number" data-count="98">0</span><span class="stat-label">% Satisfaction Rate</span></div>
          <div><span class="stat-number" data-count="12">0</span><span class="stat-label">Years Experience</span></div>
        </div>
      </div>
    </div>
  </section>

  <section id="services">
    <div class="container">
      <div class="section-header reveal">
        <span class="section-tag">Services</span>
        <h2 class="section-title">Everything You Need to <span class="gradient-text">Dominate</span> Online</h2>
      </div>
      <div class="bento-grid">
        <div class="bento-card bento-large reveal">
          <div class="bento-icon">🎨</div>
          <h3>Strategic Web Design</h3>
          <p>We don't just make things pretty. Every pixel serves a purpose in converting visitors into customers. Data-driven design that delivers results.</p>
        </div>
        <div class="bento-card reveal">
          <div class="bento-icon">⚡</div>
          <h3>Development</h3>
          <p>Clean, fast, scalable code that grows with your business.</p>
        </div>
        <div class="bento-card reveal">
          <div class="bento-icon">📈</div>
          <h3>SEO & Marketing</h3>
          <p>Get found by the customers who are looking for you.</p>
        </div>
      </div>
    </div>
  </section>

  <section id="testimonials">
    <div class="container">
      <div class="section-header centered reveal">
        <span class="section-tag">Testimonials</span>
        <h2 class="section-title">Loved by <span class="gradient-text">500+</span> Businesses</h2>
      </div>
      <div class="testimonial-card reveal">
        <p class="testimonial-quote">"Apex completely transformed our online presence. Within 3 months, we saw a 340% increase in qualified leads. The ROI has been incredible."</p>
        <div class="testimonial-author">
          <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80" alt="Sarah Johnson" class="testimonial-avatar">
          <div>
            <div class="testimonial-name">Sarah Johnson</div>
            <div class="testimonial-role">CEO, TechStart Inc.</div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <section id="contact">
    <div class="container">
      <div class="cta reveal">
        <h2 class="cta-title">Ready to Transform Your Business?</h2>
        <p class="cta-description">Join 500+ businesses that chose growth. Book your free consultation today.</p>
        <a href="mailto:hello@apex.com" class="btn btn-primary">Get Your Free Quote</a>
      </div>
    </div>
  </section>

  <footer>
    <div class="container">
      <div class="footer-grid">
        <div class="footer-brand">
          <a href="#" class="footer-logo">APEX<span style="color:var(--primary)">.</span></a>
          <p class="footer-tagline">Crafting digital experiences that inspire, engage, and convert.</p>
        </div>
        <div class="footer-column">
          <h4>Services</h4>
          <ul>
            <li><a href="#">Web Design</a></li>
            <li><a href="#">Development</a></li>
            <li><a href="#">Branding</a></li>
          </ul>
        </div>
        <div class="footer-column">
          <h4>Company</h4>
          <ul>
            <li><a href="#">About</a></li>
            <li><a href="#">Work</a></li>
            <li><a href="#">Contact</a></li>
          </ul>
        </div>
        <div class="footer-column">
          <h4>Connect</h4>
          <ul>
            <li><a href="#">Instagram</a></li>
            <li><a href="#">LinkedIn</a></li>
            <li><a href="#">Twitter</a></li>
          </ul>
        </div>
      </div>
      <div class="footer-bottom">
        <p>© 2024 Apex Digital. All rights reserved.</p>
      </div>
    </div>
  </footer>

  <script>
    document.addEventListener('DOMContentLoaded', () => {
      document.body.classList.add('loaded');
      
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) entry.target.classList.add('active');
        });
      }, { threshold: 0.1 });
      
      document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
      
      const nav = document.querySelector('nav');
      window.addEventListener('scroll', () => nav?.classList.toggle('scrolled', window.scrollY > 50));
      
      document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', e => {
          e.preventDefault();
          document.querySelector(a.getAttribute('href'))?.scrollIntoView({ behavior: 'smooth' });
        });
      });
      
      const counterObs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const el = entry.target;
            const target = +el.dataset.count;
            let current = 0;
            const step = target / 50;
            const timer = setInterval(() => {
              current += step;
              el.textContent = current >= target ? target : Math.floor(current);
              if (current >= target) clearInterval(timer);
            }, 30);
            counterObs.unobserve(el);
          }
        });
      }, { threshold: 0.5 });
      
      document.querySelectorAll('[data-count]').forEach(el => counterObs.observe(el));
    });
  </script>
</body>
</html>
\`\`\`

YOUR WEBSITE MUST MATCH OR EXCEED THIS QUALITY LEVEL.`;

// ============================================================================
// INDUSTRY-SPECIFIC BRIEFS (Enhanced with better copy and sections)
// ============================================================================
const INDUSTRY_BRIEFS: Record<string, string> = {
  'restaurant': `
## 🍽️ RESTAURANT WEBSITE

**EMOTIONAL GOAL:** Mouth-watering anticipation. "I NEED to eat there."

**HERO:** Full-screen food photography with dark overlay. Elegant serif font. "Reserve a Table" button glowing warmly.

**COLOR PALETTE:** Rich burgundy (#7f1d1d), warm gold (#d97706), cream (#fefce8), charcoal text

**REQUIRED SECTIONS:**
1. Hero - Stunning food/interior + reservation CTA
2. Story - "Our Story" with atmospheric photo and passionate copy
3. Menu Highlights - 3-4 signature dishes with beautiful photos and poetic descriptions
4. Chef/Team - Photo with credentials and story
5. Gallery - 6-8 gorgeous food/ambiance photos in grid
6. Reviews - 3 testimonials with 5 stars
7. Location - Map, hours, phone prominently displayed
8. Footer - Social links, newsletter, final reservation CTA

**IMAGES:**
- Hero: https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1920&q=80
- Food: https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80
- Interior: https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80

**FONTS:** Playfair Display (headlines), Lato (body)

**COPY STYLE:** Sensual, appetizing. "Hand-crafted pasta made fresh daily" not "We serve pasta"`,

  'local-services': `
## 🔧 LOCAL SERVICES (Plumber, Electrician, HVAC, etc.)

**EMOTIONAL GOAL:** Relief and trust. "Finally, a pro I can count on."

**HERO:** Split layout - bold headline left, team/work photo right. Trust badges floating. Orange "Get Free Quote" button.

**COLOR PALETTE:** Trust blue (#1e40af), safety orange (#ea580c), clean white, professional gray

**REQUIRED SECTIONS:**
1. Hero - Value prop + trust badges (Licensed, Insured, 5★) + CTA
2. Services - 4-6 services with icons and brief descriptions
3. Why Us - 3-4 differentiators with checkmarks (24/7, Same-Day, Warranty)
4. Work Gallery - Before/After or project photos
5. Reviews - 3 testimonials with photos, names, and 5 stars
6. Service Areas - Map or list of areas served
7. Contact - Form + HUGE phone number + hours
8. Footer - License numbers, guarantees, emergency contact

**IMAGES:**
- Hero: https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=1920&q=80
- Work: https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&q=80

**FONTS:** Poppins (headlines), Inter (body)

**COPY STYLE:** Confident, reassuring. "We'll be there in 60 minutes or it's free" not "Fast service"`,

  'professional': `
## 💼 PROFESSIONAL SERVICES (Law, Consulting, Finance)

**EMOTIONAL GOAL:** "These are EXPERTS. I'm in capable hands."

**HERO:** Sophisticated gradient or modern building photo. Outcome-focused headline. "Schedule Consultation" CTA.

**COLOR PALETTE:** Navy (#1e3a5f), gold accent (#b8860b), white, charcoal

**REQUIRED SECTIONS:**
1. Hero - Outcome-focused headline + consultation CTA
2. Services - Practice areas with elegant icons
3. About - Firm story, credentials, years of experience
4. Team - Professional headshots with titles and credentials
5. Results - Case studies, numbers, outcomes achieved
6. Testimonials - Client quotes with company names
7. Contact - Multiple contact methods, office locations
8. Footer - Bar numbers, certifications, professional associations

**IMAGES:**
- Hero: https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1920&q=80
- Team: https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80
- Office: https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80

**FONTS:** Inter (clean), Libre Baskerville (elegant headlines)

**COPY STYLE:** Authoritative but approachable. Results-focused. "$50M recovered for clients" not "We help with legal matters"`,

  'health-beauty': `
## 💆 HEALTH & BEAUTY / SPA

**EMOTIONAL GOAL:** Instant calm. A visual deep breath. "I DESERVE this."

**HERO:** Serene, dreamy imagery with soft overlay. Script or elegant serif font. "Book Your Experience" CTA.

**COLOR PALETTE:** Sage green (#84a98c), blush pink (#f4a5a4), cream (#fefcf3), soft gold

**REQUIRED SECTIONS:**
1. Hero - Serene spa imagery + booking CTA
2. Services - Treatments with poetic descriptions and prices
3. About - Philosophy, why this spa is different
4. Team - Therapists with warm, professional photos
5. Gallery - Peaceful space and treatment photos
6. Testimonials - Client experiences
7. Booking - Clear packages and prices + booking CTA
8. Contact - Location, hours, parking info

**IMAGES:**
- Hero: https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=1920&q=80
- Treatment: https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&q=80
- Interior: https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?w=800&q=80

**FONTS:** Cormorant Garamond (headlines), Quicksand (body)

**COPY STYLE:** Soothing, indulgent. "Melt away tension with our signature hot stone ritual" not "We offer massages"`,

  'real-estate': `
## 🏠 REAL ESTATE

**EMOTIONAL GOAL:** "This is THE ONE." Dream home energy meets professional guidance.

**HERO:** Stunning property photo, full-width. Search box or agent value prop. "Find Your Dream Home" headline.

**COLOR PALETTE:** Navy (#1e3a5f), gold (#b8860b), white, warm gray

**REQUIRED SECTIONS:**
1. Hero - Gorgeous property image + search/CTA
2. Featured Listings - 3-4 property cards with photos, price, beds/baths
3. Agent Profile - Professional photo, bio, credentials, sold count
4. Why Choose Us - Market expertise, negotiation, local knowledge
5. Testimonials - Happy homeowner stories
6. Areas Served - Neighborhoods with brief descriptions
7. Contact - Multiple contact methods, response time promise
8. Footer - License, MLS info

**IMAGES:**
- Hero: https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920&q=80
- Property: https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80
- Agent: https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&q=80

**FONTS:** Poppins (headlines), Inter (body)

**COPY STYLE:** Aspirational yet trustworthy. "Your dream home is waiting. Let's find it together."`,

  'fitness': `
## 💪 FITNESS / GYM

**EMOTIONAL GOAL:** "This is where I become my BEST self." Raw energy and motivation.

**HERO:** High-energy workout shot. Dark background with neon accent. Bold, motivational headline. "Start Your Transformation" CTA.

**COLOR PALETTE:** Black (#0a0a0a), electric blue (#00d4ff) or lime (#84cc16), white text

**REQUIRED SECTIONS:**
1. Hero - Action shot + bold motivational headline + free trial CTA
2. Programs - Class types with descriptions and energy
3. Results - Before/after transformations, member testimonials
4. Trainers - Team with credentials and specialties
5. Facility - Gym photos showing equipment and vibe
6. Pricing - Membership options clearly displayed
7. CTA - Free trial or consultation
8. Contact - Location, hours, parking

**IMAGES:**
- Hero: https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1920&q=80
- Training: https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&q=80
- Trainer: https://images.unsplash.com/photo-1567013127542-490d757e51fc?w=600&q=80

**FONTS:** Bebas Neue or Oswald (headlines), Inter (body)

**COPY STYLE:** Motivational, challenging. "Your strongest self is waiting. Let's go get it."`,

  'tech-startup': `
## 🚀 TECH STARTUP / SAAS

**EMOTIONAL GOAL:** "This will SOLVE my problem." Modern, innovative, trustworthy.

**HERO:** Abstract gradient or product screenshot. Clear value prop. "Start Free" or "Request Demo" CTA. Social proof (logos, user count).

**COLOR PALETTE:** Purple-blue gradient (#6366f1 to #8b5cf6), dark background (#0f0f0f), white text

**REQUIRED SECTIONS:**
1. Hero - Product visual + clear value prop + CTA + social proof
2. Logos - "Trusted by" company logos
3. Features - 3-4 key benefits with icons and visuals
4. How It Works - 3 simple steps
5. Pricing - Clear tiers with feature comparison
6. Testimonials - User quotes with photos and company
7. FAQ - Common questions
8. CTA - Final conversion push with urgency

**IMAGES:**
- Use CSS gradients and abstract shapes instead of photos
- Dashboard: https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80

**FONTS:** Inter (clean), Space Grotesk (modern headlines)

**COPY STYLE:** Clear, benefit-focused. "Save 10 hours every week" not "Our software has many features"`,

  'medical': `
## ⚕️ MEDICAL / HEALTHCARE

**EMOTIONAL GOAL:** "I'm in EXPERT, caring hands." Trust, competence, compassion.

**HERO:** Clean, calming imagery. Reassuring headline about outcomes. "Book Appointment" CTA. Trust signals visible.

**COLOR PALETTE:** Calming teal (#0d9488), clean white, warm gray, soft blue

**REQUIRED SECTIONS:**
1. Hero - Reassuring message + booking CTA + trust badges
2. Services - Medical services with clear descriptions
3. Doctors - Team with credentials, education, specialties
4. Why Us - Differentiators (technology, experience, patient care)
5. Patient Stories - Testimonials about care received
6. Insurance - Accepted plans and payment options
7. Location - Office photos, map, hours, accessibility info
8. Contact - Easy appointment booking, emergency info

**IMAGES:**
- Hero: https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1920&q=80
- Doctor: https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=600&q=80
- Office: https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=800&q=80

**FONTS:** Inter (professional), Source Sans Pro (readable body)

**COPY STYLE:** Warm but professional. "Your health journey, guided by experts who care."`
};

const DEFAULT_BRIEF = `
## ✨ PROFESSIONAL WEBSITE

**EMOTIONAL GOAL:** Trust, professionalism, and value.

**HERO:** Impactful visual + clear value proposition + strong CTA

**REQUIRED SECTIONS:**
1. Hero - Value prop + CTA
2. About - Story and credentials  
3. Services - What you offer
4. Why Us - Differentiators
5. Testimonials - Social proof
6. Contact - Easy to reach out
7. Footer - Links and info

**FONTS:** Inter (versatile), Poppins (headlines)`;

// ============================================================================
// STYLE MODIFIERS (Enhanced)
// ============================================================================
const STYLE_MODIFIERS: Record<string, string> = {
  'modern': `**STYLE: MODERN** - Clean lines, geometric shapes, strategic whitespace, subtle gradients, card layouts, smooth micro-interactions`,
  'elegant': `**STYLE: ELEGANT** - Refined serif typography, generous whitespace, muted palette, gold accents, thin lines, graceful animations`,
  'bold': `**STYLE: BOLD** - Oversized typography (go MASSIVE), high contrast, strong shapes, dynamic animations, heavy shadows, maximum impact`,
  'minimal': `**STYLE: MINIMAL** - Maximum whitespace, 2-3 colors only, typography-focused, essential elements only, subtle animations`,
  'playful': `**STYLE: PLAYFUL** - Rounded corners, bright colors, bouncy animations, illustrated elements, friendly fonts, fun hovers`,
  'dark': `**STYLE: DARK PREMIUM** - Dark backgrounds (#0a0a0a), light text, glowing accents, gradient borders, glassmorphism, grain texture overlay`,
  'corporate': `**STYLE: CORPORATE** - Professional, structured, traditional grids, conservative colors (blue/gray), clear hierarchy, trust-building`
};

// ============================================================================
// COLOR PALETTES (Enhanced with RGB values)
// ============================================================================
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
// API HANDLER
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
  
  // Remove markdown code blocks
  html = html.replace(/^```html\s*\n?/i, '').replace(/\n?```\s*$/i, '');
  html = html.replace(/^```\s*\n?/, '').replace(/\n?```\s*$/, '');
  
  // Find DOCTYPE
  const doctypeIndex = html.toLowerCase().indexOf('<!doctype');
  if (doctypeIndex > 0) {
    html = html.substring(doctypeIndex);
  }
  
  // Find closing html tag
  const htmlEndIndex = html.toLowerCase().lastIndexOf('</html>');
  if (htmlEndIndex > 0) {
    html = html.substring(0, htmlEndIndex + 7);
  }
  
  return html;
}

async function generateWebsite(project: any): Promise<string> {
  const industry = (project.industry || 'other').toLowerCase().replace(/\s+/g, '-');
  const style = (project.style || 'modern').toLowerCase();
  const colorPref = project.color_preference || 'auto';
  
  const industryBrief = INDUSTRY_BRIEFS[industry] || DEFAULT_BRIEF;
  const styleModifier = STYLE_MODIFIERS[style] || STYLE_MODIFIERS['modern'];
  const colors = COLOR_PALETTES[colorPref] || COLOR_PALETTES['auto'];
  
  const moodTags = project.mood_tags || [];
  const moodDescription = moodTags.length > 0 ? `The website should feel: ${moodTags.join(', ')}.` : '';

  // Build the full system prompt with example
  const fullSystemPrompt = MASTER_SYSTEM_PROMPT + '\n\n' + EXAMPLE_WEBSITE;

  const userPrompt = `
# CREATE AN ELITE $100,000 WEBSITE

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

## COLOR PALETTE
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
2. **USE THE ANIMATIONS** - .reveal class with IntersectionObserver, hover effects, smooth transitions
3. **MOBILE RESPONSIVE** - Must look amazing on all devices with hamburger menu
4. **ALL SECTIONS** - Every section from the industry brief, fully designed
5. **REAL CONTENT** - Write compelling copy for THIS specific business, not placeholders
6. **MATCH THE EXAMPLE** - Quality must equal or exceed the example website provided

## OUTPUT

Create a website that makes the client say "HOLY SHIT, THIS IS INCREDIBLE!" and immediately want to pay.

Output ONLY the complete HTML. Start with <!DOCTYPE html>, end with </html>. No explanations, no markdown blocks.`;

  const response = await callClaude(fullSystemPrompt, userPrompt);
  return cleanHtmlResponse(response);
}

async function reviseWebsite(currentHtml: string, feedback: string, project: any): Promise<string> {
  const systemPrompt = `You are an elite web designer making revisions. 

RULES:
- Maintain all existing animations and responsive behavior
- Keep the same quality level - this is a $100,000 website
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

      return NextResponse.json({ success: true, html, message: 'Elite website generated successfully!' });
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
