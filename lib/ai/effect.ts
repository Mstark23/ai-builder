// /lib/ai/effects.ts
// Visual effects library - Glassmorphism, gradients, blobs, glows, textures

// ============================================================================
// GLASSMORPHISM EFFECTS
// ============================================================================

export const GLASS_EFFECTS = {
  // Standard glass card
  glassCard: `
.glass {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: var(--radius-lg);
}
`,

  // Glass card for dark backgrounds
  glassDark: `
.glass-dark {
  background: rgba(0, 0, 0, 0.25);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: var(--radius-lg);
}
`,

  // Glass card for light backgrounds
  glassLight: `
.glass-light {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.5);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border-radius: var(--radius-lg);
}
`,

  // Frosted glass with gradient border
  glassFrosted: `
.glass-frosted {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(40px);
  -webkit-backdrop-filter: blur(40px);
  border-radius: var(--radius-xl);
  position: relative;
}
.glass-frosted::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  padding: 1px;
  background: linear-gradient(135deg, rgba(255,255,255,0.2), rgba(255,255,255,0.05));
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  pointer-events: none;
}
`,

  // Glass navigation
  glassNav: `
.glass-nav {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

/* Dark theme glass nav */
.glass-nav-dark {
  background: rgba(10, 10, 10, 0.8);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}
`,
};

// ============================================================================
// GRADIENT EFFECTS
// ============================================================================

export const GRADIENT_EFFECTS = {
  // Gradient text
  gradientText: `
.gradient-text {
  background: linear-gradient(135deg, var(--primary), var(--secondary));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.gradient-text-animated {
  background: linear-gradient(90deg, var(--primary), var(--secondary), var(--accent), var(--primary));
  background-size: 300% 100%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: gradientShift 4s ease infinite;
}

@keyframes gradientShift {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}
`,

  // Gradient backgrounds
  gradientBackgrounds: `
/* Radial gradient from top */
.bg-gradient-radial {
  background: radial-gradient(ellipse at top, rgba(var(--primary-rgb), 0.15), transparent 70%);
}

/* Mesh gradient */
.bg-gradient-mesh {
  background: 
    radial-gradient(at 40% 20%, rgba(var(--primary-rgb), 0.3) 0px, transparent 50%),
    radial-gradient(at 80% 0%, rgba(var(--secondary-rgb), 0.2) 0px, transparent 50%),
    radial-gradient(at 0% 50%, rgba(var(--accent-rgb), 0.15) 0px, transparent 50%),
    radial-gradient(at 80% 50%, rgba(var(--primary-rgb), 0.1) 0px, transparent 50%),
    radial-gradient(at 0% 100%, rgba(var(--secondary-rgb), 0.2) 0px, transparent 50%);
}

/* Animated gradient background */
.bg-gradient-animated {
  background: linear-gradient(-45deg, var(--primary), var(--secondary), var(--accent), var(--primary));
  background-size: 400% 400%;
  animation: gradientBG 15s ease infinite;
}

@keyframes gradientBG {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

/* Gradient overlay for images */
.gradient-overlay {
  position: relative;
}
.gradient-overlay::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.7) 100%);
  pointer-events: none;
}

/* Gradient border */
.gradient-border {
  position: relative;
  background: var(--bg-primary);
  border-radius: var(--radius-lg);
}
.gradient-border::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  padding: 2px;
  background: linear-gradient(135deg, var(--primary), var(--secondary));
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
}
`,

  // Section dividers with gradients
  gradientDividers: `
/* Gradient line divider */
.divider-gradient {
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--primary), transparent);
  border: none;
  margin: 60px 0;
}

/* Fading edge divider */
.divider-fade {
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--border-light), transparent);
  border: none;
}
`,
};

// ============================================================================
// BLOB & SHAPE EFFECTS
// ============================================================================

