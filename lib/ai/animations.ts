// /lib/ai/animations.ts
// Advanced animation utilities, keyframes, and motion patterns

// ============================================================================
// KEYFRAME ANIMATIONS
// ============================================================================

export const KEYFRAMES = {
  // Fade animations
  fadeIn: `
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
`,
  fadeInUp: `
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
`,
  fadeInDown: `
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
`,
  fadeInLeft: `
@keyframes fadeInLeft {
  from {
    opacity: 0;
    transform: translateX(-30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
`,
  fadeInRight: `
@keyframes fadeInRight {
  from {
    opacity: 0;
    transform: translateX(30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
`,
  fadeOut: `
@keyframes fadeOut {
  from { opacity: 1; }
  to { opacity: 0; }
}
`,

  // Scale animations
  scaleIn: `
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
`,
  scaleUp: `
@keyframes scaleUp {
  from { transform: scale(1); }
  to { transform: scale(1.05); }
}
`,
  scaleDown: `
@keyframes scaleDown {
  from { transform: scale(1); }
  to { transform: scale(0.95); }
}
`,
  popIn: `
@keyframes popIn {
  0% {
    opacity: 0;
    transform: scale(0.8);
  }
  70% {
    transform: scale(1.05);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}
`,

  // Slide animations
  slideInUp: `
@keyframes slideInUp {
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(0);
  }
}
`,
  slideInDown: `
@keyframes slideInDown {
  from {
    transform: translateY(-100%);
  }
  to {
    transform: translateY(0);
  }
}
`,
  slideInLeft: `
@keyframes slideInLeft {
  from {
    transform: translateX(-100%);
  }
  to {
    transform: translateX(0);
  }
}
`,
  slideInRight: `
@keyframes slideInRight {
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(0);
  }
}
`,

  // Float & hover animations
  float: `
@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-20px);
  }
}
`,
  floatSlow: `
@keyframes floatSlow {
  0%, 100% {
    transform: translateY(0) rotate(0deg);
  }
  25% {
    transform: translateY(-10px) rotate(1deg);
  }
  50% {
    transform: translateY(-20px) rotate(0deg);
  }
  75% {
    transform: translateY(-10px) rotate(-1deg);
  }
}
`,
  hover: `
@keyframes hover {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}
`,

  // Bounce animations
  bounce: `
@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
    animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
  }
  50% {
    transform: translateY(-25%);
    animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
  }
}
`,
  bounceIn: `
@keyframes bounceIn {
  0% {
    opacity: 0;
    transform: scale(0.3);
  }
  50% {
    transform: scale(1.05);
  }
  70% {
    transform: scale(0.9);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}
`,
  bounceOut: `
@keyframes bounceOut {
  0% {
    transform: scale(1);
  }
  25% {
    transform: scale(0.95);
  }
  50% {
    opacity: 1;
    transform: scale(1.1);
  }
  100% {
    opacity: 0;
    transform: scale(0.3);
  }
}
`,

  // Pulse & heartbeat
  pulse: `
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}
`,
  pulseScale: `
@keyframes pulseScale {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}
`,
  heartbeat: `
@keyframes heartbeat {
  0%, 100% {
    transform: scale(1);
  }
  14% {
    transform: scale(1.3);
  }
  28% {
    transform: scale(1);
  }
  42% {
    transform: scale(1.3);
  }
  70% {
    transform: scale(1);
  }
}
`,

  // Shake animations
  shake: `
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
  20%, 40%, 60%, 80% { transform: translateX(5px); }
}
`,
  shakeX: `
@keyframes shakeX {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-10px); }
  50% { transform: translateX(10px); }
  75% { transform: translateX(-10px); }
}
`,
  wiggle: `
@keyframes wiggle {
  0%, 100% { transform: rotate(0deg); }
  25% { transform: rotate(-5deg); }
  50% { transform: rotate(5deg); }
  75% { transform: rotate(-5deg); }
}
`,

  // Rotate animations
  rotate: `
@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
`,
  rotateIn: `
@keyframes rotateIn {
  from {
    opacity: 0;
    transform: rotate(-200deg);
  }
  to {
    opacity: 1;
    transform: rotate(0);
  }
}
`,
  spin: `
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
`,

  // Gradient & glow animations
  gradientShift: `
@keyframes gradientShift {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
`,
  glow: `
@keyframes glow {
  0%, 100% {
    box-shadow: 0 0 20px rgba(var(--primary-rgb), 0.4);
  }
  50% {
    box-shadow: 0 0 40px rgba(var(--primary-rgb), 0.6);
  }
}
`,
  glowPulse: `
@keyframes glowPulse {
  0%, 100% {
    box-shadow: 0 0 5px rgba(var(--primary-rgb), 0.2),
                0 0 20px rgba(var(--primary-rgb), 0.2);
  }
  50% {
    box-shadow: 0 0 10px rgba(var(--primary-rgb), 0.4),
                0 0 40px rgba(var(--primary-rgb), 0.4);
  }
}
`,

  // Blob morphing
  blobMorph: `
@keyframes blobMorph {
  0%, 100% {
    border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;
  }
  25% {
    border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%;
  }
  50% {
    border-radius: 50% 60% 30% 60% / 30% 60% 70% 40%;
  }
  75% {
    border-radius: 60% 40% 60% 30% / 70% 30% 50% 60%;
  }
}
`,
  blobFloat: `
@keyframes blobFloat {
  0%, 100% {
    transform: translate(0, 0) scale(1);
    border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;
  }
  25% {
    transform: translate(10px, -20px) scale(1.05);
    border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%;
  }
  50% {
    transform: translate(-10px, 10px) scale(0.95);
    border-radius: 50% 60% 30% 60% / 30% 60% 70% 40%;
  }
  75% {
    transform: translate(15px, 5px) scale(1.02);
    border-radius: 60% 40% 60% 30% / 70% 30% 50% 60%;
  }
}
`,

  // Typing cursor
  blink: `
@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}
`,
  typewriter: `
@keyframes typewriter {
  from { width: 0; }
  to { width: 100%; }
}
`,

  // Loading animations
  shimmer: `
@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
`,
  loading: `
@keyframes loading {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
`,
  dotPulse: `
@keyframes dotPulse {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(0.8); opacity: 0.5; }
}
`,

  // Marquee
  marquee: `
@keyframes marquee {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}
`,
  marqueeReverse: `
@keyframes marqueeReverse {
  0% { transform: translateX(-50%); }
  100% { transform: translateX(0); }
}
`,

  // Flip animations
  flipX: `
@keyframes flipX {
  0% { transform: perspective(400px) rotateX(90deg); opacity: 0; }
  40% { transform: perspective(400px) rotateX(-10deg); }
  70% { transform: perspective(400px) rotateX(10deg); }
  100% { transform: perspective(400px) rotateX(0deg); opacity: 1; }
}
`,
  flipY: `
@keyframes flipY {
  0% { transform: perspective(400px) rotateY(90deg); opacity: 0; }
  40% { transform: perspective(400px) rotateY(-10deg); }
  70% { transform: perspective(400px) rotateY(10deg); }
  100% { transform: perspective(400px) rotateY(0deg); opacity: 1; }
}
`,

  // Attention seekers
  rubberBand: `
@keyframes rubberBand {
  0% { transform: scaleX(1); }
  30% { transform: scaleX(1.25) scaleY(0.75); }
  40% { transform: scaleX(0.75) scaleY(1.25); }
  50% { transform: scaleX(1.15) scaleY(0.85); }
  65% { transform: scaleX(0.95) scaleY(1.05); }
  75% { transform: scaleX(1.05) scaleY(0.95); }
  100% { transform: scaleX(1); }
}
`,
  jello: `
@keyframes jello {
  0%, 100% { transform: none; }
  22.2% { transform: skewX(-12.5deg) skewY(-12.5deg); }
  33.3% { transform: skewX(6.25deg) skewY(6.25deg); }
  44.4% { transform: skewX(-3.125deg) skewY(-3.125deg); }
  55.5% { transform: skewX(1.5625deg) skewY(1.5625deg); }
  66.6% { transform: skewX(-0.78125deg) skewY(-0.78125deg); }
  77.7% { transform: skewX(0.390625deg) skewY(0.390625deg); }
  88.8% { transform: skewX(-0.1953125deg) skewY(-0.1953125deg); }
}
`,
  tada: `
@keyframes tada {
  0%, 100% { transform: scale(1) rotate(0); }
  10%, 20% { transform: scale(0.9) rotate(-3deg); }
  30%, 50%, 70%, 90% { transform: scale(1.1) rotate(3deg); }
  40%, 60%, 80% { transform: scale(1.1) rotate(-3deg); }
}
`,
};

