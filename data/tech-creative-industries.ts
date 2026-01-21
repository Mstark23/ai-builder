/**
 * VERKTORLABS Industry Intelligence - Tech, Creative & Other Industries
 * Research-based patterns from top brands in each category
 * 
 * Industries: 12
 * - SaaS Startup
 * - Developer Tools
 * - Mobile App
 * - AI/ML Startup
 * - Creative Agency
 * - Photography
 * - Videography
 * - Music/Artist
 * - Podcast
 * - Online Course
 * - Event/Wedding Planner
 * - Hotel & Hospitality
 */

import type { IndustryIntelligence } from '../types/industry';

// Re-export the type for convenience
export type { IndustryIntelligence } from '../types/industry';

export const techCreativeIndustries: IndustryIntelligence[] = [
  // ============================================
  // 1. SAAS STARTUP
  // ============================================
  {
    id: "saas-startup",
    name: "SaaS Startup",
    category: "tech",
    
    topBrands: ["Notion", "Linear", "Vercel", "Stripe", "Figma", "Slack"],
    
    psychology: {
      customerNeeds: [
        "Understand the product quickly without jargon",
        "See how it solves their specific pain point",
        "Trust the company with their data and workflow",
        "Know pricing before committing time to explore",
        "See social proof from companies like theirs",
        "Easy path to try before buying"
      ],
      trustFactors: [
        "Logos of recognizable companies using the product",
        "Clear, transparent pricing",
        "Security badges and compliance certifications",
        "Active community or user base numbers",
        "Detailed documentation availability",
        "Responsive, modern design signals competence"
      ],
      emotionalTriggers: [
        "Relief from current tool frustration",
        "Excitement about increased productivity",
        "Fear of falling behind competitors",
        "Desire for elegance and simplicity",
        "Pride in using cutting-edge tools",
        "Confidence in making a smart choice"
      ]
    },
    
    sections: [
      {
        id: "hero",
        name: "Hero Section",
        required: true,
        purpose: "Communicate value proposition in 5 seconds or less",
        keyElements: [
          "One-line value proposition (what it does + benefit)",
          "Supporting subheadline with specifics",
          "Primary CTA (Start free / Get started)",
          "Secondary CTA (See demo / Watch video)",
          "Product screenshot or animation",
          "Social proof snippet (X companies use us)"
        ]
      },
      {
        id: "logos",
        name: "Logo Cloud",
        required: true,
        purpose: "Instant credibility through association",
        keyElements: [
          "5-8 recognizable company logos",
          "Grayscale treatment for consistency",
          "Optional: 'Trusted by teams at' header",
          "Mix of enterprise and startup logos"
        ]
      },
      {
        id: "features",
        name: "Features Grid",
        required: true,
        purpose: "Show capabilities without overwhelming",
        keyElements: [
          "3-6 core features max",
          "Icon + headline + 1-2 sentence description",
          "Optional product screenshots",
          "Benefit-focused headlines, not feature names"
        ]
      },
      {
        id: "product-showcase",
        name: "Product Showcase",
        required: true,
        purpose: "Let visitors see the actual product",
        keyElements: [
          "Large, high-quality product screenshots",
          "Interactive demo or video",
          "Annotations highlighting key features",
          "Multiple views or use cases"
        ]
      },
      {
        id: "testimonials",
        name: "Testimonials",
        required: true,
        purpose: "Social proof from real users",
        keyElements: [
          "Photo, name, title, company",
          "Specific results or outcomes mentioned",
          "Mix of roles (founder, developer, designer)",
          "Video testimonials if available"
        ]
      },
      {
        id: "pricing",
        name: "Pricing",
        required: true,
        purpose: "Remove friction from decision-making",
        keyElements: [
          "Clear tier comparison",
          "Highlight most popular plan",
          "Annual vs monthly toggle",
          "Feature comparison table",
          "Free tier or trial prominently shown"
        ]
      },
      {
        id: "cta-final",
        name: "Final CTA",
        required: true,
        purpose: "Convert visitors who scrolled the whole page",
        keyElements: [
          "Reiterate main value prop",
          "Strong CTA button",
          "Risk reducer (free trial, no credit card)",
          "Optional: show what happens next"
        ]
      }
    ],
    
    design: {
      colorDescription: "Clean, minimal with strategic accent colors. Dark mode optional but increasingly expected.",
      colors: {
        primary: "#000000",
        secondary: "#6366F1",
        accent: "#10B981",
        background: "#FFFFFF"
      },
      typography: "Modern sans-serif, excellent readability, clear hierarchy. Large headlines, comfortable body text.",
      fonts: {
        heading: "Inter, Cal Sans, or SF Pro Display",
        body: "Inter or System UI"
      },
      imageStyle: "Product screenshots with subtle shadows, gradients backgrounds, minimal lifestyle imagery. 3D elements and glassmorphism trending.",
      spacing: "Generous whitespace, clear sections, breathing room around elements",
      mood: "Professional yet approachable, innovative, trustworthy, clean"
    },
    
    copywriting: {
      tone: "Clear, confident, slightly playful. Avoid jargon. Focus on outcomes not features. Use 'you' frequently.",
      exampleHeadlines: [
        "The tool for modern teams",
        "Write, plan, organize. Together.",
        "Develop. Preview. Ship.",
        "Financial infrastructure for the internet",
        "Where work happens",
        "Build faster, together"
      ],
      exampleCTAs: [
        "Start for free",
        "Get started — it's free",
        "Try for free",
        "Start building",
        "Request access",
        "Book a demo"
      ],
      avoidPhrases: [
        "Revolutionary",
        "Best-in-class",
        "Leverage",
        "Synergy",
        "Cutting-edge solution",
        "One-stop-shop",
        "We're passionate about"
      ]
    },
    
    images: {
      hero: [
        "https://images.unsplash.com/photo-1551434678-e076c223a692?w=1600",
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1600",
        "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1600",
        "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=1600",
        "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=1600"
      ],
      products: [
        "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200",
        "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200",
        "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=1200",
        "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1200"
      ],
      lifestyle: [
        "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200",
        "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=1200",
        "https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=1200"
      ],
      about: [
        "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200",
        "https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=1200"
      ]
    }
  },

  // ============================================
  // 2. MOBILE APP
  // ============================================
  {
    id: "mobile-app",
    name: "Mobile App",
    category: "tech",
    
    topBrands: ["Calm", "Headspace", "Duolingo", "Robinhood", "Spotify", "Airbnb"],
    
    psychology: {
      customerNeeds: [
        "Understand what the app does immediately",
        "See the app interface before downloading",
        "Know it works on their device",
        "Trust it with their data/money/time",
        "See ratings and reviews",
        "Easy download path"
      ],
      trustFactors: [
        "App Store ratings prominently displayed",
        "Press mentions (TechCrunch, Forbes, etc.)",
        "User count or download numbers",
        "Privacy and security mentions",
        "Awards or 'App of the Year' badges",
        "Real user testimonials"
      ],
      emotionalTriggers: [
        "Desire for self-improvement",
        "Fear of missing out",
        "Need for convenience",
        "Aspiration to be better",
        "Curiosity about new technology",
        "Trust in polished experience"
      ]
    },
    
    sections: [
      {
        id: "hero",
        name: "Hero with App Preview",
        required: true,
        purpose: "Show the app and communicate core benefit",
        keyElements: [
          "Large phone mockup with app screenshot",
          "Clear value proposition headline",
          "App Store / Play Store buttons",
          "Star rating display",
          "QR code for quick download (optional)"
        ]
      },
      {
        id: "social-proof",
        name: "Social Proof Bar",
        required: true,
        purpose: "Build immediate credibility",
        keyElements: [
          "Download count or user numbers",
          "App Store rating",
          "Press logos (Featured in...)",
          "Awards badges"
        ]
      },
      {
        id: "features",
        name: "Feature Walkthrough",
        required: true,
        purpose: "Show key app screens and capabilities",
        keyElements: [
          "Phone mockups for each feature",
          "Benefit-focused headlines",
          "Brief descriptions",
          "Alternating layout (phone left/right)"
        ]
      },
      {
        id: "how-it-works",
        name: "How It Works",
        required: false,
        purpose: "Reduce friction by explaining the process",
        keyElements: [
          "3-4 simple steps",
          "Icon or illustration for each",
          "Keep it scannable"
        ]
      },
      {
        id: "testimonials",
        name: "User Reviews",
        required: true,
        purpose: "Real social proof from users",
        keyElements: [
          "App Store style review cards",
          "Star ratings visible",
          "Mix of use cases",
          "Before/after or results stories"
        ]
      },
      {
        id: "pricing",
        name: "Pricing / Premium",
        required: false,
        purpose: "Convert free users to paid",
        keyElements: [
          "Free vs Premium comparison",
          "Highlight premium features",
          "Free trial offer",
          "Money-back guarantee"
        ]
      },
      {
        id: "download-cta",
        name: "Download CTA",
        required: true,
        purpose: "Final conversion push",
        keyElements: [
          "Large App Store buttons",
          "Phone mockup",
          "Reiterate key benefit",
          "QR code option"
        ]
      }
    ],
    
    design: {
      colorDescription: "Often uses app's brand colors prominently. Gradients popular. Dark backgrounds make device mockups pop.",
      colors: {
        primary: "#5B4FE9",
        secondary: "#FF6B6B",
        accent: "#00D9A5",
        background: "#0A0A0F"
      },
      typography: "Bold, friendly, highly readable. Large headlines that work on mobile.",
      fonts: {
        heading: "SF Pro Display, Circular, or Poppins",
        body: "SF Pro Text or Inter"
      },
      imageStyle: "High-quality device mockups, app screenshots, lifestyle photos of people using phones in context. Floating phone angles popular.",
      spacing: "Generous spacing, scroll-driven animations, sections clearly defined",
      mood: "Friendly, modern, trustworthy, polished, aspirational"
    },
    
    copywriting: {
      tone: "Friendly, benefit-focused, slightly playful. Speak to the transformation the app enables.",
      exampleHeadlines: [
        "Sleep more. Stress less.",
        "Learn a language in 10 minutes a day",
        "Your finances, finally simplified",
        "Find your calm",
        "Music for every moment",
        "Feel like home, anywhere"
      ],
      exampleCTAs: [
        "Download free",
        "Start your free trial",
        "Get the app",
        "Try it free for 7 days",
        "Download on the App Store",
        "Get started free"
      ],
      avoidPhrases: [
        "Download now!!!",
        "Best app ever",
        "You need this",
        "Limited time",
        "Act fast",
        "Don't miss out"
      ]
    },
    
    images: {
      hero: [
        "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=1600",
        "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=1600",
        "https://images.unsplash.com/photo-1526628953301-3e589a6a8b74?w=1600",
        "https://images.unsplash.com/photo-1556656793-08538906a9f8?w=1600"
      ],
      products: [
        "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=1200",
        "https://images.unsplash.com/photo-1596742578443-7682ef5251cd?w=1200",
        "https://images.unsplash.com/photo-1605170439002-90845e8c0137?w=1200"
      ],
      lifestyle: [
        "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?w=1200",
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200",
        "https://images.unsplash.com/photo-1501139083538-0139583c060f?w=1200",
        "https://images.unsplash.com/photo-1522199755839-a2bacb67c546?w=1200"
      ],
      about: [
        "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=1200",
        "https://images.unsplash.com/photo-1606857521015-7f9fcf423571?w=1200"
      ]
    }
  },

  // ============================================
  // 3. AI / TECH STARTUP
  // ============================================
  {
    id: "ai-tech-startup",
    name: "AI Tech Startup",
    category: "tech",
    
    topBrands: ["OpenAI", "Anthropic", "Midjourney", "Runway", "Stability AI", "Hugging Face"],
    
    psychology: {
      customerNeeds: [
        "Understand what the AI actually does",
        "See real examples/demos of capabilities",
        "Trust the company with their data",
        "Understand pricing and usage limits",
        "Know about safety and ethical practices",
        "Access documentation and support"
      ],
      trustFactors: [
        "Research papers and technical credibility",
        "Team backgrounds (ex-Google, Stanford, etc.)",
        "Funding and investor logos",
        "Enterprise customer logos",
        "Safety and ethics statements",
        "Clear documentation"
      ],
      emotionalTriggers: [
        "Excitement about the future",
        "Fear of being left behind",
        "Curiosity about AI capabilities",
        "Desire to be early adopter",
        "Need to stay competitive",
        "Wonder at what's possible"
      ]
    },
    
    sections: [
      {
        id: "hero",
        name: "Hero with Demo",
        required: true,
        purpose: "Show don't tell - demonstrate the AI",
        keyElements: [
          "Interactive demo or video",
          "Clear explanation of what it does",
          "Try it now / Get access CTA",
          "Waitlist option if in beta"
        ]
      },
      {
        id: "demo-showcase",
        name: "Capabilities Showcase",
        required: true,
        purpose: "Show real examples of what the AI can do",
        keyElements: [
          "Gallery of outputs/examples",
          "Before/after comparisons",
          "Interactive playground",
          "Use case categories"
        ]
      },
      {
        id: "how-it-works",
        name: "How It Works",
        required: false,
        purpose: "Explain the technology accessibly",
        keyElements: [
          "Simple explanation for non-technical users",
          "Technical details for developers",
          "Architecture diagram (optional)",
          "Link to research/papers"
        ]
      },
      {
        id: "use-cases",
        name: "Use Cases",
        required: true,
        purpose: "Help visitors see themselves using it",
        keyElements: [
          "Industry-specific applications",
          "Role-specific benefits",
          "Customer success stories",
          "Integration possibilities"
        ]
      },
      {
        id: "enterprise",
        name: "Enterprise Section",
        required: false,
        purpose: "Address enterprise buyer needs",
        keyElements: [
          "Security and compliance",
          "Custom deployment options",
          "SLAs and support",
          "Contact sales CTA"
        ]
      },
      {
        id: "pricing",
        name: "Pricing / Access",
        required: true,
        purpose: "Clear path to getting started",
        keyElements: [
          "Usage-based pricing explanation",
          "Free tier details",
          "API pricing calculator",
          "Enterprise contact option"
        ]
      },
      {
        id: "safety",
        name: "Safety & Ethics",
        required: false,
        purpose: "Build trust around AI concerns",
        keyElements: [
          "Safety practices",
          "Ethical guidelines",
          "Research commitments",
          "Transparency reports"
        ]
      }
    ],
    
    design: {
      colorDescription: "Often dark/black backgrounds with vibrant gradients. Futuristic but not gimmicky. Purple and blue common.",
      colors: {
        primary: "#10A37F",
        secondary: "#7C3AED",
        accent: "#F59E0B",
        background: "#0D0D0D"
      },
      typography: "Clean, modern, technical but readable. Monospace for code snippets.",
      fonts: {
        heading: "Söhne, Inter, or GT Walsheim",
        body: "Inter or Söhne"
      },
      imageStyle: "Abstract gradients, AI-generated art, minimal photography. Glowing effects, particle animations, 3D renders.",
      spacing: "Very generous, almost theatrical spacing. Let the product/demos be the focus.",
      mood: "Cutting-edge, trustworthy, intelligent, slightly mysterious, professional"
    },
    
    copywriting: {
      tone: "Intelligent but accessible. Confident about capabilities, humble about limitations. Avoid hype.",
      exampleHeadlines: [
        "Research and deploy AI systems",
        "Imagine what you could create",
        "AI that understands you",
        "The future of creative tools",
        "Intelligence at your fingertips",
        "Build with AI"
      ],
      exampleCTAs: [
        "Try ChatGPT",
        "Get started",
        "Join the beta",
        "Request access",
        "Read the research",
        "Explore the API"
      ],
      avoidPhrases: [
        "Revolutionary AI",
        "Artificial General Intelligence",
        "Replaces humans",
        "Limitless potential",
        "Magical",
        "The most advanced ever"
      ]
    },
    
    images: {
      hero: [
        "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1600",
        "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=1600",
        "https://images.unsplash.com/photo-1676299081847-824916de030a?w=1600",
        "https://images.unsplash.com/photo-1655720828018-edd2daec9349?w=1600"
      ],
      products: [
        "https://images.unsplash.com/photo-1675557009875-436f7a5c6f94?w=1200",
        "https://images.unsplash.com/photo-1684391963927-be5e04d27c12?w=1200",
        "https://images.unsplash.com/photo-1673442664192-1e8e28a58be6?w=1200"
      ],
      lifestyle: [
        "https://images.unsplash.com/photo-1531746790095-e5f1e7a5e982?w=1200",
        "https://images.unsplash.com/photo-1535378917042-10a22c95931a?w=1200",
        "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=1200"
      ],
      about: [
        "https://images.unsplash.com/photo-1573164713988-8665fc963095?w=1200",
        "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1200"
      ]
    }
  },

  // ============================================
  // 4. WEDDING PHOTOGRAPHY
  // ============================================
  {
    id: "photography-wedding",
    name: "Wedding Photography",
    category: "creative",
    
    topBrands: ["José Villa", "Erich McVey", "KT Merry", "Joel Bedford", "Benj Haisch"],
    
    psychology: {
      customerNeeds: [
        "See a consistent, beautiful portfolio",
        "Understand the photographer's style",
        "Know they can capture their specific vision",
        "Trust they'll be professional on the big day",
        "Understand pricing and packages",
        "Feel a personal connection"
      ],
      trustFactors: [
        "Large portfolio of consistent quality",
        "Published work in wedding publications",
        "Testimonials from real couples",
        "Professional associations",
        "Clear communication style",
        "Venue/vendor experience in their area"
      ],
      emotionalTriggers: [
        "Desire for timeless, beautiful memories",
        "Fear of regretting photographer choice",
        "Pride in having stunning photos to share",
        "Romance and sentimentality",
        "Trust in capturing authentic moments",
        "Connection with photographer's artistic vision"
      ]
    },
    
    sections: [
      {
        id: "hero",
        name: "Portfolio Hero",
        required: true,
        purpose: "Immediately show signature style",
        keyElements: [
          "Full-bleed stunning wedding photo",
          "Minimal text overlay",
          "Name/logo",
          "Optional tagline about style",
          "Subtle CTA to view work"
        ]
      },
      {
        id: "portfolio-grid",
        name: "Portfolio Gallery",
        required: true,
        purpose: "Showcase breadth and consistency",
        keyElements: [
          "Curated selection (quality over quantity)",
          "Mix of ceremony, portraits, details, candids",
          "Consistent editing style throughout",
          "Full gallery or category links",
          "Masonry or clean grid layout"
        ]
      },
      {
        id: "featured-weddings",
        name: "Featured Stories",
        required: true,
        purpose: "Show complete wedding coverage",
        keyElements: [
          "2-4 full wedding galleries",
          "Brief story about the couple",
          "Venue information",
          "Shows storytelling ability"
        ]
      },
      {
        id: "about",
        name: "About / Meet the Photographer",
        required: true,
        purpose: "Build personal connection",
        keyElements: [
          "Friendly photo of photographer",
          "Personal story and approach",
          "What makes their style unique",
          "Personality that comes through",
          "Experience and background"
        ]
      },
      {
        id: "experience",
        name: "The Experience",
        required: false,
        purpose: "Explain what working together looks like",
        keyElements: [
          "Timeline of the process",
          "What to expect on wedding day",
          "How they work with couples",
          "Delivery timeline"
        ]
      },
      {
        id: "testimonials",
        name: "Kind Words",
        required: true,
        purpose: "Social proof from happy couples",
        keyElements: [
          "Heartfelt testimonials",
          "Photos of the couples",
          "Specific praise points",
          "Mix of wedding types"
        ]
      },
      {
        id: "investment",
        name: "Investment / Pricing",
        required: true,
        purpose: "Qualify leads and set expectations",
        keyElements: [
          "Starting price or range",
          "What's included overview",
          "Package options",
          "Inquiry CTA (not full pricing)"
        ]
      },
      {
        id: "contact",
        name: "Contact / Inquire",
        required: true,
        purpose: "Convert interested visitors",
        keyElements: [
          "Inquiry form",
          "Wedding date availability",
          "Response time expectation",
          "Alternative contact methods"
        ]
      }
    ],
    
    design: {
      colorDescription: "Minimal, elegant, lets photos be the focus. Often white/cream backgrounds. Muted accent colors.",
      colors: {
        primary: "#2C2C2C",
        secondary: "#9B8B7A",
        accent: "#C4A77D",
        background: "#FAF9F7"
      },
      typography: "Elegant serifs for headings, clean sans-serif for body. Often light/thin weights.",
      fonts: {
        heading: "Playfair Display, Cormorant, or Freight Display",
        body: "Lato, Karla, or Open Sans"
      },
      imageStyle: "Fine art, editorial quality. Soft, romantic lighting. Consistent color grading. Mix of film and digital aesthetics.",
      spacing: "Very generous whitespace. Photos need room to breathe. Minimal UI elements.",
      mood: "Romantic, elegant, timeless, artistic, personal"
    },
    
    copywriting: {
      tone: "Warm, personal, romantic but not cheesy. First-person, conversational. Focus on emotion and experience.",
      exampleHeadlines: [
        "Timeless wedding photography for the modern romantic",
        "For couples who value authentic moments",
        "Fine art wedding photography",
        "Documenting love stories worldwide",
        "Photography that feels like you",
        "Your story, beautifully told"
      ],
      exampleCTAs: [
        "View the portfolio",
        "Get in touch",
        "Inquire about your date",
        "Let's connect",
        "Start the conversation",
        "Tell me about your day"
      ],
      avoidPhrases: [
        "Capture your special day",
        "Memories to last a lifetime",
        "Best day ever",
        "Fairy tale wedding",
        "Picture perfect",
        "Say cheese"
      ]
    },
    
    images: {
      hero: [
        "https://images.unsplash.com/photo-1519741497674-611481863552?w=1600",
        "https://images.unsplash.com/photo-1606800052052-a08af7148866?w=1600",
        "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=1600",
        "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=1600",
        "https://images.unsplash.com/photo-1591604466107-ec97de577aff?w=1600"
      ],
      products: [
        "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=1200",
        "https://images.unsplash.com/photo-1460978812857-470ed1c77af0?w=1200",
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200",
        "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=1200"
      ],
      lifestyle: [
        "https://images.unsplash.com/photo-1525772764200-be829a350797?w=1200",
        "https://images.unsplash.com/photo-1544078751-58fee2d8a03b?w=1200",
        "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1200"
      ],
      about: [
        "https://images.unsplash.com/photo-1554048612-b6a482bc67e5?w=1200",
        "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=1200"
      ]
    }
  },

  // ============================================
  // 5. COMMERCIAL PHOTOGRAPHY
  // ============================================
  {
    id: "photography-commercial",
    name: "Commercial Photography",
    category: "creative",
    
    topBrands: ["Annie Leibovitz", "Peter Lindbergh (estate)", "Erik Almas", "Tim Walker", "Joey L"],
    
    psychology: {
      customerNeeds: [
        "See work relevant to their industry/needs",
        "Understand technical capabilities",
        "Trust in professional reliability",
        "Know about team and production capacity",
        "Easy path to get a quote",
        "See client list and experience"
      ],
      trustFactors: [
        "Major brand client logos",
        "Published work in recognizable outlets",
        "Industry awards",
        "Production team credentials",
        "Clear professional process",
        "Responsive communication"
      ],
      emotionalTriggers: [
        "Need for high-quality visual content",
        "Desire to elevate brand perception",
        "Trust in consistent deliverables",
        "Confidence in working with professionals",
        "Relief in finding the right creative partner"
      ]
    },
    
    sections: [
      {
        id: "hero",
        name: "Portfolio Hero",
        required: true,
        purpose: "Showcase signature work immediately",
        keyElements: [
          "Stunning hero image or video reel",
          "Minimal branding overlay",
          "Work categories/navigation",
          "Optional client logo bar"
        ]
      },
      {
        id: "portfolio",
        name: "Work Portfolio",
        required: true,
        purpose: "Demonstrate range and quality",
        keyElements: [
          "Category-organized galleries",
          "Campaign/project groupings",
          "Client attribution where possible",
          "Behind-the-scenes content optional"
        ]
      },
      {
        id: "clients",
        name: "Client List",
        required: true,
        purpose: "Build credibility through association",
        keyElements: [
          "Logo grid of major clients",
          "Industry diversity shown",
          "Case studies for key projects",
          "Publications/features list"
        ]
      },
      {
        id: "services",
        name: "Services",
        required: true,
        purpose: "Clarify what you offer",
        keyElements: [
          "Photography types (product, lifestyle, portrait)",
          "Production capabilities",
          "Retouching/post-production",
          "Video/motion if offered"
        ]
      },
      {
        id: "about",
        name: "About / Team",
        required: true,
        purpose: "Introduce the people behind the work",
        keyElements: [
          "Photographer bio and photo",
          "Team members if applicable",
          "Studio information",
          "Awards and recognition"
        ]
      },
      {
        id: "contact",
        name: "Contact / Get Quote",
        required: true,
        purpose: "Enable business inquiries",
        keyElements: [
          "Contact form with project details",
          "Studio location/address",
          "Rep/agent information if applicable",
          "Response time expectation"
        ]
      }
    ],
    
    design: {
      colorDescription: "Minimal, black or dark backgrounds common to make work pop. Clean, gallery-like aesthetic.",
      colors: {
        primary: "#FFFFFF",
        secondary: "#1A1A1A",
        accent: "#FF4444",
        background: "#0A0A0A"
      },
      typography: "Clean, modern sans-serif. Often all caps for navigation. Minimal text overall.",
      fonts: {
        heading: "Helvetica Neue, Futura, or Knockout",
        body: "Helvetica Neue or Inter"
      },
      imageStyle: "Portfolio-quality, magazine-ready images. High production value. Consistent post-processing.",
      spacing: "Gallery-style layouts. Images are the focus. Minimal UI distractions.",
      mood: "Professional, sophisticated, high-end, creative, confident"
    },
    
    copywriting: {
      tone: "Professional, confident, concise. Let the work speak. Focus on capabilities and experience.",
      exampleHeadlines: [
        "Commercial & Editorial Photography",
        "Visual storytelling for brands",
        "Creating images that move people",
        "Photography • Direction • Production",
        "Work that works",
        "Stories through light"
      ],
      exampleCTAs: [
        "View work",
        "Get in touch",
        "Request estimate",
        "Start a project",
        "Contact studio",
        "Let's create"
      ],
      avoidPhrases: [
        "World-class photography",
        "Passionate about images",
        "Storyteller at heart",
        "Capturing moments",
        "Creating magic",
        "Award-winning excellence"
      ]
    },
    
    images: {
      hero: [
        "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=1600",
        "https://images.unsplash.com/photo-1471341971476-ae15ff5dd4ea?w=1600",
        "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1600",
        "https://images.unsplash.com/photo-1493863641943-9b68992a8d07?w=1600"
      ],
      products: [
        "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200",
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1200",
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1200",
        "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=1200"
      ],
      lifestyle: [
        "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1200",
        "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1200",
        "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=1200"
      ],
      about: [
        "https://images.unsplash.com/photo-1452802447250-470a88ac82bc?w=1200",
        "https://images.unsplash.com/photo-1554048612-b6a482bc67e5?w=1200"
      ]
    }
  },

  // ============================================
  // 6. DESIGNER PORTFOLIO
  // ============================================
  {
    id: "portfolio-designer",
    name: "Designer Portfolio",
    category: "creative",
    
    topBrands: ["Tobias van Schneider", "Jessica Hische", "Anton & Irene", "Rally Interactive", "Pentagram Partners"],
    
    psychology: {
      customerNeeds: [
        "See relevant work for their project type",
        "Understand the designer's process",
        "Gauge skill level and aesthetic fit",
        "Know availability and working style",
        "Easy way to initiate contact",
        "Get a sense of personality"
      ],
      trustFactors: [
        "Quality and consistency of portfolio",
        "Recognizable client names",
        "Awards and recognition",
        "Clear case study documentation",
        "Active professional presence",
        "Testimonials from clients"
      ],
      emotionalTriggers: [
        "Excitement about potential collaboration",
        "Confidence in finding the right fit",
        "Appreciation for craft and quality",
        "Trust in creative vision",
        "Connection with aesthetic sensibility"
      ]
    },
    
    sections: [
      {
        id: "hero",
        name: "Introduction",
        required: true,
        purpose: "Communicate who you are and what you do",
        keyElements: [
          "Name and role clearly stated",
          "Brief positioning statement",
          "Current status (available/unavailable)",
          "Navigation to work"
        ]
      },
      {
        id: "work",
        name: "Selected Work",
        required: true,
        purpose: "Showcase your best projects",
        keyElements: [
          "Curated project selection",
          "Consistent presentation",
          "Project thumbnails with titles",
          "Category filtering optional"
        ]
      },
      {
        id: "case-studies",
        name: "Case Studies",
        required: true,
        purpose: "Demonstrate process and thinking",
        keyElements: [
          "Project context and challenge",
          "Process documentation",
          "Design decisions explained",
          "Results and outcomes",
          "High-quality project images"
        ]
      },
      {
        id: "about",
        name: "About",
        required: true,
        purpose: "Share your story and approach",
        keyElements: [
          "Personal photo",
          "Background and experience",
          "Design philosophy",
          "Fun facts/personality",
          "Resume/CV link"
        ]
      },
      {
        id: "services",
        name: "Services / Expertise",
        required: false,
        purpose: "Clarify what you offer",
        keyElements: [
          "Design specialties",
          "Tools and skills",
          "Industry experience",
          "Collaboration types"
        ]
      },
      {
        id: "contact",
        name: "Contact",
        required: true,
        purpose: "Enable new opportunities",
        keyElements: [
          "Email address prominently shown",
          "Contact form optional",
          "Social/professional links",
          "Availability status"
        ]
      }
    ],
    
    design: {
      colorDescription: "The portfolio IS the design statement. Often minimal, sometimes experimental. Reflects designer's personal style.",
      colors: {
        primary: "#000000",
        secondary: "#5352ED",
        accent: "#FF6348",
        background: "#FFFFFF"
      },
      typography: "Typography often a key design element. Experimental or carefully chosen. Reflects aesthetic sensibility.",
      fonts: {
        heading: "Custom or distinctive (e.g., Editorial New, Neue Haas, GT Sectra)",
        body: "Clean, readable (Inter, Suisse, Graphik)"
      },
      imageStyle: "High-fidelity mockups, process shots, detail close-ups. Consistent presentation across projects.",
      spacing: "Intentional spacing that reflects design principles. Often generous, sometimes tight for effect.",
      mood: "Creative, intentional, personal, sophisticated, memorable"
    },
    
    copywriting: {
      tone: "Personal, confident, creative. First-person. Show personality. Not corporate.",
      exampleHeadlines: [
        "I'm [Name], a product designer in NYC",
        "Design that moves people",
        "Creating digital experiences",
        "Designer & Creative Director",
        "Building brands with intention",
        "I help companies tell better stories"
      ],
      exampleCTAs: [
        "See my work",
        "View case study",
        "Get in touch",
        "Let's talk",
        "Say hello",
        "Start a project"
      ],
      avoidPhrases: [
        "Pixel-perfect",
        "Passionate creative",
        "Outside the box",
        "Making the world a better place",
        "Design ninja/guru/rockstar",
        "Jack of all trades"
      ]
    },
    
    images: {
      hero: [
        "https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=1600",
        "https://images.unsplash.com/photo-1545235617-9465d2a55698?w=1600",
        "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=1600",
        "https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=1600"
      ],
      products: [
        "https://images.unsplash.com/photo-1561070791-36c11767b26a?w=1200",
        "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=1200",
        "https://images.unsplash.com/photo-1609921212029-bb5a28e60960?w=1200"
      ],
      lifestyle: [
        "https://images.unsplash.com/photo-1558655146-364adaf1fcc9?w=1200",
        "https://images.unsplash.com/photo-1483058712412-4245e9b90334?w=1200"
      ],
      about: [
        "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=1200",
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200"
      ]
    }
  },

  // ============================================
  // 7. DEVELOPER PORTFOLIO
  // ============================================
  {
    id: "portfolio-developer",
    name: "Developer Portfolio",
    category: "creative",
    
    topBrands: ["Brittany Chiang", "Josh Comeau", "Lee Robinson", "Cassidy Williams", "Wes Bos"],
    
    psychology: {
      customerNeeds: [
        "Assess technical skills and experience",
        "See real projects and code",
        "Understand tech stack proficiency",
        "Evaluate communication ability",
        "Quick access to resume/GitHub",
        "Gauge personality and culture fit"
      ],
      trustFactors: [
        "GitHub activity and repositories",
        "Live project examples",
        "Technical writing/blog posts",
        "Open source contributions",
        "Work history and companies",
        "Recommendations from peers"
      ],
      emotionalTriggers: [
        "Confidence in technical ability",
        "Interest in collaboration",
        "Respect for craft and learning",
        "Connection with personality",
        "Trust in problem-solving ability"
      ]
    },
    
    sections: [
      {
        id: "hero",
        name: "Introduction",
        required: true,
        purpose: "Quick intro with key info",
        keyElements: [
          "Name and role",
          "Brief tagline",
          "Current status/company",
          "Links to GitHub/LinkedIn/Resume",
          "Optional: terminal-style or creative intro"
        ]
      },
      {
        id: "about",
        name: "About",
        required: true,
        purpose: "Share background and interests",
        keyElements: [
          "Brief personal story",
          "How you got into coding",
          "What you enjoy building",
          "Non-work interests",
          "Current focus or learning"
        ]
      },
      {
        id: "experience",
        name: "Experience",
        required: true,
        purpose: "Professional background",
        keyElements: [
          "Work history with companies",
          "Role descriptions",
          "Key achievements",
          "Tech stacks used",
          "Timeline format common"
        ]
      },
      {
        id: "projects",
        name: "Projects",
        required: true,
        purpose: "Showcase what you've built",
        keyElements: [
          "Project cards with screenshots",
          "Tech stack badges",
          "Live demo links",
          "GitHub repository links",
          "Brief descriptions"
        ]
      },
      {
        id: "skills",
        name: "Skills / Tech Stack",
        required: false,
        purpose: "Quick reference of abilities",
        keyElements: [
          "Languages",
          "Frameworks/Libraries",
          "Tools and platforms",
          "Visual skill representation"
        ]
      },
      {
        id: "blog",
        name: "Writing / Blog",
        required: false,
        purpose: "Demonstrate knowledge sharing",
        keyElements: [
          "Technical articles",
          "Tutorial posts",
          "Thought pieces",
          "Links to external publications"
        ]
      },
      {
        id: "contact",
        name: "Contact",
        required: true,
        purpose: "Enable outreach",
        keyElements: [
          "Email address",
          "Social links",
          "Availability statement",
          "Open to opportunities indicator"
        ]
      }
    ],
    
    design: {
      colorDescription: "Often dark mode. Clean and functional. Sometimes playful with animations. Shows technical ability through site itself.",
      colors: {
        primary: "#64FFDA",
        secondary: "#8892B0",
        accent: "#FFD700",
        background: "#0A192F"
      },
      typography: "Monospace accents common. Clean sans-serifs. Good code block styling.",
      fonts: {
        heading: "Inter, Calibre, or SF Pro Display",
        body: "Inter or system fonts"
      },
      imageStyle: "Project screenshots, code snippets styled, minimal photography. Sometimes 3D elements or creative animations.",
      spacing: "Clean and functional. Good responsive behavior. Accessible design.",
      mood: "Technical, clean, sometimes playful, professional, smart"
    },
    
    copywriting: {
      tone: "Casual but professional. Technical when needed. Show personality. Not stiff.",
      exampleHeadlines: [
        "Hi, I'm [Name].",
        "I build things for the web",
        "Software Engineer at [Company]",
        "Full-stack developer & open source enthusiast",
        "Turning coffee into code",
        "I make stuff for the internet"
      ],
      exampleCTAs: [
        "View project",
        "See live demo",
        "Check it out",
        "Get in touch",
        "View on GitHub",
        "Read more"
      ],
      avoidPhrases: [
        "10x developer",
        "Coding wizard",
        "Tech ninja",
        "Guru/Expert",
        "Changing the world",
        "Revolutionary solutions"
      ]
    },
    
    images: {
      hero: [
        "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1600",
        "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1600",
        "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=1600",
        "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1600"
      ],
      products: [
        "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=1200",
        "https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=1200",
        "https://images.unsplash.com/photo-1607799279861-4dd421887fb3?w=1200"
      ],
      lifestyle: [
        "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1200",
        "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200"
      ],
      about: [
        "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=1200",
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200"
      ]
    }
  },

  // ============================================
  // 8. LIFE COACH
  // ============================================
  {
    id: "coach-life",
    name: "Life Coach",
    category: "services",
    
    topBrands: ["Tony Robbins", "Brené Brown", "Jay Shetty", "Marie Forleo", "Brendon Burchard"],
    
    psychology: {
      customerNeeds: [
        "Feel understood and not judged",
        "Believe the coach can help them",
        "Understand the coaching approach",
        "See results from other clients",
        "Know pricing and commitment",
        "Feel safe and comfortable"
      ],
      trustFactors: [
        "Credentials and certifications",
        "Personal transformation story",
        "Client testimonials with results",
        "Media appearances or publications",
        "Clear methodology explanation",
        "Professional but approachable presence"
      ],
      emotionalTriggers: [
        "Desire for change and growth",
        "Feeling stuck or lost",
        "Hope for a better future",
        "Need for accountability",
        "Seeking clarity and direction",
        "Ready to invest in themselves"
      ]
    },
    
    sections: [
      {
        id: "hero",
        name: "Hero",
        required: true,
        purpose: "Connect immediately and offer hope",
        keyElements: [
          "Warm, professional photo",
          "Empathetic headline about transformation",
          "Brief positioning statement",
          "Primary CTA (free call/assessment)",
          "Trust indicators"
        ]
      },
      {
        id: "problem-agitation",
        name: "The Challenge",
        required: true,
        purpose: "Show you understand their struggles",
        keyElements: [
          "Acknowledge common pain points",
          "Show empathy and understanding",
          "Validate their feelings",
          "Hint at the solution"
        ]
      },
      {
        id: "about",
        name: "About / Story",
        required: true,
        purpose: "Build connection through your journey",
        keyElements: [
          "Personal transformation story",
          "Credentials and training",
          "Why you do this work",
          "Authentic, vulnerable sharing",
          "Professional photo"
        ]
      },
      {
        id: "approach",
        name: "How I Help / Method",
        required: true,
        purpose: "Explain your coaching approach",
        keyElements: [
          "Methodology overview",
          "What makes your approach unique",
          "Expected outcomes",
          "Who you work best with"
        ]
      },
      {
        id: "services",
        name: "Programs / Services",
        required: true,
        purpose: "Show what you offer",
        keyElements: [
          "1:1 coaching options",
          "Group programs if offered",
          "Digital products/courses",
          "Clear deliverables for each"
        ]
      },
      {
        id: "testimonials",
        name: "Client Results",
        required: true,
        purpose: "Prove transformation is possible",
        keyElements: [
          "Detailed success stories",
          "Before/after transformations",
          "Photos and full names when possible",
          "Specific, measurable results"
        ]
      },
      {
        id: "free-offer",
        name: "Free Resource / Lead Magnet",
        required: false,
        purpose: "Capture leads not ready to buy",
        keyElements: [
          "Free guide, assessment, or training",
          "Email capture form",
          "Clear value proposition",
          "Low commitment entry point"
        ]
      },
      {
        id: "cta-booking",
        name: "Book a Call",
        required: true,
        purpose: "Convert interested visitors",
        keyElements: [
          "Discovery call offer",
          "What to expect on the call",
          "Calendar booking embed",
          "Reassurance (no obligation)"
        ]
      }
    ],
    
    design: {
      colorDescription: "Warm, inviting, professional. Often earth tones or calming colors. Not corporate, not too casual.",
      colors: {
        primary: "#2D3436",
        secondary: "#6C5CE7",
        accent: "#00B894",
        background: "#FDFCFB"
      },
      typography: "Warm, readable, trustworthy. Not too formal. Good contrast.",
      fonts: {
        heading: "Playfair Display, Lora, or Poppins",
        body: "Open Sans, Nunito, or Lato"
      },
      imageStyle: "Warm, professional photos of the coach. Lifestyle images of confident, happy people. Natural lighting.",
      spacing: "Comfortable, not cramped. Easy to read and digest.",
      mood: "Warm, trustworthy, hopeful, professional, supportive"
    },
    
    copywriting: {
      tone: "Empathetic, encouraging, confident. Speak directly to their pain and desires. First-person, conversational.",
      exampleHeadlines: [
        "Ready to unlock your full potential?",
        "Transform your life from the inside out",
        "Breakthrough the barriers holding you back",
        "Create the life you've always imagined",
        "You're closer than you think",
        "It's time to become who you're meant to be"
      ],
      exampleCTAs: [
        "Book your free discovery call",
        "Start your transformation",
        "Get your free guide",
        "Let's talk",
        "Take the first step",
        "Schedule your consultation"
      ],
      avoidPhrases: [
        "Life-changing results guaranteed",
        "I'll fix you",
        "Secret method",
        "Get rich quick",
        "Overnight transformation",
        "Magic formula"
      ]
    },
    
    images: {
      hero: [
        "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=1600",
        "https://images.unsplash.com/photo-1571844307880-751c6d86f3f3?w=1600",
        "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=1600",
        "https://images.unsplash.com/photo-1552508744-1696d4464960?w=1600"
      ],
      products: [
        "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=1200",
        "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200",
        "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1200"
      ],
      lifestyle: [
        "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=1200",
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200",
        "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200"
      ],
      about: [
        "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=1200",
        "https://images.unsplash.com/photo-1580894732444-8ecded7900cd?w=1200"
      ]
    }
  },

  // ============================================
  // 9. COURSE CREATOR
  // ============================================
  {
    id: "course-creator",
    name: "Course Creator",
    category: "education",
    
    topBrands: ["MasterClass", "Skillshare", "Domestika", "Ali Abdaal", "Pat Flynn"],
    
    psychology: {
      customerNeeds: [
        "Believe they can achieve the promised outcome",
        "Trust the instructor's expertise",
        "Understand exactly what they'll learn",
        "See the course format and structure",
        "Know the time commitment required",
        "Feel the price is worth the value"
      ],
      trustFactors: [
        "Instructor credentials and achievements",
        "Student testimonials with results",
        "Preview of course content",
        "Money-back guarantee",
        "Community or support access",
        "Clear curriculum outline"
      ],
      emotionalTriggers: [
        "Desire for new skills or knowledge",
        "Fear of falling behind",
        "Excitement about possibilities",
        "Frustration with current situation",
        "Aspiration to become expert",
        "FOMO on career opportunities"
      ]
    },
    
    sections: [
      {
        id: "hero",
        name: "Hero",
        required: true,
        purpose: "Hook with the transformation promise",
        keyElements: [
          "Clear course title",
          "Outcome-focused headline",
          "Instructor credibility",
          "Course format indicator (video, live, etc.)",
          "Enroll CTA",
          "Social proof snippet"
        ]
      },
      {
        id: "for-who",
        name: "Is This For You?",
        required: true,
        purpose: "Qualify the right students",
        keyElements: [
          "Who this course is perfect for",
          "What problems it solves",
          "Prerequisites if any",
          "Who it's NOT for"
        ]
      },
      {
        id: "transformation",
        name: "What You'll Achieve",
        required: true,
        purpose: "Paint the after picture",
        keyElements: [
          "Specific outcomes and skills",
          "Before/after contrast",
          "Real student results",
          "Career or life benefits"
        ]
      },
      {
        id: "curriculum",
        name: "Course Curriculum",
        required: true,
        purpose: "Show exactly what's included",
        keyElements: [
          "Module breakdown",
          "Lesson titles",
          "Time for each section",
          "Preview or free lessons",
          "Total course length"
        ]
      },
      {
        id: "instructor",
        name: "Meet Your Instructor",
        required: true,
        purpose: "Build trust in the teacher",
        keyElements: [
          "Photo and bio",
          "Credentials and achievements",
          "Teaching philosophy",
          "Why they created this course"
        ]
      },
      {
        id: "testimonials",
        name: "Student Success Stories",
        required: true,
        purpose: "Social proof of results",
        keyElements: [
          "Video testimonials preferred",
          "Specific outcomes mentioned",
          "Photos and names",
          "Diverse student backgrounds"
        ]
      },
      {
        id: "bonuses",
        name: "Bonuses Included",
        required: false,
        purpose: "Increase perceived value",
        keyElements: [
          "Additional resources",
          "Templates or worksheets",
          "Community access",
          "Office hours or Q&A"
        ]
      },
      {
        id: "pricing",
        name: "Pricing / Enrollment",
        required: true,
        purpose: "Convert with clear pricing",
        keyElements: [
          "Clear price display",
          "Payment plan option",
          "Money-back guarantee",
          "What's included summary",
          "Urgency if applicable (enrollment closes)"
        ]
      },
      {
        id: "faq",
        name: "FAQ",
        required: true,
        purpose: "Handle objections",
        keyElements: [
          "Common questions answered",
          "Technical requirements",
          "Access duration",
          "Refund policy"
        ]
      }
    ],
    
    design: {
      colorDescription: "Professional but approachable. Often bold colors for CTAs. Clean, trustworthy feel.",
      colors: {
        primary: "#1A1A2E",
        secondary: "#E94560",
        accent: "#0F3460",
        background: "#FFFFFF"
      },
      typography: "Clear, readable, confident. Good hierarchy for long pages.",
      fonts: {
        heading: "Poppins, Montserrat, or Raleway",
        body: "Open Sans or Lato"
      },
      imageStyle: "Course preview mockups, instructor photos, student photos. Professional but not stock-looking.",
      spacing: "Well-structured long-form page. Clear section breaks.",
      mood: "Professional, trustworthy, valuable, exciting, achievable"
    },
    
    copywriting: {
      tone: "Confident, encouraging, specific about outcomes. Balance aspiration with achievability.",
      exampleHeadlines: [
        "Master [Skill] in [Timeframe]",
        "The Complete Guide to [Topic]",
        "From Zero to [Outcome]",
        "Everything you need to [Achieve Goal]",
        "Learn [Skill] from a [Credential]",
        "The [Adjective] Way to [Outcome]"
      ],
      exampleCTAs: [
        "Enroll now",
        "Start learning",
        "Join the course",
        "Get instant access",
        "Secure your spot",
        "Start your journey"
      ],
      avoidPhrases: [
        "Get rich quick",
        "No effort required",
        "Guaranteed results",
        "Secret method",
        "Limited spots (when not true)",
        "You'll never have to work again"
      ]
    },
    
    images: {
      hero: [
        "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1600",
        "https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=1600",
        "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=1600",
        "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1600"
      ],
      products: [
        "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1200",
        "https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?w=1200",
        "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=1200"
      ],
      lifestyle: [
        "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1200",
        "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=1200"
      ],
      about: [
        "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=1200",
        "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=1200"
      ]
    }
  },

  // ============================================
  // 10. NONPROFIT / CHARITY
  // ============================================
  {
    id: "nonprofit-charity",
    name: "Nonprofit & Charity",
    category: "nonprofit",
    
    topBrands: ["charity: water", "ACLU", "WWF", "Khan Academy", "Doctors Without Borders"],
    
    psychology: {
      customerNeeds: [
        "Trust that donations are used well",
        "Understand the cause and impact",
        "See concrete results from giving",
        "Know exactly where money goes",
        "Feel connected to the mission",
        "Easy, secure donation process"
      ],
      trustFactors: [
        "Financial transparency (ratings, reports)",
        "Impact metrics and results",
        "Story of real beneficiaries",
        "Leadership and team visibility",
        "Third-party ratings (Charity Navigator)",
        "Clear mission and theory of change"
      ],
      emotionalTriggers: [
        "Desire to make a difference",
        "Empathy for those in need",
        "Guilt about privilege",
        "Hope for positive change",
        "Connection to larger purpose",
        "Pride in contributing"
      ]
    },
    
    sections: [
      {
        id: "hero",
        name: "Impact Hero",
        required: true,
        purpose: "Inspire action with the mission",
        keyElements: [
          "Powerful impact image or video",
          "Clear mission statement",
          "Donate CTA prominent",
          "Impact statistic or story snippet"
        ]
      },
      {
        id: "problem",
        name: "The Challenge",
        required: true,
        purpose: "Explain why this matters",
        keyElements: [
          "The problem you're solving",
          "Scale and urgency",
          "Human stories",
          "Why now matters"
        ]
      },
      {
        id: "solution",
        name: "Our Approach",
        required: true,
        purpose: "Show how you create change",
        keyElements: [
          "Theory of change",
          "Program descriptions",
          "What makes approach effective",
          "Geographic or focus areas"
        ]
      },
      {
        id: "impact",
        name: "Our Impact",
        required: true,
        purpose: "Prove that donations work",
        keyElements: [
          "Key metrics and numbers",
          "Success stories",
          "Before/after examples",
          "Annual report link"
        ]
      },
      {
        id: "transparency",
        name: "Financial Transparency",
        required: true,
        purpose: "Build trust with accountability",
        keyElements: [
          "Breakdown of where money goes",
          "Overhead percentage",
          "Third-party ratings",
          "Annual reports available"
        ]
      },
      {
        id: "stories",
        name: "Stories",
        required: true,
        purpose: "Emotional connection",
        keyElements: [
          "Individual beneficiary stories",
          "Photos and names (with permission)",
          "Journey from problem to impact",
          "Donor impact stories"
        ]
      },
      {
        id: "ways-to-help",
        name: "Ways to Help",
        required: true,
        purpose: "Multiple engagement options",
        keyElements: [
          "Donate (one-time and monthly)",
          "Volunteer opportunities",
          "Advocate/spread the word",
          "Corporate partnerships"
        ]
      },
      {
        id: "donate",
        name: "Donation Section",
        required: true,
        purpose: "Convert supporters to donors",
        keyElements: [
          "Suggested amounts with impact",
          "Monthly giving option",
          "Secure payment indicators",
          "Gift/tribute options",
          "Tax deductibility note"
        ]
      }
    ],
    
    design: {
      colorDescription: "Often uses hopeful, purposeful colors. Not too corporate. Warm and human.",
      colors: {
        primary: "#0F766E",
        secondary: "#F97316",
        accent: "#0EA5E9",
        background: "#FFFFFF"
      },
      typography: "Clear, readable, trustworthy. Not too playful for serious causes.",
      fonts: {
        heading: "Playfair Display, Merriweather, or Montserrat",
        body: "Open Sans, Source Sans Pro, or Lato"
      },
      imageStyle: "Authentic photos of people helped. Not stock photos. Dignity in portrayal. Impact in action.",
      spacing: "Clean, organized. Important information easy to find.",
      mood: "Hopeful, urgent, trustworthy, human, impactful"
    },
    
    copywriting: {
      tone: "Hopeful, urgent, transparent. Focus on impact and dignity. Avoid pity or savior complex.",
      exampleHeadlines: [
        "Clean water changes everything",
        "Defend rights. Demand justice.",
        "Protecting wildlife for generations",
        "Free education for anyone, anywhere",
        "Medical care where it's needed most",
        "Together, we can end [problem]"
      ],
      exampleCTAs: [
        "Donate now",
        "Give monthly",
        "Join the fight",
        "Take action",
        "Start giving",
        "Change a life today"
      ],
      avoidPhrases: [
        "Save the poor",
        "Those less fortunate",
        "Third world",
        "Give them a voice",
        "Be a savior",
        "Helpless victims"
      ]
    },
    
    images: {
      hero: [
        "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=1600",
        "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=1600",
        "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=1600",
        "https://images.unsplash.com/photo-1509099836639-18ba1795216d?w=1600"
      ],
      products: [
        "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=1200",
        "https://images.unsplash.com/photo-1593113598332-cd288d649433?w=1200",
        "https://images.unsplash.com/photo-1560252829-804f1aedf1be?w=1200"
      ],
      lifestyle: [
        "https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?w=1200",
        "https://images.unsplash.com/photo-1594708767771-a7502e46dd90?w=1200"
      ],
      about: [
        "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=1200",
        "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200"
      ]
    }
  },

  // ============================================
  // 11. WEDDING PLANNER
  // ============================================
  {
    id: "wedding-planner",
    name: "Wedding Planner",
    category: "events",
    
    topBrands: ["Mindy Weiss", "Colin Cowie", "David Tutera", "Marcy Blum", "Preston Bailey"],
    
    psychology: {
      customerNeeds: [
        "Trust with their most important day",
        "See events similar to their vision",
        "Understand the planning process",
        "Know services and pricing range",
        "Feel a personal connection",
        "Believe their vision can be executed"
      ],
      trustFactors: [
        "Portfolio of stunning events",
        "Testimonials from real couples",
        "Published features (Martha Stewart, Vogue)",
        "Industry certifications",
        "Vendor relationships",
        "Years of experience"
      ],
      emotionalTriggers: [
        "Relief from planning stress",
        "Excitement about dream wedding",
        "Trust in professional handling",
        "Fear of things going wrong",
        "Desire for perfection",
        "Pride in unique event"
      ]
    },
    
    sections: [
      {
        id: "hero",
        name: "Portfolio Hero",
        required: true,
        purpose: "Showcase signature style",
        keyElements: [
          "Stunning wedding photo or video",
          "Name/brand logo",
          "Brief positioning statement",
          "Location/regions served",
          "Contact CTA"
        ]
      },
      {
        id: "portfolio",
        name: "Featured Weddings",
        required: true,
        purpose: "Show range and quality",
        keyElements: [
          "Gallery of past events",
          "Different styles and venues",
          "Professional photography",
          "Brief story for each"
        ]
      },
      {
        id: "services",
        name: "Services",
        required: true,
        purpose: "Explain what you offer",
        keyElements: [
          "Full planning packages",
          "Partial/day-of coordination",
          "Design services",
          "Destination weddings if applicable"
        ]
      },
      {
        id: "process",
        name: "The Experience",
        required: true,
        purpose: "Explain what working together is like",
        keyElements: [
          "Planning timeline",
          "What to expect",
          "How you work with clients",
          "Communication style"
        ]
      },
      {
        id: "about",
        name: "Meet the Planner",
        required: true,
        purpose: "Build personal connection",
        keyElements: [
          "Personal photo and bio",
          "Background and experience",
          "Planning philosophy",
          "Team introduction if applicable"
        ]
      },
      {
        id: "press",
        name: "As Seen In",
        required: false,
        purpose: "Industry credibility",
        keyElements: [
          "Publication logos",
          "Featured weddings",
          "Awards and recognition",
          "Links to features"
        ]
      },
      {
        id: "testimonials",
        name: "Client Love",
        required: true,
        purpose: "Social proof from couples",
        keyElements: [
          "Heartfelt testimonials",
          "Wedding photos with quotes",
          "Specific praise points",
          "Video testimonials if available"
        ]
      },
      {
        id: "contact",
        name: "Let's Connect",
        required: true,
        purpose: "Convert inquiries",
        keyElements: [
          "Inquiry form with wedding details",
          "What happens after inquiry",
          "Response time",
          "Consultation offer"
        ]
      }
    ],
    
    design: {
      colorDescription: "Elegant, romantic, sophisticated. Often soft, muted palettes. Reflects the style of weddings designed.",
      colors: {
        primary: "#2C3E50",
        secondary: "#D4A574",
        accent: "#9B8B7A",
        background: "#FDFBF9"
      },
      typography: "Elegant serifs, romantic script accents. Light weights.",
      fonts: {
        heading: "Playfair Display, Cormorant, or Marcellus",
        body: "Lato, Karla, or Questrial"
      },
      imageStyle: "Magazine-quality wedding photography. Editorial feel. Consistent aesthetic across portfolio.",
      spacing: "Generous, luxurious feel. Gallery-focused.",
      mood: "Elegant, romantic, sophisticated, trustworthy, creative"
    },
    
    copywriting: {
      tone: "Warm, sophisticated, personal. Speak to the experience, not just logistics.",
      exampleHeadlines: [
        "Crafting unforgettable celebrations",
        "Where love stories become reality",
        "Luxury wedding planning & design",
        "Creating your perfect day",
        "Weddings as unique as you",
        "From vision to celebration"
      ],
      exampleCTAs: [
        "Start your journey",
        "Inquire now",
        "Get in touch",
        "Plan your celebration",
        "Schedule a consultation",
        "Let's create magic"
      ],
      avoidPhrases: [
        "Make your dreams come true",
        "Happily ever after",
        "Prince and princess",
        "Big day",
        "Stress-free guaranteed",
        "Cookie-cutter weddings"
      ]
    },
    
    images: {
      hero: [
        "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1600",
        "https://images.unsplash.com/photo-1478146896981-b80fe463b330?w=1600",
        "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=1600",
        "https://images.unsplash.com/photo-1507504031003-b417219a0fde?w=1600"
      ],
      products: [
        "https://images.unsplash.com/photo-1470290378698-263fa7ca60ab?w=1200",
        "https://images.unsplash.com/photo-1522413452208-996ff3f3e740?w=1200",
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200",
        "https://images.unsplash.com/photo-1532712938310-34cb3982ef74?w=1200"
      ],
      lifestyle: [
        "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=1200",
        "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=1200"
      ],
      about: [
        "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=1200",
        "https://images.unsplash.com/photo-1580894732444-8ecded7900cd?w=1200"
      ]
    }
  },

  // ============================================
  // 12. HOTEL / HOSPITALITY
  // ============================================
  {
    id: "hotel-hospitality",
    name: "Hotel & Hospitality",
    category: "hospitality",
    
    topBrands: ["Aman Resorts", "Soho House", "Ace Hotel", "The Standard", "Nobu Hotels"],
    
    psychology: {
      customerNeeds: [
        "See the property and rooms clearly",
        "Understand location and access",
        "Know amenities and services",
        "Read reviews from real guests",
        "Compare room options and prices",
        "Book quickly and securely"
      ],
      trustFactors: [
        "High-quality photos and videos",
        "Guest reviews and ratings",
        "Clear pricing (no hidden fees)",
        "Flexible cancellation policies",
        "Brand reputation",
        "Detailed amenity information"
      ],
      emotionalTriggers: [
        "Desire for escape and relaxation",
        "Anticipation of unique experience",
        "Need for comfort and care",
        "Social status and aesthetics",
        "Fear of making wrong choice",
        "Excitement about destination"
      ]
    },
    
    sections: [
      {
        id: "hero",
        name: "Property Hero",
        required: true,
        purpose: "Immediately transport the visitor",
        keyElements: [
          "Stunning property video or photo",
          "Property name and tagline",
          "Location indicator",
          "Book now / Check availability CTA",
          "Date picker widget"
        ]
      },
      {
        id: "essence",
        name: "The Experience",
        required: true,
        purpose: "Communicate the unique value",
        keyElements: [
          "What makes this property special",
          "Brand story or philosophy",
          "Highlight unique features",
          "Setting and surroundings"
        ]
      },
      {
        id: "rooms",
        name: "Rooms & Suites",
        required: true,
        purpose: "Showcase accommodation options",
        keyElements: [
          "Room type gallery",
          "Photos, size, features",
          "Starting prices",
          "Amenity lists",
          "Book button for each"
        ]
      },
      {
        id: "amenities",
        name: "Amenities",
        required: true,
        purpose: "Highlight property features",
        keyElements: [
          "Spa and wellness",
          "Dining options",
          "Pool, gym, etc.",
          "Business facilities",
          "Unique experiences offered"
        ]
      },
      {
        id: "dining",
        name: "Dining",
        required: false,
        purpose: "Showcase food and beverage",
        keyElements: [
          "Restaurant descriptions",
          "Menu highlights or links",
          "Photos of food and spaces",
          "Reservation links"
        ]
      },
      {
        id: "experiences",
        name: "Experiences / Activities",
        required: false,
        purpose: "Sell beyond the room",
        keyElements: [
          "Local experiences",
          "On-site activities",
          "Concierge services",
          "Seasonal offerings"
        ]
      },
      {
        id: "location",
        name: "Location",
        required: true,
        purpose: "Contextualize the destination",
        keyElements: [
          "Map embed",
          "Nearby attractions",
          "Transportation options",
          "Distance to key landmarks"
        ]
      },
      {
        id: "reviews",
        name: "Guest Reviews",
        required: true,
        purpose: "Social proof from travelers",
        keyElements: [
          "Review excerpts",
          "Rating indicators",
          "Link to full reviews",
          "Third-party review site ratings"
        ]
      },
      {
        id: "booking",
        name: "Booking Widget",
        required: true,
        purpose: "Enable conversion",
        keyElements: [
          "Date selector",
          "Guest count",
          "Room type filter",
          "Real-time availability",
          "Best rate guarantee"
        ]
      }
    ],
    
    design: {
      colorDescription: "Reflects brand identity. Often sophisticated, minimal. Let property photography shine.",
      colors: {
        primary: "#1A1A1A",
        secondary: "#C4A77D",
        accent: "#2C5F2D",
        background: "#FAF9F7"
      },
      typography: "Elegant, often custom or distinctive. Premium feel.",
      fonts: {
        heading: "Canela, Freight Display, or Playfair Display",
        body: "Suisse, Graphik, or Lato"
      },
      imageStyle: "High-end photography. Editorial quality. Lifestyle shots showing the experience. Architectural detail shots.",
      spacing: "Luxurious, generous. Let images breathe. Premium feel.",
      mood: "Luxurious, inviting, aspirational, calm, distinctive"
    },
    
    copywriting: {
      tone: "Sophisticated, evocative, experiential. Sell the feeling, not just features.",
      exampleHeadlines: [
        "Where time stands still",
        "Your urban retreat",
        "Discover your sanctuary",
        "Stay original",
        "Luxury redefined",
        "An escape like no other"
      ],
      exampleCTAs: [
        "Book your stay",
        "Check availability",
        "Reserve now",
        "Explore rooms",
        "Plan your escape",
        "Begin your journey"
      ],
      avoidPhrases: [
        "Home away from home",
        "World-class service",
        "Nestled in the heart of",
        "Unparalleled luxury",
        "Five-star excellence",
        "Paradise found"
      ]
    },
    
    images: {
      hero: [
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1600",
        "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=1600",
        "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1600",
        "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=1600",
        "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1600"
      ],
      products: [
        "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=1200",
        "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1200",
        "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1200",
        "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=1200"
      ],
      lifestyle: [
        "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1200",
        "https://images.unsplash.com/photo-1540541338287-41700207dee6?w=1200",
        "https://images.unsplash.com/photo-1561501900-3701fa6a0864?w=1200"
      ],
      about: [
        "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=1200",
        "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=1200"
      ]
    }
  }
];

export default techCreativeIndustries;
