// /lib/ai/industries.ts
// Complete industry templates with colors, fonts, sections, and curated images

export interface IndustryTemplate {
  name: string;
  emotionalGoal: string;
  colors: {
    primary: string;
    primaryRgb: string;
    secondary: string;
    secondaryRgb: string;
    accent: string;
    background: string;
    backgroundSecondary: string;
    text: string;
    textSecondary: string;
    textMuted: string;
  };
  fonts: {
    display: string;
    body: string;
    googleImport: string;
  };
  sections: string[];
  images: {
    hero: string;
    secondary: string[];
    team?: string;
  };
  specialComponents: string[];
  copyStyle: string;
  heroApproach: string;
}

export const INDUSTRIES: Record<string, IndustryTemplate> = {

  // ============================================================================
  // 1. RESTAURANT / FOOD & BEVERAGE
  // ============================================================================
  'restaurant': {
    name: 'Restaurant / Food & Beverage',
    emotionalGoal: 'Mouth-watering anticipation. "I NEED to eat there tonight."',
    colors: {
      primary: '#7f1d1d',
      primaryRgb: '127, 29, 29',
      secondary: '#b45309',
      secondaryRgb: '180, 83, 9',
      accent: '#d97706',
      background: '#fffbeb',
      backgroundSecondary: '#fef3c7',
      text: '#1c1917',
      textSecondary: '#44403c',
      textMuted: '#78716c',
    },
    fonts: {
      display: "'Playfair Display', serif",
      body: "'Lato', sans-serif",
      googleImport: "@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600;700&family=Lato:wght@400;500;700&display=swap');",
    },
    sections: [
      'Hero - Full-bleed appetizing food photography with dark overlay, restaurant name in elegant serif, tagline about culinary experience, "Reserve a Table" CTA button',
      'About/Story - Split layout with atmospheric restaurant photo, chef story, founding history, culinary philosophy, passion for ingredients',
      'Menu Highlights - 4-6 signature dishes displayed as cards with beautiful photos, poetic descriptions, and prices',
      'Gallery - Masonry grid of 6-8 images showing food close-ups, plated dishes, restaurant interior, bar area',
      'Testimonials - 3 customer reviews with 5-star ratings, customer names, and quotes about their dining experience',
      'Private Events - Section about catering, private dining rooms, special events with inquiry CTA',
      'Location & Hours - Embedded map placeholder, full address, phone number (clickable), hours of operation for each day',
      'Footer - Social media links (Instagram prominent), newsletter signup for specials, final reservation CTA',
    ],
    images: {
      hero: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1920&q=80',
      secondary: [
        'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80',
        'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80',
        'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80',
        'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&q=80',
        'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&q=80',
      ],
      team: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=600&q=80',
    },
    specialComponents: ['Reservation widget', 'Menu with prices', 'Photo gallery with lightbox', 'Hours display'],
    copyStyle: 'Sensual, appetizing, evocative. Use words like "handcrafted", "farm-fresh", "slow-roasted", "artisanal". Describe flavors and aromas.',
    heroApproach: 'Full-screen food/interior photo with dark gradient overlay from bottom. Elegant serif headline centered. Warm glowing CTA button.',
  },

  // ============================================================================
  // 2. LOCAL SERVICES (Plumber, Electrician, HVAC, Cleaning)
  // ============================================================================
  'local-services': {
    name: 'Local Services',
    emotionalGoal: 'Relief and trust. "Finally, a reliable pro I can count on."',
    colors: {
      primary: '#1e40af',
      primaryRgb: '30, 64, 175',
      secondary: '#ea580c',
      secondaryRgb: '234, 88, 12',
      accent: '#16a34a',
      background: '#ffffff',
      backgroundSecondary: '#f0f9ff',
      text: '#0f172a',
      textSecondary: '#475569',
      textMuted: '#94a3b8',
    },
    fonts: {
      display: "'Poppins', sans-serif",
      body: "'Inter', sans-serif",
      googleImport: "@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@500;600;700;800&family=Inter:wght@400;500;600&display=swap');",
    },
    sections: [
      'Hero - Split layout with team photo on right, trust badges floating (Licensed, Insured, 5-Star), HUGE clickable phone number, "Get Free Quote" orange CTA',
      'Services - 6 service cards in grid with icons, service names, brief descriptions, "Learn More" links',
      'Why Choose Us - 4 differentiators with checkmarks: 24/7 Emergency, Same-Day Service, Satisfaction Guarantee, Licensed & Insured',
      'Work Gallery - Before/After slider or grid of completed project photos',
      'Testimonials - 3+ customer reviews with photos, names, locations, star ratings, specific praise',
      'Service Areas - Map or list of cities/neighborhoods served with "Check Availability" option',
      'Contact - Large contact form, PROMINENT phone number, business hours, emergency contact info',
      'Footer - License numbers, insurance info, service area list, final CTA',
    ],
    images: {
      hero: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=1920&q=80',
      secondary: [
        'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&q=80',
        'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80',
        'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
      ],
      team: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=600&q=80',
    },
    specialComponents: ['Click-to-call phone', 'Trust badges', 'Before/After gallery', 'Service area checker', 'Emergency banner'],
    copyStyle: 'Confident, reassuring, straightforward. Emphasize speed, reliability, guarantees. Use "We\'ll be there in 60 minutes" not "Fast service".',
    heroApproach: 'Split layout - compelling headline on left with trust badges and CTA, professional team photo on right. Phone number very prominent.',
  },

  // ============================================================================
  // 3. PROFESSIONAL SERVICES (Law, Finance, Consulting)
  // ============================================================================
  'professional': {
    name: 'Professional Services',
    emotionalGoal: '"These are EXPERTS. I\'m in capable hands."',
    colors: {
      primary: '#1e3a5f',
      primaryRgb: '30, 58, 95',
      secondary: '#115e59',
      secondaryRgb: '17, 94, 89',
      accent: '#b8860b',
      background: '#ffffff',
      backgroundSecondary: '#f8fafc',
      text: '#0f172a',
      textSecondary: '#475569',
      textMuted: '#64748b',
    },
    fonts: {
      display: "'Libre Baskerville', serif",
      body: "'Source Sans Pro', sans-serif",
      googleImport: "@import url('https://fonts.googleapis.com/css2?family=Libre+Baskerville:wght@400;700&family=Source+Sans+Pro:wght@400;600;700&display=swap');",
    },
    sections: [
      'Hero - Sophisticated gradient or modern building photo, outcome-focused headline, "Schedule Consultation" CTA, trust indicators (years, cases won)',
      'Practice Areas/Services - Elegant cards with icons for each service area, brief descriptions',
      'About the Firm - Company story, founding principles, mission, credentials, years of experience',
      'Team - Professional headshots in grid with names, titles, credentials, brief bios',
      'Results/Case Studies - Key metrics, notable outcomes, success stories (without confidential info)',
      'Testimonials - Client quotes with company names (where permitted), professional endorsements',
      'Insights/Blog - Optional section for thought leadership articles',
      'Contact - Multiple contact methods, office locations with addresses, professional contact form',
      'Footer - Bar numbers, certifications, professional associations, disclaimer',
    ],
    images: {
      hero: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1920&q=80',
      secondary: [
        'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80',
        'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80',
      ],
      team: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&q=80',
    },
    specialComponents: ['Credentials display', 'Case results counter', 'Consultation scheduler', 'Multi-location map'],
    copyStyle: 'Authoritative but approachable. Lead with outcomes and results. "$50M recovered for clients" not "We help with legal matters".',
    heroApproach: 'Clean, sophisticated. Subtle gradient or architectural photo. Serif headline conveying trust and expertise. Gold accent on CTA.',
  },

  // ============================================================================
  // 4. HEALTH & BEAUTY / SPA / WELLNESS
  // ============================================================================
  'health-beauty': {
    name: 'Spa / Health & Beauty / Wellness',
    emotionalGoal: 'Instant calm. A visual deep breath. "I DESERVE this."',
    colors: {
      primary: '#84a98c',
      primaryRgb: '132, 169, 140',
      secondary: '#f4a5a4',
      secondaryRgb: '244, 165, 164',
      accent: '#d4af37',
      background: '#fafaf9',
      backgroundSecondary: '#fefcf3',
      text: '#1c1917',
      textSecondary: '#57534e',
      textMuted: '#a8a29e',
    },
    fonts: {
      display: "'Cormorant Garamond', serif",
      body: "'Quicksand', sans-serif",
      googleImport: "@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Quicksand:wght@400;500;600&display=swap');",
    },
    sections: [
      'Hero - Serene spa imagery with soft overlay, elegant script headline, "Book Your Experience" CTA in muted gold',
      'Services/Treatments - Treatment menu with beautiful descriptions, durations, and prices in an elegant layout',
      'About - Philosophy section about approach to wellness, what makes this spa unique, commitment to relaxation',
      'Team - Therapists and aestheticians with warm, professional photos and specialties',
      'Gallery - Peaceful images of treatment rooms, products, spa facilities in soft-toned grid',
      'Testimonials - Client experiences focused on transformation and relaxation',
      'Packages - Bundled treatment packages with savings highlighted',
      'Gift Cards - Section promoting gift cards for loved ones',
      'Contact/Booking - Easy booking interface, location with parking info, hours',
      'Footer - Social links, newsletter for wellness tips, serene closing message',
    ],
    images: {
      hero: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=1920&q=80',
      secondary: [
        'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&q=80',
        'https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?w=800&q=80',
        'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?w=800&q=80',
        'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?w=800&q=80',
      ],
      team: 'https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=600&q=80',
    },
    specialComponents: ['Treatment menu with prices', 'Booking widget', 'Gift card purchase', 'Package builder'],
    copyStyle: 'Soothing, indulgent, sensory. "Melt away tension with our signature hot stone ritual" not "We offer massages". Use words like "rejuvenate", "restore", "nurture".',
    heroApproach: 'Dreamy, soft imagery. Gentle gradient overlay. Elegant serif or script headline. Understated CTA that doesn\'t disrupt the calm.',
  },

  // ============================================================================
  // 5. REAL ESTATE
  // ============================================================================
  'real-estate': {
    name: 'Real Estate',
    emotionalGoal: '"This is THE ONE." Dream home energy meets professional guidance.',
    colors: {
      primary: '#1e3a5f',
      primaryRgb: '30, 58, 95',
      secondary: '#166534',
      secondaryRgb: '22, 101, 52',
      accent: '#b8860b',
      background: '#ffffff',
      backgroundSecondary: '#fafaf9',
      text: '#0f172a',
      textSecondary: '#475569',
      textMuted: '#94a3b8',
    },
    fonts: {
      display: "'Poppins', sans-serif",
      body: "'Inter', sans-serif",
      googleImport: "@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&family=Inter:wght@400;500;600&display=swap');",
    },
    sections: [
      'Hero - Stunning property photo full-width, "Find Your Dream Home" headline, property search box or agent value proposition',
      'Featured Listings - 3-4 property cards with photos, price, beds/baths/sqft, "View Details" buttons',
      'Agent Profile - Professional photo, personal bio, credentials (sales volume, years experience), contact info',
      'Services - Buying, Selling, Investment, Relocation services explained',
      'Why Choose Me/Us - Market expertise, negotiation skills, local knowledge, client-first approach',
      'Testimonials - Happy homeowner stories with photos and specific outcomes',
      'Neighborhoods/Areas - Guide to areas served with brief descriptions and links',
      'Market Insights - Optional section with market stats or blog posts',
      'Contact - Multiple contact methods, response time promise, showing request form',
      'Footer - License number, MLS info, fair housing logo, brokerage info',
    ],
    images: {
      hero: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920&q=80',
      secondary: [
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80',
        'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80',
        'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&q=80',
      ],
      team: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=600&q=80',
    },
    specialComponents: ['Property search', 'Property cards', 'Agent profile', 'Home valuation CTA', 'Neighborhood guide'],
    copyStyle: 'Aspirational yet trustworthy. "Your dream home is waiting. Let\'s find it together." Focus on the emotional journey of finding home.',
    heroApproach: 'Stunning property photo that evokes desire. Clean headline about the dream of homeownership. Search box or strong agent-focused CTA.',
  },

  // ============================================================================
  // 6. FITNESS / GYM / PERSONAL TRAINING
  // ============================================================================
  'fitness': {
    name: 'Fitness / Gym / Personal Training',
    emotionalGoal: '"This is where I become my BEST self." Raw energy and motivation.',
    colors: {
      primary: '#dc2626',
      primaryRgb: '220, 38, 38',
      secondary: '#0ea5e9',
      secondaryRgb: '14, 165, 233',
      accent: '#84cc16',
      background: '#09090b',
      backgroundSecondary: '#18181b',
      text: '#fafafa',
      textSecondary: '#a1a1aa',
      textMuted: '#71717a',
    },
    fonts: {
      display: "'Oswald', sans-serif",
      body: "'Inter', sans-serif",
      googleImport: "@import url('https://fonts.googleapis.com/css2?family=Oswald:wght@500;600;700&family=Inter:wght@400;500;600&display=swap');",
    },
    sections: [
      'Hero - High-energy action shot with dark overlay, bold motivational headline in all-caps, "Start Your Transformation" CTA with glow effect',
      'Programs/Classes - Grid of class types (HIIT, Strength, Yoga, etc.) with energy-filled descriptions',
      'Transformations - Before/after photos with client testimonials and specific results achieved',
      'Trainers - Team photos with credentials, specialties, certifications, personal philosophies',
      'Facility Tour - Gallery of gym equipment, workout spaces, locker rooms',
      'Membership/Pricing - Clear pricing tiers with features, "Most Popular" badge on recommended plan',
      'Free Trial CTA - Strong conversion section offering free trial or consultation',
      'Schedule - Class schedule or training availability',
      'Contact - Location, hours, free trial signup form',
      'Footer - Social links (Instagram for transformations), final motivational CTA',
    ],
    images: {
      hero: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1920&q=80',
      secondary: [
        'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&q=80',
        'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=800&q=80',
        'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&q=80',
        'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=800&q=80',
      ],
      team: 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?w=600&q=80',
    },
    specialComponents: ['Transformation slider', 'Class schedule', 'Pricing table', 'Free trial form', 'Progress tracker'],
    copyStyle: 'Motivational, challenging, energetic. "Your strongest self is waiting. Let\'s go get it." Use action words: crush, transform, unleash, dominate.',
    heroApproach: 'Dark, high-contrast. Action shot with athlete mid-movement. Bold sans-serif headline. Glowing CTA button. Stats or social proof.',
  },

  // ============================================================================
  // 7. TECH / SAAS / STARTUP
  // ============================================================================
  'tech-startup': {
    name: 'Tech / SaaS / Startup',
    emotionalGoal: '"This will SOLVE my problem." Modern, innovative, trustworthy.',
    colors: {
      primary: '#6366f1',
      primaryRgb: '99, 102, 241',
      secondary: '#8b5cf6',
      secondaryRgb: '139, 92, 246',
      accent: '#ec4899',
      background: '#09090b',
      backgroundSecondary: '#18181b',
      text: '#fafafa',
      textSecondary: '#a1a1aa',
      textMuted: '#71717a',
    },
    fonts: {
      display: "'Space Grotesk', sans-serif",
      body: "'Inter', sans-serif",
      googleImport: "@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&display=swap');",
    },
    sections: [
      'Hero - Gradient mesh background or product screenshot, clear value proposition headline, "Start Free" primary CTA, "Watch Demo" secondary, social proof (logos, user count)',
      'Logo Bar - "Trusted by" section with company logos',
      'Features - Bento grid layout with icons, feature names, benefit-focused descriptions',
      'How It Works - 3 simple steps with numbers, icons, and brief explanations',
      'Product Screenshot/Demo - Large product visual or embedded demo video',
      'Pricing - 3 tiers with monthly/yearly toggle, feature comparison, "Most Popular" badge, FAQ about pricing',
      'Testimonials - User quotes with photos, company names, specific results ("Saved 10 hours/week")',
      'Integrations - Grid of integration logos if applicable',
      'FAQ - Accordion with common questions about the product',
      'Final CTA - Strong conversion section with headline, subtext, and prominent signup button',
      'Footer - Product links, company links, legal links, social links',
    ],
    images: {
      hero: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&q=80',
      secondary: [
        'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80',
        'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&q=80',
      ],
    },
    specialComponents: ['Pricing toggle', 'Feature bento grid', 'Integration logos', 'FAQ accordion', 'Product mockup'],
    copyStyle: 'Clear, benefit-focused, confident. "Save 10 hours every week" not "Our software has many features". Quantify results.',
    heroApproach: 'Gradient background or abstract shapes. Product-focused headline with clear value prop. Two CTAs (primary action + demo). Social proof immediately visible.',
  },

  // ============================================================================
  // 8. MEDICAL / HEALTHCARE / DENTAL
  // ============================================================================
  'medical': {
    name: 'Medical / Healthcare / Dental',
    emotionalGoal: '"I\'m in EXPERT, caring hands." Trust, competence, compassion.',
    colors: {
      primary: '#0d9488',
      primaryRgb: '13, 148, 136',
      secondary: '#0284c7',
      secondaryRgb: '2, 132, 199',
      accent: '#16a34a',
      background: '#ffffff',
      backgroundSecondary: '#f0fdfa',
      text: '#0f172a',
      textSecondary: '#475569',
      textMuted: '#94a3b8',
    },
    fonts: {
      display: "'Inter', sans-serif",
      body: "'Source Sans Pro', sans-serif",
      googleImport: "@import url('https://fonts.googleapis.com/css2?family=Inter:wght@500;600;700&family=Source+Sans+Pro:wght@400;600&display=swap');",
    },
    sections: [
      'Hero - Warm, reassuring imagery with doctor/patient, headline about patient-centered care, "Book Appointment" CTA, trust badges (board certified, years experience)',
      'Services - Medical services offered with clear, patient-friendly descriptions',
      'Meet the Doctors - Professional photos with credentials, education, specialties, board certifications',
      'Why Choose Us - Differentiators: latest technology, compassionate care, convenient hours, patient reviews',
      'Patient Stories - Testimonials about quality of care, bedside manner, outcomes',
      'Insurance & Payment - Accepted insurance plans grid, payment options, financing if available',
      'Office Tour - Photos of clean, modern facilities, equipment',
      'Location & Hours - Office photos, map, full address, hours, after-hours emergency info',
      'New Patient Info - What to expect, forms to download, preparation instructions',
      'Contact - Easy appointment booking, phone, patient portal link',
      'Footer - Credentials, certifications, HIPAA notice, emergency contact',
    ],
    images: {
      hero: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1920&q=80',
      secondary: [
        'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=800&q=80',
        'https://images.unsplash.com/photo-1666214280557-f1b5022eb634?w=800&q=80',
      ],
      team: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=600&q=80',
    },
    specialComponents: ['Appointment scheduler', 'Insurance grid', 'Doctor profiles', 'Patient portal link', 'Virtual consultation CTA'],
    copyStyle: 'Warm but professional. "Your health journey, guided by experts who care." Balance medical authority with compassion and accessibility.',
    heroApproach: 'Welcoming imagery showing care and expertise. Reassuring headline. Clear booking CTA. Trust signals prominent.',
  },

  // ============================================================================
  // 9. CONSTRUCTION / CONTRACTOR / HOME IMPROVEMENT
  // ============================================================================
  'construction': {
    name: 'Construction / Contractor / Home Improvement',
    emotionalGoal: '"These guys will get it done RIGHT." Strength, reliability, craftsmanship.',
    colors: {
      primary: '#d97706',
      primaryRgb: '217, 119, 6',
      secondary: '#1f2937',
      secondaryRgb: '31, 41, 55',
      accent: '#eab308',
      background: '#ffffff',
      backgroundSecondary: '#f9fafb',
      text: '#111827',
      textSecondary: '#4b5563',
      textMuted: '#9ca3af',
    },
    fonts: {
      display: "'Oswald', sans-serif",
      body: "'Inter', sans-serif",
      googleImport: "@import url('https://fonts.googleapis.com/css2?family=Oswald:wght@500;600;700&family=Inter:wght@400;500;600&display=swap');",
    },
    sections: [
      'Hero - Impressive completed project photo, strong headline about quality craftsmanship, "Get Free Quote" CTA, trust badges (Licensed, Bonded, Insured)',
      'Services - Residential and commercial services: renovations, new builds, additions, specific trades',
      'Project Gallery - Portfolio of completed work with project type filter, before/after when applicable',
      'About Us - Company history, team experience, values, commitment to quality',
      'Why Choose Us - Differentiators: warranty, years experience, licensing, project management',
      'Process - How you work: consultation, design, build, completion timeline',
      'Testimonials - Homeowner reviews with photos of completed projects, specific praise',
      'Financing - Financing options if available',
      'Service Areas - Map or list of areas served',
      'Contact - Quote request form, phone, office location',
      'Footer - License numbers, insurance info, certifications, associations',
    ],
    images: {
      hero: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1920&q=80',
      secondary: [
        'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&q=80',
        'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800&q=80',
        'https://images.unsplash.com/photo-1541123603104-512919d6a96c?w=800&q=80',
      ],
      team: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&q=80',
    },
    specialComponents: ['Project gallery with filters', 'Before/after slider', 'Quote calculator', 'License badges'],
    copyStyle: 'Straightforward, confident, quality-focused. "Built to last. Guaranteed." Emphasize experience, warranty, and craftsmanship.',
    heroApproach: 'Impressive project photo showing scale and quality. Bold headline. Prominent quote CTA. Trust badges visible.',
  },

  // ============================================================================
  // 10. E-COMMERCE / ONLINE STORE
  // ============================================================================
  'ecommerce': {
    name: 'E-commerce / Online Store',
    emotionalGoal: '"I WANT that!" Create desire, make purchasing effortless.',
    colors: {
      primary: '#000000',
      primaryRgb: '0, 0, 0',
      secondary: '#6366f1',
      secondaryRgb: '99, 102, 241',
      accent: '#f59e0b',
      background: '#ffffff',
      backgroundSecondary: '#f9fafb',
      text: '#111827',
      textSecondary: '#6b7280',
      textMuted: '#9ca3af',
    },
    fonts: {
      display: "'DM Sans', sans-serif",
      body: "'Inter', sans-serif",
      googleImport: "@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@500;600;700&family=Inter:wght@400;500;600&display=swap');",
    },
    sections: [
      'Announcement Bar - Promo banner for sales, free shipping threshold, discount codes',
      'Hero - Lifestyle product imagery or hero product, compelling headline, "Shop Now" CTA, maybe secondary "New Arrivals" link',
      'Trust Badges - Free shipping, easy returns, secure checkout, satisfaction guarantee icons',
      'Featured Products - 4-8 product cards with images, names, prices, "Add to Cart" or "Quick View"',
      'Categories - Visual category showcase with images and links',
      'Bestsellers - Top-selling products carousel or grid',
      'About/Story - Brand story section building emotional connection',
      'Reviews/Social Proof - Customer reviews, Instagram feed, user-generated content',
      'Newsletter - Email signup with discount incentive',
      'Footer - Shop links, customer service, policies, payment method icons, social links',
    ],
    images: {
      hero: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1920&q=80',
      secondary: [
        'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80',
        'https://images.unsplash.com/photo-1560343090-f0409e92791a?w=800&q=80',
        'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&q=80',
      ],
    },
    specialComponents: ['Product cards', 'Cart drawer', 'Quick view modal', 'Trust badges', 'Newsletter popup', 'Payment icons'],
    copyStyle: 'Concise, benefit-focused, creates urgency. "Bestselling. Limited stock." Use action-oriented language.',
    heroApproach: 'Product-focused lifestyle imagery. Clear headline about value or current promotion. Strong CTA to shop. Minimal distraction.',
  },

  // ============================================================================
  // 11. PORTFOLIO / CREATIVE AGENCY / FREELANCER
  // ============================================================================
  'portfolio': {
    name: 'Portfolio / Creative Agency / Freelancer',
    emotionalGoal: '"I NEED to work with them." Let the work speak.',
    colors: {
      primary: '#18181b',
      primaryRgb: '24, 24, 27',
      secondary: '#a855f7',
      secondaryRgb: '168, 85, 247',
      accent: '#ec4899',
      background: '#09090b',
      backgroundSecondary: '#18181b',
      text: '#fafafa',
      textSecondary: '#a1a1aa',
      textMuted: '#71717a',
    },
    fonts: {
      display: "'Space Grotesk', sans-serif",
      body: "'Inter', sans-serif",
      googleImport: "@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&display=swap');",
    },
    sections: [
      'Hero - Bold, minimal. Name/brand prominently displayed, brief tagline, "View Work" CTA or scroll indicator',
      'Selected Works - Project grid with hover effects revealing project details, filterable by category',
      'About - Photo, story, design philosophy, what makes your work unique',
      'Services - What you offer: web design, branding, development, etc.',
      'Process - How you work with clients: discovery, design, development, launch',
      'Testimonials - Client quotes praising the work and collaboration',
      'Awards/Recognition - Optional: awards, publications, notable clients',
      'Availability - Current availability status, ideal project types',
      'Contact - Simple contact form or email link, social links',
      'Footer - Minimal with copyright and social links',
    ],
    images: {
      hero: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80',
      secondary: [
        'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&q=80',
        'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=800&q=80',
      ],
    },
    specialComponents: ['Project grid with filters', 'Case study layout', 'Availability indicator', 'Hover reveals'],
    copyStyle: 'Minimal, confident. "I create digital experiences that convert." Let the work do most of the talking.',
    heroApproach: 'Ultra-minimal. Name large. Brief description. Let the portfolio below be the hero.',
  },

  // ============================================================================
  // 12. EDUCATION / COACHING / ONLINE COURSE
  // ============================================================================
  'education': {
    name: 'Education / Coaching / Online Course',
    emotionalGoal: '"This will transform my life/career." Aspiration meets credibility.',
    colors: {
      primary: '#4f46e5',
      primaryRgb: '79, 70, 229',
      secondary: '#7c3aed',
      secondaryRgb: '124, 58, 237',
      accent: '#10b981',
      background: '#ffffff',
      backgroundSecondary: '#f5f3ff',
      text: '#1e1b4b',
      textSecondary: '#4c1d95',
      textMuted: '#6b7280',
    },
    fonts: {
      display: "'Plus Jakarta Sans', sans-serif",
      body: "'Inter', sans-serif",
      googleImport: "@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800&family=Inter:wght@400;500;600&display=swap');",
    },
    sections: [
      'Hero - Instructor photo or aspirational image, transformation-focused headline, enroll CTA, social proof (student count, success rate)',
      'Problem/Solution - Address the pain point your course solves',
      'Who It\'s For - Target audience description, "This is for you if..." section',
      'Curriculum - What they\'ll learn in accordion or module format with lesson details',
      'Instructor - Bio, credentials, story of expertise, why they\'re qualified to teach',
      'Success Stories - Student testimonials with specific results achieved',
      'Course Format - Details about format: video, live calls, community, resources',
      'Bonuses - Additional value included with enrollment',
      'Pricing - Package options with payment plans if available',
      'FAQ - Common objections addressed',
      'Guarantee - Money-back guarantee details',
      'Final CTA - Enrollment section with urgency (limited spots, enrollment deadline)',
      'Footer - Legal links, support email, social links',
    ],
    images: {
      hero: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=1920&q=80',
      secondary: [
        'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&q=80',
        'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80',
      ],
      team: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&q=80',
    },
    specialComponents: ['Curriculum accordion', 'Pricing table', 'Countdown timer', 'Student success counter', 'Guarantee badge'],
    copyStyle: 'Transformational, encouraging, specific about outcomes. "By the end of this course, you\'ll be able to..." Address objections, build desire.',
    heroApproach: 'Aspirational. Show the transformation possible. Clear headline about outcome. Strong CTA. Social proof with numbers.',
  },
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get industry template by key
 */
export function getIndustryTemplate(industryKey: string): IndustryTemplate | null {
  const key = industryKey.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z-]/g, '');
  return INDUSTRIES[key] || null;
}