export const BLOB_EFFECTS = {
  // Animated blobs
  animatedBlobs: `
.blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(60px);
  opacity: 0.5;
  animation: blobMorph 8s ease-in-out infinite;
}

.blob-primary {
  background: var(--primary);
}

.blob-secondary {
  background: var(--secondary);
}

.blob-accent {
  background: var(--accent);
}

@keyframes blobMorph {
  0%, 100% {
    border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;
    transform: rotate(0deg) scale(1);
  }
  25% {
    border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%;
  }
  50% {
    border-radius: 50% 60% 30% 60% / 30% 60% 70% 40%;
    transform: rotate(180deg) scale(1.1);
  }
  75% {
    border-radius: 60% 40% 60% 30% / 70% 30% 50% 60%;
  }
}

/* Blob container for hero sections */
.blob-container {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
  z-index: 0;
}

.blob-1 {
  width: 600px;
  height: 600px;
  top: -200px;
  right: -100px;
  animation-delay: 0s;
}

.blob-2 {
  width: 400px;
  height: 400px;
  bottom: -100px;
  left: -100px;
  animation-delay: -4s;
}

.blob-3 {
  width: 300px;
  height: 300px;
  top: 50%;
  left: 30%;
  animation-delay: -2s;
}
`,

  // Geometric shapes
  geometricShapes: `
/* Floating circles */
.shape-circle {
  position: absolute;
  border-radius: 50%;
  border: 1px solid rgba(var(--primary-rgb), 0.2);
  animation: float 6s ease-in-out infinite;
}

.shape-circle-filled {
  background: rgba(var(--primary-rgb), 0.1);
}

/* Floating squares */
.shape-square {
  position: absolute;
  border: 1px solid rgba(var(--primary-rgb), 0.2);
  border-radius: var(--radius-sm);
  animation: float 8s ease-in-out infinite;
}

/* Decorative dots grid */
.dots-pattern {
  background-image: radial-gradient(rgba(var(--primary-rgb), 0.3) 1px, transparent 1px);
  background-size: 20px 20px;
}

/* Cross pattern */
.cross-pattern {
  background-image: 
    linear-gradient(rgba(var(--primary-rgb), 0.1) 1px, transparent 1px),
    linear-gradient(90deg, rgba(var(--primary-rgb), 0.1) 1px, transparent 1px);
  background-size: 40px 40px;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0) rotate(0deg);
  }
  50% {
    transform: translateY(-20px) rotate(5deg);
  }
}
`,

  // Decorative lines
  decorativeLines: `
/* Animated line */
.line-animated {
  height: 2px;
  background: linear-gradient(90deg, var(--primary), var(--secondary));
  position: relative;
  overflow: hidden;
}

.line-animated::after {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, white, transparent);
  animation: lineShine 2s ease-in-out infinite;
}

@keyframes lineShine {
  0% { left: -100%; }
  100% { left: 100%; }
}

/* Corner decorations */
.corner-decoration {
  position: absolute;
  width: 100px;
  height: 100px;
  border: 2px solid rgba(var(--primary-rgb), 0.2);
}

.corner-decoration.top-left {
  top: 20px;
  left: 20px;
  border-right: none;
  border-bottom: none;
}

.corner-decoration.bottom-right {
  bottom: 20px;
  right: 20px;
  border-left: none;
  border-top: none;
}
`,
};

// ============================================================================
// GLOW EFFECTS
// ============================================================================

export const GLOW_EFFECTS = {
  // Button glow
  buttonGlow: `
.btn-glow {
  position: relative;
  z-index: 1;
}

.btn-glow::before {
  content: '';
  position: absolute;
  inset: -2px;
  background: linear-gradient(135deg, var(--primary), var(--secondary));
  border-radius: inherit;
  z-index: -1;
  opacity: 0;
  filter: blur(15px);
  transition: opacity 0.3s ease;
}

.btn-glow:hover::before {
  opacity: 0.7;
}

/* Pulsing glow */
.btn-glow-pulse {
  animation: glowPulse 2s ease-in-out infinite;
}

@keyframes glowPulse {
  0%, 100% {
    box-shadow: 0 0 20px rgba(var(--primary-rgb), 0.4);
  }
  50% {
    box-shadow: 0 0 40px rgba(var(--primary-rgb), 0.6);
  }
}
`,

  // Card glow on hover
  cardGlow: `
.card-glow {
  transition: box-shadow 0.3s ease, transform 0.3s ease;
}

.card-glow:hover {
  transform: translateY(-4px);
  box-shadow: 
    0 10px 40px rgba(0, 0, 0, 0.1),
    0 0 40px rgba(var(--primary-rgb), 0.15);
}

/* Colored border glow */
.card-glow-border {
  position: relative;
}

.card-glow-border::before {
  content: '';
  position: absolute;
  inset: -1px;
  background: linear-gradient(135deg, var(--primary), var(--secondary));
  border-radius: inherit;
  z-index: -1;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.card-glow-border:hover::before {
  opacity: 1;
}
`,

  // Text glow
  textGlow: `
.text-glow {
  text-shadow: 0 0 20px rgba(var(--primary-rgb), 0.5);
}

.text-glow-white {
  text-shadow: 0 0 30px rgba(255, 255, 255, 0.5);
}

.text-glow-animated {
  animation: textGlowPulse 2s ease-in-out infinite;
}

@keyframes textGlowPulse {
  0%, 100% {
    text-shadow: 0 0 20px rgba(var(--primary-rgb), 0.3);
  }
  50% {
    text-shadow: 0 0 40px rgba(var(--primary-rgb), 0.6);
  }
}
`,

  // Icon glow
  iconGlow: `
.icon-glow {
  filter: drop-shadow(0 0 10px rgba(var(--primary-rgb), 0.5));
}

.icon-glow:hover {
  filter: drop-shadow(0 0 20px rgba(var(--primary-rgb), 0.7));
}
`,
};

