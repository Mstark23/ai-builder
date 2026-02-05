// /lib/ai/king-forensic-profile.ts
// The complete DNA structure extracted from a King's live website
// Every single detail — nothing assumed, everything measured

// =============================================================================
// MASTER TYPE: The full forensic extraction
// =============================================================================

export interface KingForensicProfile {
  // META
  meta: {
    kingName: string;
    url: string;
    industry: string;
    extractedAt: string;
    pagesAnalyzed: string[];
    overallVibe: string; // 1-2 sentence emotional feel
  };

  // NAVIGATION
  navigation: {
    type: 'sticky' | 'fixed' | 'static' | 'transparent-to-solid';
    height: string;
    backgroundColor: string;
    backgroundOnScroll: string;
    logoPlacement: 'left' | 'center';
    logoStyle: string; // "text-only", "icon+text", "image"
    menuItems: {
      label: string;
      hasDropdown: boolean;
      children?: string[];
    }[];
    menuAlignment: 'left' | 'center' | 'right';
    ctaButton: {
      text: string;
      style: string; // "filled", "outline", "ghost"
      color: string;
      borderRadius: string;
    } | null;
    hasSearch: boolean;
    hasCartIcon: boolean;
    mobileMenuType: 'hamburger' | 'slide-in' | 'fullscreen-overlay';
    backdropBlur: boolean;
    borderBottom: string;
    padding: string;
    fontFamily: string;
    fontSize: string;
    fontWeight: string;
    letterSpacing: string;
    textTransform: string;
  };

  // HERO SECTION
  hero: {
    layout: 'full-width-image-overlay' | 'split-content-image' | 'video-background' | 'text-centered-minimal' | 'carousel-slider' | 'parallax' | 'animated-gradient' | 'product-showcase';
    height: string; // "100vh", "90vh", "80vh", etc.
    headline: {
      text: string;
      formula: string; // e.g., "Benefit + Emotional Trigger"
      fontSize: string;
      fontWeight: string;
      fontFamily: string;
      lineHeight: string;
      letterSpacing: string;
      textTransform: string;
      color: string;
      maxWidth: string;
      hasGradient: boolean;
      gradientColors: string;
    };
    subheadline: {
      text: string;
      fontSize: string;
      fontWeight: string;
      color: string;
      lineHeight: string;
      maxWidth: string;
    };
    ctaButtons: {
      text: string;
      style: 'filled' | 'outline' | 'ghost' | 'gradient';
      backgroundColor: string;
      textColor: string;
      borderRadius: string;
      padding: string;
      fontSize: string;
      fontWeight: string;
      hoverEffect: string;
      hasIcon: boolean;
      iconPosition: 'left' | 'right';
    }[];
    contentAlignment: 'left' | 'center' | 'right';
    hasOverlay: boolean;
    overlayColor: string;
    overlayOpacity: string;
    backgroundImageStyle: string; // "cover photo", "gradient", "pattern", "video"
    socialProof: {
      type: string; // "star-rating", "customer-count", "avatar-stack", "logo-strip", "trust-badges"
      text: string;
      placement: string; // "below-cta", "above-headline", "floating"
    } | null;
    decorativeElements: string[]; // "floating-shapes", "grid-pattern", "gradient-orbs"
    padding: {
      top: string;
      bottom: string;
    };
    contentGap: string; // gap between headline, subheadline, CTA
  };

  // COLOR SYSTEM
  colors: {
    primary: string;
    primaryRgb: string;
    primaryDark: string;
    primaryLight: string;
    secondary: string;
    secondaryRgb: string;
    accent: string;
    accentRgb: string;
    background: {
      main: string;
      secondary: string;
      tertiary: string;
      dark: string;
      card: string;
    };
    text: {
      primary: string;
      secondary: string;
      muted: string;
      inverse: string;
      link: string;
      linkHover: string;
    };
    border: {
      light: string;
      dark: string;
      focus: string;
    };
    gradients: {
      primary: string; // full CSS gradient string
      hero: string;
      accent: string;
      text: string;
    };
    isDarkTheme: boolean;
    selectionColor: string;
    specialColors: Record<string, string>; // any unique colors used
  };