// ============================================================================
// SCROLL REVEAL CLASSES
// ============================================================================

export const SCROLL_REVEAL = `
/* Base reveal styles */
.reveal {
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 0.6s ease, transform 0.6s ease;
}

.reveal.active {
  opacity: 1;
  transform: translateY(0);
}

/* Direction variants */
.reveal-left {
  opacity: 0;
  transform: translateX(-50px);
  transition: opacity 0.6s ease, transform 0.6s ease;
}

.reveal-left.active {
  opacity: 1;
  transform: translateX(0);
}

.reveal-right {
  opacity: 0;
  transform: translateX(50px);
  transition: opacity 0.6s ease, transform 0.6s ease;
}

.reveal-right.active {
  opacity: 1;
  transform: translateX(0);
}

.reveal-scale {
  opacity: 0;
  transform: scale(0.9);
  transition: opacity 0.6s ease, transform 0.6s ease;
}

.reveal-scale.active {
  opacity: 1;
  transform: scale(1);
}

.reveal-rotate {
  opacity: 0;
  transform: rotate(-10deg) translateY(30px);
  transition: opacity 0.6s ease, transform 0.6s ease;
}

.reveal-rotate.active {
  opacity: 1;
  transform: rotate(0) translateY(0);
}

/* Fade only */
.reveal-fade {
  opacity: 0;
  transition: opacity 0.8s ease;
}

.reveal-fade.active {
  opacity: 1;
}
`;