/**
 * Detect industry from business description
 */
export function detectIndustry(description: string): string {
  const desc = description.toLowerCase();
  
  const keywords: Record<string, string[]> = {
    'restaurant': ['restaurant', 'food', 'dining', 'chef', 'cuisine', 'menu', 'cafe', 'bistro', 'eatery', 'catering', 'bar', 'grill', 'kitchen'],
    'local-services': ['plumber', 'plumbing', 'electrician', 'hvac', 'heating', 'cooling', 'cleaning', 'handyman', 'repair', 'maintenance', 'contractor', 'roofing', 'painting'],
    'professional': ['law', 'lawyer', 'attorney', 'legal', 'accounting', 'accountant', 'consulting', 'consultant', 'financial', 'advisor', 'cpa', 'firm'],
    'health-beauty': ['spa', 'salon', 'beauty', 'wellness', 'massage', 'facial', 'skincare', 'nail', 'hair', 'aesthetic', 'medspa'],
    'real-estate': ['real estate', 'realtor', 'property', 'homes', 'housing', 'broker', 'realty', 'mortgage'],
    'fitness': ['gym', 'fitness', 'training', 'workout', 'exercise', 'personal trainer', 'crossfit', 'yoga', 'pilates', 'strength'],
    'tech-startup': ['software', 'saas', 'app', 'platform', 'tech', 'startup', 'digital', 'ai', 'automation', 'tool'],
    'medical': ['medical', 'doctor', 'healthcare', 'clinic', 'dental', 'dentist', 'physician', 'health', 'patient', 'therapy', 'chiropractic'],
    'construction': ['construction', 'building', 'remodel', 'renovation', 'home improvement', 'general contractor', 'builder'],
    'ecommerce': ['shop', 'store', 'ecommerce', 'e-commerce', 'retail', 'products', 'sell', 'merchandise', 'boutique'],
    'portfolio': ['portfolio', 'designer', 'creative', 'agency', 'freelance', 'artist', 'photographer', 'videographer'],
    'education': ['course', 'coaching', 'training', 'learn', 'education', 'teaching', 'workshop', 'mentor', 'program'],
  };

  for (const [industry, words] of Object.entries(keywords)) {
    if (words.some(word => desc.includes(word))) {
      return industry;
    }
  }

  return 'professional'; // Default fallback
}

