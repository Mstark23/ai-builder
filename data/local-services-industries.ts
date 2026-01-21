/**
 * VERKTORLABS Industry Intelligence - Local Services Industries
 * Research-based patterns from top brands in each category
 * 
 * Industries: 8
 * - Fine Dining Restaurant
 * - Casual Restaurant
 * - Coffee Shop
 * - Salon & Barbershop
 * - Auto Service
 * - Home Services
 * - Medical Practice
 * - Yoga/Pilates Studio
 */

import type { IndustryIntelligence } from '../types/industry';

// Re-export the type for convenience
export type { IndustryIntelligence } from '../types/industry';

export const localServiceIndustries: IndustryIntelligence[] = [
  // ============================================
  // 1. RESTAURANT - FINE DINING
  // ============================================
  {
    id: "restaurant-fine-dining",
    name: "Fine Dining Restaurant",
    category: "local-services",
    
    topBrands: [
      "Eleven Madison Park",
      "Nobu",
      "The French Laundry",
      "Alinea",
      "Per Se",
      "Le Bernardin"
    ],
    
    psychology: {
      customerNeeds: [
        "Sense of occasion and celebration",
        "Confidence in quality and reputation",
        "Clear understanding of the experience",
        "Easy reservation process",
        "Menu preview and dietary accommodation info",
        "Dress code and atmosphere expectations"
      ],
      trustFactors: [
        "Awards and recognition (Michelin stars, James Beard)",
        "Chef credentials and story",
        "Press mentions and reviews",
        "Longevity and heritage",
        "High-quality photography",
        "Professional, polished presentation"
      ],
      emotionalTriggers: [
        "Exclusivity and prestige",
        "Culinary artistry and craftsmanship",
        "Memorable experiences",
        "Romance and celebration",
        "Discovery and adventure",
        "Status and sophistication"
      ]
    },
    
    sections: [
      {
        id: "hero",
        name: "Hero / Opening Statement",
        required: true,
        purpose: "Create immediate sense of sophistication and set expectations",
        keyElements: [
          "Full-screen cinematic imagery or video",
          "Minimal text - let visuals speak",
          "Reservation CTA prominently placed",
          "Location subtly indicated"
        ]
      },
      {
        id: "concept",
        name: "Concept / Philosophy",
        required: true,
        purpose: "Communicate the culinary vision and what makes this restaurant unique",
        keyElements: [
          "Chef's philosophy or manifesto",
          "Ingredient sourcing story",
          "Culinary approach description",
          "Seasonal or tasting menu concept"
        ]
      },
      {
        id: "menus",
        name: "Menus",
        required: true,
        purpose: "Showcase offerings and set price expectations",
        keyElements: [
          "Tasting menu with pricing",
          "À la carte if available",
          "Wine pairing options",
          "Dietary accommodation notes",
          "Seasonal update indicators"
        ]
      },
      {
        id: "chef",
        name: "The Chef",
        required: true,
        purpose: "Build credibility through chef's story and credentials",
        keyElements: [
          "Professional portrait",
          "Background and training",
          "Awards and recognition",
          "Culinary philosophy quote"
        ]
      },
      {
        id: "experience",
        name: "The Experience",
        required: false,
        purpose: "Set expectations for the dining journey",
        keyElements: [
          "Interior photography",
          "Service style description",
          "Duration of experience",
          "What to expect"
        ]
      },
      {
        id: "private-events",
        name: "Private Dining",
        required: false,
        purpose: "Capture high-value private event bookings",
        keyElements: [
          "Private room imagery",
          "Capacity information",
          "Custom menu options",
          "Inquiry form"
        ]
      },
      {
        id: "press",
        name: "Press & Accolades",
        required: true,
        purpose: "Build credibility through third-party validation",
        keyElements: [
          "Michelin stars or major awards",
          "Publication logos",
          "Select quotes from reviews",
          "Chef media appearances"
        ]
      },
      {
        id: "reservations",
        name: "Reservations",
        required: true,
        purpose: "Convert interest into bookings",
        keyElements: [
          "Integrated booking widget (Resy, OpenTable, Tock)",
          "Cancellation policy",
          "Dress code",
          "Contact for special requests"
        ]
      },
      {
        id: "contact",
        name: "Contact & Location",
        required: true,
        purpose: "Provide practical visit information",
        keyElements: [
          "Address with map",
          "Hours of operation",
          "Phone number",
          "Parking/transportation info"
        ]
      }
    ],
    
    design: {
      colorDescription: "Dark, moody palette with metallic accents. Black or deep navy backgrounds with gold or copper touches create luxury feel.",
      colors: {
        primary: "#1a1a1a",
        secondary: "#c9a962",
        accent: "#8b7355",
        background: "#0d0d0d"
      },
      typography: "Refined serif fonts for headings, clean sans-serif for body. Generous letter-spacing creates elegance.",
      fonts: {
        heading: "Playfair Display",
        body: "Lato"
      },
      imageStyle: "Cinematic, low-light photography. Shallow depth of field. Close-ups of dishes as art. Moody atmosphere shots.",
      spacing: "Very generous whitespace. Let content breathe. Sections feel like gallery displays.",
      mood: "Sophisticated, intimate, artistic, exclusive"
    },
    
    copywriting: {
      tone: "Refined, poetic, understated. Short sentences. Evocative rather than descriptive. Never salesy.",
      exampleHeadlines: [
        "A journey through seasons",
        "Where craft meets intention",
        "The art of the table",
        "An evening, elevated",
        "Nourishing the senses"
      ],
      exampleCTAs: [
        "Reserve Your Table",
        "Begin Your Experience",
        "Request a Reservation",
        "Join Us",
        "Secure Your Evening"
      ],
      avoidPhrases: [
        "Best restaurant in town",
        "Delicious food",
        "Amazing service",
        "Book now before it's too late",
        "You won't be disappointed",
        "Fine dining experience"
      ]
    },
    
    images: {
      hero: [
        "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1600&q=80",
        "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=1600&q=80",
        "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1600&q=80",
        "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?w=1600&q=80",
        "https://images.unsplash.com/photo-1592861956120-e524fc739696?w=1600&q=80"
      ],
      products: [
        "https://images.unsplash.com/photo-1546039907-7fa05f864c02?w=1200&q=80",
        "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200&q=80",
        "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=1200&q=80",
        "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=1200&q=80",
        "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=1200&q=80"
      ],
      lifestyle: [
        "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=1200&q=80",
        "https://images.unsplash.com/photo-1600891964092-4316c288032e?w=1200&q=80",
        "https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=1200&q=80",
        "https://images.unsplash.com/photo-1560624052-449f5ddf0c31?w=1200&q=80",
        "https://images.unsplash.com/photo-1515669097368-22e68427d265?w=1200&q=80"
      ],
      about: [
        "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=1200&q=80",
        "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=1200&q=80",
        "https://images.unsplash.com/photo-1581299894007-aaa50297cf16?w=1200&q=80",
        "https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?w=1200&q=80",
        "https://images.unsplash.com/photo-1507048331197-7d4ac70811cf?w=1200&q=80"
      ]
    }
  },

  // ============================================
  // 2. RESTAURANT - CASUAL
  // ============================================
  {
    id: "restaurant-casual",
    name: "Casual Restaurant / Fast Casual",
    category: "local-services",
    
    topBrands: [
      "Sweetgreen",
      "CAVA",
      "Tender Greens",
      "Chipotle",
      "Shake Shack",
      "Dig"
    ],
    
    psychology: {
      customerNeeds: [
        "Quick understanding of menu and concept",
        "Transparency about ingredients and sourcing",
        "Easy online ordering",
        "Location finder",
        "Nutritional information",
        "Loyalty/rewards program access"
      ],
      trustFactors: [
        "Ingredient sourcing transparency",
        "Clean, modern branding",
        "Health and sustainability commitments",
        "Consistent quality messaging",
        "Real food photography",
        "Community involvement"
      ],
      emotionalTriggers: [
        "Feeling good about food choices",
        "Convenience without compromise",
        "Being part of a movement",
        "Fresh, vibrant energy",
        "Customization and control",
        "Supporting local/sustainable"
      ]
    },
    
    sections: [
      {
        id: "hero",
        name: "Hero / Value Proposition",
        required: true,
        purpose: "Immediately communicate brand concept and drive ordering",
        keyElements: [
          "Vibrant food photography",
          "Clear tagline about concept",
          "Prominent order CTA",
          "App download prompts"
        ]
      },
      {
        id: "menu",
        name: "Menu",
        required: true,
        purpose: "Showcase offerings in an appetizing, easy-to-navigate way",
        keyElements: [
          "Visual menu with photos",
          "Customization options",
          "Dietary filters (vegan, GF, etc.)",
          "Calorie/nutritional info",
          "Seasonal/limited items highlighted"
        ]
      },
      {
        id: "ordering",
        name: "Order Online",
        required: true,
        purpose: "Convert visitors to orders",
        keyElements: [
          "Order pickup option",
          "Delivery integration",
          "Catering option",
          "Gift cards"
        ]
      },
      {
        id: "sourcing",
        name: "Our Ingredients / Food Philosophy",
        required: true,
        purpose: "Build trust through transparency and differentiation",
        keyElements: [
          "Sourcing practices",
          "Supplier partnerships",
          "Sustainability commitments",
          "Health benefits"
        ]
      },
      {
        id: "locations",
        name: "Locations",
        required: true,
        purpose: "Help customers find nearest restaurant",
        keyElements: [
          "Interactive map",
          "Search by zip/city",
          "Individual location hours",
          "Coming soon locations"
        ]
      },
      {
        id: "rewards",
        name: "Rewards / App",
        required: false,
        purpose: "Drive app downloads and loyalty program signups",
        keyElements: [
          "Rewards program benefits",
          "App features",
          "Download links",
          "Sign-up incentive"
        ]
      },
      {
        id: "catering",
        name: "Catering",
        required: false,
        purpose: "Capture B2B and event orders",
        keyElements: [
          "Catering menu",
          "Group order minimums",
          "Delivery areas",
          "Inquiry/order form"
        ]
      },
      {
        id: "impact",
        name: "Impact / Sustainability",
        required: false,
        purpose: "Connect with values-driven customers",
        keyElements: [
          "Environmental initiatives",
          "Community programs",
          "Packaging commitments",
          "Metrics and goals"
        ]
      },
      {
        id: "careers",
        name: "Careers",
        required: false,
        purpose: "Recruit team members",
        keyElements: [
          "Culture highlights",
          "Benefits",
          "Open positions",
          "Application process"
        ]
      }
    ],
    
    design: {
      colorDescription: "Fresh, natural palette with pops of vibrant color. Greens, warm neutrals, and bright accents that feel healthy and energetic.",
      colors: {
        primary: "#2d5a27",
        secondary: "#f5f0e8",
        accent: "#e85d04",
        background: "#ffffff"
      },
      typography: "Modern, friendly sans-serif. Bold headings with approachable body text. Clean and legible.",
      fonts: {
        heading: "DM Sans",
        body: "Inter"
      },
      imageStyle: "Bright, overhead food shots. Fresh ingredients. Action shots of prep. Diverse, happy customers.",
      spacing: "Clean and organized. Card-based layouts. Easy scanning.",
      mood: "Fresh, energetic, wholesome, accessible"
    },
    
    copywriting: {
      tone: "Friendly, transparent, enthusiastic. Short punchy sentences. Emphasis on fresh and real.",
      exampleHeadlines: [
        "Real food, real fast",
        "Fuel that feels good",
        "Deliciously uncomplicated",
        "Fresh is our thing",
        "Eat well, do well"
      ],
      exampleCTAs: [
        "Order Now",
        "Find a Location",
        "Start Your Order",
        "Build Your Bowl",
        "Get the App"
      ],
      avoidPhrases: [
        "Cheap eats",
        "Fast food",
        "Processed",
        "Diet food",
        "Guilty pleasure",
        "Cheat meal"
      ]
    },
    
    images: {
      hero: [
        "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=1600&q=80",
        "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=1600&q=80",
        "https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=1600&q=80",
        "https://images.unsplash.com/photo-1543339308-43e59d6b73a6?w=1600&q=80",
        "https://images.unsplash.com/photo-1529059997568-3d847b1154f0?w=1600&q=80"
      ],
      products: [
        "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=1200&q=80",
        "https://images.unsplash.com/photo-1607532941433-304659e8198a?w=1200&q=80",
        "https://images.unsplash.com/photo-1547592180-85f173990554?w=1200&q=80",
        "https://images.unsplash.com/photo-1623428187969-5da2dcea5ebf?w=1200&q=80",
        "https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?w=1200&q=80"
      ],
      lifestyle: [
        "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&q=80",
        "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=1200&q=80",
        "https://images.unsplash.com/photo-1424847651672-bf20a4b0982b?w=1200&q=80",
        "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&q=80",
        "https://images.unsplash.com/photo-1559329007-40df8a9345d8?w=1200&q=80"
      ],
      about: [
        "https://images.unsplash.com/photo-1466637574441-749b8f19452f?w=1200&q=80",
        "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200&q=80",
        "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1200&q=80",
        "https://images.unsplash.com/photo-1551218808-94e220e084d2?w=1200&q=80",
        "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=1200&q=80"
      ]
    }
  },

  // ============================================
  // 3. CAFE / COFFEE SHOP
  // ============================================
  {
    id: "cafe-coffee-shop",
    name: "Cafe / Coffee Shop",
    category: "local-services",
    
    topBrands: [
      "Blue Bottle Coffee",
      "Stumptown Coffee Roasters",
      "Intelligentsia Coffee",
      "La Colombe",
      "Verve Coffee Roasters",
      "Counter Culture Coffee"
    ],
    
    psychology: {
      customerNeeds: [
        "Understanding of coffee quality and sourcing",
        "Location and hours information",
        "Menu/offerings overview",
        "Atmosphere preview",
        "Online ordering for beans/merchandise",
        "WiFi and workspace suitability"
      ],
      trustFactors: [
        "Origin and sourcing transparency",
        "Roasting expertise and process",
        "Quality certifications",
        "Barista expertise",
        "Consistency across locations",
        "Community and culture"
      ],
      emotionalTriggers: [
        "Ritual and comfort",
        "Discovery and craft appreciation",
        "Community belonging",
        "Creative/productive atmosphere",
        "Sensory experience",
        "Supporting ethical practices"
      ]
    },
    
    sections: [
      {
        id: "hero",
        name: "Hero",
        required: true,
        purpose: "Establish brand identity and coffee philosophy",
        keyElements: [
          "Atmospheric cafe imagery or coffee close-up",
          "Simple, evocative tagline",
          "Location finder CTA",
          "Shop coffee CTA"
        ]
      },
      {
        id: "coffee",
        name: "Our Coffee",
        required: true,
        purpose: "Communicate quality and differentiation",
        keyElements: [
          "Sourcing philosophy",
          "Roasting approach",
          "Current offerings",
          "Tasting notes methodology"
        ]
      },
      {
        id: "menu",
        name: "Menu",
        required: true,
        purpose: "Show drinks and food offerings",
        keyElements: [
          "Espresso drinks",
          "Filter/pour-over options",
          "Food items",
          "Seasonal specials"
        ]
      },
      {
        id: "shop",
        name: "Shop / Subscribe",
        required: true,
        purpose: "Drive online bean sales and subscriptions",
        keyElements: [
          "Bean offerings with tasting notes",
          "Subscription options",
          "Brewing equipment",
          "Merchandise"
        ]
      },
      {
        id: "locations",
        name: "Locations",
        required: true,
        purpose: "Help customers find and visit cafes",
        keyElements: [
          "Location cards with photos",
          "Hours and amenities",
          "Neighborhood context",
          "Map integration"
        ]
      },
      {
        id: "sourcing",
        name: "Sourcing / Origins",
        required: false,
        purpose: "Build trust through supply chain transparency",
        keyElements: [
          "Farm/producer relationships",
          "Region information",
          "Sustainability practices",
          "Direct trade info"
        ]
      },
      {
        id: "wholesale",
        name: "Wholesale",
        required: false,
        purpose: "Capture B2B partnerships",
        keyElements: [
          "Wholesale program details",
          "Training offerings",
          "Equipment support",
          "Inquiry form"
        ]
      },
      {
        id: "about",
        name: "Our Story",
        required: false,
        purpose: "Connect through brand narrative",
        keyElements: [
          "Founding story",
          "Mission and values",
          "Team/roasters",
          "Community involvement"
        ]
      }
    ],
    
    design: {
      colorDescription: "Warm, earthy tones with cream and coffee hues. Minimalist palette that lets the product shine. Subtle warmth.",
      colors: {
        primary: "#3d2c29",
        secondary: "#c4a77d",
        accent: "#8b5a2b",
        background: "#f8f5f0"
      },
      typography: "Clean, minimal sans-serif or refined serif. Emphasis on readability. Subtle craft feeling.",
      fonts: {
        heading: "Libre Baskerville",
        body: "Source Sans Pro"
      },
      imageStyle: "Warm natural light. Steam and texture. Hands holding cups. Roasting process. Moody cafe interiors.",
      spacing: "Generous, gallery-like. Content feels curated and intentional.",
      mood: "Warm, crafted, minimal, inviting"
    },
    
    copywriting: {
      tone: "Knowledgeable but approachable. Passionate without pretension. Descriptive sensory language.",
      exampleHeadlines: [
        "Roasted with intention",
        "From seed to cup",
        "Where coffee is craft",
        "Your morning ritual, elevated",
        "Sourced with care, roasted with passion"
      ],
      exampleCTAs: [
        "Shop Coffee",
        "Find a Cafe",
        "Start a Subscription",
        "Explore Origins",
        "Order Ahead"
      ],
      avoidPhrases: [
        "Best coffee ever",
        "Coffee snob",
        "Java",
        "Cup of joe",
        "Caffeine fix",
        "Basic coffee"
      ]
    },
    
    images: {
      hero: [
        "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1600&q=80",
        "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=1600&q=80",
        "https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=1600&q=80",
        "https://images.unsplash.com/photo-1498804103079-a6351b050096?w=1600&q=80",
        "https://images.unsplash.com/photo-1559496417-e7f25cb247f3?w=1600&q=80"
      ],
      products: [
        "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=1200&q=80",
        "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=1200&q=80",
        "https://images.unsplash.com/photo-1610889556528-9a770e32642f?w=1200&q=80",
        "https://images.unsplash.com/photo-1587734195503-904fca47e0e9?w=1200&q=80",
        "https://images.unsplash.com/photo-1611564494260-6f21b80af7ea?w=1200&q=80"
      ],
      lifestyle: [
        "https://images.unsplash.com/photo-1445116572660-236099ec97a0?w=1200&q=80",
        "https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=1200&q=80",
        "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=1200&q=80",
        "https://images.unsplash.com/photo-1600093463592-8e36ae95ef56?w=1200&q=80",
        "https://images.unsplash.com/photo-1453614512568-c4024d13c247?w=1200&q=80"
      ],
      about: [
        "https://images.unsplash.com/photo-1511920170033-f8396924c348?w=1200&q=80",
        "https://images.unsplash.com/photo-1504630083234-14187a9df0f5?w=1200&q=80",
        "https://images.unsplash.com/photo-1558872235-101f80c1c04a?w=1200&q=80",
        "https://images.unsplash.com/photo-1518057111178-44a106bad636?w=1200&q=80",
        "https://images.unsplash.com/photo-1494314671902-399b18174975?w=1200&q=80"
      ]
    }
  },

  // ============================================
  // 4. SALON - HAIR
  // ============================================
  {
    id: "salon-hair",
    name: "Hair Salon",
    category: "local-services",
    
    topBrands: [
      "Drybar",
      "Madison Reed",
      "Blind Barber",
      "IGK Salon",
      "Spoke & Weal",
      "Salon SCK"
    ],
    
    psychology: {
      customerNeeds: [
        "See stylist work and specialties",
        "Easy booking system",
        "Pricing transparency",
        "Salon atmosphere preview",
        "Stylist matching",
        "Location and parking info"
      ],
      trustFactors: [
        "Portfolio of work (before/after)",
        "Stylist credentials and training",
        "Client testimonials with photos",
        "Product brand partnerships",
        "Clean, professional environment",
        "Consistent branding"
      ],
      emotionalTriggers: [
        "Self-confidence and transformation",
        "Self-care and pampering",
        "Expertise and trust",
        "Trendy and current",
        "Feeling understood",
        "Community and belonging"
      ]
    },
    
    sections: [
      {
        id: "hero",
        name: "Hero",
        required: true,
        purpose: "Showcase salon vibe and invite booking",
        keyElements: [
          "Striking hair imagery",
          "Brand positioning statement",
          "Prominent book now CTA",
          "Location indicator"
        ]
      },
      {
        id: "services",
        name: "Services & Pricing",
        required: true,
        purpose: "Clear service menu with transparent pricing",
        keyElements: [
          "Service categories (cut, color, style, treatment)",
          "Pricing or starting prices",
          "Duration estimates",
          "Service descriptions"
        ]
      },
      {
        id: "team",
        name: "Our Stylists",
        required: true,
        purpose: "Build trust and help clients find their stylist",
        keyElements: [
          "Individual stylist profiles",
          "Photos and bios",
          "Specialties (color, curly hair, etc.)",
          "Portfolio samples",
          "Direct booking links"
        ]
      },
      {
        id: "gallery",
        name: "Our Work / Portfolio",
        required: true,
        purpose: "Demonstrate expertise through visual proof",
        keyElements: [
          "Before/after transformations",
          "Style variety",
          "Color work showcase",
          "Instagram integration"
        ]
      },
      {
        id: "booking",
        name: "Book Now",
        required: true,
        purpose: "Convert visitors to appointments",
        keyElements: [
          "Online booking integration",
          "Stylist selection",
          "Service selection",
          "Date/time picker"
        ]
      },
      {
        id: "experience",
        name: "The Experience",
        required: false,
        purpose: "Set expectations and differentiate",
        keyElements: [
          "Salon interior photos",
          "Amenities (beverages, WiFi)",
          "What to expect",
          "COVID protocols if relevant"
        ]
      },
      {
        id: "products",
        name: "Products / Shop",
        required: false,
        purpose: "Retail sales and product education",
        keyElements: [
          "Product lines carried",
          "Stylist recommendations",
          "Online shop if available",
          "Product benefits"
        ]
      },
      {
        id: "testimonials",
        name: "Reviews",
        required: true,
        purpose: "Social proof from happy clients",
        keyElements: [
          "Client reviews with photos",
          "Google/Yelp rating",
          "Video testimonials if available",
          "Before/after with review"
        ]
      },
      {
        id: "contact",
        name: "Location & Contact",
        required: true,
        purpose: "Practical visit information",
        keyElements: [
          "Address with map",
          "Hours",
          "Phone/email",
          "Parking info"
        ]
      }
    ],
    
    design: {
      colorDescription: "Sophisticated neutral palette with a signature accent. Black, white, blush or warm metallics. Clean and editorial.",
      colors: {
        primary: "#1a1a1a",
        secondary: "#f5e6e0",
        accent: "#d4a574",
        background: "#ffffff"
      },
      typography: "Chic, fashion-forward. Mix of elegant serif headlines and clean sans-serif body.",
      fonts: {
        heading: "Cormorant Garamond",
        body: "Montserrat"
      },
      imageStyle: "Editorial hair photography. Natural light. Close-up texture shots. Lifestyle in-salon moments.",
      spacing: "Clean, airy layouts. Gallery-style image displays.",
      mood: "Chic, professional, inviting, trendy"
    },
    
    copywriting: {
      tone: "Confident, welcoming, fashion-conscious. Expertise without intimidation.",
      exampleHeadlines: [
        "Where style finds you",
        "Your best hair starts here",
        "Expertise meets expression",
        "Color that speaks volumes",
        "More than a haircut"
      ],
      exampleCTAs: [
        "Book Your Appointment",
        "Find Your Stylist",
        "Schedule Now",
        "View Our Work",
        "Get the Look"
      ],
      avoidPhrases: [
        "Cheap haircuts",
        "Walk-ins welcome",
        "Discount salon",
        "Basic trim",
        "Any stylist",
        "Quick cuts"
      ]
    },
    
    images: {
      hero: [
        "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=1600&q=80",
        "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=1600&q=80",
        "https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?w=1600&q=80",
        "https://images.unsplash.com/photo-1562322140-8baeececf3df?w=1600&q=80",
        "https://images.unsplash.com/photo-1605497788044-5a32c7078486?w=1600&q=80"
      ],
      products: [
        "https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?w=1200&q=80",
        "https://images.unsplash.com/photo-1522337094846-8a818192de1f?w=1200&q=80",
        "https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=1200&q=80",
        "https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=1200&q=80",
        "https://images.unsplash.com/photo-1492106087820-71f1a00d2b11?w=1200&q=80"
      ],
      lifestyle: [
        "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=1200&q=80",
        "https://images.unsplash.com/photo-1559599101-f09722fb4948?w=1200&q=80",
        "https://images.unsplash.com/photo-1582095133179-bfd08e2fc6b3?w=1200&q=80",
        "https://images.unsplash.com/photo-1633681926022-84c23e8cb2d6?w=1200&q=80",
        "https://images.unsplash.com/photo-1500840216050-6ffa99d75160?w=1200&q=80"
      ],
      about: [
        "https://images.unsplash.com/photo-1633681926022-84c23e8cb2d6?w=1200&q=80",
        "https://images.unsplash.com/photo-1559599101-f09722fb4948?w=1200&q=80",
        "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=1200&q=80",
        "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=1200&q=80",
        "https://images.unsplash.com/photo-1562322140-8baeececf3df?w=1200&q=80"
      ]
    }
  },

  // ============================================
  // 5. NAIL SALON
  // ============================================
  {
    id: "nail-salon",
    name: "Nail Salon",
    category: "local-services",
    
    topBrands: [
      "Olive & June",
      "Paintbox",
      "MiniLuxe",
      "tenoverten",
      "Sundays",
      "Base Coat"
    ],
    
    psychology: {
      customerNeeds: [
        "Service menu with clear pricing",
        "Online booking availability",
        "Hygiene and cleanliness standards",
        "Nail art gallery/inspiration",
        "Product information (non-toxic, etc.)",
        "Gift card options"
      ],
      trustFactors: [
        "Clean, modern environment",
        "Health/safety standards (sterilization)",
        "Non-toxic/clean product lines",
        "Nail artist portfolios",
        "Consistent quality",
        "Professional training"
      ],
      emotionalTriggers: [
        "Self-care and relaxation",
        "Self-expression through nail art",
        "Feeling polished and put-together",
        "Treat yourself moments",
        "Social experience (going with friends)",
        "Confidence boost"
      ]
    },
    
    sections: [
      {
        id: "hero",
        name: "Hero",
        required: true,
        purpose: "Establish brand aesthetic and drive bookings",
        keyElements: [
          "Beautiful nail imagery",
          "Brand positioning",
          "Book now CTA",
          "Current promotion if applicable"
        ]
      },
      {
        id: "services",
        name: "Services & Pricing",
        required: true,
        purpose: "Clear menu of offerings",
        keyElements: [
          "Manicure options",
          "Pedicure options",
          "Nail art/enhancements",
          "Add-ons and treatments",
          "Duration and pricing"
        ]
      },
      {
        id: "gallery",
        name: "Nail Art Gallery",
        required: true,
        purpose: "Inspire and showcase capabilities",
        keyElements: [
          "Nail art portfolio",
          "Seasonal designs",
          "Classic looks",
          "Custom work examples",
          "Instagram feed integration"
        ]
      },
      {
        id: "booking",
        name: "Book Now",
        required: true,
        purpose: "Streamlined appointment scheduling",
        keyElements: [
          "Online booking widget",
          "Service selection",
          "Technician selection if preferred",
          "Multiple location support"
        ]
      },
      {
        id: "clean-beauty",
        name: "Clean Beauty / Our Standards",
        required: true,
        purpose: "Differentiate through health-conscious positioning",
        keyElements: [
          "Non-toxic product commitment",
          "Sanitation practices",
          "Product lines used",
          "Health certifications"
        ]
      },
      {
        id: "membership",
        name: "Membership / Packages",
        required: false,
        purpose: "Drive recurring revenue and loyalty",
        keyElements: [
          "Membership tiers and pricing",
          "Benefits breakdown",
          "Package deals",
          "Gift options"
        ]
      },
      {
        id: "shop",
        name: "Shop",
        required: false,
        purpose: "Retail nail care products",
        keyElements: [
          "At-home products",
          "Polish collections",
          "Tools and accessories",
          "Gift sets"
        ]
      },
      {
        id: "locations",
        name: "Locations",
        required: true,
        purpose: "Multi-location discovery",
        keyElements: [
          "Location cards with photos",
          "Hours and contact",
          "Book at specific location",
          "Parking/transit info"
        ]
      },
      {
        id: "reviews",
        name: "Reviews",
        required: true,
        purpose: "Social proof and trust",
        keyElements: [
          "Client reviews",
          "Star ratings",
          "Before/after or result photos",
          "Press mentions"
        ]
      }
    ],
    
    design: {
      colorDescription: "Soft, feminine palette with playful accents. Blush pinks, creams, and modern pastels. Clean and Instagram-worthy.",
      colors: {
        primary: "#e8b4b8",
        secondary: "#f7f3f0",
        accent: "#c75b7a",
        background: "#ffffff"
      },
      typography: "Modern, feminine sans-serif. Clean headlines with soft, readable body text.",
      fonts: {
        heading: "Poppins",
        body: "Nunito Sans"
      },
      imageStyle: "Close-up nail art. Clean, bright photography. Flat-lay product shots. Modern interior spaces.",
      spacing: "Clean, organized. Card-based service displays. Visual-heavy layouts.",
      mood: "Fresh, playful, clean, inviting"
    },
    
    copywriting: {
      tone: "Friendly, fun, slightly playful. Health-conscious messaging. Empowering.",
      exampleHeadlines: [
        "Nails that make a statement",
        "Clean beauty for your hands",
        "Your self-care ritual",
        "Polish with purpose",
        "Express yourself"
      ],
      exampleCTAs: [
        "Book Now",
        "Get Inspired",
        "Find Your Look",
        "Join the Club",
        "Shop Nail Care"
      ],
      avoidPhrases: [
        "Cheap manicures",
        "Quick nails",
        "Discount deals",
        "Basic polish",
        "Walk-in specials",
        "Budget friendly"
      ]
    },
    
    images: {
      hero: [
        "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=1600&q=80",
        "https://images.unsplash.com/photo-1610992015732-2449b76344bc?w=1600&q=80",
        "https://images.unsplash.com/photo-1607779097040-26e80aa78e66?w=1600&q=80",
        "https://images.unsplash.com/photo-1519014816548-bf5fe059798b?w=1600&q=80",
        "https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?w=1600&q=80"
      ],
      products: [
        "https://images.unsplash.com/photo-1599206676335-5c5471a5cdeb?w=1200&q=80",
        "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=1200&q=80",
        "https://images.unsplash.com/photo-1571290274554-6a2eaa771e5f?w=1200&q=80",
        "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=1200&q=80",
        "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=1200&q=80"
      ],
      lifestyle: [
        "https://images.unsplash.com/photo-1600948836101-f9ffda59d250?w=1200&q=80",
        "https://images.unsplash.com/photo-1519014816548-bf5fe059798b?w=1200&q=80",
        "https://images.unsplash.com/photo-1610992015732-2449b76344bc?w=1200&q=80",
        "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=1200&q=80",
        "https://images.unsplash.com/photo-1595867818082-083862f3d630?w=1200&q=80"
      ],
      about: [
        "https://images.unsplash.com/photo-1633681122967-4c2e402c9c90?w=1200&q=80",
        "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=1200&q=80",
        "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=1200&q=80",
        "https://images.unsplash.com/photo-1519014816548-bf5fe059798b?w=1200&q=80",
        "https://images.unsplash.com/photo-1562322140-8baeececf3df?w=1200&q=80"
      ]
    }
  },

  // ============================================
  // 6. MED SPA
  // ============================================
  {
    id: "med-spa",
    name: "Medical Spa / Med Spa",
    category: "local-services",
    
    topBrands: [
      "Ever/Body",
      "Skin Laundry",
      "Heyday",
      "Glowbar",
      "Peachy",
      "SkinSpirit"
    ],
    
    psychology: {
      customerNeeds: [
        "Treatment information and results",
        "Provider credentials and expertise",
        "Pricing transparency",
        "Before/after gallery",
        "Consultation booking",
        "Safety and quality assurance"
      ],
      trustFactors: [
        "Medical credentials (MD, RN, etc.)",
        "Before/after results",
        "FDA-approved treatments",
        "Professional affiliations",
        "Client testimonials",
        "Clean, clinical environment"
      ],
      emotionalTriggers: [
        "Confidence and self-improvement",
        "Looking refreshed and natural",
        "Preventative care mindset",
        "Self-investment",
        "Expert guidance",
        "Feeling understood and supported"
      ]
    },
    
    sections: [
      {
        id: "hero",
        name: "Hero",
        required: true,
        purpose: "Establish credibility and invite consultations",
        keyElements: [
          "Clean, aspirational imagery",
          "Clear value proposition",
          "Consultation CTA",
          "Trust indicators (credentials)"
        ]
      },
      {
        id: "treatments",
        name: "Treatments / Services",
        required: true,
        purpose: "Comprehensive service overview",
        keyElements: [
          "Treatment categories (injectables, laser, facials)",
          "Individual treatment pages",
          "Benefits and process",
          "Ideal candidate info",
          "Pricing or consultation prompts"
        ]
      },
      {
        id: "results",
        name: "Results / Before & After",
        required: true,
        purpose: "Visual proof of efficacy",
        keyElements: [
          "Before/after gallery",
          "Treatment type filters",
          "Patient stories",
          "Realistic expectations"
        ]
      },
      {
        id: "team",
        name: "Our Providers / Team",
        required: true,
        purpose: "Build trust through credentials",
        keyElements: [
          "Provider profiles",
          "Medical credentials",
          "Specialties and training",
          "Certifications",
          "Professional headshots"
        ]
      },
      {
        id: "booking",
        name: "Book Consultation",
        required: true,
        purpose: "Convert interest to consultations",
        keyElements: [
          "Online scheduling",
          "Consultation types",
          "What to expect",
          "Location selection"
        ]
      },
      {
        id: "education",
        name: "Education / Resources",
        required: false,
        purpose: "Position as experts and address concerns",
        keyElements: [
          "Treatment FAQs",
          "Blog/articles",
          "Video content",
          "First-timer guides"
        ]
      },
      {
        id: "memberships",
        name: "Memberships",
        required: false,
        purpose: "Drive recurring visits and loyalty",
        keyElements: [
          "Membership tiers",
          "Benefits and savings",
          "Included treatments",
          "Exclusive perks"
        ]
      },
      {
        id: "testimonials",
        name: "Reviews & Testimonials",
        required: true,
        purpose: "Social proof from satisfied clients",
        keyElements: [
          "Written reviews",
          "Video testimonials",
          "Ratings integration",
          "Treatment-specific reviews"
        ]
      },
      {
        id: "locations",
        name: "Locations",
        required: true,
        purpose: "Multi-location directory",
        keyElements: [
          "Location cards",
          "Contact information",
          "Hours",
          "Book at location"
        ]
      },
      {
        id: "financing",
        name: "Financing",
        required: false,
        purpose: "Remove cost barriers",
        keyElements: [
          "Payment plan options",
          "Financing partners (Cherry, Affirm)",
          "Application process",
          "No-interest options"
        ]
      }
    ],
    
    design: {
      colorDescription: "Clinical yet warm. White-dominated with soft neutrals and a sophisticated accent color. Modern and trustworthy.",
      colors: {
        primary: "#2d3436",
        secondary: "#f5f1eb",
        accent: "#d4a574",
        background: "#ffffff"
      },
      typography: "Clean, modern sans-serif. Professional but not cold. Excellent readability.",
      fonts: {
        heading: "Outfit",
        body: "DM Sans"
      },
      imageStyle: "Clean, bright treatment photos. Natural-looking results. Modern interiors. Diverse clientele.",
      spacing: "Generous, clinical clean. Information hierarchy clear.",
      mood: "Professional, warm, trustworthy, aspirational"
    },
    
    copywriting: {
      tone: "Expert, reassuring, approachable. Scientific backing without jargon. Empowering.",
      exampleHeadlines: [
        "Expert care, natural results",
        "The science of looking like yourself",
        "Your skin, optimized",
        "Preventative beauty, perfected",
        "Where expertise meets enhancement"
      ],
      exampleCTAs: [
        "Book a Consultation",
        "See Results",
        "Meet Our Providers",
        "Explore Treatments",
        "Get Started"
      ],
      avoidPhrases: [
        "Anti-aging",
        "Perfect skin",
        "Turn back the clock",
        "Dramatic transformation",
        "Cheap Botox",
        "Miracle treatment"
      ]
    },
    
    images: {
      hero: [
        "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=1600&q=80",
        "https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=1600&q=80",
        "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=1600&q=80",
        "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=1600&q=80",
        "https://images.unsplash.com/photo-1487412947147-5cebf96edcd1?w=1600&q=80"
      ],
      products: [
        "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=1200&q=80",
        "https://images.unsplash.com/photo-1612817288484-6f916006741a?w=1200&q=80",
        "https://images.unsplash.com/photo-1619451334792-150fd785ee74?w=1200&q=80",
        "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=1200&q=80",
        "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=1200&q=80"
      ],
      lifestyle: [
        "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1200&q=80",
        "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=1200&q=80",
        "https://images.unsplash.com/photo-1552693673-1bf958298935?w=1200&q=80",
        "https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=1200&q=80",
        "https://images.unsplash.com/photo-1487412947147-5cebf96edcd1?w=1200&q=80"
      ],
      about: [
        "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=1200&q=80",
        "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1200&q=80",
        "https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=1200&q=80",
        "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=1200&q=80",
        "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=1200&q=80"
      ]
    }
  },

  // ============================================
  // 7. GYM - BOUTIQUE
  // ============================================
  {
    id: "gym-boutique",
    name: "Boutique Fitness Gym",
    category: "local-services",
    
    topBrands: [
      "Barry's Bootcamp",
      "SoulCycle",
      "Rumble Boxing",
      "F45 Training",
      "Orangetheory Fitness",
      "HIIT by Hilliard"
    ],
    
    psychology: {
      customerNeeds: [
        "Class schedule and booking",
        "Understanding the workout format",
        "Pricing and membership options",
        "Instructor information",
        "First-timer guidance",
        "Location and facilities info"
      ],
      trustFactors: [
        "Results and transformations",
        "Instructor credentials and energy",
        "Community and culture",
        "Clean, professional facilities",
        "Consistent class quality",
        "Brand recognition"
      ],
      emotionalTriggers: [
        "Community and belonging",
        "Challenge and achievement",
        "Energy and motivation",
        "Transformation and results",
        "Accountability",
        "Status and lifestyle"
      ]
    },
    
    sections: [
      {
        id: "hero",
        name: "Hero",
        required: true,
        purpose: "Capture energy and drive trial bookings",
        keyElements: [
          "High-energy workout imagery/video",
          "Bold brand statement",
          "First class free CTA",
          "Class booking CTA"
        ]
      },
      {
        id: "workout",
        name: "The Workout",
        required: true,
        purpose: "Explain what the class/workout entails",
        keyElements: [
          "Workout format explanation",
          "Duration and structure",
          "What to expect",
          "Equipment used",
          "Results/benefits"
        ]
      },
      {
        id: "schedule",
        name: "Schedule / Book",
        required: true,
        purpose: "Enable class discovery and booking",
        keyElements: [
          "Class schedule by day/time",
          "Location filter",
          "Instructor info",
          "Book class CTAs",
          "Waitlist options"
        ]
      },
      {
        id: "instructors",
        name: "Instructors / Coaches",
        required: true,
        purpose: "Build connection with coaching team",
        keyElements: [
          "Instructor profiles and photos",
          "Background and certifications",
          "Teaching style/specialties",
          "Social links",
          "Schedule by instructor"
        ]
      },
      {
        id: "pricing",
        name: "Pricing / Memberships",
        required: true,
        purpose: "Clear pricing and conversion",
        keyElements: [
          "Class packages",
          "Unlimited memberships",
          "First-timer offers",
          "Comparison chart"
        ]
      },
      {
        id: "first-time",
        name: "First Time?",
        required: true,
        purpose: "Reduce barriers for new clients",
        keyElements: [
          "What to expect guide",
          "What to wear/bring",
          "Arrival time",
          "Intro offer",
          "FAQ for newbies"
        ]
      },
      {
        id: "community",
        name: "Community / Transformations",
        required: false,
        purpose: "Social proof and aspirational content",
        keyElements: [
          "Member spotlights",
          "Transformation stories",
          "Community events",
          "Social media feed"
        ]
      },
      {
        id: "locations",
        name: "Locations",
        required: true,
        purpose: "Multi-location discovery",
        keyElements: [
          "Location cards with images",
          "Amenities per location",
          "Hours",
          "Book at location"
        ]
      },
      {
        id: "shop",
        name: "Shop / Gear",
        required: false,
        purpose: "Merchandise and brand extension",
        keyElements: [
          "Branded apparel",
          "Accessories",
          "Supplements if applicable"
        ]
      }
    ],
    
    design: {
      colorDescription: "Bold, high-energy palette. Often dark with neon or vibrant accents. High contrast for impact.",
      colors: {
        primary: "#e63946",
        secondary: "#1d1d1d",
        accent: "#f4f4f4",
        background: "#0a0a0a"
      },
      typography: "Bold, impactful sans-serif. Strong headlines that command attention. Athletic feel.",
      fonts: {
        heading: "Bebas Neue",
        body: "Roboto"
      },
      imageStyle: "Action shots mid-workout. Sweat, energy, intensity. Dark moody lighting with pops of color. Community moments.",
      spacing: "Dynamic, energetic layouts. Bold section breaks. Content demands attention.",
      mood: "Energetic, bold, motivational, community-driven"
    },
    
    copywriting: {
      tone: "Motivational, energetic, direct. Short punchy sentences. Community-focused.",
      exampleHeadlines: [
        "Every class is a comeback",
        "Work hard. Get results.",
        "Where champions train",
        "Find your fight",
        "The best hour of your day"
      ],
      exampleCTAs: [
        "Book Your First Class",
        "Try It Free",
        "Reserve Your Spot",
        "Start Your Journey",
        "Join the Pack"
      ],
      avoidPhrases: [
        "Easy workout",
        "No sweat",
        "Weight loss guaranteed",
        "Get skinny",
        "Perfect for lazy people",
        "No effort required"
      ]
    },
    
    images: {
      hero: [
        "https://images.unsplash.com/photo-1534258936925-c58bed479fcb?w=1600&q=80",
        "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=1600&q=80",
        "https://images.unsplash.com/photo-1549060279-7e168fcee0c2?w=1600&q=80",
        "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=1600&q=80",
        "https://images.unsplash.com/photo-1517963879433-6ad2b056d712?w=1600&q=80"
      ],
      products: [
        "https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=1200&q=80",
        "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=1200&q=80",
        "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=1200&q=80",
        "https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=1200&q=80",
        "https://images.unsplash.com/photo-1581009146145-b5ef050c149a?w=1200&q=80"
      ],
      lifestyle: [
        "https://images.unsplash.com/photo-1518310383802-640c2de311b2?w=1200&q=80",
        "https://images.unsplash.com/photo-1571388208497-71bedc66e932?w=1200&q=80",
        "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=1200&q=80",
        "https://images.unsplash.com/photo-1518459031867-a89b944bffe4?w=1200&q=80",
        "https://images.unsplash.com/photo-1599058917212-d750089bc07e?w=1200&q=80"
      ],
      about: [
        "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1200&q=80",
        "https://images.unsplash.com/photo-1579758629938-03607ccdbaba?w=1200&q=80",
        "https://images.unsplash.com/photo-1518310383802-640c2de311b2?w=1200&q=80",
        "https://images.unsplash.com/photo-1571388208497-71bedc66e932?w=1200&q=80",
        "https://images.unsplash.com/photo-1517963879433-6ad2b056d712?w=1200&q=80"
      ]
    }
  },

  // ============================================
  // 8. YOGA / PILATES STUDIO
  // ============================================
  {
    id: "yoga-pilates",
    name: "Yoga / Pilates Studio",
    category: "local-services",
    
    topBrands: [
      "Y7 Studio",
      "CorePower Yoga",
      "SLT (Strengthen Lengthen Tone)",
      "Alo Yoga (studios)",
      "Modo Yoga",
      "Club Pilates"
    ],
    
    psychology: {
      customerNeeds: [
        "Class types and levels explained",
        "Schedule and online booking",
        "Teacher backgrounds and styles",
        "Pricing and package options",
        "What to expect for beginners",
        "Studio atmosphere preview"
      ],
      trustFactors: [
        "Teacher training and certifications",
        "Studio lineage or methodology",
        "Community testimonials",
        "Clean, peaceful environment",
        "Consistent class quality",
        "Safety and alignment focus"
      ],
      emotionalTriggers: [
        "Inner peace and stress relief",
        "Mind-body connection",
        "Community and belonging",
        "Self-improvement journey",
        "Strength and flexibility",
        "Escape from daily chaos"
      ]
    },
    
    sections: [
      {
        id: "hero",
        name: "Hero",
        required: true,
        purpose: "Establish peaceful yet powerful brand presence",
        keyElements: [
          "Serene studio or practice imagery",
          "Welcoming brand message",
          "New student offer CTA",
          "Book class CTA"
        ]
      },
      {
        id: "classes",
        name: "Classes / Styles",
        required: true,
        purpose: "Help students find the right class for them",
        keyElements: [
          "Class style descriptions (vinyasa, hot, restorative, etc.)",
          "Level indicators (beginner, intermediate, advanced)",
          "Duration and intensity",
          "What to expect in each"
        ]
      },
      {
        id: "schedule",
        name: "Schedule / Book",
        required: true,
        purpose: "Enable class discovery and booking",
        keyElements: [
          "Weekly schedule view",
          "Class type filter",
          "Level filter",
          "Teacher filter",
          "Online booking integration"
        ]
      },
      {
        id: "teachers",
        name: "Teachers / Instructors",
        required: true,
        purpose: "Connect students with teachers",
        keyElements: [
          "Teacher profiles and photos",
          "Training and certifications",
          "Teaching style and philosophy",
          "Class schedule per teacher"
        ]
      },
      {
        id: "pricing",
        name: "Pricing / Memberships",
        required: true,
        purpose: "Clear pricing structure",
        keyElements: [
          "Drop-in rates",
          "Class packages",
          "Unlimited memberships",
          "New student specials"
        ]
      },
      {
        id: "new-students",
        name: "New Students",
        required: true,
        purpose: "Welcome and guide beginners",
        keyElements: [
          "What to bring/wear",
          "Arrival time",
          "What to expect",
          "Intro offers",
          "FAQ"
        ]
      },
      {
        id: "studio",
        name: "The Studio",
        required: false,
        purpose: "Showcase the physical space and amenities",
        keyElements: [
          "Interior photography",
          "Amenities (showers, props, etc.)",
          "Atmosphere description",
          "Parking/location info"
        ]
      },
      {
        id: "workshops",
        name: "Workshops & Teacher Training",
        required: false,
        purpose: "Deeper engagement and education",
        keyElements: [
          "Upcoming workshops",
          "Teacher training programs",
          "Retreats",
          "Special events"
        ]
      },
      {
        id: "private",
        name: "Private Sessions",
        required: false,
        purpose: "Upsell personal instruction",
        keyElements: [
          "Private session benefits",
          "Pricing",
          "Booking process",
          "Teacher availability"
        ]
      },
      {
        id: "testimonials",
        name: "Community / Reviews",
        required: true,
        purpose: "Social proof and community feel",
        keyElements: [
          "Student testimonials",
          "Community photos",
          "Social feed",
          "Member stories"
        ]
      }
    ],
    
    design: {
      colorDescription: "Calm, natural palette. Soft neutrals, warm earth tones, or serene blues/greens. Peaceful and grounding.",
      colors: {
        primary: "#4a5568",
        secondary: "#e8ded3",
        accent: "#7c9885",
        background: "#faf8f5"
      },
      typography: "Elegant, calm typography. Serif or refined sans-serif. Spacious and breathable.",
      fonts: {
        heading: "Cormorant Garamond",
        body: "Lora"
      },
      imageStyle: "Natural light, serene studio shots. Diverse practitioners. Movement and stillness. Peaceful expressions.",
      spacing: "Very generous whitespace. Content breathes. Calming visual rhythm.",
      mood: "Peaceful, grounding, welcoming, mindful"
    },
    
    copywriting: {
      tone: "Calm, inviting, inclusive. Mindful language. Avoid intensity; emphasize journey.",
      exampleHeadlines: [
        "Find your practice",
        "Move. Breathe. Be.",
        "Where stillness meets strength",
        "Your sanctuary in the city",
        "Begin where you are"
      ],
      exampleCTAs: [
        "Book a Class",
        "Start Your Journey",
        "Find Your Class",
        "Try Your First Class",
        "Join Our Community"
      ],
      avoidPhrases: [
        "Get bikini ready",
        "Burn calories",
        "No pain no gain",
        "Sweat it out",
        "Beach body",
        "Aggressive stretch"
      ]
    },
    
    images: {
      hero: [
        "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=1600&q=80",
        "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=1600&q=80",
        "https://images.unsplash.com/photo-1588286840104-8957b019727f?w=1600&q=80",
        "https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=1600&q=80",
        "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=1600&q=80"
      ],
      products: [
        "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=1200&q=80",
        "https://images.unsplash.com/photo-1545389336-cf090694435e?w=1200&q=80",
        "https://images.unsplash.com/photo-1573384666979-2b1e160d2d08?w=1200&q=80",
        "https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=1200&q=80",
        "https://images.unsplash.com/photo-1518459031867-a89b944bffe4?w=1200&q=80"
      ],
      lifestyle: [
        "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=1200&q=80",
        "https://images.unsplash.com/photo-1552196563-55cd4e45efb3?w=1200&q=80",
        "https://images.unsplash.com/photo-1510894347713-fc3ed6fdf539?w=1200&q=80",
        "https://images.unsplash.com/photo-1529693662653-9d480530a697?w=1200&q=80",
        "https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?w=1200&q=80"
      ],
      about: [
        "https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=1200&q=80",
        "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=1200&q=80",
        "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1200&q=80",
        "https://images.unsplash.com/photo-1518310383802-640c2de311b2?w=1200&q=80",
        "https://images.unsplash.com/photo-1508108712903-49b7ef9b1df8?w=1200&q=80"
      ]
    }
  }
];

// Export helper function to get industry by ID
export function getLocalServiceIndustry(id: string): IndustryIntelligence | undefined {
  return localServiceIndustries.find(industry => industry.id === id);
}

// Export all industry IDs for easy reference
export const localServiceIndustryIds = localServiceIndustries.map(i => i.id);

export default localServiceIndustries;
