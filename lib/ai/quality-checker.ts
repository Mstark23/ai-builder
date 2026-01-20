// /lib/ai/quality-checker.ts
// Automated quality scoring system for generated websites

export interface QualityScore {
  overall: number; // 0-100
  breakdown: {
    structure: number;
    design: number;
    content: number;
    functionality: number;
    performance: number;
    seo: number;
    accessibility: number;
  };
  issues: QualityIssue[];
  suggestions: string[];
  passed: boolean; // true if overall >= 70
}

export interface QualityIssue {
  category: string;
  severity: 'critical' | 'warning' | 'info';
  message: string;
  fix?: string;
}

// ============================================================================
// MAIN QUALITY CHECK FUNCTION
// ============================================================================

export function checkWebsiteQuality(html: string): QualityScore {
  const issues: QualityIssue[] = [];
  const suggestions: string[] = [];
  
  // Run all checks
  const structureScore = checkStructure(html, issues);
  const designScore = checkDesign(html, issues, suggestions);
  const contentScore = checkContent(html, issues, suggestions);
  const functionalityScore = checkFunctionality(html, issues);
  const performanceScore = checkPerformance(html, issues, suggestions);
  const seoScore = checkSEO(html, issues, suggestions);
  const accessibilityScore = checkAccessibility(html, issues, suggestions);
  
  // Calculate weighted overall score
  const overall = Math.round(
    structureScore * 0.15 +
    designScore * 0.25 +
    contentScore * 0.20 +
    functionalityScore * 0.15 +
    performanceScore * 0.10 +
    seoScore * 0.10 +
    accessibilityScore * 0.05
  );
  
  return {
    overall,
    breakdown: {
      structure: structureScore,
      design: designScore,
      content: contentScore,
      functionality: functionalityScore,
      performance: performanceScore,
      seo: seoScore,
      accessibility: accessibilityScore,
    },
    issues,
    suggestions,
    passed: overall >= 70,
  };
}

// ============================================================================
// STRUCTURE CHECKS (15%)
// ============================================================================

function checkStructure(html: string, issues: QualityIssue[]): number {
  let score = 100;
  
  // Check for valid HTML document
  if (!html.includes('<!DOCTYPE html>')) {
    issues.push({
      category: 'structure',
      severity: 'critical',
      message: 'Missing DOCTYPE declaration',
      fix: 'Add <!DOCTYPE html> at the beginning',
    });
    score -= 20;
  }
  
  if (!html.includes('<html')) {
    issues.push({
      category: 'structure',
      severity: 'critical',
      message: 'Missing <html> tag',
    });
    score -= 20;
  }
  
  if (!html.includes('<head>') || !html.includes('</head>')) {
    issues.push({
      category: 'structure',
      severity: 'critical',
      message: 'Missing <head> section',
    });
    score -= 15;
  }
  
  if (!html.includes('<body') || !html.includes('</body>')) {
    issues.push({
      category: 'structure',
      severity: 'critical',
      message: 'Missing <body> section',
    });
    score -= 15;
  }
  
  // Check for required sections
  const requiredSections = [
    { tag: '<nav', name: 'Navigation' },
    { tag: '<header', name: 'Header', alt: 'class="hero"' },
    { tag: '<footer', name: 'Footer' },
  ];
  
  requiredSections.forEach(section => {
    if (!html.includes(section.tag) && (!section.alt || !html.includes(section.alt))) {
      issues.push({
        category: 'structure',
        severity: 'warning',
        message: `Missing ${section.name} section`,
      });
      score -= 5;
    }
  });
  
  // Check for multiple sections
  const sectionCount = (html.match(/<section/g) || []).length;
  if (sectionCount < 4) {
    issues.push({
      category: 'structure',
      severity: 'warning',
      message: `Only ${sectionCount} sections found. Premium websites typically have 6-10 sections.`,
    });
    score -= 10;
  }
  
  // Check for <style> tag
  if (!html.includes('<style>') && !html.includes('<style ')) {
    issues.push({
      category: 'structure',
      severity: 'critical',
      message: 'Missing <style> tag - no CSS found',
    });
    score -= 20;
  }
  
  // Check for <script> tag
  if (!html.includes('<script>') && !html.includes('<script ')) {
    issues.push({
      category: 'structure',
      severity: 'warning',
      message: 'Missing <script> tag - no JavaScript found',
    });
    score -= 10;
  }
  
  return Math.max(0, score);
}

// ============================================================================
// DESIGN CHECKS (25%)
// ============================================================================