// ============================================================================
// STAGGER ANIMATIONS
// ============================================================================

export const STAGGER_ANIMATIONS = `
/* Stagger container - children animate one by one */
.stagger > * {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.5s ease, transform 0.5s ease;
}

.stagger.active > *:nth-child(1) { transition-delay: 0.0s; opacity: 1; transform: translateY(0); }
.stagger.active > *:nth-child(2) { transition-delay: 0.1s; opacity: 1; transform: translateY(0); }
.stagger.active > *:nth-child(3) { transition-delay: 0.2s; opacity: 1; transform: translateY(0); }
.stagger.active > *:nth-child(4) { transition-delay: 0.3s; opacity: 1; transform: translateY(0); }
.stagger.active > *:nth-child(5) { transition-delay: 0.4s; opacity: 1; transform: translateY(0); }
.stagger.active > *:nth-child(6) { transition-delay: 0.5s; opacity: 1; transform: translateY(0); }
.stagger.active > *:nth-child(7) { transition-delay: 0.6s; opacity: 1; transform: translateY(0); }
.stagger.active > *:nth-child(8) { transition-delay: 0.7s; opacity: 1; transform: translateY(0); }
.stagger.active > *:nth-child(9) { transition-delay: 0.8s; opacity: 1; transform: translateY(0); }
.stagger.active > *:nth-child(10) { transition-delay: 0.9s; opacity: 1; transform: translateY(0); }
.stagger.active > *:nth-child(11) { transition-delay: 1.0s; opacity: 1; transform: translateY(0); }
.stagger.active > *:nth-child(12) { transition-delay: 1.1s; opacity: 1; transform: translateY(0); }

/* Fast stagger */
.stagger-fast > * {
  opacity: 0;
  transform: translateY(15px);
  transition: opacity 0.4s ease, transform 0.4s ease;
}

.stagger-fast.active > *:nth-child(1) { transition-delay: 0.0s; opacity: 1; transform: translateY(0); }
.stagger-fast.active > *:nth-child(2) { transition-delay: 0.05s; opacity: 1; transform: translateY(0); }
.stagger-fast.active > *:nth-child(3) { transition-delay: 0.1s; opacity: 1; transform: translateY(0); }
.stagger-fast.active > *:nth-child(4) { transition-delay: 0.15s; opacity: 1; transform: translateY(0); }
.stagger-fast.active > *:nth-child(5) { transition-delay: 0.2s; opacity: 1; transform: translateY(0); }
.stagger-fast.active > *:nth-child(6) { transition-delay: 0.25s; opacity: 1; transform: translateY(0); }
.stagger-fast.active > *:nth-child(7) { transition-delay: 0.3s; opacity: 1; transform: translateY(0); }
.stagger-fast.active > *:nth-child(8) { transition-delay: 0.35s; opacity: 1; transform: translateY(0); }

/* Scale stagger */
.stagger-scale > * {
  opacity: 0;
  transform: scale(0.9);
  transition: opacity 0.5s ease, transform 0.5s ease;
}

.stagger-scale.active > *:nth-child(1) { transition-delay: 0.0s; opacity: 1; transform: scale(1); }
.stagger-scale.active > *:nth-child(2) { transition-delay: 0.1s; opacity: 1; transform: scale(1); }
.stagger-scale.active > *:nth-child(3) { transition-delay: 0.2s; opacity: 1; transform: scale(1); }
.stagger-scale.active > *:nth-child(4) { transition-delay: 0.3s; opacity: 1; transform: scale(1); }
.stagger-scale.active > *:nth-child(5) { transition-delay: 0.4s; opacity: 1; transform: scale(1); }
.stagger-scale.active > *:nth-child(6) { transition-delay: 0.5s; opacity: 1; transform: scale(1); }
`;

