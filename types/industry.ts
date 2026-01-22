/**
 * VERKTORLABS - Industry Intelligence Type Definitions
 * 
 * Core types for the industry intelligence system.
 * These types are shared across all industry data files and the API.
 */

/**
 * Main industry intelligence structure
 * Contains all research-backed data for generating websites
 */
export interface IndustryIntelligence {
  /** URL-friendly identifier (e.g., 'fashion-clothing', 'saas-startup') */
  id: string;
  
  /** Human-readable industry name */
  name: string;
  
  /** Category grouping for organization */
  category: string;
  
  /** Top brands researched for this industry's patterns */
  topBrands: string[];
  
  /** Customer psychology insights */
  psychology: {
    /** What customers need to see on the website to convert */
    customerNeeds: string[];
    /** Credibility signals that build trust */
    trustFactors: string[];
    /** Emotional motivators that drive action */
    emotionalTriggers: string[];
  };
  
  /** Page sections with implementation guidance */
  sections: Section[];
  
  /** Complete design system */
  design: {
    /** Description of the color strategy */
    colorDescription: string;
    /** Exact color values */
    colors: ColorPalette;
    /** Typography strategy description */
    typography: string;
    /** Font family recommendations */
    fonts: FontPairing;
    /** Image style guidelines */
    imageStyle: string;
    /** Spacing philosophy */
    spacing: string;
    /** Overall mood/feeling to convey */
    mood: string;
  };
  
  /** Copywriting guidelines */
  copywriting: {
    /** Tone of voice description */
    tone: string;
    /** Example headlines that work for this industry */
    exampleHeadlines: string[];
    /** Example CTAs that convert */
    exampleCTAs: string[];
    /** Overused phrases to avoid */
    avoidPhrases: string[];
  };
  
  /** Curated image URLs from Unsplash */
  images: {
    /** Hero/banner images */
    hero: string[];
    /** Product/service images */
    products: string[];
    /** Lifestyle/context images */
    lifestyle: string[];
    /** About/team images */
    about: string[];
  };
}

/**
 * Page section definition
 */
export interface Section {
  /** Section identifier */
  id: string;
  /** Human-readable section name */
  name: string;
  /** Whether this section is required for the industry */
  required: boolean;
  /** Why this section matters for conversion */
  purpose: string;
  /** Key elements to include in this section */
  keyElements: string[];
}

/**
 * Color palette for design system
 */
export interface ColorPalette {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
}

/**
 * Font pairing for typography
 */
export interface FontPairing {
  heading: string;
  body: string;
}

/**
 * Design system subset for quick access
 */
export interface DesignSystem {
  colors: ColorPalette;
  fonts: FontPairing;
  mood: string;
}

/**
 * Database row structure for industries table
 */
export interface IndustryRow {
  id: string;
  name: string;
  category: string;
  intelligence: IndustryIntelligence;
  created_at?: string;
  updated_at?: string;
}

/**
 * Project information for website generation
 */
export interface Project {
  id: string;
  name: string;
  industry: string;
  businessName: string;
  businessDescription?: string;
  targetAudience?: string;
  uniqueSellingPoints?: string[];
  location?: string;
  contactInfo?: {
    phone?: string;
    email?: string;
    address?: string;
  };
}

/**
 * Website generation request
 */
export interface GenerateRequest {
  project: Project;
  pageType?: PageType;
  customInstructions?: string;
  customizations?: {
    /** Sections to exclude from generation */
    excludeSections?: string[];
    /** Override default colors */
    colorOverride?: Partial<ColorPalette>;
    /** Override default fonts */
    fontOverride?: Partial<FontPairing>;
  };
}

/**
 * Website generation response
 */
export interface GenerateResponse {
  success: boolean;
  industry: string;
  industryName: string;
  usedFallback: boolean;
  generatedCode: string;
  metadata: {
    model: string;
    pageType: string;
    sectionsIncluded: string[];
    designSystem: DesignSystem;
  };
}