function checkDesign(html: string, issues: QualityIssue[], suggestions: string[]): number {
  let score = 100;
  
  // Check for CSS custom properties (variables)
  if (!html.includes(':root') || !html.includes('--')) {
    issues.push({
      category: 'design',
      severity: 'warning',
      message: 'No CSS custom properties found. Premium sites use design tokens.',
    });
    score -= 10;
  }
  
  // Check for color palette
  const hasColorVariables = html.includes('--primary') || html.includes('--color');
  if (!hasColorVariables) {
    issues.push({
      category: 'design',
      severity: 'warning',
      message: 'No color variables defined. Site may lack consistent branding.',
    });
    score -= 10;
  }
  
  // Check for typography imports (Google Fonts)
  if (!html.includes('fonts.googleapis.com') && !html.includes('@font-face')) {
    issues.push({
      category: 'design',
      severity: 'warning',
      message: 'No custom fonts imported. Using system fonts only.',
    });
    score -= 5;
  }
  
  // Check for responsive design
  if (!html.includes('@media')) {
    issues.push({
      category: 'design',
      severity: 'critical',
      message: 'No media queries found. Site is not responsive.',
    });
    score -= 20;
  } else {
    // Check for mobile breakpoint
    if (!html.includes('max-width: 768px') && !html.includes('max-width:768px')) {
      issues.push({
        category: 'design',
        severity: 'warning',
        message: 'No mobile breakpoint (768px) found.',
      });
      score -= 5;
    }
  }
  
  // Check for modern CSS features (premium indicators)
  const premiumFeatures = [
    { feature: 'gradient', name: 'Gradients' },
    { feature: 'border-radius', name: 'Rounded corners' },
    { feature: 'box-shadow', name: 'Shadows' },
    { feature: 'transition', name: 'Transitions' },
    { feature: 'transform', name: 'Transforms' },
  ];
  
  let premiumCount = 0;
  premiumFeatures.forEach(pf => {
    if (html.includes(pf.feature)) premiumCount++;
  });
  
  if (premiumCount < 3) {
    issues.push({
      category: 'design',
      severity: 'warning',
      message: `Only ${premiumCount}/5 premium CSS features used.`,
    });
    score -= (5 - premiumCount) * 3;
  }
  
  // Check for backdrop-filter (glassmorphism)
  if (html.includes('backdrop-filter')) {
    suggestions.push('✓ Glassmorphism effect detected - premium touch!');
  }
  
  // Check for clamp() for responsive typography
  if (html.includes('clamp(')) {
    suggestions.push('✓ Fluid typography with clamp() detected.');
  } else {
    issues.push({
      category: 'design',
      severity: 'info',
      message: 'Consider using clamp() for fluid typography.',
    });
  }
  
  // Check for animations
  if (!html.includes('@keyframes') && !html.includes('animation:')) {
    issues.push({
      category: 'design',
      severity: 'warning',
      message: 'No animations defined. Premium sites have subtle animations.',
    });
    score -= 10;
  }
  
  // Check for hover states
  if (!html.includes(':hover')) {
    issues.push({
      category: 'design',
      severity: 'warning',
      message: 'No hover states found. Interactive elements need feedback.',
    });
    score -= 10;
  }
  
  return Math.max(0, score);
}

// ============================================================================
// CONTENT CHECKS (20%)
// ============================================================================