// ============================================================================
// ANIMATION UTILITY CLASSES
// ============================================================================

export const ANIMATION_UTILITIES = `
/* Animation utility classes */
.animate-fade-in { animation: fadeIn 0.6s ease forwards; }
.animate-fade-in-up { animation: fadeInUp 0.6s ease forwards; }
.animate-fade-in-down { animation: fadeInDown 0.6s ease forwards; }
.animate-fade-in-left { animation: fadeInLeft 0.6s ease forwards; }
.animate-fade-in-right { animation: fadeInRight 0.6s ease forwards; }
.animate-scale-in { animation: scaleIn 0.6s ease forwards; }
.animate-pop-in { animation: popIn 0.5s ease forwards; }
.animate-bounce-in { animation: bounceIn 0.8s ease forwards; }
.animate-slide-in-up { animation: slideInUp 0.5s ease forwards; }
.animate-slide-in-down { animation: slideInDown 0.5s ease forwards; }
.animate-slide-in-left { animation: slideInLeft 0.5s ease forwards; }
.animate-slide-in-right { animation: slideInRight 0.5s ease forwards; }

/* Continuous animations */
.animate-float { animation: float 3s ease-in-out infinite; }
.animate-float-slow { animation: floatSlow 6s ease-in-out infinite; }
.animate-hover { animation: hover 2s ease-in-out infinite; }
.animate-bounce { animation: bounce 1s ease-in-out infinite; }
.animate-pulse { animation: pulse 2s ease-in-out infinite; }
.animate-pulse-scale { animation: pulseScale 2s ease-in-out infinite; }
.animate-heartbeat { animation: heartbeat 1.5s ease-in-out infinite; }
.animate-spin { animation: spin 1s linear infinite; }
.animate-spin-slow { animation: spin 3s linear infinite; }
.animate-glow { animation: glow 2s ease-in-out infinite; }
.animate-glow-pulse { animation: glowPulse 2s ease-in-out infinite; }
.animate-blob { animation: blobMorph 8s ease-in-out infinite; }
.animate-gradient { animation: gradientShift 4s ease infinite; }
.animate-shimmer { animation: shimmer 2s ease-in-out infinite; }
.animate-blink { animation: blink 1s step-end infinite; }
.animate-marquee { animation: marquee 20s linear infinite; }

/* Attention seekers (use on hover or trigger) */
.animate-shake { animation: shake 0.5s ease; }
.animate-wiggle { animation: wiggle 0.5s ease; }
.animate-rubber-band { animation: rubberBand 1s ease; }
.animate-jello { animation: jello 1s ease; }
.animate-tada { animation: tada 1s ease; }

/* Animation delays */
.delay-0 { animation-delay: 0s; }
.delay-100 { animation-delay: 0.1s; }
.delay-200 { animation-delay: 0.2s; }
.delay-300 { animation-delay: 0.3s; }
.delay-400 { animation-delay: 0.4s; }
.delay-500 { animation-delay: 0.5s; }
.delay-600 { animation-delay: 0.6s; }
.delay-700 { animation-delay: 0.7s; }
.delay-800 { animation-delay: 0.8s; }
.delay-900 { animation-delay: 0.9s; }
.delay-1000 { animation-delay: 1s; }

/* Animation durations */
.duration-150 { animation-duration: 0.15s; }
.duration-200 { animation-duration: 0.2s; }
.duration-300 { animation-duration: 0.3s; }
.duration-500 { animation-duration: 0.5s; }
.duration-700 { animation-duration: 0.7s; }
.duration-1000 { animation-duration: 1s; }
.duration-2000 { animation-duration: 2s; }
.duration-3000 { animation-duration: 3s; }

/* Animation timing functions */
.ease-linear { animation-timing-function: linear; }
.ease-in { animation-timing-function: ease-in; }
.ease-out { animation-timing-function: ease-out; }
.ease-in-out { animation-timing-function: ease-in-out; }
.ease-bounce { animation-timing-function: cubic-bezier(0.68, -0.55, 0.265, 1.55); }

/* Animation play state */
.animate-paused { animation-play-state: paused; }
.animate-running { animation-play-state: running; }

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
  
  .reveal,
  .reveal-left,
  .reveal-right,
  .reveal-scale,
  .stagger > * {
    opacity: 1;
    transform: none;
  }
}
`;

