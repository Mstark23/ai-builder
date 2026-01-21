/**
 * VERKTORLABS - Core Industry Intelligence Seed Data
 * 
 * Deep research on 6 foundational industries:
 * - Jewelry (Mejuri, Ana Luisa, Missoma, Gorjana)
 * - Restaurant (Sweetgreen, CAVA, Chipotle)
 * - Fitness/Gym (Barry's, Orangetheory, F45, Equinox)
 * - Spa/Beauty (Drybar, Heyday, Glossier, Sephora)
 * - Law Firm (Top firms' digital presence)
 * - Dental Clinic (Tend, Aspen Dental, modern practices)
 */

import type { IndustryIntelligence } from '../types/industry';

// Re-export the type for convenience
export type { IndustryIntelligence } from '../types/industry';

export const coreIndustries: IndustryIntelligence[] = [
  // ============================================================================
  // JEWELRY
  // Research: Mejuri, Ana Luisa, Missoma, Gorjana
  // Pattern: Minimal luxury, editorial photography, aspirational lifestyle
  // ============================================================================
  {
    id: 'jewelry',
    name: 'Jewelry & Accessories',
    category: 'e-commerce',
    topBrands: ['Mejuri', 'Ana Luisa', 'Missoma', 'Gorjana', 'Catbird', 'Stone and Strand'],
    psychology: {
      customerNeeds: [
        'See jewelry on real people (not just product shots)',
        'Understand sizing and scale relative to body',
        'Know materials, sourcing, and quality standards',
        'Easy navigation by category (rings, necklaces, earrings)',
        'Gift-finding assistance and occasions browsing',
        'Confidence in returns and exchanges',
      ],
      trustFactors: [
        'Material transparency (14k gold, sterling silver, vermeil explained)',
        'Ethical sourcing and sustainability messaging',
        'Lifetime warranty or quality guarantees',
        'Real customer photos and reviews with images',
        'Celebrity or influencer social proof (subtle)',
        'Free shipping and easy returns prominently displayed',
      ],
      emotionalTriggers: [
        'Self-expression and personal style identity',
        'Treating yourself - "everyday luxury" positioning',
        'Meaningful gifts for loved ones',
        'Building a curated collection over time',
        'Confidence and feeling put-together',
        'Milestone moments (graduation, promotion, anniversary)',
      ],
    },
    sections: [
      {
        id: 'hero',
        name: 'Hero Banner',
        required: true,
        purpose: 'Create aspirational first impression with editorial imagery',
        keyElements: ['Full-bleed lifestyle image', 'Minimal text overlay', 'Single CTA', 'New collection or bestseller focus'],
      },
      {
        id: 'collection-grid',
        name: 'Shop by Category',
        required: true,
        purpose: 'Enable intuitive product discovery',
        keyElements: ['Visual category cards (Rings, Necklaces, Earrings, Bracelets)', 'Hover effects', 'Clean grid layout'],
      },
      {
        id: 'bestsellers',
        name: 'Bestsellers Carousel',
        required: true,
        purpose: 'Surface proven products and build confidence',
        keyElements: ['Product cards with price', 'Quick-add functionality', 'Star ratings', 'Multiple product images on hover'],
      },
      {
        id: 'story',
        name: 'Brand Story',
        required: true,
        purpose: 'Differentiate through values and craftsmanship',
        keyElements: ['Founder story or brand mission', 'Craftsmanship imagery', 'Sustainability commitments', 'Certifications'],
      },
      {
        id: 'styling',
        name: 'Styling Guide / Lookbook',
        required: false,
        purpose: 'Inspire and increase average order value',
        keyElements: ['Layering suggestions', 'Stack builder', 'Editorial photography', 'Shop the look CTAs'],
      },
      {
        id: 'reviews',
        name: 'Customer Reviews',
        required: true,
        purpose: 'Build trust through social proof',
        keyElements: ['Photo reviews', 'Star ratings', 'Verified purchase badges', 'Filter by product type'],
      },
      {
        id: 'gifting',
        name: 'Gift Guide',
        required: false,
        purpose: 'Capture gift-giving occasions',
        keyElements: ['Price point filters', 'Occasion categories', 'Gift wrapping preview', 'Personalization options'],
      },
      {
        id: 'instagram',
        name: 'Instagram / UGC Feed',
        required: true,
        purpose: 'Show real customers and build community',
        keyElements: ['Shoppable UGC gallery', 'Brand hashtag', 'Customer photos', 'Follow CTA'],
      },
      {
        id: 'newsletter',
        name: 'Email Signup',
        required: true,
        purpose: 'Capture leads with incentive',
        keyElements: ['Discount offer (10-15% off)', 'Minimal form', 'Early access promise', 'Privacy reassurance'],
      },
      {
        id: 'footer',
        name: 'Footer',
        required: true,
        purpose: 'Trust signals and navigation',
        keyElements: ['Payment icons', 'Shipping info', 'Contact options', 'Social links', 'Legal links'],
      },
    ],
    design: {
      colorDescription: 'Refined neutral palette with warm gold accents - cream backgrounds, soft blacks, gold highlights',
      colors: {
        primary: '#1a1a1a',
        secondary: '#c9a962',
        accent: '#d4af37',
        background: '#faf9f7',
      },
      typography: 'Elegant serif for headings paired with clean sans-serif body text - sophisticated but readable',
      fonts: {
        heading: 'Cormorant Garamond',
        body: 'Montserrat',
      },
      imageStyle: 'Editorial fashion photography - soft natural lighting, neutral backgrounds, close-up detail shots mixed with lifestyle imagery showing jewelry on diverse models',
      spacing: 'Generous whitespace, luxurious breathing room between sections, asymmetric layouts for editorial feel',
      mood: 'Quietly luxurious, modern elegance, approachable sophistication, curated not cluttered',
    },
    copywriting: {
      tone: 'Refined, intimate, aspirational but accessible - speaks to "everyday luxury" not exclusive wealth',
      exampleHeadlines: [
        'Everyday Fine Jewelry',
        'Made to Be Worn',
        'Your New Favorites',
        'Crafted for Life\'s Moments',
        'The Art of Layering',
      ],
      exampleCTAs: [
        'Shop the Collection',
        'Discover More',
        'Add to Bag',
        'Find Your Size',
        'Complete the Look',
      ],
      avoidPhrases: [
        'Cheap', 'Discount', 'Bargain', 'Fake', 'Costume jewelry',
        'Limited time only!!!', 'BUY NOW', 'Don\'t miss out',
      ],
    },
    images: {
      hero: [
        'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1920',
        'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=1920',
        'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=1920',
        'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=1920',
      ],
      products: [
        'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=800',
        'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800',
        'https://images.unsplash.com/photo-1599459183200-59c3cd0b3aa0?w=800',
        'https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=800',
        'https://images.unsplash.com/photo-1535632787350-4e68ef0ac584?w=800',
      ],
      lifestyle: [
        'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=1200',
        'https://images.unsplash.com/photo-1492707892479-7bc8d5a4ee93?w=1200',
        'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=1200',
        'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=1200',
      ],
      about: [
        'https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=1200',
        'https://images.unsplash.com/photo-1591085686350-798c0f9faa7f?w=1200',
        'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200',
        'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=1200',
      ],
    },
  },

  // ============================================================================
  // RESTAURANT
  // Research: Sweetgreen, CAVA, Chipotle, Dig
  // Pattern: Fresh imagery, simple ordering, location-centric, mission-driven
  // ============================================================================
  {
    id: 'restaurant',
    name: 'Restaurant & Fast Casual',
    category: 'local-services',
    topBrands: ['Sweetgreen', 'CAVA', 'Chipotle', 'Dig', 'Tender Greens', 'Just Salad'],
    psychology: {
      customerNeeds: [
        'See the food - high-quality imagery is essential',
        'Understand the menu quickly with clear categories',
        'Find location and hours immediately',
        'Order online or see delivery options upfront',
        'Know dietary accommodations (vegan, gluten-free)',
        'Understand pricing without deep navigation',
      ],
      trustFactors: [
        'Ingredient sourcing and quality claims',
        'Visible food photography (not stock)',
        'Health/nutrition information availability',
        'Reviews and ratings integration',
        'Visible location with real photos',
        'Active social media presence',
      ],
      emotionalTriggers: [
        'Freshness and health associations',
        'Convenience without guilt',
        'Supporting local/sustainable businesses',
        'Flavor adventure and customization',
        'Social dining experiences',
        'Feeding yourself and family well',
      ],
    },
    sections: [
      {
        id: 'hero',
        name: 'Hero with Food Imagery',
        required: true,
        purpose: 'Make visitors hungry immediately',
        keyElements: ['Full-screen food photography', 'Order Now CTA', 'Location finder link', 'Current promotion'],
      },
      {
        id: 'order-bar',
        name: 'Quick Order Bar',
        required: true,
        purpose: 'Enable immediate action',
        keyElements: ['Delivery/Pickup toggle', 'Location input', 'Start Order button', 'Delivery partner logos'],
      },
      {
        id: 'menu-highlights',
        name: 'Menu Highlights',
        required: true,
        purpose: 'Showcase signature items',
        keyElements: ['Featured dishes with photos', 'Prices visible', 'Dietary icons', 'Quick add to order'],
      },
      {
        id: 'menu-full',
        name: 'Full Menu',
        required: true,
        purpose: 'Complete food exploration',
        keyElements: ['Category tabs', 'Item cards with descriptions', 'Customization hints', 'Nutritional info links'],
      },
      {
        id: 'sourcing',
        name: 'Our Ingredients / Story',
        required: true,
        purpose: 'Build trust through transparency',
        keyElements: ['Farm partnerships', 'Sourcing map', 'Freshness claims', 'Sustainability initiatives'],
      },
      {
        id: 'locations',
        name: 'Locations',
        required: true,
        purpose: 'Drive foot traffic and enable ordering',
        keyElements: ['Interactive map', 'Location cards with hours', 'Individual location CTAs', 'Opening soon teaser'],
      },
      {
        id: 'app-download',
        name: 'App Promotion',
        required: false,
        purpose: 'Drive loyalty program adoption',
        keyElements: ['App screenshots', 'Rewards explanation', 'Download badges', 'Exclusive offers mention'],
      },
      {
        id: 'catering',
        name: 'Catering / Group Orders',
        required: false,
        purpose: 'Capture B2B and event business',
        keyElements: ['Catering menu preview', 'Inquiry form', 'Minimum order info', 'Setup options'],
      },
      {
        id: 'newsletter',
        name: 'Email Signup',
        required: true,
        purpose: 'Build direct communication channel',
        keyElements: ['Free item offer', 'Simple email field', 'SMS option', 'Frequency expectation'],
      },
      {
        id: 'footer',
        name: 'Footer',
        required: true,
        purpose: 'Navigation and legal',
        keyElements: ['Location links', 'Career opportunities', 'Franchising info', 'Allergen/nutrition links'],
      },
    ],
    design: {
      colorDescription: 'Fresh, natural palette - warm earth tones with vibrant vegetable-inspired accents, clean whites',
      colors: {
        primary: '#2d5016',
        secondary: '#f5f0e8',
        accent: '#e07b39',
        background: '#ffffff',
      },
      typography: 'Modern, friendly sans-serif throughout - approachable but sophisticated',
      fonts: {
        heading: 'DM Sans',
        body: 'DM Sans',
      },
      imageStyle: 'Bright, overhead food photography with natural lighting, fresh ingredients visible, action shots of preparation',
      spacing: 'Clean and functional, tight on mobile for easy scrolling, generous on desktop for browsing',
      mood: 'Fresh, vibrant, healthy, community-focused, transparent',
    },
    copywriting: {
      tone: 'Friendly, transparent, passionate about food - casual but not juvenile',
      exampleHeadlines: [
        'Real Food, Real Fast',
        'From Our Farms to Your Bowl',
        'Fuel That Feels Good',
        'Freshness You Can Taste',
        'Eat Well. Live Well.',
      ],
      exampleCTAs: [
        'Order Now',
        'Find a Location',
        'View Full Menu',
        'Start Your Order',
        'Join Rewards',
      ],
      avoidPhrases: [
        'Cheap eats', 'Diet food', 'Guilty pleasure', 'Cheat meal',
        'Processed', 'Artificial', 'Corporate', 'Chain restaurant',
      ],
    },
    images: {
      hero: [
        'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=1920',
        'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=1920',
        'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=1920',
        'https://images.unsplash.com/photo-1543353071-873f17a7a088?w=1920',
      ],
      products: [
        'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=800',
        'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800',
        'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800',
        'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800',
        'https://images.unsplash.com/photo-1482049016gy4-7834cfb3205a?w=800',
      ],
      lifestyle: [
        'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200',
        'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200',
        'https://images.unsplash.com/photo-1559329007-40df8a9345d8?w=1200',
        'https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=1200',
      ],
      about: [
        'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200',
        'https://images.unsplash.com/photo-1581349485608-9469926a8e5e?w=1200',
        'https://images.unsplash.com/photo-1595273670150-bd0c3c392e46?w=1200',
        'https://images.unsplash.com/photo-1542838132-92c53300491e?w=1200',
      ],
    },
  },

  // ============================================================================
  // FITNESS / GYM
  // Research: Barry's, Orangetheory, F45, Equinox
  // Pattern: High-energy imagery, class schedules, transformation focus, community
  // ============================================================================
  {
    id: 'fitness-gym',
    name: 'Fitness & Gym',
    category: 'local-services',
    topBrands: ['Barry\'s Bootcamp', 'Orangetheory Fitness', 'F45 Training', 'Equinox', 'SoulCycle', 'CrossFit'],
    psychology: {
      customerNeeds: [
        'Understand what makes this gym different',
        'See class schedule and booking availability',
        'Know pricing and membership options clearly',
        'See the facility and equipment',
        'Understand the workout methodology',
        'Find location and parking information',
      ],
      trustFactors: [
        'Transformation stories and before/after results',
        'Certified trainer credentials',
        'Cleanliness and facility quality photos',
        'Class reviews and ratings',
        'Trial offer or money-back guarantee',
        'Clear cancellation policy',
      ],
      emotionalTriggers: [
        'Transformation and becoming best self',
        'Community and belonging',
        'Achievement and personal records',
        'Energy and empowerment',
        'Accountability and consistency',
        'Escaping daily stress',
      ],
    },
    sections: [
      {
        id: 'hero',
        name: 'Hero Section',
        required: true,
        purpose: 'Inspire action with energy and aspiration',
        keyElements: ['Dynamic workout imagery or video', 'Bold headline', 'Trial offer CTA', 'Key differentiator'],
      },
      {
        id: 'trial-offer',
        name: 'First-Timer Offer',
        required: true,
        purpose: 'Lower barrier to entry',
        keyElements: ['Free class or discounted week', 'Clear value proposition', 'Urgency element', 'Simple booking form'],
      },
      {
        id: 'methodology',
        name: 'Our Method / Workout Style',
        required: true,
        purpose: 'Explain the unique workout approach',
        keyElements: ['Workout breakdown', 'Science-backed claims', 'Expected results', 'Class format explanation'],
      },
      {
        id: 'class-schedule',
        name: 'Class Schedule',
        required: true,
        purpose: 'Enable booking and show availability',
        keyElements: ['Weekly calendar view', 'Class type filters', 'Instructor names', 'Book now buttons'],
      },
      {
        id: 'trainers',
        name: 'Our Trainers',
        required: true,
        purpose: 'Build trust through expertise and personality',
        keyElements: ['Trainer photos', 'Certifications', 'Specialties', 'Personality bios'],
      },
      {
        id: 'results',
        name: 'Results / Transformations',
        required: true,
        purpose: 'Prove effectiveness through social proof',
        keyElements: ['Before/after photos', 'Member testimonials', 'Metrics achieved', 'Video testimonials'],
      },
      {
        id: 'membership',
        name: 'Membership Options',
        required: true,
        purpose: 'Convert interest to purchase',
        keyElements: ['Pricing tiers', 'What\'s included', 'Comparison table', 'Most popular badge'],
      },
      {
        id: 'facility',
        name: 'Facility Tour',
        required: false,
        purpose: 'Showcase the space and equipment',
        keyElements: ['Photo gallery', 'Virtual tour option', 'Amenities list', 'Equipment highlights'],
      },
      {
        id: 'locations',
        name: 'Locations',
        required: true,
        purpose: 'Help visitors find nearest studio',
        keyElements: ['Map integration', 'Location cards', 'Hours and contact', 'Parking info'],
      },
      {
        id: 'app',
        name: 'Mobile App',
        required: false,
        purpose: 'Drive app adoption for retention',
        keyElements: ['App screenshots', 'Feature highlights', 'Download buttons', 'Booking convenience'],
      },
    ],
    design: {
      colorDescription: 'High-energy dark theme with vibrant accents - deep blacks, electric oranges or reds, clean whites',
      colors: {
        primary: '#ff4d00',
        secondary: '#1a1a1a',
        accent: '#ffffff',
        background: '#0d0d0d',
      },
      typography: 'Bold, condensed sans-serif for impact - aggressive headings, readable body text',
      fonts: {
        heading: 'Oswald',
        body: 'Source Sans Pro',
      },
      imageStyle: 'High-contrast action photography, dramatic lighting, athletes mid-workout, sweat and intensity visible',
      spacing: 'Dense, energetic layouts with strong visual hierarchy, bold section breaks',
      mood: 'Intense, motivating, aspirational, community-driven, results-focused',
    },
    copywriting: {
      tone: 'Motivational, direct, empowering - push without being aggressive',
      exampleHeadlines: [
        'Push Your Limits',
        'Results That Speak',
        'Your Strongest Hour',
        'Train Like You Mean It',
        'Where Results Happen',
      ],
      exampleCTAs: [
        'Book Your First Class Free',
        'Start Your Transformation',
        'View Schedule',
        'Join the Community',
        'Claim Your Trial',
      ],
      avoidPhrases: [
        'No pain no gain', 'Beach body', 'Skinny', 'Bulk up',
        'Quick fix', 'Lose weight fast', 'Get ripped', 'Summer body',
      ],
    },
    images: {
      hero: [
        'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1920',
        'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=1920',
        'https://images.unsplash.com/photo-1549060279-7e168fcee0c2?w=1920',
        'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=1920',
      ],
      products: [
        'https://images.unsplash.com/photo-1581009146145-b5ef050c149a?w=800',
        'https://images.unsplash.com/photo-1593079831268-3381b0db4a77?w=800',
        'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=800',
        'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=800',
      ],
      lifestyle: [
        'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=1200',
        'https://images.unsplash.com/photo-1571388208497-71bedc66e932?w=1200',
        'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200',
        'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=1200',
      ],
      about: [
        'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=1200',
        'https://images.unsplash.com/photo-1597452485669-2c7bb5fef90d?w=1200',
        'https://images.unsplash.com/photo-1567013127542-490d757e51fc?w=1200',
        'https://images.unsplash.com/photo-1605296867304-46d5465a13f1?w=1200',
      ],
    },
  },

  // ============================================================================
  // SPA & BEAUTY
  // Research: Drybar, Heyday, Glossier, Sephora
  // Pattern: Clean aesthetic, treatment focus, booking-centric, results-oriented
  // ============================================================================
  {
    id: 'spa-beauty',
    name: 'Spa & Beauty Services',
    category: 'local-services',
    topBrands: ['Drybar', 'Heyday', 'Glossier', 'Sephora', 'Skin Laundry', 'Massage Envy'],
    psychology: {
      customerNeeds: [
        'See service menu with clear pricing',
        'Book appointments easily online',
        'Understand what each treatment involves',
        'See the space and ambiance',
        'Know practitioner qualifications',
        'Read reviews from real clients',
      ],
      trustFactors: [
        'Clean, professional facility photos',
        'Licensed and certified staff credentials',
        'Product brands used (recognizable names)',
        'Before/after results for treatments',
        'Hygiene and sanitation standards',
        'Flexible cancellation policies',
      ],
      emotionalTriggers: [
        'Self-care and "me time" positioning',
        'Confidence and feeling beautiful',
        'Relaxation and stress relief',
        'Special occasion preparation',
        'Treating yourself - deserving pampering',
        'Visible results and transformation',
      ],
    },
    sections: [
      {
        id: 'hero',
        name: 'Hero Section',
        required: true,
        purpose: 'Set the mood and invite relaxation',
        keyElements: ['Serene imagery', 'Calming headline', 'Book Now CTA', 'New client offer'],
      },
      {
        id: 'booking-bar',
        name: 'Quick Booking Bar',
        required: true,
        purpose: 'Enable immediate appointment booking',
        keyElements: ['Service selector', 'Date/time picker', 'Location selector', 'Book button'],
      },
      {
        id: 'services',
        name: 'Services Menu',
        required: true,
        purpose: 'Showcase all treatments with pricing',
        keyElements: ['Service categories', 'Treatment descriptions', 'Duration and pricing', 'Add-on options'],
      },
      {
        id: 'signature',
        name: 'Signature Treatments',
        required: true,
        purpose: 'Highlight unique or popular services',
        keyElements: ['Featured treatment cards', 'What\'s included', 'Results expected', 'Book this service CTA'],
      },
      {
        id: 'results',
        name: 'Results Gallery',
        required: true,
        purpose: 'Show treatment effectiveness',
        keyElements: ['Before/after photos', 'Treatment labels', 'Client testimonials', 'Results timeline'],
      },
      {
        id: 'team',
        name: 'Meet the Team',
        required: true,
        purpose: 'Build trust through expertise',
        keyElements: ['Stylist/esthetician photos', 'Certifications', 'Specialties', 'Years of experience'],
      },
      {
        id: 'space',
        name: 'Our Space',
        required: false,
        purpose: 'Showcase the ambiance and environment',
        keyElements: ['Interior photography', 'Treatment rooms', 'Relaxation areas', 'Amenities'],
      },
      {
        id: 'products',
        name: 'Products We Use',
        required: false,
        purpose: 'Build trust through quality brands',
        keyElements: ['Brand logos', 'Why we chose them', 'Retail availability', 'Product education'],
      },
      {
        id: 'membership',
        name: 'Membership / Packages',
        required: true,
        purpose: 'Drive recurring revenue and loyalty',
        keyElements: ['Membership tiers', 'Included services', 'Savings highlight', 'Join CTA'],
      },
      {
        id: 'reviews',
        name: 'Client Reviews',
        required: true,
        purpose: 'Social proof and trust building',
        keyElements: ['Google/Yelp reviews', 'Star ratings', 'Specific service mentions', 'Photo reviews'],
      },
    ],
    design: {
      colorDescription: 'Soft, calming palette - blush pinks, sage greens, warm neutrals, clean whites',
      colors: {
        primary: '#d4a5a5',
        secondary: '#9caf88',
        accent: '#c9b037',
        background: '#fdfbf9',
      },
      typography: 'Elegant serif headings with soft sans-serif body - feminine but not frilly',
      fonts: {
        heading: 'Playfair Display',
        body: 'Lato',
      },
      imageStyle: 'Soft, natural lighting, serene atmosphere, close-up treatment shots, clean and minimal backgrounds',
      spacing: 'Airy and open, luxurious whitespace, calming visual flow',
      mood: 'Serene, luxurious, welcoming, clean, professional yet warm',
    },
    copywriting: {
      tone: 'Warm, inviting, indulgent - permission to treat yourself',
      exampleHeadlines: [
        'Your Glow Awaits',
        'Time for You',
        'Beauty, Elevated',
        'Where Self-Care Lives',
        'Relax. Restore. Renew.',
      ],
      exampleCTAs: [
        'Book Your Appointment',
        'Treat Yourself',
        'View Services',
        'Find Your Location',
        'Become a Member',
      ],
      avoidPhrases: [
        'Anti-aging', 'Fix your flaws', 'Problem areas', 'Hide imperfections',
        'Look younger', 'Reverse aging', 'Correct', 'Cheap',
      ],
    },
    images: {
      hero: [
        'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=1920',
        'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=1920',
        'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=1920',
        'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=1920',
      ],
      products: [
        'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=800',
        'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=800',
        'https://images.unsplash.com/photo-1571875257727-256c39da42af?w=800',
        'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=800',
      ],
      lifestyle: [
        'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=1200',
        'https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=1200',
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200',
        'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?w=1200',
      ],
      about: [
        'https://images.unsplash.com/photo-1600334129128-685c5582fd35?w=1200',
        'https://images.unsplash.com/photo-1559599101-f09722fb4948?w=1200',
        'https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=1200',
        'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=1200',
      ],
    },
  },

  // ============================================================================
  // LAW FIRM
  // Research: Top firms, modern legal websites
  // Pattern: Authority, credibility, trust, practice area clarity, easy contact
  // ============================================================================
  {
    id: 'law-firm',
    name: 'Law Firm',
    category: 'professional-services',
    topBrands: ['Cravath', 'Skadden', 'Davis Polk', 'Morgan & Morgan', 'Quinn Emanuel', 'Cooley'],
    psychology: {
      customerNeeds: [
        'Understand what areas of law the firm handles',
        'See attorney credentials and experience',
        'Know the firm\'s track record and results',
        'Find easy way to contact or schedule consultation',
        'Understand the process and what to expect',
        'Feel confident the firm can handle their case',
      ],
      trustFactors: [
        'Attorney education and bar admissions',
        'Case results and settlements (where allowed)',
        'Years of experience prominently displayed',
        'Professional certifications and awards',
        'Client testimonials and reviews',
        'Media mentions and thought leadership',
      ],
      emotionalTriggers: [
        'Protection and security',
        'Justice and fairness',
        'Expert guidance in confusing times',
        'Someone fighting in your corner',
        'Peace of mind and resolution',
        'Confidence in uncertain situations',
      ],
    },
    sections: [
      {
        id: 'hero',
        name: 'Hero Section',
        required: true,
        purpose: 'Establish authority and enable contact',
        keyElements: ['Confident headline', 'Core practice areas', 'Free consultation CTA', 'Phone number visible'],
      },
      {
        id: 'trust-bar',
        name: 'Trust Indicators',
        required: true,
        purpose: 'Immediate credibility signals',
        keyElements: ['Years in practice', 'Cases won', 'Amount recovered', 'Awards logos'],
      },
      {
        id: 'practice-areas',
        name: 'Practice Areas',
        required: true,
        purpose: 'Help visitors find relevant expertise',
        keyElements: ['Practice area cards', 'Brief descriptions', 'Learn more links', 'Icons or imagery'],
      },
      {
        id: 'results',
        name: 'Case Results',
        required: true,
        purpose: 'Prove track record and capability',
        keyElements: ['Notable settlements/verdicts', 'Case type labels', 'Dollar amounts where allowed', 'Confidential placeholders'],
      },
      {
        id: 'attorneys',
        name: 'Our Attorneys',
        required: true,
        purpose: 'Showcase team expertise',
        keyElements: ['Attorney headshots', 'Credentials', 'Practice focus', 'Bio links'],
      },
      {
        id: 'process',
        name: 'How We Work',
        required: true,
        purpose: 'Demystify legal process',
        keyElements: ['Step-by-step process', 'Timeline expectations', 'What clients provide', 'Communication style'],
      },
      {
        id: 'testimonials',
        name: 'Client Testimonials',
        required: true,
        purpose: 'Social proof from real clients',
        keyElements: ['Client quotes', 'Case type context', 'Star ratings', 'Google/Avvo review links'],
      },
      {
        id: 'faq',
        name: 'FAQ',
        required: true,
        purpose: 'Address common concerns',
        keyElements: ['Common questions', 'Clear answers', 'Accordion format', 'Contact CTA'],
      },
      {
        id: 'contact',
        name: 'Contact / Consultation',
        required: true,
        purpose: 'Convert visitors to leads',
        keyElements: ['Contact form', 'Phone number', 'Office locations', 'Response time promise'],
      },
      {
        id: 'resources',
        name: 'Resources / Blog',
        required: false,
        purpose: 'Demonstrate expertise and help with SEO',
        keyElements: ['Recent articles', 'Practice area guides', 'Video content', 'Newsletter signup'],
      },
    ],
    design: {
      colorDescription: 'Professional, authoritative palette - deep navy, rich burgundy or forest green, gold accents, cream backgrounds',
      colors: {
        primary: '#1e3a5f',
        secondary: '#8b2635',
        accent: '#c5a572',
        background: '#f8f6f3',
      },
      typography: 'Traditional serif for headings conveying authority, clean sans-serif for readability',
      fonts: {
        heading: 'Libre Baskerville',
        body: 'Open Sans',
      },
      imageStyle: 'Professional headshots, office interiors, courthouse imagery, serious but approachable',
      spacing: 'Structured and organized, clear hierarchy, professional density',
      mood: 'Authoritative, trustworthy, sophisticated, approachable expertise',
    },
    copywriting: {
      tone: 'Confident, knowledgeable, reassuring - authoritative without being intimidating',
      exampleHeadlines: [
        'Experienced Advocates in Your Corner',
        'Fighting for What\'s Right',
        'Trusted Legal Counsel for Over [X] Years',
        'Results-Driven Representation',
        'Your Case Deserves Dedicated Attention',
      ],
      exampleCTAs: [
        'Schedule a Free Consultation',
        'Contact Us Today',
        'Discuss Your Case',
        'Get Legal Help Now',
        'Speak With an Attorney',
      ],
      avoidPhrases: [
        'Guarantee results', 'Win your case', 'Best lawyers', 'Cheap legal help',
        'Quick settlement', 'Easy case', 'No-brainer', 'Slam dunk',
      ],
    },
    images: {
      hero: [
        'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=1920',
        'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=1920',
        'https://images.unsplash.com/photo-1521791055366-0d553872125f?w=1920',
        'https://images.unsplash.com/photo-1479142506502-19b3a3b7ff33?w=1920',
      ],
      products: [
        'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800',
        'https://images.unsplash.com/photo-1505664194779-8beaceb93744?w=800',
        'https://images.unsplash.com/photo-1423592707957-3b212afa6733?w=800',
        'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800',
      ],
      lifestyle: [
        'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=1200',
        'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=1200',
        'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=1200',
        'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1200',
      ],
      about: [
        'https://images.unsplash.com/photo-1556157382-97eda2d62296?w=1200',
        'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=1200',
        'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=1200',
        'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=1200',
      ],
    },
  },

  // ============================================================================
  // DENTAL CLINIC
  // Research: Tend, Aspen Dental, modern dental practices
  // Pattern: Modern/welcoming, anxiety reduction, clear services, easy booking
  // ============================================================================
  {
    id: 'dental-clinic',
    name: 'Dental Clinic',
    category: 'healthcare',
    topBrands: ['Tend', 'Aspen Dental', 'Smile Direct Club', 'Heartland Dental', 'Pacific Dental Services'],
    psychology: {
      customerNeeds: [
        'See services offered and pricing transparency',
        'Book appointments online easily',
        'Know insurance is accepted',
        'See the facility and technology',
        'Understand the dentist\'s qualifications',
        'Feel the environment is welcoming, not clinical',
      ],
      trustFactors: [
        'Dentist credentials and education',
        'Modern technology and equipment',
        'Clean, updated facility photos',
        'Patient reviews and testimonials',
        'Insurance and payment options clarity',
        'Before/after smile transformations',
      ],
      emotionalTriggers: [
        'Anxiety reduction and comfort',
        'Confidence in your smile',
        'Health and prevention mindset',
        'Modern, spa-like experience',
        'Family-friendly welcoming environment',
        'Painless and gentle care promises',
      ],
    },
    sections: [
      {
        id: 'hero',
        name: 'Hero Section',
        required: true,
        purpose: 'Welcome and reduce anxiety immediately',
        keyElements: ['Friendly imagery', 'Welcoming headline', 'Book appointment CTA', 'New patient offer'],
      },
      {
        id: 'booking',
        name: 'Appointment Booking',
        required: true,
        purpose: 'Enable easy online scheduling',
        keyElements: ['Book online button', 'Phone number', 'Hours displayed', 'Emergency contact'],
      },
      {
        id: 'services',
        name: 'Our Services',
        required: true,
        purpose: 'Showcase range of dental care',
        keyElements: ['Service categories', 'Brief descriptions', 'Icons', 'Learn more links'],
      },
      {
        id: 'technology',
        name: 'Modern Technology',
        required: true,
        purpose: 'Differentiate through advanced care',
        keyElements: ['Equipment photos', 'Technology benefits', 'Comfort features', 'Digital capabilities'],
      },
      {
        id: 'team',
        name: 'Meet Our Team',
        required: true,
        purpose: 'Build trust and familiarity',
        keyElements: ['Doctor headshots', 'Credentials', 'Friendly bios', 'Staff photos'],
      },
      {
        id: 'experience',
        name: 'Patient Experience',
        required: true,
        purpose: 'Address anxiety and comfort concerns',
        keyElements: ['Office tour photos', 'Amenities', 'Comfort options', 'What to expect'],
      },
      {
        id: 'transformations',
        name: 'Smile Transformations',
        required: true,
        purpose: 'Show results and inspire',
        keyElements: ['Before/after photos', 'Treatment type labels', 'Patient stories', 'Consultation CTA'],
      },
      {
        id: 'testimonials',
        name: 'Patient Reviews',
        required: true,
        purpose: 'Social proof and trust',
        keyElements: ['Google reviews', 'Star ratings', 'Video testimonials', 'Review platform links'],
      },
      {
        id: 'insurance',
        name: 'Insurance & Payment',
        required: true,
        purpose: 'Remove financial barriers',
        keyElements: ['Accepted insurance logos', 'Payment plans', 'Financing options', 'Price transparency'],
      },
      {
        id: 'location',
        name: 'Location & Hours',
        required: true,
        purpose: 'Provide practical information',
        keyElements: ['Map embed', 'Address', 'Hours of operation', 'Parking info'],
      },
    ],
    design: {
      colorDescription: 'Clean, modern healthcare palette - calming blues and teals, fresh whites, warm accents',
      colors: {
        primary: '#0891b2',
        secondary: '#115e59',
        accent: '#f59e0b',
        background: '#ffffff',
      },
      typography: 'Friendly, modern sans-serif throughout - approachable and contemporary',
      fonts: {
        heading: 'Poppins',
        body: 'Nunito',
      },
      imageStyle: 'Bright, welcoming photography - smiling patients, friendly staff, modern clean facilities',
      spacing: 'Clean and organized, calming whitespace, easy to scan',
      mood: 'Welcoming, modern, calming, professional yet friendly, anxiety-reducing',
    },
    copywriting: {
      tone: 'Warm, reassuring, modern - focuses on comfort and positive experiences',
      exampleHeadlines: [
        'Dentistry Designed Around You',
        'A Dental Experience You\'ll Actually Enjoy',
        'Smile with Confidence',
        'Modern Care. Genuine Comfort.',
        'Your Smile, Our Passion',
      ],
      exampleCTAs: [
        'Book Your Visit',
        'Schedule Online',
        'New Patient Special',
        'Meet Our Team',
        'See Our Technology',
      ],
      avoidPhrases: [
        'Drill', 'Pain', 'Needles', 'Scary', 'Procedure',
        'Clinical', 'Sterile', 'Medical', 'Cheap', 'Discount dentistry',
      ],
    },
    images: {
      hero: [
        'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=1920',
        'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=1920',
        'https://images.unsplash.com/photo-1445527815219-ecbfec67492e?w=1920',
        'https://images.unsplash.com/photo-1598256989800-fe5f95da9787?w=1920',
      ],
      products: [
        'https://images.unsplash.com/photo-1609840114035-3c981b782dfe?w=800',
        'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800',
        'https://images.unsplash.com/photo-1628177142898-93e36e4e3a50?w=800',
        'https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?w=800',
      ],
      lifestyle: [
        'https://images.unsplash.com/photo-1606265752439-1f18756aa5fc?w=1200',
        'https://images.unsplash.com/photo-1601907410547-fba51a1fa617?w=1200',
        'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=1200',
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=1200',
      ],
      about: [
        'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=1200',
        'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=1200',
        'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=1200',
        'https://images.unsplash.com/photo-1551190822-a9333d879b1f?w=1200',
      ],
    },
  },
];

// Export individual industries for direct access
export const jewelryIndustry = coreIndustries[0];
export const restaurantIndustry = coreIndustries[1];
export const fitnessGymIndustry = coreIndustries[2];
export const spaBeautyIndustry = coreIndustries[3];
export const lawFirmIndustry = coreIndustries[4];
export const dentalClinicIndustry = coreIndustries[5];

// Default export
export default coreIndustries;