// ============================================================================
// TEXTURE & NOISE EFFECTS
// ============================================================================

export const TEXTURE_EFFECTS = {
  // Noise texture overlay
  noiseTexture: `
.noise-overlay {
  position: relative;
}

.noise-overlay::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
  opacity: 0.03;
  pointer-events: none;
  z-index: 1;
}
`,

  // Grain texture
  grainTexture: `
.grain-overlay::after {
  content: '';
  position: absolute;
  inset: 0;
  background: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='grain'%3E%3CfeTurbulence type='turbulence' baseFrequency='0.9' result='noise' numOctaves='3'/%3E%3CfeComposite in='SourceGraphic' in2='noise' operator='arithmetic' k1='0' k2='0.5' k3='0.5' k4='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23grain)'/%3E%3C/svg%3E");
  opacity: 0.05;
  pointer-events: none;
}
`,

  // Paper texture
  paperTexture: `
.paper-texture {
  background-color: #fafaf9;
  background-image: 
    linear-gradient(90deg, transparent 79px, #e8e4e4 79px, #e8e4e4 81px, transparent 81px),
    linear-gradient(#e8e4e4 .1em, transparent .1em);
  background-size: 100% 1.5em;
}
`,

  // Subtle grid pattern
  gridPattern: `
.grid-pattern {
  background-image: 
    linear-gradient(rgba(var(--primary-rgb), 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(var(--primary-rgb), 0.03) 1px, transparent 1px);
  background-size: 60px 60px;
}

.grid-pattern-dark {
  background-image: 
    linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
  background-size: 60px 60px;
}
`,
};

// ============================================================================
// SHADOW EFFECTS
// ============================================================================

export const SHADOW_EFFECTS = {
  // Layered shadows
  layeredShadows: `
.shadow-layered {
  box-shadow:
    0 1px 1px rgba(0,0,0,0.04),
    0 2px 2px rgba(0,0,0,0.04),
    0 4px 4px rgba(0,0,0,0.04),
    0 8px 8px rgba(0,0,0,0.04),
    0 16px 16px rgba(0,0,0,0.04);
}

.shadow-layered-lg {
  box-shadow:
    0 2px 2px rgba(0,0,0,0.03),
    0 4px 4px rgba(0,0,0,0.03),
    0 8px 8px rgba(0,0,0,0.03),
    0 16px 16px rgba(0,0,0,0.03),
    0 32px 32px rgba(0,0,0,0.03),
    0 64px 64px rgba(0,0,0,0.03);
}
`,

  // Colored shadows
  coloredShadows: `
.shadow-primary {
  box-shadow: 0 10px 40px rgba(var(--primary-rgb), 0.3);
}

.shadow-primary-lg {
  box-shadow: 0 20px 60px rgba(var(--primary-rgb), 0.4);
}

.shadow-secondary {
  box-shadow: 0 10px 40px rgba(var(--secondary-rgb), 0.3);
}
`,

  // Soft shadows
  softShadows: `
.shadow-soft {
  box-shadow: 0 20px 50px -10px rgba(0, 0, 0, 0.15);
}

.shadow-soft-lg {
  box-shadow: 0 30px 60px -15px rgba(0, 0, 0, 0.2);
}
`,

  // Inner shadows
  innerShadows: `
.shadow-inner-soft {
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.05);
}

.shadow-inner-top {
  box-shadow: inset 0 4px 8px -4px rgba(0, 0, 0, 0.1);
}
`,
};

// ============================================================================
// HOVER EFFECTS
// ============================================================================