/**
 * Supported page types for generation
 */
export type PageType = 'landing' | 'homepage' | 'about' | 'services' | 'contact' | 'product';

/**
 * Industry category types
 */
export type IndustryCategory = 
  | 'e-commerce' 
  | 'ecommerce'
  | 'local-services' 
  | 'professional-services'
  | 'professional'
  | 'healthcare'
  | 'tech-creative'
  | 'tech'
  | 'creative'
  | 'hospitality'
  | 'legal'
  | 'financial';

/**
 * Fallback intelligence for unknown industries
 */
export const fallbackIntelligence: IndustryIntelligence = {
  id: 'general',
  name: 'General Business',
  category: 'general',
  topBrands: ['Apple', 'Stripe', 'Airbnb', 'Notion'],
  psychology: {
    customerNeeds: [
      'Clear understanding of products/services offered',
      'Easy way to contact or get started',
      'Social proof and credibility indicators',
      'Transparent pricing information',
      'Professional, trustworthy presentation',
    ],
    trustFactors: [
      'Customer testimonials and reviews',
      'Professional website design',
      'Clear contact information',
      'About page with team/founder info',
      'Security and privacy indicators',
    ],
    emotionalTriggers: [
      'Confidence in making the right choice',
      'Relief from solving a problem',
      'Excitement about improvement',
      'Trust in the brand',
      'Connection with company values',
    ],
  },
  sections: [
    {
      id: 'hero',
      name: 'Hero Section',
      required: true,
      purpose: 'Communicate value proposition immediately',
      keyElements: ['Headline', 'Subheadline', 'Primary CTA', 'Supporting visual'],
    },
    {
      id: 'features',
      name: 'Features/Services',
      required: true,
      purpose: 'Explain what you offer',
      keyElements: ['Feature list', 'Icons', 'Brief descriptions'],
    },
    {
      id: 'about',
      name: 'About Section',
      required: true,
      purpose: 'Build trust and connection',
      keyElements: ['Company story', 'Mission', 'Team'],
    },
    {
      id: 'testimonials',
      name: 'Testimonials',
      required: true,
      purpose: 'Social proof',
      keyElements: ['Customer quotes', 'Names', 'Photos'],
    },
    {
      id: 'cta',
      name: 'Call to Action',
      required: true,
      purpose: 'Convert visitors',
      keyElements: ['Clear CTA', 'Value reminder', 'Easy action'],
    },
    {
      id: 'contact',
      name: 'Contact',
      required: true,
      purpose: 'Enable communication',
      keyElements: ['Form', 'Email', 'Phone', 'Location'],
    },
  ],
  design: {
    colorDescription: 'Clean, professional palette with strategic accent colors',
    colors: {
      primary: '#1a1a1a',
      secondary: '#6366f1',
      accent: '#10b981',
      background: '#ffffff',
    },
    typography: 'Modern sans-serif for clarity and professionalism',
    fonts: {
      heading: 'Inter',
      body: 'Inter',
    },
    imageStyle: 'Professional, high-quality photography that reflects the brand',
    spacing: 'Generous whitespace for readability',
    mood: 'Professional, trustworthy, modern, approachable',
  },
  copywriting: {
    tone: 'Clear, confident, and customer-focused',
    exampleHeadlines: [
      'The better way to [solve problem]',
      'Built for [target audience]',
      'Transform your [area of improvement]',
    ],
    exampleCTAs: [
      'Get Started',
      'Learn More',
      'Contact Us',
      'Try Free',
    ],
    avoidPhrases: [
      'Best in class',
      'Revolutionary',
      'Synergy',
      'Leverage',
    ],
  },
  images: {
    hero: [
      'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1920',
      'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=1920',
    ],
    products: [
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800',
    ],
    lifestyle: [
      'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200',
    ],
    about: [
      'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=1200',
    ],
  },
};