  // TYPOGRAPHY
  typography: {
    headingFont: {
      family: string;
      weights: string[];
      googleFontsUrl: string;
      style: 'serif' | 'sans-serif' | 'display' | 'slab' | 'mono';
    };
    bodyFont: {
      family: string;
      weights: string[];
      googleFontsUrl: string;
      style: 'serif' | 'sans-serif' | 'display' | 'slab' | 'mono';
    };
    scale: {
      h1: { size: string; weight: string; lineHeight: string; letterSpacing: string; textTransform: string; };
      h2: { size: string; weight: string; lineHeight: string; letterSpacing: string; textTransform: string; };
      h3: { size: string; weight: string; lineHeight: string; letterSpacing: string; textTransform: string; };
      h4: { size: string; weight: string; lineHeight: string; letterSpacing: string; textTransform: string; };
      body: { size: string; weight: string; lineHeight: string; };
      small: { size: string; weight: string; };
      caption: { size: string; weight: string; letterSpacing: string; textTransform: string; };
    };
    sectionLabel: {
      fontSize: string;
      fontWeight: string;
      letterSpacing: string;
      textTransform: string;
      color: string;
      style: string; // "badge-pill", "simple-text", "with-line", "numbered"
    };
  };

  // PAGE STRUCTURE
  pageStructure: {
    totalPages: number;
    pages: {
      name: string;
      url: string;
      purpose: string;
      sectionsInOrder: string[];
    }[];
    singlePageSections: string[]; // ordered list for single-page sites
  };

  // SECTIONS (in exact order as they appear)
  sections: {
    name: string;
    type: string; // "services", "about", "testimonials", "pricing", "gallery", "stats", "team", "faq", "cta", "contact", "footer"
    layout: string; // detailed: "3-column-grid", "2-col-split-image-right", "centered-stack", "bento-grid"
    gridColumns: string; // "1", "2", "3", "4", "auto-fit"
    gridGap: string;
    backgroundColor: string;
    padding: {
      top: string;
      bottom: string;
    };
    containerWidth: string;
    hasAnimation: boolean;
    animationType: string;
    headerStyle: string; // "centered-with-badge", "left-aligned", "with-subtitle", "numbered"
    contentPattern: string; // detailed description of what's in this section
    specialElements: string[]; // icons, counters, progress bars, etc.
    borderTop: string;
    borderBottom: string;
  }[];

  // DESIGN SYSTEM
  designSystem: {
    containerMaxWidth: string;
    containerPadding: string;
    sectionPadding: { desktop: string; mobile: string };
    spacingScale: string; // "4px base", "8px base", etc.
    borderRadius: {
      none: string;
      small: string;
      medium: string;
      large: string;
      xl: string;
      full: string;
      buttons: string;
      cards: string;
      images: string;
      inputs: string;
      badges: string;
    };
    shadows: {
      none: string;
      sm: string;
      md: string;
      lg: string;
      xl: string;
      cardDefault: string;
      cardHover: string;
      buttonDefault: string;
      buttonHover: string;
      glow: string;
    };
    borders: {
      cardBorder: string;
      inputBorder: string;
      dividerStyle: string;
    };
    iconSystem: {
      style: 'line' | 'solid' | 'duotone' | 'custom-svg' | 'emoji' | 'none';
      library: string; // "Lucide", "Heroicons", "Font Awesome", "custom SVG", "none"
      size: string;
      color: string;
      containerStyle: string; // "circle-bg", "square-bg", "no-container", "bordered"
      containerSize: string;
      containerColor: string;
    };
    buttonStyles: {
      primary: {
        backgroundColor: string;
        textColor: string;
        border: string;
        borderRadius: string;
        padding: string;
        fontSize: string;
        fontWeight: string;
        letterSpacing: string;
        textTransform: string;
        shadow: string;
        hoverTransform: string;
        hoverShadow: string;
        hoverBg: string;
        transition: string;
      };
      secondary: {
        backgroundColor: string;
        textColor: string;
        border: string;
        borderRadius: string;
        padding: string;
        hoverEffect: string;
      };
    };
    cardStyles: {
      background: string;
      border: string;
      borderRadius: string;
      padding: string;
      shadow: string;
      hoverTransform: string;
      hoverShadow: string;
      hoverBorder: string;
      transition: string;
    };
    imageStyles: {
      borderRadius: string;
      aspectRatio: string; // "16:9", "4:3", "1:1", "free"
      objectFit: string;
      filter: string;
      hoverEffect: string;
    };
    inputStyles: {
      backgroundColor: string;
      border: string;
      borderRadius: string;
      padding: string;
      fontSize: string;
      focusBorder: string;
      focusShadow: string;
      placeholder: string;
    };
    dividerStyle: string; // "thin-line", "gradient", "none", "spacer"
  };