export const HOVER_EFFECTS = {
  // Card hover effects
  cardHover: `
/* Lift effect */
.hover-lift {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}
.hover-lift:hover {
  transform: translateY(-8px);
  box-shadow: var(--shadow-xl);
}

/* Scale effect */
.hover-scale {
  transition: transform 0.3s ease;
}
.hover-scale:hover {
  transform: scale(1.03);
}

/* Border color change */
.hover-border {
  border: 1px solid var(--border-light);
  transition: border-color 0.3s ease;
}
.hover-border:hover {
  border-color: var(--primary);
}

/* Background reveal */
.hover-bg-reveal {
  position: relative;
  overflow: hidden;
}
.hover-bg-reveal::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(var(--primary-rgb), 0.05), rgba(var(--secondary-rgb), 0.05));
  opacity: 0;
  transition: opacity 0.3s ease;
}
.hover-bg-reveal:hover::before {
  opacity: 1;
}
`,

  // Image hover effects
  imageHover: `
/* Zoom effect */
.img-hover-zoom {
  overflow: hidden;
}
.img-hover-zoom img {
  transition: transform 0.5s ease;
}
.img-hover-zoom:hover img {
  transform: scale(1.1);
}

/* Overlay reveal */
.img-hover-overlay {
  position: relative;
  overflow: hidden;
}
.img-hover-overlay::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(0,0,0,0.7), transparent);
  opacity: 0;
  transition: opacity 0.3s ease;
}
.img-hover-overlay:hover::after {
  opacity: 1;
}

/* Brightness effect */
.img-hover-bright img {
  transition: filter 0.3s ease;
}
.img-hover-bright:hover img {
  filter: brightness(1.1);
}
`,

  // Link hover effects
  linkHover: `
/* Underline animation */
.link-underline {
  position: relative;
}
.link-underline::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 0;
  height: 2px;
  background: var(--primary);
  transition: width 0.3s ease;
}
.link-underline:hover::after {
  width: 100%;
}

/* Color shift */
.link-color-shift {
  transition: color 0.3s ease;
}
.link-color-shift:hover {
  color: var(--primary);
}

/* Arrow animation */
.link-arrow {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}
.link-arrow svg {
  transition: transform 0.3s ease;
}
.link-arrow:hover svg {
  transform: translateX(4px);
}
`,

  // Icon hover effects
  iconHover: `
/* Bounce */
.icon-hover-bounce:hover {
  animation: iconBounce 0.5s ease;
}

@keyframes iconBounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
}

/* Rotate */
.icon-hover-rotate {
  transition: transform 0.3s ease;
}
.icon-hover-rotate:hover {
  transform: rotate(15deg);
}

/* Scale */
.icon-hover-scale {
  transition: transform 0.3s ease;
}
.icon-hover-scale:hover {
  transform: scale(1.2);
}
`,
};

// ============================================================================
// SPECIAL EFFECTS
// ============================================================================

