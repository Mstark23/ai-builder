/**
 * VERKTORLABS Industry Intelligence - Professional Services Industries
 * Research-backed data for generating high-converting websites
 * 
 * Industries: 10
 * - Personal Injury Law
 * - Family Law
 * - Accounting/CPA
 * - Financial Advisor
 * - Real Estate Agent
 * - Marketing Agency
 * - Consulting Firm
 * - HR/Recruiting
 * - Architecture Firm
 * - Insurance Agency
 */

import type { IndustryIntelligence } from '../types/industry';

// Re-export the type for convenience
export type { IndustryIntelligence } from '../types/industry';

export const professionalIndustries: IndustryIntelligence[] = [
  // ============================================
  // 1. LAW FIRM - PERSONAL INJURY
  // ============================================
  {
    id: "law-firm-personal-injury",
    name: "Personal Injury Law Firm",
    category: "legal",
    
    topBrands: [
      "Morgan & Morgan",
      "Ben Crump Law",
      "Cellino & Barnes",
      "The Barnes Firm",
      "Rosenfeld Injury Lawyers"
    ],
    
    psychology: {
      customerNeeds: [
        "Immediate validation that they have a case",
        "Understanding they won't pay unless they win",
        "Confidence the firm has won similar cases",
        "Easy way to start without commitment",
        "Feeling understood and not judged",
        "Quick response to their situation"
      ],
      trustFactors: [
        "Total settlement amounts won ($XXX Million+)",
        "Number of cases won / success rate",
        "No fee unless we win guarantee",
        "Awards and legal recognitions",
        "Real client testimonials with outcomes",
        "Years of experience / cases handled",
        "Free consultation offer prominently displayed"
      ],
      emotionalTriggers: [
        "Justice and accountability",
        "Financial recovery and security",
        "Being heard and believed",
        "Fighting back against negligence",
        "Peace of mind during difficult time",
        "Not being taken advantage of by insurance"
      ]
    },
    
    sections: [
      {
        id: "hero",
        name: "Hero Section",
        required: true,
        purpose: "Instantly communicate you fight for injury victims and winning is guaranteed or free",
        keyElements: [
          "Bold headline with case type specificity",
          "No Fee Unless We Win - prominent",
          "Free consultation CTA (phone + form)",
          "Trust badges: settlements won, years experience",
          "24/7 availability indicator"
        ]
      },
      {
        id: "results",
        name: "Case Results",
        required: true,
        purpose: "Prove track record with specific dollar amounts",
        keyElements: [
          "Large settlement figures ($X.X Million format)",
          "Case type for each result",
          "Grid of 6-12 notable verdicts",
          "Total recovered for clients stat"
        ]
      },
      {
        id: "practice-areas",
        name: "Practice Areas",
        required: true,
        purpose: "Show expertise in their specific injury type",
        keyElements: [
          "Car accidents, truck accidents, motorcycle",
          "Medical malpractice, slip & fall",
          "Workers compensation, wrongful death",
          "Product liability, nursing home abuse",
          "Icon + brief description for each"
        ]
      },
      {
        id: "why-choose",
        name: "Why Choose Us",
        required: true,
        purpose: "Differentiate from ambulance chasers and big ad spenders",
        keyElements: [
          "Personal attention promise",
          "Resources to take on big insurance",
          "Trial experience (not just settlements)",
          "Client communication commitment",
          "No upfront costs explained"
        ]
      },
      {
        id: "process",
        name: "How It Works",
        required: true,
        purpose: "Reduce anxiety about legal process",
        keyElements: [
          "Step 1: Free consultation",
          "Step 2: Investigation & case building",
          "Step 3: Negotiation or trial",
          "Step 4: You get compensated",
          "Timeline expectations"
        ]
      },
      {
        id: "testimonials",
        name: "Client Testimonials",
        required: true,
        purpose: "Social proof from real clients",
        keyElements: [
          "Video testimonials if possible",
          "Specific outcomes mentioned",
          "Emotional journey stories",
          "Diverse case types represented"
        ]
      },
      {
        id: "attorneys",
        name: "Meet Our Attorneys",
        required: true,
        purpose: "Humanize the firm and show credentials",
        keyElements: [
          "Professional headshots",
          "Education and bar admissions",
          "Notable case wins",
          "Personal injury focus years"
        ]
      },
      {
        id: "faq",
        name: "FAQ",
        required: true,
        purpose: "Answer common concerns that prevent action",
        keyElements: [
          "How much does it cost?",
          "How long will my case take?",
          "What is my case worth?",
          "What if I was partially at fault?",
          "Statute of limitations info"
        ]
      },
      {
        id: "contact",
        name: "Contact / Free Consultation",
        required: true,
        purpose: "Convert visitors into consultations",
        keyElements: [
          "Phone number large and clickable",
          "Simple intake form",
          "24/7 messaging",
          "Office locations with map",
          "Chat widget"
        ]
      }
    ],
    
    design: {
      colorDescription: "Bold navy blue with gold/amber accents. Communicates authority and victory. Red used sparingly for urgency.",
      colors: {
        primary: "#1E3A5F",
        secondary: "#C9A227",
        accent: "#B8860B",
        background: "#FFFFFF"
      },
      typography: "Strong serif for headlines conveys tradition and authority. Clean sans-serif for body ensures readability.",
      fonts: {
        heading: "Playfair Display",
        body: "Source Sans Pro"
      },
      imageStyle: "Confident attorney portraits, courthouse imagery, empathetic client interactions. Avoid cliché gavels and scales unless done tastefully.",
      spacing: "Generous padding, clear visual hierarchy. Information dense but not cluttered.",
      mood: "Powerful, trustworthy, victorious, accessible"
    },
    
    copywriting: {
      tone: "Empathetic yet strong. You understand their pain but project confidence you'll win. Direct and clear, never condescending.",
      exampleHeadlines: [
        "Injured? Get the Compensation You Deserve",
        "We Fight Insurance Companies So You Don't Have To",
        "Over $500 Million Recovered for Our Clients",
        "You Don't Pay Unless We Win. Period.",
        "Hurt in an Accident? We Can Help."
      ],
      exampleCTAs: [
        "Get Your Free Case Review",
        "Call Now - Available 24/7",
        "Find Out What Your Case Is Worth",
        "Start Your Free Consultation",
        "Speak With an Attorney Today"
      ],
      avoidPhrases: [
        "Ambulance chaser language",
        "Guaranteed outcomes (ethics violation)",
        "Attacking other lawyers",
        "Overly aggressive/sensational",
        "Legal jargon without explanation"
      ]
    },
    
    images: {
      hero: [
        "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=1920&q=80",
        "https://images.unsplash.com/photo-1521791055366-0d553872125f?w=1920&q=80",
        "https://images.unsplash.com/photo-1593115057322-e94b77572f20?w=1920&q=80",
        "https://images.unsplash.com/photo-1436450412740-6b988f486c6b?w=1920&q=80",
        "https://images.unsplash.com/photo-1575505586569-646b2ca898fc?w=1920&q=80"
      ],
      products: [
        "https://images.unsplash.com/photo-1479142506502-19b3a3b7ff33?w=800&q=80",
        "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&q=80",
        "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&q=80",
        "https://images.unsplash.com/photo-1423592707957-3b212afa6733?w=800&q=80"
      ],
      lifestyle: [
        "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=800&q=80",
        "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=800&q=80",
        "https://images.unsplash.com/photo-1573497620053-ea5300f94f21?w=800&q=80"
      ],
      about: [
        "https://images.unsplash.com/photo-1556157382-97eda2d62296?w=800&q=80",
        "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&q=80",
        "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800&q=80"
      ]
    }
  },
  
  // ============================================
  // 2. LAW FIRM - CORPORATE
  // ============================================
  {
    id: "law-firm-corporate",
    name: "Corporate Law Firm",
    category: "legal",
    
    topBrands: [
      "Skadden, Arps, Slate, Meagher & Flom",
      "Cravath, Swaine & Moore",
      "Wachtell, Lipton, Rosen & Katz",
      "Sullivan & Cromwell",
      "Kirkland & Ellis"
    ],
    
    psychology: {
      customerNeeds: [
        "Confidence firm handles high-stakes matters",
        "Understanding of their specific industry",
        "Access to senior partners, not just associates",
        "Global reach and capabilities",
        "Discretion and confidentiality",
        "Strategic thinking, not just legal compliance"
      ],
      trustFactors: [
        "Notable transactions and deals handled",
        "Rankings (Chambers, Am Law 100, Vault)",
        "Partner credentials and pedigree",
        "Industry-specific practice group depth",
        "Global office network",
        "Client roster (implied through industries served)"
      ],
      emotionalTriggers: [
        "Prestige and exclusivity",
        "Risk mitigation and protection",
        "Competitive advantage through legal strategy",
        "Confidence in major business decisions",
        "Access to elite legal minds",
        "Partnership in business success"
      ]
    },
    
    sections: [
      {
        id: "hero",
        name: "Hero Section",
        required: true,
        purpose: "Establish prestige and sophistication immediately",
        keyElements: [
          "Understated, confident headline",
          "Subtle firm differentiator",
          "Premium photography/video background",
          "Minimal text, maximum impact",
          "No garish CTAs - subtle contact paths"
        ]
      },
      {
        id: "practices",
        name: "Practice Areas",
        required: true,
        purpose: "Demonstrate full-service capabilities",
        keyElements: [
          "M&A, Private Equity, Capital Markets",
          "Litigation & Arbitration",
          "Tax, Real Estate, IP",
          "Regulatory & Government",
          "Restructuring, Employment",
          "Elegant grid or list presentation"
        ]
      },
      {
        id: "industries",
        name: "Industries",
        required: true,
        purpose: "Show sector expertise clients care about",
        keyElements: [
          "Financial Services",
          "Technology & Media",
          "Healthcare & Life Sciences",
          "Energy & Infrastructure",
          "Private Equity & Funds"
        ]
      },
      {
        id: "experience",
        name: "Representative Experience",
        required: true,
        purpose: "Prove track record with notable matters",
        keyElements: [
          "Deal descriptions (anonymized if needed)",
          "Transaction values when notable",
          "Industry and practice area tags",
          "Filterable/searchable database feel"
        ]
      },
      {
        id: "professionals",
        name: "Our Professionals",
        required: true,
        purpose: "Showcase partner depth and talent",
        keyElements: [
          "Searchable attorney directory",
          "Practice and office filters",
          "Individual credential pages",
          "Education, admissions, recognition"
        ]
      },
      {
        id: "insights",
        name: "Insights & News",
        required: true,
        purpose: "Demonstrate thought leadership",
        keyElements: [
          "Client alerts on regulatory changes",
          "Deal announcements",
          "Speaking engagements",
          "Published articles and analysis"
        ]
      },
      {
        id: "offices",
        name: "Global Offices",
        required: true,
        purpose: "Show geographic reach",
        keyElements: [
          "Interactive map or elegant list",
          "Major financial centers represented",
          "Local contact for each office"
        ]
      },
      {
        id: "recognition",
        name: "Awards & Rankings",
        required: false,
        purpose: "Third-party validation",
        keyElements: [
          "Chambers rankings",
          "Am Law standings",
          "Notable case wins",
          "Industry awards"
        ]
      },
      {
        id: "careers",
        name: "Careers",
        required: true,
        purpose: "Attract top legal talent",
        keyElements: [
          "Associate programs",
          "Summer associate info",
          "Diversity & inclusion",
          "Benefits and culture"
        ]
      },
      {
        id: "contact",
        name: "Contact",
        required: true,
        purpose: "Facilitate sophisticated inquiries",
        keyElements: [
          "General inquiry form",
          "Office-specific contacts",
          "Media relations",
          "No hard-sell elements"
        ]
      }
    ],
    
    design: {
      colorDescription: "Deep navy, charcoal, or black with subtle metallic accents. White space is a feature. Conveys established prestige.",
      colors: {
        primary: "#0A1628",
        secondary: "#1E3A5F",
        accent: "#8B7355",
        background: "#FFFFFF"
      },
      typography: "Refined serif for headlines, elegant sans-serif for body. Typography should feel like a premium publication.",
      fonts: {
        heading: "Cormorant Garamond",
        body: "Inter"
      },
      imageStyle: "Architectural photography, abstract textures, cityscape/skyline imagery. Minimal people photography - when used, very editorial and diverse.",
      spacing: "Extremely generous. White space conveys confidence and premium positioning.",
      mood: "Sophisticated, authoritative, understated, global"
    },
    
    copywriting: {
      tone: "Confident but never boastful. Precise, measured language. Let credentials speak. Formal but not stiff.",
      exampleHeadlines: [
        "Counsel for Consequential Matters",
        "Where Business and Law Converge",
        "Trusted Advisors to Leading Enterprises",
        "Strategic Legal Excellence",
        "Navigating Complexity, Delivering Results"
      ],
      exampleCTAs: [
        "View Our Experience",
        "Contact Our Team",
        "Explore Practice Areas",
        "Find a Professional",
        "Read Our Latest Insights"
      ],
      avoidPhrases: [
        "Aggressive or combative language",
        "Discount or price mentions",
        "Superlatives without backing",
        "Casual or conversational tone",
        "Urgency-based CTAs"
      ]
    },
    
    images: {
      hero: [
        "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1920&q=80",
        "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1920&q=80",
        "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=1920&q=80",
        "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=1920&q=80"
      ],
      products: [
        "https://images.unsplash.com/photo-1568992687947-868a62a9f521?w=800&q=80",
        "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&q=80",
        "https://images.unsplash.com/photo-1551135049-8a33b5883817?w=800&q=80"
      ],
      lifestyle: [
        "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800&q=80",
        "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&q=80"
      ],
      about: [
        "https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=800&q=80",
        "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80",
        "https://images.unsplash.com/photo-1552581234-26160f608093?w=800&q=80"
      ]
    }
  },
  
  // ============================================
  // 3. ACCOUNTING / CPA FIRM
  // ============================================
  {
    id: "accounting-cpa",
    name: "Accounting & CPA Firm",
    category: "financial",
    
    topBrands: [
      "Bench",
      "Pilot",
      "KPMG",
      "Deloitte",
      "RSM US",
      "BDO USA"
    ],
    
    psychology: {
      customerNeeds: [
        "Peace of mind about tax compliance",
        "Saving money through proper planning",
        "Understanding their financial position",
        "Timely and accurate work",
        "Proactive advice, not just filing",
        "Responsive communication"
      ],
      trustFactors: [
        "CPA certifications prominently displayed",
        "Years in business / clients served",
        "Industry specializations",
        "Secure data handling credentials",
        "Professional associations (AICPA)",
        "Client testimonials with specifics"
      ],
      emotionalTriggers: [
        "Relief from tax stress and complexity",
        "Confidence in financial decisions",
        "Protection from IRS issues",
        "More time to focus on business",
        "Feeling financially organized",
        "Avoiding costly mistakes"
      ]
    },
    
    sections: [
      {
        id: "hero",
        name: "Hero Section",
        required: true,
        purpose: "Communicate expertise and reliability",
        keyElements: [
          "Clear value proposition headline",
          "Primary audience callout (businesses vs individuals)",
          "Trust badges (CPA, years experience)",
          "Free consultation or quote CTA"
        ]
      },
      {
        id: "services",
        name: "Services",
        required: true,
        purpose: "Show full range of capabilities",
        keyElements: [
          "Tax Preparation & Planning",
          "Bookkeeping & Accounting",
          "Payroll Services",
          "Business Advisory",
          "Audit & Assurance",
          "IRS Representation"
        ]
      },
      {
        id: "industries",
        name: "Industries We Serve",
        required: true,
        purpose: "Demonstrate specialized expertise",
        keyElements: [
          "Small Business",
          "Real Estate",
          "Healthcare",
          "Professional Services",
          "E-commerce / Startups",
          "Non-profits"
        ]
      },
      {
        id: "why-us",
        name: "Why Choose Us",
        required: true,
        purpose: "Differentiate from competition",
        keyElements: [
          "Proactive tax planning approach",
          "Technology-forward (cloud accounting)",
          "Dedicated account manager",
          "Fixed pricing / transparent fees",
          "Year-round availability"
        ]
      },
      {
        id: "process",
        name: "Our Process",
        required: false,
        purpose: "Reduce uncertainty about working together",
        keyElements: [
          "Initial consultation",
          "Document collection (secure portal)",
          "Review and preparation",
          "Final review with client",
          "Filing and follow-up"
        ]
      },
      {
        id: "team",
        name: "Our Team",
        required: true,
        purpose: "Build trust through credentials",
        keyElements: [
          "CPA credentials highlighted",
          "Education and certifications",
          "Years of experience",
          "Specialization areas"
        ]
      },
      {
        id: "testimonials",
        name: "Client Success Stories",
        required: true,
        purpose: "Social proof",
        keyElements: [
          "Business owner testimonials",
          "Specific outcomes (savings, resolved issues)",
          "Industry diversity",
          "Google/Yelp rating showcase"
        ]
      },
      {
        id: "resources",
        name: "Resources / Blog",
        required: false,
        purpose: "SEO and thought leadership",
        keyElements: [
          "Tax deadline reminders",
          "Tax law changes updates",
          "Business tax tips",
          "Downloadable guides"
        ]
      },
      {
        id: "contact",
        name: "Contact / Get Started",
        required: true,
        purpose: "Convert inquiries",
        keyElements: [
          "Simple contact form",
          "Phone number",
          "Office location/hours",
          "Free consultation offer"
        ]
      }
    ],
    
    design: {
      colorDescription: "Professional greens and blues. Green suggests money/growth, blue suggests trust. Clean, organized feel.",
      colors: {
        primary: "#1A5F4A",
        secondary: "#2D4A5E",
        accent: "#4CAF50",
        background: "#F8FAF9"
      },
      typography: "Clean, modern sans-serif throughout. Numbers should be highly legible. Tables and data should be clear.",
      fonts: {
        heading: "DM Sans",
        body: "IBM Plex Sans"
      },
      imageStyle: "Professional office settings, organized workspaces, confident professionals, abstract financial graphics. Avoid cliché calculator/money images.",
      spacing: "Clean and organized like a well-kept ledger. Clear sections, logical flow.",
      mood: "Trustworthy, organized, approachable, professional"
    },
    
    copywriting: {
      tone: "Knowledgeable and reassuring. Technical when needed but explained clearly. Friendly professional.",
      exampleHeadlines: [
        "Tax Expertise You Can Trust",
        "More Than Tax Prep. Strategic Financial Partners.",
        "Focus on Your Business. We'll Handle the Numbers.",
        "Proactive Tax Planning for Growing Businesses",
        "Your Success is Our Bottom Line"
      ],
      exampleCTAs: [
        "Schedule Your Free Consultation",
        "Get a Custom Quote",
        "Talk to a CPA Today",
        "Start Your Tax Prep",
        "Request a Proposal"
      ],
      avoidPhrases: [
        "Cheap or discount positioning",
        "Overpromising on refunds",
        "Fear-mongering about IRS",
        "Overly casual tone",
        "Generic 'we're different' claims"
      ]
    },
    
    images: {
      hero: [
        "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1920&q=80",
        "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=1920&q=80",
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1920&q=80",
        "https://images.unsplash.com/photo-1554224154-22dec7ec8818?w=1920&q=80"
      ],
      products: [
        "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&q=80",
        "https://images.unsplash.com/photo-1543286386-713bdd548da4?w=800&q=80",
        "https://images.unsplash.com/photo-1586282391129-76a6df230234?w=800&q=80"
      ],
      lifestyle: [
        "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=800&q=80",
        "https://images.unsplash.com/photo-1556761175-4b46a572b786?w=800&q=80"
      ],
      about: [
        "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&q=80",
        "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&q=80",
        "https://images.unsplash.com/photo-1521791136064-7986c2920216?w=800&q=80"
      ]
    }
  },
  
  // ============================================
  // 4. FINANCIAL ADVISOR
  // ============================================
  {
    id: "financial-advisor",
    name: "Financial Advisor / Wealth Management",
    category: "financial",
    
    topBrands: [
      "Betterment",
      "Wealthfront",
      "Personal Capital",
      "Fisher Investments",
      "Vanguard Personal Advisor Services",
      "Edelman Financial Engines"
    ],
    
    psychology: {
      customerNeeds: [
        "Confidence their money is in good hands",
        "Clear understanding of fees",
        "Personalized strategy for their situation",
        "Access to advisor when needed",
        "Progress toward financial goals",
        "Protection from market volatility"
      ],
      trustFactors: [
        "Fiduciary commitment (legally must act in client interest)",
        "CFP, CFA, or other credentials",
        "Fee transparency (fee-only vs commission)",
        "Assets under management",
        "Years of experience / market cycles navigated",
        "Regulatory compliance (SEC, FINRA registered)"
      ],
      emotionalTriggers: [
        "Security and peace of mind",
        "Freedom to enjoy life/retirement",
        "Legacy for family",
        "Achieving life goals",
        "Feeling in control of financial future",
        "Relief from financial anxiety"
      ]
    },
    
    sections: [
      {
        id: "hero",
        name: "Hero Section",
        required: true,
        purpose: "Establish trust and communicate value prop",
        keyElements: [
          "Client-focused headline",
          "Fiduciary badge if applicable",
          "Primary audience (retirees, executives, etc)",
          "Free consultation CTA"
        ]
      },
      {
        id: "services",
        name: "Services",
        required: true,
        purpose: "Show comprehensive planning capabilities",
        keyElements: [
          "Retirement Planning",
          "Investment Management",
          "Tax Planning",
          "Estate Planning",
          "Risk Management / Insurance",
          "Education Funding"
        ]
      },
      {
        id: "approach",
        name: "Our Approach / Philosophy",
        required: true,
        purpose: "Differentiate investment philosophy",
        keyElements: [
          "Fiduciary standard explained",
          "Investment philosophy (passive vs active)",
          "Risk management approach",
          "Holistic planning method",
          "Technology integration"
        ]
      },
      {
        id: "who-we-serve",
        name: "Who We Serve",
        required: true,
        purpose: "Help visitors self-qualify",
        keyElements: [
          "Investment minimums if any",
          "Ideal client profiles",
          "Life stage focus (pre-retirement, executives)",
          "Specific situations handled"
        ]
      },
      {
        id: "team",
        name: "Our Team",
        required: true,
        purpose: "Build trust through credentials and personality",
        keyElements: [
          "CFP, CFA credentials prominently",
          "Education and career background",
          "Personal stories / why they do this",
          "Professional headshots"
        ]
      },
      {
        id: "fees",
        name: "Fee Structure",
        required: true,
        purpose: "Build trust through transparency",
        keyElements: [
          "Fee-only vs commission explanation",
          "Clear fee schedule or ranges",
          "What's included",
          "No hidden costs message"
        ]
      },
      {
        id: "testimonials",
        name: "Client Stories",
        required: true,
        purpose: "Social proof with compliance considerations",
        keyElements: [
          "Anonymous or compliant testimonials",
          "Outcome-focused stories",
          "Diverse client situations",
          "Long-term relationship emphasis"
        ]
      },
      {
        id: "resources",
        name: "Resources / Insights",
        required: false,
        purpose: "Thought leadership and SEO",
        keyElements: [
          "Market commentary",
          "Retirement planning guides",
          "Calculators and tools",
          "Webinars and events"
        ]
      },
      {
        id: "contact",
        name: "Start Your Plan",
        required: true,
        purpose: "Convert to consultation",
        keyElements: [
          "Schedule consultation CTA",
          "What to expect in first meeting",
          "Contact form",
          "Phone and office info"
        ]
      }
    ],
    
    design: {
      colorDescription: "Deep blues and greens convey stability and growth. Gold accents suggest wealth. Clean, premium feel.",
      colors: {
        primary: "#1B365D",
        secondary: "#2E5D4B",
        accent: "#C9A227",
        background: "#FAFBFC"
      },
      typography: "Refined serif for headlines conveys tradition and trust. Modern sans-serif for body ensures readability of financial content.",
      fonts: {
        heading: "Libre Baskerville",
        body: "Nunito Sans"
      },
      imageStyle: "Happy retirees, family moments, life milestones, subtle wealth indicators. Avoid obvious money/stock imagery.",
      spacing: "Generous, premium feel. Never cluttered. Financial info presented clearly.",
      mood: "Trustworthy, aspirational, calm, professional"
    },
    
    copywriting: {
      tone: "Knowledgeable and reassuring. Client goals first, products second. Warm but professional.",
      exampleHeadlines: [
        "Your Financial Partner for Life's Journey",
        "Fee-Only Advice. Your Interests First.",
        "Retirement Planning That Puts You First",
        "Building Wealth. Preserving Legacy.",
        "Financial Clarity for Every Chapter"
      ],
      exampleCTAs: [
        "Schedule Your Free Consultation",
        "Start Your Financial Plan",
        "Talk to an Advisor",
        "Get Your Retirement Checkup",
        "Request a Portfolio Review"
      ],
      avoidPhrases: [
        "Get rich quick language",
        "Guaranteed returns (regulatory issue)",
        "Beating the market claims",
        "Fear-mongering about economy",
        "Pressure tactics"
      ]
    },
    
    images: {
      hero: [
        "https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=1920&q=80",
        "https://images.unsplash.com/photo-1559526324-593bc073d938?w=1920&q=80",
        "https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=1920&q=80",
        "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=1920&q=80"
      ],
      products: [
        "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=800&q=80",
        "https://images.unsplash.com/photo-1565514020179-026b92b2d70b?w=800&q=80",
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80"
      ],
      lifestyle: [
        "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=800&q=80",
        "https://images.unsplash.com/photo-1484863137850-59afcfe05386?w=800&q=80",
        "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&q=80"
      ],
      about: [
        "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=800&q=80",
        "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=800&q=80",
        "https://images.unsplash.com/photo-1600880292089-90a7e086ee0c?w=800&q=80"
      ]
    }
  },
  
  // ============================================
  // 5. REAL ESTATE - RESIDENTIAL
  // ============================================
  {
    id: "real-estate-residential",
    name: "Residential Real Estate",
    category: "real-estate",
    
    topBrands: [
      "Compass",
      "Sotheby's International Realty",
      "The Agency",
      "Douglas Elliman",
      "Coldwell Banker Global Luxury"
    ],
    
    psychology: {
      customerNeeds: [
        "Finding the right home for their lifestyle",
        "Getting the best price (buying or selling)",
        "Understanding the local market",
        "Smooth, low-stress transaction",
        "Access to off-market opportunities",
        "Expert negotiation on their behalf"
      ],
      trustFactors: [
        "Sales volume and transaction history",
        "Local market expertise (neighborhoods)",
        "Client testimonials and reviews",
        "Professional designations (ABR, CRS, Luxury)",
        "Brokerage reputation",
        "Marketing capabilities for sellers"
      ],
      emotionalTriggers: [
        "Finding their dream home",
        "Excitement of new beginnings",
        "Security of a good investment",
        "Pride of homeownership",
        "Relief when transaction closes smoothly",
        "Trust in advisor relationship"
      ]
    },
    
    sections: [
      {
        id: "hero",
        name: "Hero Section",
        required: true,
        purpose: "Capture attention with stunning property/lifestyle imagery",
        keyElements: [
          "High-impact property imagery or video",
          "Agent/team name prominently",
          "Primary service areas",
          "Search functionality or CTA"
        ]
      },
      {
        id: "featured-listings",
        name: "Featured Listings",
        required: true,
        purpose: "Showcase current inventory and market position",
        keyElements: [
          "High-quality property photos",
          "Price, beds, baths, sqft",
          "Neighborhood/location",
          "Open house dates if applicable",
          "Link to full listing"
        ]
      },
      {
        id: "search",
        name: "Property Search",
        required: true,
        purpose: "Engage buyers with search functionality",
        keyElements: [
          "MLS/IDX integration",
          "Filter by price, beds, location",
          "Map-based search",
          "Save search functionality"
        ]
      },
      {
        id: "about",
        name: "About / Meet the Agent",
        required: true,
        purpose: "Build personal connection and trust",
        keyElements: [
          "Professional photo (lifestyle feel)",
          "Personal story and why real estate",
          "Local expertise highlighted",
          "Production stats",
          "Designations and awards"
        ]
      },
      {
        id: "sold",
        name: "Recently Sold / Success Stories",
        required: true,
        purpose: "Prove track record",
        keyElements: [
          "Sold properties with prices",
          "Before/after or list/sale comparison",
          "Days on market stats",
          "Client testimonial with each"
        ]
      },
      {
        id: "buyers",
        name: "For Buyers",
        required: true,
        purpose: "Speak directly to buyer needs",
        keyElements: [
          "Buyer process overview",
          "First-time buyer resources",
          "Neighborhood guides",
          "Pre-approval partners"
        ]
      },
      {
        id: "sellers",
        name: "For Sellers",
        required: true,
        purpose: "Attract listing appointments",
        keyElements: [
          "Home valuation CTA",
          "Marketing plan overview",
          "Staging and prep resources",
          "Pricing strategy philosophy"
        ]
      },
      {
        id: "neighborhoods",
        name: "Neighborhood Guides",
        required: false,
        purpose: "Demonstrate local expertise",
        keyElements: [
          "Area overviews with stats",
          "Schools, amenities, lifestyle",
          "Market trends by area",
          "Video tours if possible"
        ]
      },
      {
        id: "testimonials",
        name: "Client Reviews",
        required: true,
        purpose: "Social proof from past clients",
        keyElements: [
          "Zillow/Realtor.com review integration",
          "Video testimonials",
          "Buyer and seller mix",
          "Specific transaction details"
        ]
      },
      {
        id: "contact",
        name: "Contact",
        required: true,
        purpose: "Convert visitors to clients",
        keyElements: [
          "Phone prominently displayed",
          "Contact form",
          "Home valuation request",
          "Schedule showing CTA"
        ]
      }
    ],
    
    design: {
      colorDescription: "For luxury: black, white, gold. For approachable: navy, white, soft gold or green. Premium feel regardless.",
      colors: {
        primary: "#1A1A2E",
        secondary: "#4A4E69",
        accent: "#C9A227",
        background: "#FFFFFF"
      },
      typography: "Elegant serif for property names and headlines. Clean sans for details and navigation. Luxury feel.",
      fonts: {
        heading: "Cormorant",
        body: "Montserrat"
      },
      imageStyle: "Stunning property photography is everything. Twilight shots, drone aerials, lifestyle staging. Agent photos should be professional but approachable.",
      spacing: "Let beautiful images breathe. Generous white space conveys luxury.",
      mood: "Aspirational, trustworthy, local expert, premium"
    },
    
    copywriting: {
      tone: "Warm and knowledgeable. Expert but not condescending. Genuinely helpful. Local insider.",
      exampleHeadlines: [
        "Find Your Place in [City]",
        "Local Expertise. Exceptional Results.",
        "Your Home Search Starts Here",
        "Selling Your Home? Get Top Dollar.",
        "Real Estate Elevated"
      ],
      exampleCTAs: [
        "View All Listings",
        "What's My Home Worth?",
        "Schedule a Showing",
        "Start Your Search",
        "Let's Talk About Your Goals"
      ],
      avoidPhrases: [
        "Hard sell pressure tactics",
        "Unrealistic price promises",
        "Generic 'I love real estate'",
        "Stale MLS descriptions",
        "Stock/impersonal language"
      ]
    },
    
    images: {
      hero: [
        "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920&q=80",
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1920&q=80",
        "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1920&q=80",
        "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1920&q=80",
        "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1920&q=80"
      ],
      products: [
        "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80",
        "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80",
        "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80",
        "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800&q=80"
      ],
      lifestyle: [
        "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&q=80",
        "https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=800&q=80",
        "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80"
      ],
      about: [
        "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=800&q=80",
        "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=800&q=80",
        "https://images.unsplash.com/photo-1556157382-97eda2d62296?w=800&q=80"
      ]
    }
  },
  
  // ============================================
  // 6. REAL ESTATE - COMMERCIAL
  // ============================================
  {
    id: "real-estate-commercial",
    name: "Commercial Real Estate",
    category: "real-estate",
    
    topBrands: [
      "CBRE",
      "JLL",
      "Cushman & Wakefield",
      "Newmark",
      "Colliers International",
      "Marcus & Millichap"
    ],
    
    psychology: {
      customerNeeds: [
        "Data-driven market insights",
        "Access to off-market deals",
        "Expertise in specific property types",
        "Strong negotiation for best terms",
        "Understanding of zoning and regulations",
        "Capital markets knowledge"
      ],
      trustFactors: [
        "Transaction volume and deal size",
        "Specific property type expertise",
        "Market research and reports",
        "Client roster (implied)",
        "Brokerage platform and resources",
        "Professional designations (CCIM, SIOR)"
      ],
      emotionalTriggers: [
        "Confidence in investment decisions",
        "Competitive advantage through information",
        "Trust in advisor expertise",
        "Relief of complex transaction management",
        "Success of their business/investment",
        "Partnership mindset"
      ]
    },
    
    sections: [
      {
        id: "hero",
        name: "Hero Section",
        required: true,
        purpose: "Establish market leadership",
        keyElements: [
          "Strong positioning statement",
          "Property type or market focus",
          "Key stats (volume, deals)",
          "Search or property spotlight"
        ]
      },
      {
        id: "services",
        name: "Services",
        required: true,
        purpose: "Show full capabilities",
        keyElements: [
          "Tenant Representation",
          "Landlord Representation",
          "Investment Sales",
          "Capital Markets",
          "Property Management",
          "Consulting / Advisory"
        ]
      },
      {
        id: "property-types",
        name: "Property Types",
        required: true,
        purpose: "Demonstrate specialization",
        keyElements: [
          "Office",
          "Industrial / Logistics",
          "Retail",
          "Multifamily",
          "Hospitality",
          "Healthcare / Life Sciences"
        ]
      },
      {
        id: "listings",
        name: "Available Properties",
        required: true,
        purpose: "Showcase inventory",
        keyElements: [
          "Commercial listing search",
          "For Lease vs For Sale filter",
          "Property type filters",
          "Key specs (SF, price, cap rate)"
        ]
      },
      {
        id: "research",
        name: "Market Research",
        required: true,
        purpose: "Thought leadership and lead generation",
        keyElements: [
          "Market reports by sector",
          "Economic outlook",
          "Rent and vacancy trends",
          "Gated content for lead capture"
        ]
      },
      {
        id: "team",
        name: "Our Professionals",
        required: true,
        purpose: "Showcase expertise",
        keyElements: [
          "Searchable broker directory",
          "Specialization filters",
          "Deal history",
          "Contact information"
        ]
      },
      {
        id: "case-studies",
        name: "Transaction Highlights",
        required: true,
        purpose: "Prove track record",
        keyElements: [
          "Notable deal closings",
          "Deal size and terms",
          "Client objectives achieved",
          "Property type diversity"
        ]
      },
      {
        id: "insights",
        name: "Insights & News",
        required: false,
        purpose: "Thought leadership",
        keyElements: [
          "Market commentary",
          "Deal announcements",
          "Industry trends",
          "Expert perspectives"
        ]
      },
      {
        id: "contact",
        name: "Contact",
        required: true,
        purpose: "Facilitate inquiries",
        keyElements: [
          "General inquiry form",
          "Office locations",
          "Specialist contacts by service/property type"
        ]
      }
    ],
    
    design: {
      colorDescription: "Corporate blues, grays, sophisticated. Data-forward. Premium but not flashy.",
      colors: {
        primary: "#003366",
        secondary: "#6B7B8C",
        accent: "#0077B6",
        background: "#F5F7FA"
      },
      typography: "Clean, modern sans-serif throughout. Data and numbers must be highly readable. Professional publication feel.",
      fonts: {
        heading: "Neue Haas Grotesk Display Pro",
        body: "Inter"
      },
      imageStyle: "Architectural photography of buildings, skylines, industrial spaces. Drone/aerial shots. Data visualizations. Minimal people.",
      spacing: "Clean, organized, data-friendly. Grid-based layouts.",
      mood: "Authoritative, data-driven, sophisticated, institutional"
    },
    
    copywriting: {
      tone: "Professional, data-informed, confident. Industry terminology expected. Thought leadership positioning.",
      exampleHeadlines: [
        "Commercial Real Estate Intelligence",
        "Market Leaders in [City/Region]",
        "Data-Driven Real Estate Solutions",
        "Your Partner in Commercial Success",
        "Insights That Move Markets"
      ],
      exampleCTAs: [
        "View Available Properties",
        "Download Market Report",
        "Connect With a Specialist",
        "Search Listings",
        "Get Property Valuation"
      ],
      avoidPhrases: [
        "Residential real estate language",
        "Emotional appeals",
        "Generic superlatives",
        "Consumer-focused messaging",
        "Oversimplified concepts"
      ]
    },
    
    images: {
      hero: [
        "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1920&q=80",
        "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=1920&q=80",
        "https://images.unsplash.com/photo-1577415124269-fc1140354c49?w=1920&q=80",
        "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=1920&q=80"
      ],
      products: [
        "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80",
        "https://images.unsplash.com/photo-1587293852726-70cdb56c2866?w=800&q=80",
        "https://images.unsplash.com/photo-1565623833408-d77e39b88af6?w=800&q=80",
        "https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=800&q=80"
      ],
      lifestyle: [
        "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&q=80",
        "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=800&q=80"
      ],
      about: [
        "https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=800&q=80",
        "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&q=80",
        "https://images.unsplash.com/photo-1556761175-4b46a572b786?w=800&q=80"
      ]
    }
  },
  
  // ============================================
  // 7. CONSULTING / MANAGEMENT
  // ============================================
  {
    id: "consulting-management",
    name: "Management Consulting",
    category: "consulting",
    
    topBrands: [
      "McKinsey & Company",
      "Bain & Company",
      "Boston Consulting Group",
      "Deloitte Consulting",
      "Accenture Strategy"
    ],
    
    psychology: {
      customerNeeds: [
        "Solving complex business challenges",
        "Objective outside perspective",
        "Access to best practices and frameworks",
        "Implementation support, not just strategy",
        "Measurable results and ROI",
        "Confidentiality and discretion"
      ],
      trustFactors: [
        "Client results and case studies",
        "Industry expertise depth",
        "Team credentials (MBA, industry experience)",
        "Methodology and frameworks",
        "Thought leadership and publications",
        "Reference clients"
      ],
      emotionalTriggers: [
        "Confidence in business decisions",
        "Competitive advantage",
        "Growth and transformation",
        "Risk mitigation",
        "Access to expertise unavailable internally",
        "Partnership in success"
      ]
    },
    
    sections: [
      {
        id: "hero",
        name: "Hero Section",
        required: true,
        purpose: "Establish expertise and value",
        keyElements: [
          "Bold value proposition",
          "Results-oriented messaging",
          "Professional imagery",
          "Contact or explore CTA"
        ]
      },
      {
        id: "services",
        name: "Services / Capabilities",
        required: true,
        purpose: "Show range of expertise",
        keyElements: [
          "Strategy & Growth",
          "Operations & Performance",
          "Digital Transformation",
          "Organization & Talent",
          "M&A and Integration",
          "Industry-specific services"
        ]
      },
      {
        id: "industries",
        name: "Industries",
        required: true,
        purpose: "Demonstrate sector expertise",
        keyElements: [
          "Financial Services",
          "Healthcare",
          "Technology",
          "Manufacturing",
          "Retail & Consumer",
          "Energy & Utilities"
        ]
      },
      {
        id: "approach",
        name: "Our Approach",
        required: true,
        purpose: "Differentiate methodology",
        keyElements: [
          "Collaborative partnership model",
          "Data-driven insights",
          "Implementation focus",
          "Knowledge transfer",
          "Measurable outcomes"
        ]
      },
      {
        id: "case-studies",
        name: "Case Studies / Results",
        required: true,
        purpose: "Prove impact",
        keyElements: [
          "Specific client challenges",
          "Approach taken",
          "Measurable results achieved",
          "Industry and service diversity"
        ]
      },
      {
        id: "team",
        name: "Our Team",
        required: true,
        purpose: "Showcase expertise",
        keyElements: [
          "Leadership team",
          "Credentials and experience",
          "Industry backgrounds",
          "Professional bios"
        ]
      },
      {
        id: "insights",
        name: "Insights / Thought Leadership",
        required: true,
        purpose: "Demonstrate expertise and generate leads",
        keyElements: [
          "Whitepapers and research",
          "Industry perspectives",
          "Webinars and events",
          "Newsletter signup"
        ]
      },
      {
        id: "careers",
        name: "Careers",
        required: false,
        purpose: "Attract talent",
        keyElements: [
          "Culture and values",
          "Open positions",
          "Growth opportunities",
          "Benefits"
        ]
      },
      {
        id: "contact",
        name: "Contact",
        required: true,
        purpose: "Facilitate conversations",
        keyElements: [
          "Inquiry form",
          "Office locations",
          "General and specific contacts"
        ]
      }
    ],
    
    design: {
      colorDescription: "Sophisticated neutrals with strategic accent color. Deep blues, charcoals, with one bold accent. Premium feel.",
      colors: {
        primary: "#1A1A2E",
        secondary: "#3D5A80",
        accent: "#00A878",
        background: "#FFFFFF"
      },
      typography: "Clean, modern sans-serif. Professional and readable. Data should be presented beautifully.",
      fonts: {
        heading: "Söhne",
        body: "Inter"
      },
      imageStyle: "Abstract business concepts, strategic imagery, professional team shots. Avoid obvious stock photos. Data visualizations.",
      spacing: "Generous, premium, confidence-projecting. Clean grids.",
      mood: "Authoritative, innovative, sophisticated, results-oriented"
    },
    
    copywriting: {
      tone: "Confident and intelligent. Results-focused. Industry-aware. Collaborative, not preachy.",
      exampleHeadlines: [
        "Strategy That Delivers Results",
        "Transforming Complexity Into Clarity",
        "Your Partner in Growth",
        "Insights That Drive Performance",
        "Building Better Businesses"
      ],
      exampleCTAs: [
        "Explore Our Services",
        "Read Case Studies",
        "Connect With Us",
        "Download Insights",
        "Start a Conversation"
      ],
      avoidPhrases: [
        "Jargon-heavy MBA speak",
        "Vague claims without proof",
        "Arrogant tone",
        "One-size-fits-all messaging",
        "Trendy buzzwords overuse"
      ]
    },
    
    images: {
      hero: [
        "https://images.unsplash.com/photo-1552664730-d307ca884978?w=1920&q=80",
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1920&q=80",
        "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1920&q=80",
        "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1920&q=80"
      ],
      products: [
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80",
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80",
        "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=800&q=80"
      ],
      lifestyle: [
        "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80",
        "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&q=80"
      ],
      about: [
        "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&q=80",
        "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=800&q=80",
        "https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=800&q=80"
      ]
    }
  },
  
  // ============================================
  // 8. MARKETING AGENCY
  // ============================================
  {
    id: "marketing-agency",
    name: "Marketing & Digital Agency",
    category: "creative",
    
    topBrands: [
      "Wieden+Kennedy",
      "R/GA",
      "AKQA",
      "Huge",
      "VaynerMedia",
      "Instrument"
    ],
    
    psychology: {
      customerNeeds: [
        "Growing their brand and business",
        "Standing out from competitors",
        "Measurable marketing ROI",
        "Fresh creative perspective",
        "Keeping up with digital trends",
        "Reliable execution and delivery"
      ],
      trustFactors: [
        "Portfolio of impressive work",
        "Recognizable client logos",
        "Case studies with results",
        "Industry awards and recognition",
        "Team expertise and backgrounds",
        "Testimonials from clients"
      ],
      emotionalTriggers: [
        "Excitement about creative possibilities",
        "Confidence in marketing investment",
        "Pride in their brand representation",
        "Relief of having expert partners",
        "Competitive drive to outperform rivals",
        "Trust in collaborative relationship"
      ]
    },
    
    sections: [
      {
        id: "hero",
        name: "Hero Section",
        required: true,
        purpose: "Make immediate creative impact",
        keyElements: [
          "Bold creative statement or reel",
          "Showcase best work immediately",
          "Agency positioning clear",
          "Subtle CTA or scroll invitation"
        ]
      },
      {
        id: "work",
        name: "Work / Portfolio",
        required: true,
        purpose: "Show capabilities through results",
        keyElements: [
          "Visual-heavy case study grid",
          "Mix of industries and mediums",
          "Filter by service or industry",
          "Click through to full case studies"
        ]
      },
      {
        id: "services",
        name: "Services / Capabilities",
        required: true,
        purpose: "Define what you do",
        keyElements: [
          "Brand Strategy & Identity",
          "Digital Marketing & Performance",
          "Content Creation & Social",
          "Web Design & Development",
          "Advertising & Campaigns",
          "Video & Motion"
        ]
      },
      {
        id: "case-studies",
        name: "Case Studies",
        required: true,
        purpose: "Prove impact with depth",
        keyElements: [
          "Challenge / objective",
          "Strategic approach",
          "Creative execution",
          "Results and metrics",
          "Client testimonial"
        ]
      },
      {
        id: "clients",
        name: "Clients",
        required: true,
        purpose: "Build credibility through logos",
        keyElements: [
          "Logo grid of recognizable brands",
          "Industry diversity",
          "Mix of enterprise and growth brands",
          "Testimonial quotes"
        ]
      },
      {
        id: "about",
        name: "About / Team",
        required: true,
        purpose: "Show the people behind the work",
        keyElements: [
          "Agency story and philosophy",
          "Team photos with personality",
          "Culture glimpses",
          "Leadership bios"
        ]
      },
      {
        id: "process",
        name: "How We Work",
        required: false,
        purpose: "Set expectations for collaboration",
        keyElements: [
          "Discovery and strategy",
          "Creative development",
          "Execution and launch",
          "Optimization and growth"
        ]
      },
      {
        id: "blog-insights",
        name: "Blog / Insights",
        required: false,
        purpose: "Thought leadership and SEO",
        keyElements: [
          "Industry trends",
          "Creative inspiration",
          "Marketing tips",
          "Agency news"
        ]
      },
      {
        id: "contact",
        name: "Contact / New Business",
        required: true,
        purpose: "Convert interested visitors",
        keyElements: [
          "New business inquiry form",
          "Budget/scope questions",
          "Timeline questions",
          "Direct contact info"
        ]
      }
    ],
    
    design: {
      colorDescription: "Bold and distinctive. Often dark backgrounds to let work pop. Accent colors that are unique to agency brand.",
      colors: {
        primary: "#0D0D0D",
        secondary: "#1A1A1A",
        accent: "#FF4D4D",
        background: "#FFFFFF"
      },
      typography: "Distinctive, modern fonts that reflect creative capability. Typography as design element. Unexpected choices welcome.",
      fonts: {
        heading: "Monument Extended",
        body: "Graphik"
      },
      imageStyle: "Work should be hero. High-quality project photography. Behind-the-scenes agency culture shots. Avoid corporate stock.",
      spacing: "Dramatic. Large imagery. Bold choices. Confident use of space.",
      mood: "Creative, bold, innovative, confident, collaborative"
    },
    
    copywriting: {
      tone: "Creative and confident. Industry-savvy. Not stuffy. Personality-forward.",
      exampleHeadlines: [
        "We Make Brands Impossible to Ignore",
        "Creative That Works. Results That Matter.",
        "Your Brand, Amplified",
        "Strategy Meets Creativity",
        "Building Brands People Love"
      ],
      exampleCTAs: [
        "See Our Work",
        "Let's Talk",
        "Start a Project",
        "Get in Touch",
        "View Case Study"
      ],
      avoidPhrases: [
        "Full-service agency (say what you actually do)",
        "We're passionate about...",
        "Synergy, leverage, holistic",
        "Best-in-class, cutting-edge",
        "Generic mission statements"
      ]
    },
    
    images: {
      hero: [
        "https://images.unsplash.com/photo-1542744094-3a31f272c490?w=1920&q=80",
        "https://images.unsplash.com/photo-1558655146-d09347e92766?w=1920&q=80",
        "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=1920&q=80",
        "https://images.unsplash.com/photo-1600880292089-90a7e086ee0c?w=1920&q=80"
      ],
      products: [
        "https://images.unsplash.com/photo-1542744094-3a31f272c490?w=800&q=80",
        "https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=800&q=80",
        "https://images.unsplash.com/photo-1618004652321-13a63e576b80?w=800&q=80"
      ],
      lifestyle: [
        "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80",
        "https://images.unsplash.com/photo-1552581234-26160f608093?w=800&q=80",
        "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&q=80"
      ],
      about: [
        "https://images.unsplash.com/photo-1543269865-cbf427effbad?w=800&q=80",
        "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800&q=80",
        "https://images.unsplash.com/photo-1606857521015-7f9fcf423571?w=800&q=80"
      ]
    }
  },
  
  // ============================================
  // 9. ARCHITECTURE FIRM
  // ============================================
  {
    id: "architecture-firm",
    name: "Architecture Firm",
    category: "creative",
    
    topBrands: [
      "Bjarke Ingels Group (BIG)",
      "Foster + Partners",
      "Zaha Hadid Architects",
      "Snøhetta",
      "OMA",
      "Heatherwick Studio"
    ],
    
    psychology: {
      customerNeeds: [
        "Vision brought to life through design",
        "Understanding of project constraints",
        "Budget and timeline management",
        "Technical expertise and compliance",
        "Collaborative design process",
        "Long-term building performance"
      ],
      trustFactors: [
        "Portfolio of completed projects",
        "Design awards and recognition",
        "Principal architect credentials",
        "Project type expertise",
        "Publications and press features",
        "Client testimonials"
      ],
      emotionalTriggers: [
        "Pride in their built environment",
        "Creative expression through architecture",
        "Lasting legacy and impact",
        "Solving complex spatial challenges",
        "Sustainability and responsibility",
        "Delight in design details"
      ]
    },
    
    sections: [
      {
        id: "hero",
        name: "Hero Section",
        required: true,
        purpose: "Lead with stunning project imagery",
        keyElements: [
          "Full-screen project photography",
          "Minimal text overlay",
          "Firm name subtly placed",
          "Navigation to explore work"
        ]
      },
      {
        id: "projects",
        name: "Projects",
        required: true,
        purpose: "Showcase portfolio depth",
        keyElements: [
          "High-quality project photography",
          "Filter by type, status, location",
          "Project name, type, year",
          "Click through to full case study"
        ]
      },
      {
        id: "project-detail",
        name: "Project Detail Pages",
        required: true,
        purpose: "Tell complete project story",
        keyElements: [
          "Multiple photography angles",
          "Drawings and diagrams",
          "Project narrative",
          "Technical details",
          "Client and collaborators credited"
        ]
      },
      {
        id: "services",
        name: "Services",
        required: true,
        purpose: "Define capabilities",
        keyElements: [
          "Architecture",
          "Interior Design",
          "Master Planning",
          "Sustainable Design",
          "Historic Preservation",
          "Feasibility Studies"
        ]
      },
      {
        id: "sectors",
        name: "Sectors / Project Types",
        required: true,
        purpose: "Show expertise areas",
        keyElements: [
          "Residential",
          "Commercial & Workplace",
          "Cultural & Civic",
          "Hospitality",
          "Education",
          "Healthcare"
        ]
      },
      {
        id: "about",
        name: "About / Studio",
        required: true,
        purpose: "Show philosophy and team",
        keyElements: [
          "Design philosophy",
          "Principal architects",
          "Studio culture",
          "History and milestones"
        ]
      },
      {
        id: "process",
        name: "Our Process",
        required: false,
        purpose: "Demystify working together",
        keyElements: [
          "Discovery and programming",
          "Concept design",
          "Design development",
          "Construction documentation",
          "Construction administration"
        ]
      },
      {
        id: "news",
        name: "News / Press",
        required: false,
        purpose: "Build credibility and SEO",
        keyElements: [
          "Awards and recognition",
          "Project completions",
          "Publications and features",
          "Lectures and exhibitions"
        ]
      },
      {
        id: "contact",
        name: "Contact",
        required: true,
        purpose: "Facilitate project inquiries",
        keyElements: [
          "New project inquiry form",
          "Studio location with map",
          "General contact info",
          "Press inquiries"
        ]
      }
    ],
    
    design: {
      colorDescription: "Minimal. White, black, grays. Let architecture photography be the color. Subtle accent at most.",
      colors: {
        primary: "#1A1A1A",
        secondary: "#4A4A4A",
        accent: "#B8860B",
        background: "#FFFFFF"
      },
      typography: "Clean, architectural. Geometric sans-serif or refined serif. Typography should feel designed, not default.",
      fonts: {
        heading: "Neue Montreal",
        body: "Untitled Sans"
      },
      imageStyle: "Professional architectural photography is everything. Exterior, interior, detail shots. Drawings and models. People at scale when appropriate.",
      spacing: "Gallery-like. Images breathe. Minimal clutter. Museum quality.",
      mood: "Refined, visionary, precise, creative, minimal"
    },
    
    copywriting: {
      tone: "Thoughtful and articulate. Design-literate. Aspirational but grounded. Avoids jargon.",
      exampleHeadlines: [
        "Architecture for [City/Region]",
        "Designing Spaces That Inspire",
        "Where Vision Meets Structure",
        "Architecture with Purpose",
        "Building Tomorrow's Landmarks"
      ],
      exampleCTAs: [
        "View Projects",
        "Explore Our Work",
        "Start a Conversation",
        "See Full Project",
        "Connect With Us"
      ],
      avoidPhrases: [
        "Architectural jargon overuse",
        "Pretentious descriptions",
        "Generic 'we design buildings'",
        "Overly technical for public audience",
        "Self-congratulatory tone"
      ]
    },
    
    images: {
      hero: [
        "https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=1920&q=80",
        "https://images.unsplash.com/photo-1518005020951-eccb494ad742?w=1920&q=80",
        "https://images.unsplash.com/photo-1545558014-8692077e9b5c?w=1920&q=80",
        "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1920&q=80",
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1920&q=80"
      ],
      products: [
        "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&q=80",
        "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80",
        "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&q=80",
        "https://images.unsplash.com/photo-1600573472592-401b489a3cdc?w=800&q=80"
      ],
      lifestyle: [
        "https://images.unsplash.com/photo-1600585152220-90363fe7e115?w=800&q=80",
        "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&q=80"
      ],
      about: [
        "https://images.unsplash.com/photo-1503387837-b154d5074bd2?w=800&q=80",
        "https://images.unsplash.com/photo-1542621334-a254cf47733d?w=800&q=80",
        "https://images.unsplash.com/photo-1574958269340-fa927503f3dd?w=800&q=80"
      ]
    }
  },
  
  // ============================================
  // 10. INSURANCE AGENCY
  // ============================================
  {
    id: "insurance-agency",
    name: "Insurance Agency",
    category: "financial",
    
    topBrands: [
      "Lemonade",
      "Policygenius",
      "The Zebra",
      "State Farm",
      "Allstate",
      "Nationwide"
    ],
    
    psychology: {
      customerNeeds: [
        "Right coverage for their situation",
        "Competitive pricing / best value",
        "Understanding what they're buying",
        "Easy claims process",
        "Responsive service when needed",
        "Trusted advisor relationship"
      ],
      trustFactors: [
        "Insurance carrier partnerships",
        "Years in business",
        "Client retention rate",
        "Claims support track record",
        "Professional licenses",
        "Client reviews and testimonials"
      ],
      emotionalTriggers: [
        "Peace of mind and protection",
        "Financial security for family",
        "Relief of being properly covered",
        "Confidence in difficult situations",
        "Trust in advisor relationship",
        "Feeling of being taken care of"
      ]
    },
    
    sections: [
      {
        id: "hero",
        name: "Hero Section",
        required: true,
        purpose: "Communicate protection and ease",
        keyElements: [
          "Clear value proposition",
          "Get a Quote CTA prominent",
          "Trust indicators",
          "Types of insurance offered"
        ]
      },
      {
        id: "products",
        name: "Insurance Products",
        required: true,
        purpose: "Show coverage options",
        keyElements: [
          "Auto Insurance",
          "Home Insurance",
          "Life Insurance",
          "Business Insurance",
          "Health Insurance",
          "Specialty coverage"
        ]
      },
      {
        id: "quote",
        name: "Get a Quote",
        required: true,
        purpose: "Convert visitors to leads",
        keyElements: [
          "Simple quote form",
          "Insurance type selection",
          "Basic info collection",
          "Call option for complex needs"
        ]
      },
      {
        id: "why-us",
        name: "Why Choose Us",
        required: true,
        purpose: "Differentiate from direct carriers",
        keyElements: [
          "Independent agent advantages",
          "Multiple carrier options",
          "Personal service",
          "Claims advocacy",
          "Local expertise"
        ]
      },
      {
        id: "carriers",
        name: "Our Carriers",
        required: true,
        purpose: "Show options available",
        keyElements: [
          "Carrier logo grid",
          "Mix of major and specialty carriers",
          "AM Best ratings if applicable"
        ]
      },
      {
        id: "about",
        name: "About Us",
        required: true,
        purpose: "Build trust and local connection",
        keyElements: [
          "Agency story",
          "Team members with photos",
          "Community involvement",
          "Licenses and credentials"
        ]
      },
      {
        id: "testimonials",
        name: "Client Reviews",
        required: true,
        purpose: "Social proof",
        keyElements: [
          "Google/Yelp reviews",
          "Claims experience stories",
          "Long-term client testimonials",
          "Star ratings displayed"
        ]
      },
      {
        id: "resources",
        name: "Resources / Blog",
        required: false,
        purpose: "Education and SEO",
        keyElements: [
          "Coverage guides",
          "Insurance tips",
          "Policy review reminders",
          "Life event coverage needs"
        ]
      },
      {
        id: "contact",
        name: "Contact",
        required: true,
        purpose: "Facilitate conversations",
        keyElements: [
          "Phone prominently displayed",
          "Office location and hours",
          "Contact form",
          "Emergency claims line"
        ]
      }
    ],
    
    design: {
      colorDescription: "Blues for trust, greens for protection. Modern agencies go bold with unexpected colors. Approachable and reassuring.",
      colors: {
        primary: "#1E4D8C",
        secondary: "#2E7D6B",
        accent: "#F4B942",
        background: "#FAFBFC"
      },
      typography: "Friendly, readable sans-serif. Should feel approachable, not corporate or cold.",
      fonts: {
        heading: "Plus Jakarta Sans",
        body: "Open Sans"
      },
      imageStyle: "Happy families, protected homes, business owners. Avoid disaster imagery. Lifestyle-focused, positive.",
      spacing: "Clean and organized. Easy to navigate. Information clearly presented.",
      mood: "Trustworthy, protective, approachable, professional"
    },
    
    copywriting: {
      tone: "Friendly expert. Explains simply. Reassuring but not fear-based. Local and personal.",
      exampleHeadlines: [
        "Insurance Made Simple",
        "Protect What Matters Most",
        "Coverage Tailored to Your Life",
        "Your Trusted Insurance Partner",
        "Compare. Save. Protect."
      ],
      exampleCTAs: [
        "Get Your Free Quote",
        "Compare Rates",
        "Talk to an Agent",
        "Find the Right Coverage",
        "Start Saving Today"
      ],
      avoidPhrases: [
        "Fear-based disaster messaging",
        "Insurance jargon without explanation",
        "Pressure tactics",
        "Unrealistic savings promises",
        "Generic 'we care' statements"
      ]
    },
    
    images: {
      hero: [
        "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1920&q=80",
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1920&q=80",
        "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1920&q=80",
        "https://images.unsplash.com/photo-1516733968668-dbdce39c0651?w=1920&q=80"
      ],
      products: [
        "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=800&q=80",
        "https://images.unsplash.com/photo-1480074568708-e7b720bb3f09?w=800&q=80",
        "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80"
      ],
      lifestyle: [
        "https://images.unsplash.com/photo-1531983412531-1f49a365ffed?w=800&q=80",
        "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=800&q=80",
        "https://images.unsplash.com/photo-1484863137850-59afcfe05386?w=800&q=80"
      ],
      about: [
        "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=800&q=80",
        "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=800&q=80",
        "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80"
      ]
    }
  }
];

// Export helper functions
export function getIndustryById(id: string): IndustryIntelligence | undefined {
  return professionalIndustries.find(industry => industry.id === id);
}

export function getIndustriesByCategory(category: string): IndustryIntelligence[] {
  return professionalIndustries.filter(industry => industry.category === category);
}

export function getAllIndustryIds(): string[] {
  return professionalIndustries.map(industry => industry.id);
}

export default professionalIndustries;