// ============================================================================
// TRANSITION UTILITIES
// ============================================================================

export const TRANSITION_UTILITIES = `
/* Transition utilities */
.transition-none { transition: none; }
.transition-all { transition: all 0.3s ease; }
.transition-colors { transition: color 0.3s ease, background-color 0.3s ease, border-color 0.3s ease; }
.transition-opacity { transition: opacity 0.3s ease; }
.transition-shadow { transition: box-shadow 0.3s ease; }
.transition-transform { transition: transform 0.3s ease; }

/* Transition durations */
.transition-fast { transition-duration: 0.15s; }
.transition-normal { transition-duration: 0.3s; }
.transition-slow { transition-duration: 0.5s; }
.transition-slower { transition-duration: 0.7s; }

/* Transition timing */
.transition-ease { transition-timing-function: ease; }
.transition-ease-in { transition-timing-function: ease-in; }
.transition-ease-out { transition-timing-function: ease-out; }
.transition-ease-in-out { transition-timing-function: ease-in-out; }
.transition-bounce { transition-timing-function: cubic-bezier(0.68, -0.55, 0.265, 1.55); }
.transition-smooth { transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); }
`;

// ============================================================================
// JAVASCRIPT FOR ANIMATIONS
// ============================================================================

export const ANIMATION_JS = `
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
document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale, .reveal-rotate, .reveal-fade, .stagger, .stagger-fast, .stagger-scale').forEach(el => {
  revealObserver.observe(el);
});

// Counter animation
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
      entry.target.classList.add('counted');
      const target = parseInt(entry.target.dataset.count);
      const duration = parseInt(entry.target.dataset.duration) || 2000;
      const start = performance.now();
      
      const updateCounter = (currentTime) => {
        const elapsed = currentTime - start;
        const progress = Math.min(elapsed / duration, 1);
        const easeProgress = 1 - Math.pow(1 - progress, 3); // easeOutCubic
        const current = Math.floor(easeProgress * target);
        
        entry.target.textContent = current.toLocaleString();
        
        if (progress < 1) {
          requestAnimationFrame(updateCounter);
        } else {
          entry.target.textContent = target.toLocaleString();
        }
      };
      
      requestAnimationFrame(updateCounter);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('[data-count]').forEach(el => {
  counterObserver.observe(el);
});

// Parallax on scroll (lightweight)
const parallaxElements = document.querySelectorAll('[data-parallax]');
if (parallaxElements.length > 0) {
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    parallaxElements.forEach(el => {
      const speed = parseFloat(el.dataset.parallax) || 0.5;
      const rect = el.getBoundingClientRect();
      const inView = rect.top < window.innerHeight && rect.bottom > 0;
      
      if (inView) {
        const offset = (scrollY - el.offsetTop) * speed;
        el.style.transform = \`translateY(\${offset}px)\`;
      }
    });
  }, { passive: true });
}

// Tilt effect on hover (for cards)
document.querySelectorAll('[data-tilt]').forEach(el => {
  el.addEventListener('mousemove', (e) => {
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const tiltX = (y - centerY) / 10;
    const tiltY = (centerX - x) / 10;
    
    el.style.transform = \`perspective(1000px) rotateX(\${tiltX}deg) rotateY(\${tiltY}deg) scale(1.02)\`;
  });
  
  el.addEventListener('mouseleave', () => {
    el.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
  });
});

// Typing effect
document.querySelectorAll('[data-typing]').forEach(el => {
  const text = el.dataset.typing;
  const speed = parseInt(el.dataset.typingSpeed) || 50;
  el.textContent = '';
  let i = 0;
  
  const typeObserver = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      const typeChar = () => {
        if (i < text.length) {
          el.textContent += text.charAt(i);
          i++;
          setTimeout(typeChar, speed);
        }
      };
      typeChar();
      typeObserver.disconnect();
    }
  });
  
  typeObserver.observe(el);
});

// Magnetic button effect
document.querySelectorAll('[data-magnetic]').forEach(el => {
  el.addEventListener('mousemove', (e) => {
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    
    el.style.transform = \`translate(\${x * 0.3}px, \${y * 0.3}px)\`;
  });
  
  el.addEventListener('mouseleave', () => {
    el.style.transform = 'translate(0, 0)';
  });
});
`;

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get all keyframe animations combined
 */