/**
 * Generate the industry-specific prompt section
 */
export function generateIndustryPrompt(industry: IndustryTemplate): string {
  return `
## INDUSTRY-SPECIFIC DESIGN BRIEF

**Industry:** ${industry.name}
**Emotional Goal:** ${industry.emotionalGoal}

### COLOR PALETTE (Use these EXACT colors)
- Primary: ${industry.colors.primary} (RGB: ${industry.colors.primaryRgb})
- Secondary: ${industry.colors.secondary}
- Accent: ${industry.colors.accent}
- Background: ${industry.colors.background}
- Background Secondary: ${industry.colors.backgroundSecondary}
- Text Primary: ${industry.colors.text}
- Text Secondary: ${industry.colors.textSecondary}

### TYPOGRAPHY
${industry.fonts.googleImport}
- Display Font: ${industry.fonts.display}
- Body Font: ${industry.fonts.body}

### REQUIRED SECTIONS
${industry.sections.map((section, i) => `${i + 1}. ${section}`).join('\n')}

### IMAGES TO USE
- Hero: ${industry.images.hero}
${industry.images.secondary.map((img, i) => `- Image ${i + 2}: ${img}`).join('\n')}
${industry.images.team ? `- Team/Portrait: ${industry.images.team}` : ''}

### SPECIAL COMPONENTS TO INCLUDE
${industry.specialComponents.map(c => `- ${c}`).join('\n')}

### COPY STYLE
${industry.copyStyle}

### HERO APPROACH
${industry.heroApproach}
`;
}

/**
 * Get all industry keys
 */
export function getAllIndustryKeys(): string[] {
  return Object.keys(INDUSTRIES);
}

/**
 * Get CSS variables for an industry
 */
export function getIndustryCSSVariables(industry: IndustryTemplate): string {
  return `
  --primary: ${industry.colors.primary};
  --primary-rgb: ${industry.colors.primaryRgb};
  --secondary: ${industry.colors.secondary};
  --secondary-rgb: ${industry.colors.secondaryRgb};
  --accent: ${industry.colors.accent};
  --bg-primary: ${industry.colors.background};
  --bg-secondary: ${industry.colors.backgroundSecondary};
  --text-primary: ${industry.colors.text};
  --text-secondary: ${industry.colors.textSecondary};
  --text-muted: ${industry.colors.textMuted};
  --font-display: ${industry.fonts.display};
  --font-body: ${industry.fonts.body};
  `;
}