function checkContent(html: string, issues: QualityIssue[], suggestions: string[]): number {
  let score = 100;
  
  // Check for headings
  const h1Count = (html.match(/<h1/g) || []).length;
  const h2Count = (html.match(/<h2/g) || []).length;
  
  if (h1Count === 0) {
    issues.push({
      category: 'content',
      severity: 'critical',
      message: 'No H1 heading found.',
    });
    score -= 15;
  } else if (h1Count > 1) {
    issues.push({
      category: 'content',
      severity: 'warning',
      message: `Multiple H1 tags (${h1Count}) found. Should only have one.`,
    });
    score -= 5;
  }
  
  if (h2Count < 3) {
    issues.push({
      category: 'content',
      severity: 'warning',
      message: `Only ${h2Count} H2 headings. Premium sites have clear section titles.`,
    });
    score -= 5;
  }
  
  // Check for images
  const imgCount = (html.match(/<img/g) || []).length;
  if (imgCount === 0) {
    issues.push({
      category: 'content',
      severity: 'warning',
      message: 'No images found. Visuals are essential for engagement.',
    });
    score -= 15;
  } else if (imgCount < 3) {
    issues.push({
      category: 'content',
      severity: 'info',
      message: `Only ${imgCount} images. Consider adding more visuals.`,
    });
    score -= 5;
  }
  
  // Check for CTAs
  const buttonCount = (html.match(/<button/g) || []).length;
  const ctaLinks = (html.match(/class="[^"]*btn[^"]*"/g) || []).length;
  
  if (buttonCount + ctaLinks < 2) {
    issues.push({
      category: 'content',
      severity: 'warning',
      message: 'Few CTAs found. Premium sites have clear calls-to-action.',
    });
    score -= 10;
  }
  
  // Check for contact information
  const hasEmail = html.includes('mailto:') || html.includes('@');
  const hasPhone = html.includes('tel:') || /\(\d{3}\)|\d{3}-\d{3}-\d{4}/.test(html);
  
  if (!hasEmail && !hasPhone) {
    issues.push({
      category: 'content',
      severity: 'warning',
      message: 'No contact information (email/phone) found.',
    });
    score -= 10;
  }
  
  // Check for social proof
  const hasSocialProof = 
    html.includes('testimonial') || 
    html.includes('review') || 
    html.includes('★') ||
    html.includes('star') ||
    /\d+\+?\s*(customers|clients|users|projects)/i.test(html);
  
  if (!hasSocialProof) {
    issues.push({
      category: 'content',
      severity: 'info',
      message: 'No social proof detected. Consider adding testimonials or stats.',
    });
    score -= 5;
  } else {
    suggestions.push('✓ Social proof elements detected.');
  }
  
  // Check for form
  if (!html.includes('<form')) {
    issues.push({
      category: 'content',
      severity: 'warning',
      message: 'No contact form found.',
    });
    score -= 10;
  }
  
  // Check content length (rough estimate)
  const textContent = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  const wordCount = textContent.split(' ').length;
  
  if (wordCount < 200) {
    issues.push({
      category: 'content',
      severity: 'warning',
      message: `Content seems sparse (~${wordCount} words). Premium sites have rich content.`,
    });
    score -= 10;
  }
  
  return Math.max(0, score);
}

// ============================================================================
// FUNCTIONALITY CHECKS (15%)
// ============================================================================

function checkFunctionality(html: string, issues: QualityIssue[]): number {
  let score = 100;
  
  // Check for JavaScript
  if (!html.includes('<script')) {
    issues.push({
      category: 'functionality',
      severity: 'warning',
      message: 'No JavaScript found. Site may lack interactivity.',
    });
    score -= 20;
    return Math.max(0, score);
  }
  
  // Check for scroll reveal / intersection observer
  if (!html.includes('IntersectionObserver')) {
    issues.push({
      category: 'functionality',
      severity: 'info',
      message: 'No scroll reveal animations (IntersectionObserver).',
    });
    score -= 10;
  }
  
  // Check for smooth scrolling
  if (!html.includes('scroll-behavior: smooth') && !html.includes('scrollTo')) {
    issues.push({
      category: 'functionality',
      severity: 'info',
      message: 'No smooth scrolling implemented.',
    });
    score -= 5;
  }
  
  // Check for mobile menu functionality
  if (html.includes('menu-toggle') || html.includes('mobile-menu') || html.includes('nav-toggle')) {
    // Good - has mobile menu
  } else if (html.includes('@media') && html.includes('nav')) {
    issues.push({
      category: 'functionality',
      severity: 'info',
      message: 'Mobile menu toggle may be missing.',
    });
    score -= 5;
  }
  
  // Check for form handling
  if (html.includes('<form')) {
    if (!html.includes('addEventListener') && !html.includes('onsubmit')) {
      issues.push({
        category: 'functionality',
        severity: 'warning',
        message: 'Form has no submit handler.',
      });
      score -= 10;
    }
  }
  
  // Check for navbar scroll effect
  if (!html.includes('scroll') || !html.includes('classList')) {
    issues.push({
      category: 'functionality',
      severity: 'info',
      message: 'No navbar scroll effect detected.',
    });
    score -= 5;
  }
  
  // Check for animated counters
  if (html.includes('data-count') || html.includes('counter')) {
    // Good - has counters
  }
  
  return Math.max(0, score);
}

// ============================================================================
// PERFORMANCE CHECKS (10%)
// ============================================================================