export function getAllKeyframes(): string {
  return Object.values(KEYFRAMES).join('\n');
}

/**
 * Get complete animation CSS
 */
export function getFullAnimationCSS(): string {
  return [
    getAllKeyframes(),
    SCROLL_REVEAL,
    STAGGER_ANIMATIONS,
    ANIMATION_UTILITIES,
    TRANSITION_UTILITIES,
  ].join('\n');
}

/**
 * Get animation JavaScript
 */
export function getAnimationJS(): string {
  return ANIMATION_JS;
}

/**
 * Get specific keyframe by name
 */
export function getKeyframe(name: string): string | null {
  return KEYFRAMES[name as keyof typeof KEYFRAMES] || null;
}

/**
 * Get animations reference for prompts
 */
export function getAnimationsReference(): string {
  return `
## AVAILABLE ANIMATIONS

### Keyframe Animations
- Fade: fadeIn, fadeInUp, fadeInDown, fadeInLeft, fadeInRight, fadeOut
- Scale: scaleIn, scaleUp, scaleDown, popIn
- Slide: slideInUp, slideInDown, slideInLeft, slideInRight
- Float: float, floatSlow, hover
- Bounce: bounce, bounceIn, bounceOut
- Pulse: pulse, pulseScale, heartbeat
- Shake: shake, shakeX, wiggle
- Rotate: rotate, rotateIn, spin
- Gradient: gradientShift, glow, glowPulse
- Blob: blobMorph, blobFloat
- Special: shimmer, marquee, blink, typewriter
- Attention: rubberBand, jello, tada

### Scroll Reveal Classes
- .reveal - Fade up on scroll
- .reveal-left - Slide in from left
- .reveal-right - Slide in from right
- .reveal-scale - Scale up on scroll
- .reveal-rotate - Rotate in on scroll
- .reveal-fade - Fade only
- .stagger - Children animate sequentially
- .stagger-fast - Faster stagger
- .stagger-scale - Scale stagger

### Animation Utility Classes
- .animate-[name] - Apply animation (e.g., .animate-fade-in)
- .delay-[ms] - Animation delay (e.g., .delay-300)
- .duration-[ms] - Animation duration
- .ease-[type] - Timing function

### Data Attributes (JavaScript)
- data-count="100" - Animated counter
- data-parallax="0.5" - Parallax effect
- data-tilt - 3D tilt on hover
- data-typing="Hello" - Typing effect
- data-magnetic - Magnetic hover effect
`;
}

/**
 * Get recommended animations for an industry
 */
export function getRecommendedAnimations(industry: string): string[] {
  const recommendations: Record<string, string[]> = {
    'restaurant': ['fadeInUp', 'float', 'reveal', 'stagger'],
    'health-beauty': ['fadeIn', 'floatSlow', 'reveal', 'stagger-scale'],
    'professional': ['fadeInUp', 'reveal', 'stagger', 'slideInUp'],
    'fitness': ['scaleIn', 'bounce', 'reveal', 'stagger-fast', 'pulse'],
    'tech-startup': ['fadeInUp', 'popIn', 'reveal', 'stagger', 'gradientShift', 'glow'],
    'real-estate': ['fadeIn', 'slideInUp', 'reveal', 'stagger'],
    'medical': ['fadeInUp', 'reveal', 'stagger'],
    'construction': ['slideInUp', 'reveal', 'stagger', 'scaleIn'],
    'ecommerce': ['fadeInUp', 'popIn', 'reveal', 'stagger-fast'],
    'portfolio': ['fadeIn', 'scaleIn', 'reveal', 'stagger-scale', 'blob'],
    'education': ['fadeInUp', 'bounceIn', 'reveal', 'stagger', 'typewriter'],
    'local-services': ['fadeInUp', 'reveal', 'stagger', 'pulse'],
  };
  
  return recommendations[industry] || recommendations['professional'];
}