  // ANIMATIONS & INTERACTIONS
  animations: {
    pageLoad: string; // "fade-in-body", "none", "stagger-sections"
    scrollReveal: {
      enabled: boolean;
      type: string; // "fade-up", "fade-in", "slide-in-left", "scale"
      duration: string;
      delay: string;
      stagger: string;
      threshold: string;
    };
    hoverEffects: {
      cards: string; // "lift-shadow", "border-glow", "scale", "none"
      buttons: string; // "lift", "glow", "darken", "arrow-move"
      links: string; // "underline-grow", "color-change", "none"
      images: string; // "zoom", "overlay", "none"
    };
    specialAnimations: string[]; // "gradient-text-shift", "floating-shapes", "parallax-scroll", "counter-up", "typing-effect"
    transition: {
      default: string; // full CSS transition value
      fast: string;
      slow: string;
    };
    prefersReducedMotion: boolean; // does the site respect this?
  };

  // COPYWRITING PATTERNS
  copywriting: {
    tone: string; // "confident-luxurious", "friendly-approachable", "authoritative-trustworthy"
    headlineFormulas: {
      hero: string; // "Benefit Statement" or "Question + Promise"
      section: string; // "Action Verb + Benefit"
      card: string; // "Short noun phrase"
    };
    ctaPatterns: {
      primary: string[]; // ["Shop Now", "Get Started", "Book a Call"]
      secondary: string[]; // ["Learn More", "See How It Works"]
      style: string; // "action-verb-first", "benefit-focused", "urgency"
    };
    socialProofStyle: string; // "stats-with-labels", "avatar-stack-with-count", "logo-strip"
    exampleHeadlines: string[];
    exampleSubheadlines: string[];
    exampleCTAs: string[];
    urgencyTactics: string[];
    trustSignals: string[];
  };

  // INTEGRATIONS DETECTED
  integrations: {
    chatWidget: string | null;
    analytics: string[];
    socialProofWidgets: string[];
    paymentProviders: string[];
    newsletterService: string | null;
    reviewPlatform: string | null;
    bookingSystem: string | null;
    ecommercePlatform: string | null;
    socialMedia: string[];
    customIntegrations: string[];
  };

  // FOOTER
  footer: {
    layout: string; // "4-column-grid", "centered-minimal", "mega-footer", "split-cta-plus-links"
    columns: number;
    backgroundColor: string;
    textColor: string;
    hasNewsletter: boolean;
    newsletterStyle: string;
    hasSocialIcons: boolean;
    socialIconStyle: string;
    hasCtaSection: boolean;
    ctaText: string;
    legalLinks: string[];
    columnContent: { heading: string; links: string[] }[];
    padding: string;
    borderTop: string;
    bottomBarStyle: string;
    fontSizes: { heading: string; links: string; legal: string };
  };

  // MOBILE BEHAVIOR
  mobile: {
    breakpoints: { tablet: string; mobile: string };
    navBehavior: string; // "hamburger-slide-in", "bottom-bar", "fullscreen-overlay"
    heroChanges: string; // "stacks-vertically", "reduces-font-50%", "hides-image"
    gridBehavior: string; // "collapses-to-single-column", "2-col-to-1-col"
    hiddenOnMobile: string[];
    mobileOnlyElements: string[];
    touchOptimizations: string[];
    sectionPaddingMobile: string;
    fontSizeReductions: Record<string, string>;
  };

  // SPECIAL / UNIQUE ELEMENTS
  uniqueElements: {
    description: string;
    cssSnippet: string;
    htmlStructure: string;
  }[];
}

// =============================================================================
// CUSTOMER QUESTIONNAIRE TYPE
// =============================================================================

export interface CustomerQuestionnaire {
  businessName: string;
  industry: string;
  description: string;
  targetAudience: string;
  websiteGoal: string;
  uniqueSellingPoints: string[];
  services: string[];
  features: string[];
  contactInfo: {
    email: string;
    phone: string;
    address: string;
  };
  socialMedia?: Record<string, string>;
  testimonials?: {
    name: string;
    role: string;
    text: string;
    rating: number;
  }[];
  stats?: {
    number: string;
    label: string;
  }[];
  pricing?: {
    name: string;
    price: string;
    features: string[];
    isPopular: boolean;
  }[];
  faqs?: {
    question: string;
    answer: string;
  }[];
  customContent?: Record<string, string>;
}

// =============================================================================
// EXTRACTION REQUEST/RESPONSE TYPES
// =============================================================================

export interface ExtractionRequest {
  kingUrl: string;
  kingName: string;
  industry: string;
  additionalPages?: string[]; // extra pages to analyze
}

export interface ExtractionResponse {
  success: boolean;
  profile: KingForensicProfile | null;
  error?: string;
  tokensUsed?: number;
  extractionTime?: number;
}

// =============================================================================
// STORED KING PROFILE (for Supabase)
// =============================================================================

export interface StoredKingProfile {
  id: string;
  king_name: string;
  king_url: string;
  industry: string;
  profile_data: KingForensicProfile;
  extracted_at: string;
  updated_at: string;
  extraction_version: string;
  is_active: boolean;
}