function checkPerformance(html: string, issues: QualityIssue[], suggestions: string[]): number {
  let score = 100;
  
  // Check HTML size
  const sizeKB = new Blob([html]).size / 1024;
  
  if (sizeKB > 500) {
    issues.push({
      category: 'performance',
      severity: 'warning',
      message: `HTML is ${sizeKB.toFixed(0)}KB. Consider optimizing.`,
    });
    score -= 15;
  } else if (sizeKB > 300) {
    issues.push({
      category: 'performance',
      severity: 'info',
      message: `HTML is ${sizeKB.toFixed(0)}KB. Acceptable but could be smaller.`,
    });
    score -= 5;
  }
  
  // Check for lazy loading on images
  if (html.includes('<img') && !html.includes('loading="lazy"')) {
    issues.push({
      category: 'performance',
      severity: 'info',
      message: 'Images don\'t have lazy loading. Add loading="lazy".',
    });
    score -= 5;
  }
  
  // Check for prefers-reduced-motion
  if (!html.includes('prefers-reduced-motion')) {
    issues.push({
      category: 'performance',
      severity: 'info',
      message: 'No prefers-reduced-motion support for accessibility.',
    });
    score -= 5;
  }
  
  // Check for external resources
  const externalCount = (html.match(/https?:\/\//g) || []).length;
  if (externalCount > 20) {
    issues.push({
      category: 'performance',
      severity: 'warning',
      message: `${externalCount} external resources. May slow page load.`,
    });
    score -= 10;
  }
  
  // Check for font-display: swap
  if (html.includes('fonts.googleapis.com') && !html.includes('display=swap')) {
    issues.push({
      category: 'performance',
      severity: 'info',
      message: 'Google Fonts missing display=swap parameter.',
    });
    score -= 5;
  }
  
  return Math.max(0, score);
}

// ============================================================================
// SEO CHECKS (10%)
// ============================================================================

function checkSEO(html: string, issues: QualityIssue[], suggestions: string[]): number {
  let score = 100;
  
  // Check for title tag
  if (!html.includes('<title>') || html.includes('<title></title>')) {
    issues.push({
      category: 'seo',
      severity: 'critical',
      message: 'Missing or empty <title> tag.',
    });
    score -= 20;
  }
  
  // Check for meta description
  if (!html.includes('name="description"')) {
    issues.push({
      category: 'seo',
      severity: 'warning',
      message: 'Missing meta description.',
    });
    score -= 15;
  }
  
  // Check for viewport meta
  if (!html.includes('name="viewport"')) {
    issues.push({
      category: 'seo',
      severity: 'critical',
      message: 'Missing viewport meta tag. Essential for mobile.',
    });
    score -= 15;
  }
  
  // Check for charset
  if (!html.includes('charset') && !html.includes('UTF-8')) {
    issues.push({
      category: 'seo',
      severity: 'warning',
      message: 'Missing charset declaration.',
    });
    score -= 5;
  }
  
  // Check for semantic HTML
  const semanticTags = ['<header', '<main', '<footer', '<article', '<section', '<nav'];
  let semanticCount = 0;
  semanticTags.forEach(tag => {
    if (html.includes(tag)) semanticCount++;
  });
  
  if (semanticCount < 3) {
    issues.push({
      category: 'seo',
      severity: 'info',
      message: 'Limited semantic HTML. Use <header>, <main>, <footer>, etc.',
    });
    score -= 10;
  }
  
  // Check for alt text on images
  const imgTags = html.match(/<img[^>]+>/g) || [];
  const imgWithoutAlt = imgTags.filter(img => !img.includes('alt=')).length;
  
  if (imgWithoutAlt > 0) {
    issues.push({
      category: 'seo',
      severity: 'warning',
      message: `${imgWithoutAlt} image(s) missing alt text.`,
    });
    score -= imgWithoutAlt * 3;
  }
  
  // Check for Open Graph tags
  if (html.includes('og:title') || html.includes('og:description')) {
    suggestions.push('✓ Open Graph meta tags detected.');
  } else {
    issues.push({
      category: 'seo',
      severity: 'info',
      message: 'No Open Graph tags for social sharing.',
    });
    score -= 5;
  }
  
  return Math.max(0, score);
}

// ============================================================================
// ACCESSIBILITY CHECKS (5%)
// ============================================================================

function checkAccessibility(html: string, issues: QualityIssue[], suggestions: string[]): number {
  let score = 100;
  
  // Check for lang attribute
  if (!html.includes('lang="')) {
    issues.push({
      category: 'accessibility',
      severity: 'warning',
      message: 'Missing lang attribute on <html> tag.',
    });
    score -= 15;
  }
  
  // Check for skip link
  if (html.includes('skip') && html.includes('#main')) {
    suggestions.push('✓ Skip to main content link detected.');
  }
  
  // Check for focus styles
  if (!html.includes(':focus') && !html.includes(':focus-visible')) {
    issues.push({
      category: 'accessibility',
      severity: 'warning',
      message: 'No focus styles defined. Keyboard users need visible focus.',
    });
    score -= 15;
  }
  
  // Check for aria-labels on interactive elements
  const ariaCount = (html.match(/aria-label/g) || []).length;
  if (ariaCount === 0) {
    issues.push({
      category: 'accessibility',
      severity: 'info',
      message: 'No aria-labels found. Add to icon-only buttons.',
    });
    score -= 10;
  }
  
  // Check for button elements (vs div onclick)
  if (html.includes('onclick') && !html.includes('<button')) {
    issues.push({
      category: 'accessibility',
      severity: 'warning',
      message: 'Using onclick without <button>. Use semantic elements.',
    });
    score -= 10;
  }
  
  // Check color contrast hint (can't fully check without parsing)
  if (html.includes('color: #fff') || html.includes('color: white')) {
    // Likely has light text, should check background
  }
  
  return Math.max(0, score);
}

// ============================================================================
// QUICK QUALITY CHECK (for real-time feedback)
// ============================================================================

export function quickQualityCheck(html: string): { score: number; status: 'excellent' | 'good' | 'fair' | 'poor'; criticalIssues: string[] } {
  const criticalIssues: string[] = [];
  let score = 100;
  
  // Critical checks only
  if (!html.includes('<!DOCTYPE html>')) {
    criticalIssues.push('Missing DOCTYPE');
    score -= 15;
  }
  
  if (!html.includes('<style')) {
    criticalIssues.push('Missing CSS');
    score -= 20;
  }
  
  if (!html.includes('@media')) {
    criticalIssues.push('Not responsive');
    score -= 20;
  }
  
  if (!html.includes('<nav')) {
    criticalIssues.push('Missing navigation');
    score -= 10;
  }
  
  if (!html.includes('<footer')) {
    criticalIssues.push('Missing footer');
    score -= 10;
  }
  
  const sectionCount = (html.match(/<section/g) || []).length;
  if (sectionCount < 4) {
    criticalIssues.push(`Only ${sectionCount} sections`);
    score -= 15;
  }
  
  if (!html.includes('<form')) {
    criticalIssues.push('No contact form');
    score -= 10;
  }
  
  let status: 'excellent' | 'good' | 'fair' | 'poor';
  if (score >= 90) status = 'excellent';
  else if (score >= 70) status = 'good';
  else if (score >= 50) status = 'fair';
  else status = 'poor';
  
  return { score: Math.max(0, score), status, criticalIssues };
}

// ============================================================================
// GENERATE QUALITY REPORT
// ============================================================================

export function generateQualityReport(result: QualityScore): string {
  const { overall, breakdown, issues, suggestions, passed } = result;
  
  let report = `
# Website Quality Report

## Overall Score: ${overall}/100 ${passed ? '✅ PASSED' : '❌ NEEDS IMPROVEMENT'}

### Breakdown
| Category | Score |
|----------|-------|
| Structure | ${breakdown.structure}/100 |
| Design | ${breakdown.design}/100 |
| Content | ${breakdown.content}/100 |
| Functionality | ${breakdown.functionality}/100 |
| Performance | ${breakdown.performance}/100 |
| SEO | ${breakdown.seo}/100 |
| Accessibility | ${breakdown.accessibility}/100 |

`;

  // Critical issues
  const criticalIssues = issues.filter(i => i.severity === 'critical');
  if (criticalIssues.length > 0) {
    report += `### 🚨 Critical Issues (${criticalIssues.length})\n`;
    criticalIssues.forEach(issue => {
      report += `- **${issue.category}**: ${issue.message}${issue.fix ? ` → ${issue.fix}` : ''}\n`;
    });
    report += '\n';
  }

  // Warnings
  const warnings = issues.filter(i => i.severity === 'warning');
  if (warnings.length > 0) {
    report += `### ⚠️ Warnings (${warnings.length})\n`;
    warnings.forEach(issue => {
      report += `- **${issue.category}**: ${issue.message}\n`;
    });
    report += '\n';
  }

  // Info
  const infos = issues.filter(i => i.severity === 'info');
  if (infos.length > 0) {
    report += `### ℹ️ Suggestions (${infos.length})\n`;
    infos.forEach(issue => {
      report += `- ${issue.message}\n`;
    });
    report += '\n';
  }

  // Positive notes
  if (suggestions.length > 0) {
    report += `### ✨ What's Working Well\n`;
    suggestions.forEach(s => {
      report += `- ${s}\n`;
    });
  }

  return report;
}