export const SPECIAL_EFFECTS = {
  // Spotlight effect
  spotlight: `
.spotlight {
  position: relative;
  overflow: hidden;
}
.spotlight::before {
  content: '';
  position: absolute;
  width: 200px;
  height: 200px;
  background: radial-gradient(circle, rgba(255,255,255,0.3), transparent 70%);
  opacity: 0;
  transform: translate(-50%, -50%);
  transition: opacity 0.3s ease;
  pointer-events: none;
}
.spotlight:hover::before {
  opacity: 1;
}
`,

  // Shimmer loading effect
  shimmer: `
.shimmer {
  background: linear-gradient(
    90deg,
    var(--bg-secondary) 0%,
    var(--bg-tertiary) 50%,
    var(--bg-secondary) 100%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s ease-in-out infinite;
}

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
`,

  // Parallax effect (CSS only)
  parallax: `
.parallax-container {
  perspective: 1px;
  height: 100vh;
  overflow-x: hidden;
  overflow-y: auto;
}

.parallax-layer {
  position: absolute;
  inset: 0;
}

.parallax-back {
  transform: translateZ(-1px) scale(2);
}

.parallax-front {
  transform: translateZ(0);
}
`,

  // Marquee scroll
  marquee: `
.marquee {
  overflow: hidden;
  white-space: nowrap;
}

.marquee-content {
  display: inline-block;
  animation: marquee 20s linear infinite;
}

.marquee-content:hover {
  animation-play-state: paused;
}

@keyframes marquee {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}
`,

  // Typing cursor
  typingCursor: `
.typing-cursor::after {
  content: '|';
  animation: blink 1s step-end infinite;
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}
`,

  // Number counter styling
  counterStyle: `
.counter {
  font-family: var(--font-display);
  font-weight: 800;
  font-size: clamp(48px, 8vw, 80px);
  line-height: 1;
  letter-spacing: -0.02em;
  background: linear-gradient(135deg, var(--primary), var(--secondary));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
`,
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get all effects CSS combined
 */
export function getAllEffectsCSS(): string {
  const allEffects = [
    ...Object.values(GLASS_EFFECTS),
    ...Object.values(GRADIENT_EFFECTS),
    ...Object.values(BLOB_EFFECTS),
    ...Object.values(GLOW_EFFECTS),
    ...Object.values(TEXTURE_EFFECTS),
    ...Object.values(SHADOW_EFFECTS),
    ...Object.values(HOVER_EFFECTS),
    ...Object.values(SPECIAL_EFFECTS),
  ];
  
  return allEffects.join('\n');
}

/**
 * Get effects by category
 */
export function getEffectsByCategory(category: string): string {
  switch (category) {
    case 'glass': return Object.values(GLASS_EFFECTS).join('\n');
    case 'gradient': return Object.values(GRADIENT_EFFECTS).join('\n');
    case 'blob': return Object.values(BLOB_EFFECTS).join('\n');
    case 'glow': return Object.values(GLOW_EFFECTS).join('\n');
    case 'texture': return Object.values(TEXTURE_EFFECTS).join('\n');
    case 'shadow': return Object.values(SHADOW_EFFECTS).join('\n');
    case 'hover': return Object.values(HOVER_EFFECTS).join('\n');
    case 'special': return Object.values(SPECIAL_EFFECTS).join('\n');
    default: return '';
  }
}

/**
 * Get effects reference for prompts
 */
export function getEffectsReference(): string {
  return `
## AVAILABLE VISUAL EFFECTS

### Glassmorphism
- .glass - Standard glass card with blur
- .glass-dark - Glass for dark backgrounds
- .glass-light - Glass for light backgrounds
- .glass-frosted - Frosted glass with gradient border
- .glass-nav - Glass navigation bar

### Gradients
- .gradient-text - Gradient text fill
- .gradient-text-animated - Animated gradient text
- .bg-gradient-radial - Radial gradient background
- .bg-gradient-mesh - Multi-point mesh gradient
- .bg-gradient-animated - Animated gradient background
- .gradient-border - Gradient border on cards

### Blobs & Shapes
- .blob - Animated morphing blob
- .blob-primary, .blob-secondary, .blob-accent - Colored blobs
- .shape-circle, .shape-square - Floating geometric shapes
- .dots-pattern - Dot grid pattern
- .cross-pattern - Cross grid pattern

### Glow Effects
- .btn-glow - Button with glow on hover
- .btn-glow-pulse - Pulsing glow animation
- .card-glow - Card with glow on hover
- .text-glow - Text with glow
- .icon-glow - Icon with glow

### Textures
- .noise-overlay - Subtle noise texture
- .grain-overlay - Film grain effect
- .grid-pattern - Subtle grid background

### Shadows
- .shadow-layered - Multi-layer realistic shadow
- .shadow-primary - Colored shadow matching primary
- .shadow-soft - Ultra-soft shadow

### Hover Effects
- .hover-lift - Lift card on hover
- .hover-scale - Scale up on hover
- .img-hover-zoom - Image zoom on hover
- .link-underline - Animated underline
- .icon-hover-bounce - Bounce icon on hover

### Special Effects
- .shimmer - Loading shimmer animation
- .marquee - Horizontal scroll animation
- .typing-cursor - Blinking cursor
- .counter - Styled number counter
`;
}

/**
 * Get recommended effects for an industry
 */
export function getRecommendedEffects(industry: string): string[] {
  const recommendations: Record<string, string[]> = {
    'restaurant': ['glass-dark', 'gradient-overlay', 'img-hover-zoom', 'shadow-soft'],
    'health-beauty': ['glass-light', 'gradient-text', 'hover-lift', 'shadow-layered'],
    'professional': ['shadow-layered', 'hover-border', 'link-underline', 'gradient-text'],
    'tech-startup': ['glass-frosted', 'gradient-text-animated', 'blob', 'btn-glow', 'grid-pattern'],
    'fitness': ['bg-gradient-animated', 'text-glow', 'hover-scale', 'shadow-primary'],
    'real-estate': ['img-hover-zoom', 'shadow-soft', 'hover-lift', 'gradient-overlay'],
    'ecommerce': ['hover-lift', 'img-hover-zoom', 'shadow-layered', 'shimmer'],
    'portfolio': ['glass-frosted', 'gradient-text', 'img-hover-overlay', 'blob'],
    'education': ['gradient-text', 'hover-lift', 'shadow-soft', 'counter'],
    'medical': ['shadow-soft', 'hover-border', 'glass-light', 'gradient-text'],
    'construction': ['shadow-layered', 'img-hover-zoom', 'hover-lift', 'gradient-overlay'],
    'local-services': ['shadow-soft', 'hover-lift', 'btn-glow', 'gradient-text'],
  };
  
  return recommendations[industry] || recommendations['professional'];
}
