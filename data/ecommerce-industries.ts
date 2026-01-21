/**
 * VERKTORLABS Industry Intelligence - E-commerce Industries
 * Research-backed data for AI website generation
 * 
 * Industries: 8
 * - Fashion & Clothing
 * - Beauty & Cosmetics
 * - Home & Furniture
 * - Food & Beverage DTC
 * - Pet Products
 * - Kids & Baby
 * - Sports & Outdoors
 * - Electronics & Gadgets
 */

import type { IndustryIntelligence } from '../types/industry';

// Re-export the type for convenience
export type { IndustryIntelligence } from '../types/industry';

export const ecommerceIndustries: IndustryIntelligence[] = [
  // ============================================
  // 1. FASHION & CLOTHING
  // ============================================
  {
    id: "fashion-clothing",
    name: "Fashion & Clothing",
    category: "ecommerce",
    
    topBrands: ["Everlane", "Reformation", "ASOS", "COS", "& Other Stories", "Arket"],
    
    psychology: {
      customerNeeds: [
        "See how clothes look on real people (not just models)",
        "Understand fit, sizing, and fabric quality",
        "Easy navigation by occasion, style, or category",
        "Quick checkout with saved preferences",
        "Transparent pricing and no hidden fees",
        "Confidence that items match online photos"
      ],
      trustFactors: [
        "Clear size guides with measurements",
        "Customer reviews with photos",
        "Transparent return policy (free returns)",
        "Sustainability and ethical sourcing info",
        "Real customer testimonials",
        "Secure payment badges"
      ],
      emotionalTriggers: [
        "Aspiration - looking stylish and put-together",
        "Confidence - feeling good in what you wear",
        "Identity - expressing personal style",
        "Belonging - being part of a fashion community",
        "Discovery - finding unique pieces",
        "Value - quality that lasts"
      ]
    },
    
    sections: [
      {
        id: "hero",
        name: "Hero Banner",
        required: true,
        purpose: "Showcase current collection/season with aspirational imagery",
        keyElements: ["Full-width lifestyle image", "Collection name", "Shop now CTA", "Seasonal messaging"]
      },
      {
        id: "featured-collection",
        name: "Featured Collection",
        required: true,
        purpose: "Highlight new arrivals or bestsellers to drive immediate engagement",
        keyElements: ["4-8 product grid", "Quick-add functionality", "Price display", "New/Sale badges"]
      },
      {
        id: "category-navigation",
        name: "Shop by Category",
        required: true,
        purpose: "Help customers find what they need quickly",
        keyElements: ["Visual category cards", "Women/Men/Accessories splits", "Occasion-based shopping"]
      },
      {
        id: "brand-story",
        name: "Brand Story",
        required: true,
        purpose: "Build emotional connection and differentiation",
        keyElements: ["Founder story", "Mission statement", "Values (sustainability, quality)", "Behind-the-scenes imagery"]
      },
      {
        id: "social-proof",
        name: "Social Proof",
        required: true,
        purpose: "Build trust through community validation",
        keyElements: ["Instagram feed integration", "Customer photos", "Review highlights", "Press mentions"]
      },
      {
        id: "sustainability",
        name: "Sustainability Commitment",
        required: false,
        purpose: "Appeal to conscious consumers",
        keyElements: ["Materials sourcing", "Factory conditions", "Carbon footprint", "Certifications"]
      },
      {
        id: "newsletter",
        name: "Email Signup",
        required: true,
        purpose: "Capture leads with incentive",
        keyElements: ["Discount offer (10-15% off)", "Early access promise", "Minimal form fields"]
      }
    ],
    
    design: {
      colorDescription: "Clean, minimal palette that lets product photography shine. Neutral base with occasional accent.",
      colors: {
        primary: "#1a1a1a",
        secondary: "#757575",
        accent: "#c9a87c",
        background: "#ffffff"
      },
      typography: "Clean sans-serif for modern appeal, occasionally serif for luxury positioning",
      fonts: {
        heading: "Helvetica Neue, Futura, or Cormorant Garamond",
        body: "Inter, Karla, or Source Sans Pro"
      },
      imageStyle: "High-quality editorial photography, mix of studio and lifestyle, diverse models, natural lighting",
      spacing: "Generous whitespace, grid-based layouts, breathing room around products",
      mood: "Effortlessly stylish, aspirational yet attainable, clean and curated"
    },
    
    copywriting: {
      tone: "Confident but not pretentious, conversational, style-forward, occasionally playful",
      exampleHeadlines: [
        "Designed to Last",
        "New Season, New Favorites",
        "Effortless Style, Everyday",
        "Made for Living",
        "The Edit: Summer Essentials",
        "Wear It Your Way"
      ],
      exampleCTAs: [
        "Shop the Collection",
        "Add to Bag",
        "Complete the Look",
        "Find Your Fit",
        "Explore New Arrivals",
        "Get 15% Off Your First Order"
      ],
      avoidPhrases: [
        "Cheap",
        "Bargain",
        "Once in a lifetime",
        "You won't believe",
        "Act now",
        "Limited time only (overused)",
        "Flattering for all body types (patronizing)"
      ]
    },
    
    images: {
      hero: [
        "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1920&q=80",
        "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1920&q=80",
        "https://images.unsplash.com/photo-1445205170230-053b83016050?w=1920&q=80",
        "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1920&q=80",
        "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=1920&q=80"
      ],
      products: [
        "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=800&q=80",
        "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&q=80",
        "https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?w=800&q=80",
        "https://images.unsplash.com/photo-1603252109303-2751441dd157?w=800&q=80",
        "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&q=80"
      ],
      lifestyle: [
        "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1200&q=80",
        "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=1200&q=80",
        "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1200&q=80",
        "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=1200&q=80",
        "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=1200&q=80"
      ],
      about: [
        "https://images.unsplash.com/photo-1558171813-4c088753af8f?w=1200&q=80",
        "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&q=80",
        "https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=1200&q=80",
        "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=1200&q=80"
      ]
    }
  },

  // ============================================
  // 2. BEAUTY & COSMETICS
  // ============================================
  {
    id: "beauty-cosmetics",
    name: "Beauty & Cosmetics",
    category: "ecommerce",
    
    topBrands: ["Glossier", "Fenty Beauty", "Drunk Elephant", "Rare Beauty", "Tower 28", "Merit"],
    
    psychology: {
      customerNeeds: [
        "See products on different skin tones",
        "Understand ingredients and their benefits",
        "Know if products work for their skin type/concerns",
        "Simple routines, not overwhelming choices",
        "Authenticity over heavily edited imagery",
        "Community recommendations and real reviews"
      ],
      trustFactors: [
        "Ingredient transparency and explanations",
        "Before/after results (real, not retouched)",
        "Dermatologist/expert endorsements",
        "Clean/cruelty-free/vegan certifications",
        "User reviews with skin type details",
        "Shade finder tools"
      ],
      emotionalTriggers: [
        "Self-care and treating yourself",
        "Confidence and self-expression",
        "Natural beauty enhancement",
        "Being 'in the know' on trends",
        "Ritual and routine",
        "Transformation and glow-up"
      ]
    },
    
    sections: [
      {
        id: "hero",
        name: "Hero Banner",
        required: true,
        purpose: "Create aspirational first impression with hero product or collection",
        keyElements: ["Dewy skin close-up or product hero shot", "Minimal text", "Shop CTA", "Current campaign"]
      },
      {
        id: "bestsellers",
        name: "Bestsellers",
        required: true,
        purpose: "Social proof through popularity - show what others love",
        keyElements: ["Top 4-6 products", "Star ratings", "Review count", "Quick-add to bag"]
      },
      {
        id: "shop-by-concern",
        name: "Shop by Concern",
        required: true,
        purpose: "Help customers find solutions to specific needs",
        keyElements: ["Acne, aging, hydration, etc.", "Visual icons", "Problem-solution framing"]
      },
      {
        id: "ingredients",
        name: "Ingredient Spotlight",
        required: true,
        purpose: "Educate and build trust through transparency",
        keyElements: ["Hero ingredients explained", "Scientific backing", "Clean beauty commitment"]
      },
      {
        id: "how-to-use",
        name: "Routines & How-To",
        required: false,
        purpose: "Reduce friction by showing simple application",
        keyElements: ["Step-by-step routines", "Video tutorials", "Product bundles"]
      },
      {
        id: "community",
        name: "Community & UGC",
        required: true,
        purpose: "Build trust through real customer content",
        keyElements: ["Customer selfies", "Instagram integration", "Real reviews with photos"]
      },
      {
        id: "values",
        name: "Our Values",
        required: true,
        purpose: "Differentiate through brand mission",
        keyElements: ["Clean ingredients", "Sustainability", "Inclusivity", "Cruelty-free status"]
      },
      {
        id: "quiz",
        name: "Product Quiz",
        required: false,
        purpose: "Personalize experience and capture data",
        keyElements: ["Skin type quiz", "Routine builder", "Personalized recommendations"]
      }
    ],
    
    design: {
      colorDescription: "Soft, approachable palette. Millennial pink influence or clean white with pops of brand color.",
      colors: {
        primary: "#2d2d2d",
        secondary: "#8b7355",
        accent: "#e8b4b8",
        background: "#faf8f6"
      },
      typography: "Soft, rounded sans-serifs for approachability. Clean and modern.",
      fonts: {
        heading: "Recoleta, Tenor Sans, or Quicksand",
        body: "Nunito Sans, Lato, or Poppins"
      },
      imageStyle: "Dewy close-ups, natural lighting, diverse skin tones, minimal retouching, product texture shots",
      spacing: "Soft and breathable, rounded corners, gentle shadows",
      mood: "Fresh, dewy, approachable, inclusive, self-care oriented"
    },
    
    copywriting: {
      tone: "Friendly best-friend energy, educational but not preachy, confident, inclusive",
      exampleHeadlines: [
        "Skin First. Makeup Second.",
        "Your Glow-To Routine",
        "Clean Beauty That Works",
        "Made for Every Shade of You",
        "Feel Good Beauty",
        "Less Is More"
      ],
      exampleCTAs: [
        "Find Your Shade",
        "Build Your Routine",
        "Add to Bag",
        "Take the Quiz",
        "See Results",
        "Join the Community"
      ],
      avoidPhrases: [
        "Anti-aging (use 'age-positive')",
        "Flawless (unrealistic)",
        "Perfect skin",
        "Fix your skin",
        "Problem skin",
        "Miracle cure"
      ]
    },
    
    images: {
      hero: [
        "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=1920&q=80",
        "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=1920&q=80",
        "https://images.unsplash.com/photo-1487412912498-0447578fcca8?w=1920&q=80",
        "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=1920&q=80",
        "https://images.unsplash.com/photo-1560750588-73207b1ef5b8?w=1920&q=80"
      ],
      products: [
        "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=800&q=80",
        "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=800&q=80",
        "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=800&q=80",
        "https://images.unsplash.com/photo-1599305090598-fe179d501227?w=800&q=80",
        "https://images.unsplash.com/photo-1612817288484-6f916006741a?w=800&q=80"
      ],
      lifestyle: [
        "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=1200&q=80",
        "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=1200&q=80",
        "https://images.unsplash.com/photo-1498843053639-170ff2122f35?w=1200&q=80",
        "https://images.unsplash.com/photo-1519415510236-718bdfcd89c8?w=1200&q=80",
        "https://images.unsplash.com/photo-1552693673-1bf958298935?w=1200&q=80"
      ],
      about: [
        "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=1200&q=80",
        "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=1200&q=80",
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&q=80",
        "https://images.unsplash.com/photo-1573461160327-b450ce3d8e7f?w=1200&q=80"
      ]
    }
  },

  // ============================================
  // 3. HOME & FURNITURE
  // ============================================
  {
    id: "home-furniture",
    name: "Home & Furniture",
    category: "ecommerce",
    
    topBrands: ["Article", "CB2", "West Elm", "Floyd", "Burrow", "Interior Define"],
    
    psychology: {
      customerNeeds: [
        "See furniture in real room contexts",
        "Understand exact dimensions and scale",
        "Know delivery timelines and assembly",
        "Visualize pieces in their own space",
        "Quality assurance for big purchases",
        "Easy returns for large items"
      ],
      trustFactors: [
        "Detailed product dimensions",
        "Customer photos in real homes",
        "Quality and material transparency",
        "Clear delivery and return policies",
        "Warranty information",
        "Reviews mentioning durability"
      ],
      emotionalTriggers: [
        "Creating a home, not just a house",
        "Pride in good taste",
        "Comfort and sanctuary",
        "Investment in quality",
        "Personal expression through space",
        "Adulting and milestone moments"
      ]
    },
    
    sections: [
      {
        id: "hero",
        name: "Hero Banner",
        required: true,
        purpose: "Showcase aspirational room setting",
        keyElements: ["Full room photography", "Lifestyle context", "Shop collection CTA", "Seasonal styling"]
      },
      {
        id: "shop-by-room",
        name: "Shop by Room",
        required: true,
        purpose: "Help customers navigate by space they're furnishing",
        keyElements: ["Living room, bedroom, dining, office", "Visual room cards", "Complete-the-room suggestions"]
      },
      {
        id: "bestsellers",
        name: "Bestsellers & Customer Favorites",
        required: true,
        purpose: "Social proof for high-consideration purchases",
        keyElements: ["Top products with reviews", "Customer photo integration", "Star ratings"]
      },
      {
        id: "new-arrivals",
        name: "New Arrivals",
        required: false,
        purpose: "Drive urgency and return visits",
        keyElements: ["Latest designs", "Coming soon teasers", "Limited editions"]
      },
      {
        id: "quality",
        name: "Quality & Craftsmanship",
        required: true,
        purpose: "Justify price point and build trust",
        keyElements: ["Material sourcing", "Construction details", "Durability claims", "Warranty info"]
      },
      {
        id: "design-services",
        name: "Design Services",
        required: false,
        purpose: "Reduce decision paralysis, increase order value",
        keyElements: ["Free design consultation", "Room planning tools", "Style quiz"]
      },
      {
        id: "delivery-info",
        name: "Delivery & Assembly",
        required: true,
        purpose: "Address major purchase concern",
        keyElements: ["White glove delivery option", "Assembly info", "Delivery timeline", "Return policy"]
      },
      {
        id: "sustainability",
        name: "Sustainability",
        required: false,
        purpose: "Appeal to conscious consumers",
        keyElements: ["Sustainable materials", "Manufacturing practices", "Packaging reduction"]
      }
    ],
    
    design: {
      colorDescription: "Warm, sophisticated neutrals that complement furniture photography. Earthy and grounded.",
      colors: {
        primary: "#2c3e50",
        secondary: "#7f8c8d",
        accent: "#d4a574",
        background: "#f5f3f0"
      },
      typography: "Sophisticated serif for headings, clean sans-serif for body. Architectural feel.",
      fonts: {
        heading: "Playfair Display, Freight Display, or Canela",
        body: "Graphik, Circular, or Apercu"
      },
      imageStyle: "Styled room photography, natural lighting, warm tones, detail shots of materials and construction",
      spacing: "Generous, editorial-style layouts with large imagery and ample whitespace",
      mood: "Sophisticated, warm, aspirational but attainable, design-forward"
    },
    
    copywriting: {
      tone: "Design-savvy but accessible, warm and inviting, quality-focused, helpful",
      exampleHeadlines: [
        "Design Your Dream Space",
        "Made to Last",
        "Modern Living, Simplified",
        "Crafted for Comfort",
        "The Pieces You'll Keep Forever",
        "Where Great Design Lives"
      ],
      exampleCTAs: [
        "Shop the Room",
        "Explore the Collection",
        "Get Free Swatches",
        "Book a Design Consultation",
        "See It in Your Space",
        "Find Your Style"
      ],
      avoidPhrases: [
        "Cheap furniture",
        "Disposable",
        "Fast furniture",
        "Some assembly required (reframe positively)",
        "Showroom only",
        "Limited stock"
      ]
    },
    
    images: {
      hero: [
        "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1920&q=80",
        "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1920&q=80",
        "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=1920&q=80",
        "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1920&q=80",
        "https://images.unsplash.com/photo-1631679706909-1844bbd07221?w=1920&q=80"
      ],
      products: [
        "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80",
        "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=800&q=80",
        "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=800&q=80",
        "https://images.unsplash.com/photo-1540574163026-643ea20ade25?w=800&q=80",
        "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=800&q=80"
      ],
      lifestyle: [
        "https://images.unsplash.com/photo-1616046229478-9901c5536a45?w=1200&q=80",
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80",
        "https://images.unsplash.com/photo-1617806118233-18e1de247200?w=1200&q=80",
        "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=80",
        "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&q=80"
      ],
      about: [
        "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=1200&q=80",
        "https://images.unsplash.com/photo-1558997519-83ea9252edf8?w=1200&q=80",
        "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=1200&q=80",
        "https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?w=1200&q=80"
      ]
    }
  },

  // ============================================
  // 4. FOOD & BEVERAGE DTC
  // ============================================
  {
    id: "food-beverage-dtc",
    name: "Food & Beverage DTC",
    category: "ecommerce",
    
    topBrands: ["Magic Spoon", "Athletic Greens", "Haus", "Olipop", "Liquid Death", "Graza"],
    
    psychology: {
      customerNeeds: [
        "Understand taste and flavor profiles",
        "Know nutritional information and ingredients",
        "See if it fits their dietary needs",
        "Subscription flexibility and savings",
        "Social proof that it actually tastes good",
        "Transparency about sourcing"
      ],
      trustFactors: [
        "Full ingredient transparency",
        "Nutritional facts prominently displayed",
        "Third-party certifications (organic, non-GMO)",
        "Real customer taste reviews",
        "Founder story and mission",
        "Money-back guarantee"
      ],
      emotionalTriggers: [
        "Health and wellness goals",
        "Nostalgia with a modern twist",
        "Being part of a movement/community",
        "Guilt-free indulgence",
        "Convenience without compromise",
        "Discovery and trying something new"
      ]
    },
    
    sections: [
      {
        id: "hero",
        name: "Hero Banner",
        required: true,
        purpose: "Create immediate appetite appeal and brand differentiation",
        keyElements: ["Bold product photography", "Key benefit headline", "Subscribe & save CTA", "Founder story hook"]
      },
      {
        id: "products",
        name: "Product Showcase",
        required: true,
        purpose: "Display flavors/varieties with key selling points",
        keyElements: ["Flavor grid", "Nutritional highlights", "Quick subscribe", "Best seller badges"]
      },
      {
        id: "why-different",
        name: "Why We're Different",
        required: true,
        purpose: "Differentiate from traditional alternatives",
        keyElements: ["Comparison charts", "Ingredient callouts", "Health benefits", "What we don't use"]
      },
      {
        id: "reviews",
        name: "Reviews & Social Proof",
        required: true,
        purpose: "Overcome taste skepticism",
        keyElements: ["Video testimonials", "Star ratings", "Review quotes about taste", "Press logos"]
      },
      {
        id: "subscription",
        name: "Subscription Benefits",
        required: true,
        purpose: "Drive recurring revenue with clear value prop",
        keyElements: ["Save percentage", "Free shipping", "Flexibility", "Cancel anytime"]
      },
      {
        id: "founder-story",
        name: "Our Story",
        required: true,
        purpose: "Build emotional connection and trust",
        keyElements: ["Why we started", "Mission statement", "Founder photo", "Values"]
      },
      {
        id: "ingredients",
        name: "Ingredients Spotlight",
        required: true,
        purpose: "Build trust through transparency",
        keyElements: ["Clean ingredients list", "Sourcing info", "What's NOT in it", "Certifications"]
      },
      {
        id: "recipes",
        name: "Recipes & Usage",
        required: false,
        purpose: "Inspire usage and increase consumption",
        keyElements: ["Recipe cards", "Usage suggestions", "Community recipes"]
      }
    ],
    
    design: {
      colorDescription: "Bold, playful, and distinctive. Often breaks from category norms with unexpected color choices.",
      colors: {
        primary: "#1a1a2e",
        secondary: "#e94560",
        accent: "#ffc93c",
        background: "#f8f8f8"
      },
      typography: "Bold, playful display fonts for personality. Often custom or distinctive typefaces.",
      fonts: {
        heading: "GT Walsheim, Gilroy Bold, or custom display",
        body: "Inter, DM Sans, or Outfit"
      },
      imageStyle: "Vibrant product photography, bold backgrounds, lifestyle shots showing consumption moments",
      spacing: "Dynamic layouts, bold color blocks, playful asymmetry",
      mood: "Fun, bold, disruptive, health-conscious but not boring"
    },
    
    copywriting: {
      tone: "Playful, bold, confident, sometimes irreverent, mission-driven",
      exampleHeadlines: [
        "Cereal That Loves You Back",
        "Finally, Soda That's Good For You",
        "The Future of Fuel",
        "Drink Your Greens, Love Your Greens",
        "Made Different. Tastes Better.",
        "Healthy Never Tasted So Good"
      ],
      exampleCTAs: [
        "Try It Risk-Free",
        "Subscribe & Save 20%",
        "Find Your Flavor",
        "Start Your Routine",
        "Get 30% Off Your First Order",
        "Build Your Bundle"
      ],
      avoidPhrases: [
        "Diet food",
        "Low calorie",
        "Guilt-free (overused)",
        "Clean eating",
        "Superfood (overused)",
        "Revolutionary"
      ]
    },
    
    images: {
      hero: [
        "https://images.unsplash.com/photo-1490818387583-1baba5e638af?w=1920&q=80",
        "https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?w=1920&q=80",
        "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1920&q=80",
        "https://images.unsplash.com/photo-1495195134817-aeb325a55b65?w=1920&q=80",
        "https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=1920&q=80"
      ],
      products: [
        "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=800&q=80",
        "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800&q=80",
        "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=800&q=80",
        "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=800&q=80",
        "https://images.unsplash.com/photo-1589927986089-35812418d78a?w=800&q=80"
      ],
      lifestyle: [
        "https://images.unsplash.com/photo-1494390248081-4e521a5940db?w=1200&q=80",
        "https://images.unsplash.com/photo-1543362906-acfc16c67564?w=1200&q=80",
        "https://images.unsplash.com/photo-1478145046317-39f10e56b5e9?w=1200&q=80",
        "https://images.unsplash.com/photo-1547592180-85f173990554?w=1200&q=80",
        "https://images.unsplash.com/photo-1505576399279-565b52d4ac71?w=1200&q=80"
      ],
      about: [
        "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200&q=80",
        "https://images.unsplash.com/photo-1542838132-92c53300491e?w=1200&q=80",
        "https://images.unsplash.com/photo-1556909172-54557c7e4fb7?w=1200&q=80",
        "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&q=80"
      ]
    }
  },

  // ============================================
  // 5. PET PRODUCTS
  // ============================================
  {
    id: "pet-products",
    name: "Pet Products",
    category: "ecommerce",
    
    topBrands: ["The Farmer's Dog", "Wild One", "Chewy", "Ollie", "Sundays", "Fable"],
    
    psychology: {
      customerNeeds: [
        "Know products are safe and healthy for pets",
        "Understand ingredients and quality",
        "Find products suited to their pet's specific needs",
        "Convenience of subscription delivery",
        "Trust that the brand truly cares about animals",
        "Aesthetic products that fit their home"
      ],
      trustFactors: [
        "Veterinarian endorsements/formulations",
        "Human-grade/natural ingredient claims",
        "Before/after health testimonials",
        "Transparent sourcing",
        "Money-back guarantee",
        "Certifications and testing"
      ],
      emotionalTriggers: [
        "Pet is family member, deserves the best",
        "Pet parent guilt (wanting to do right)",
        "Joy and love for their pet",
        "Health and longevity concerns",
        "Pride in being a good pet parent",
        "Community of fellow pet lovers"
      ]
    },
    
    sections: [
      {
        id: "hero",
        name: "Hero Banner",
        required: true,
        purpose: "Emotional connection through adorable pet imagery",
        keyElements: ["Happy, healthy pets", "Core value proposition", "Start quiz/subscription CTA", "Emotional headline"]
      },
      {
        id: "products",
        name: "Products/Plans",
        required: true,
        purpose: "Clear product offering tailored to pet needs",
        keyElements: ["Product categories or subscription plans", "Pet type filtering", "Key benefits", "Pricing transparency"]
      },
      {
        id: "how-it-works",
        name: "How It Works",
        required: true,
        purpose: "Explain subscription/customization process",
        keyElements: ["3-step process", "Customization options", "Delivery schedule", "Easy management"]
      },
      {
        id: "quality",
        name: "Quality & Ingredients",
        required: true,
        purpose: "Build trust through transparency",
        keyElements: ["Ingredient sourcing", "Vet formulated", "What's not included", "Human-grade claims"]
      },
      {
        id: "testimonials",
        name: "Pet Parent Reviews",
        required: true,
        purpose: "Social proof with emotional pet stories",
        keyElements: ["Before/after stories", "Pet photos", "Health improvement testimonials", "Video reviews"]
      },
      {
        id: "quiz",
        name: "Pet Profile Quiz",
        required: false,
        purpose: "Personalize recommendations and capture data",
        keyElements: ["Breed, age, weight inputs", "Health concerns", "Dietary restrictions", "Activity level"]
      },
      {
        id: "mission",
        name: "Our Mission",
        required: true,
        purpose: "Emotional connection through shared values",
        keyElements: ["Why we started", "Love for pets", "Shelter donations/partnerships", "Team pet photos"]
      },
      {
        id: "faq",
        name: "FAQ",
        required: true,
        purpose: "Address common concerns about pet products",
        keyElements: ["Transition guidance", "Allergy info", "Subscription management", "Shipping details"]
      }
    ],
    
    design: {
      colorDescription: "Warm, friendly, and natural. Often earth tones mixed with playful accents.",
      colors: {
        primary: "#2d4a3e",
        secondary: "#e8985e",
        accent: "#f4d03f",
        background: "#faf9f7"
      },
      typography: "Friendly, rounded fonts that feel approachable and warm",
      fonts: {
        heading: "Recoleta, Nunito, or Quicksand",
        body: "Open Sans, Lato, or Source Sans Pro"
      },
      imageStyle: "Adorable pet photography, happy animals, lifestyle shots, warm and natural lighting",
      spacing: "Comfortable and friendly, rounded corners, soft shadows",
      mood: "Loving, trustworthy, playful, health-conscious, community-oriented"
    },
    
    copywriting: {
      tone: "Warm, loving, knowledgeable, community-focused, slightly playful",
      exampleHeadlines: [
        "Real Food for Real Good Dogs",
        "They Deserve Better",
        "Because They're Family",
        "Healthy Pets, Happy Life",
        "The Food Your Dog Would Choose",
        "Made with Love, Backed by Science"
      ],
      exampleCTAs: [
        "Build Your Pet's Plan",
        "Take the Quiz",
        "Start Your Free Trial",
        "See the Difference",
        "Meet Your Dog's New Favorite",
        "Unlock 50% Off First Box"
      ],
      avoidPhrases: [
        "Pet owner (use 'pet parent')",
        "Cheap pet food",
        "Generic",
        "Basic",
        "Standard formula",
        "One-size-fits-all"
      ]
    },
    
    images: {
      hero: [
        "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=1920&q=80",
        "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=1920&q=80",
        "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=1920&q=80",
        "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=1920&q=80",
        "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=1920&q=80"
      ],
      products: [
        "https://images.unsplash.com/photo-1568640347023-a616a30bc3bd?w=800&q=80",
        "https://images.unsplash.com/photo-1601758124510-52d02ddb7cbd?w=800&q=80",
        "https://images.unsplash.com/photo-1591946614720-90a587da4a36?w=800&q=80",
        "https://images.unsplash.com/photo-1623387641168-d9803ddd3f35?w=800&q=80",
        "https://images.unsplash.com/photo-1535294435445-d7249524ef2e?w=800&q=80"
      ],
      lifestyle: [
        "https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=1200&q=80",
        "https://images.unsplash.com/photo-1544568100-847a948585b9?w=1200&q=80",
        "https://images.unsplash.com/photo-1530281700549-e82e7bf110d6?w=1200&q=80",
        "https://images.unsplash.com/photo-1587764379873-97837921fd44?w=1200&q=80",
        "https://images.unsplash.com/photo-1494947665470-20322015e3a8?w=1200&q=80"
      ],
      about: [
        "https://images.unsplash.com/photo-1601979031925-424e53b6caaa?w=1200&q=80",
        "https://images.unsplash.com/photo-1596492784531-6e6eb5ea9993?w=1200&q=80",
        "https://images.unsplash.com/photo-1581888227599-779811939961?w=1200&q=80",
        "https://images.unsplash.com/photo-1560807707-8cc77767d783?w=1200&q=80"
      ]
    }
  },

  // ============================================
  // 6. KIDS & BABY
  // ============================================
  {
    id: "kids-baby",
    name: "Kids & Baby",
    category: "ecommerce",
    
    topBrands: ["Primary", "Monica + Andy", "Maisonette", "Finn + Emma", "Kyte Baby", "Little Sleepies"],
    
    psychology: {
      customerNeeds: [
        "Know products are safe (non-toxic, CPSC compliant)",
        "Easy sizing for fast-growing children",
        "Soft, comfortable materials",
        "Easy care (machine washable)",
        "Value for items kids outgrow quickly",
        "Cute without being overly gendered"
      ],
      trustFactors: [
        "Safety certifications (CPSC, OEKO-TEX)",
        "Organic/non-toxic material claims",
        "Parent reviews with age/size info",
        "Clear return policy",
        "Brand founder is a parent",
        "Durability testimonials"
      ],
      emotionalTriggers: [
        "Wanting the best for their child",
        "Parenting pride",
        "Capturing precious moments",
        "Simplifying chaotic parenting life",
        "Nostalgia and sweetness of childhood",
        "Community of fellow parents"
      ]
    },
    
    sections: [
      {
        id: "hero",
        name: "Hero Banner",
        required: true,
        purpose: "Emotional connection through adorable kid imagery",
        keyElements: ["Happy, diverse children", "Core value prop (comfort, safety)", "Shop now CTA", "Current collection"]
      },
      {
        id: "shop-by-age",
        name: "Shop by Age/Size",
        required: true,
        purpose: "Easy navigation for size-specific shopping",
        keyElements: ["Age ranges", "Size guides", "Newborn to toddler categories"]
      },
      {
        id: "bestsellers",
        name: "Bestsellers",
        required: true,
        purpose: "Social proof from other parents",
        keyElements: ["Top products", "Parent reviews", "Quick-add", "Size selector"]
      },
      {
        id: "safety",
        name: "Safety & Quality",
        required: true,
        purpose: "Address #1 parent concern",
        keyElements: ["Certifications", "Material safety", "Testing info", "Non-toxic claims"]
      },
      {
        id: "gift-registry",
        name: "Gift Registry / Gifting",
        required: false,
        purpose: "Capture gifting occasions (baby showers, birthdays)",
        keyElements: ["Registry creation", "Gift guides", "Gift wrapping", "Gift cards"]
      },
      {
        id: "parent-reviews",
        name: "Parent Reviews",
        required: true,
        purpose: "Build trust through peer experiences",
        keyElements: ["Photo reviews", "Sizing feedback", "Durability comments", "Age-specific reviews"]
      },
      {
        id: "brand-story",
        name: "Our Story",
        required: true,
        purpose: "Build trust through founder's parenting journey",
        keyElements: ["Founded by parents", "Mission", "Why we started", "Values"]
      },
      {
        id: "sustainability",
        name: "Sustainability",
        required: false,
        purpose: "Appeal to eco-conscious parents",
        keyElements: ["Organic materials", "Ethical production", "Longevity/hand-me-down quality"]
      }
    ],
    
    design: {
      colorDescription: "Soft, warm, and playful. Pastels or bright primaries, avoiding heavily gendered pink/blue splits.",
      colors: {
        primary: "#5a4a42",
        secondary: "#e8b4b8",
        accent: "#7eb5a6",
        background: "#fefdfb"
      },
      typography: "Friendly, rounded, approachable fonts with a touch of playfulness",
      fonts: {
        heading: "Nunito, Baloo 2, or Quicksand",
        body: "Open Sans, Lato, or Karla"
      },
      imageStyle: "Joyful, natural photography of real kids, diverse families, soft natural lighting",
      spacing: "Soft, comfortable, and clean. Rounded corners, gentle shadows",
      mood: "Warm, joyful, safe, playful, modern parenting"
    },
    
    copywriting: {
      tone: "Warm, reassuring, playful, parent-to-parent, unpretentious",
      exampleHeadlines: [
        "Soft on Skin, Easy on Parents",
        "Built for Play, Made to Last",
        "The Basics, Perfected",
        "For Every Little Adventure",
        "Comfort First",
        "Designed by Parents, Loved by Kids"
      ],
      exampleCTAs: [
        "Shop by Age",
        "Find Their Size",
        "Build a Bundle",
        "Start Your Registry",
        "Explore New Arrivals",
        "Get 15% Off First Order"
      ],
      avoidPhrases: [
        "Gender-specific clichés (princess, tough guy)",
        "Perfect parent imagery",
        "Competitive parenting language",
        "Overly precious/cutesy",
        "Mini-me",
        "Mommy/daddy's little..."
      ]
    },
    
    images: {
      hero: [
        "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=1920&q=80",
        "https://images.unsplash.com/photo-1596914254058-337840dc07fb?w=1920&q=80",
        "https://images.unsplash.com/photo-1491013516836-7db643ee125a?w=1920&q=80",
        "https://images.unsplash.com/photo-1519689680058-324335c77eba?w=1920&q=80",
        "https://images.unsplash.com/photo-1509909756405-be0199881695?w=1920&q=80"
      ],
      products: [
        "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&q=80",
        "https://images.unsplash.com/photo-1560347876-aeef00ee58a1?w=800&q=80",
        "https://images.unsplash.com/photo-1567113463300-102a7eb3cb26?w=800&q=80",
        "https://images.unsplash.com/photo-1565376485749-e2549c6e1ed7?w=800&q=80",
        "https://images.unsplash.com/photo-1574294876832-99a62e31bbab?w=800&q=80"
      ],
      lifestyle: [
        "https://images.unsplash.com/photo-1476703993599-0035a21b17a9?w=1200&q=80",
        "https://images.unsplash.com/photo-1471286174890-9c112ffca5b4?w=1200&q=80",
        "https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=1200&q=80",
        "https://images.unsplash.com/photo-1484665754804-74b091211472?w=1200&q=80",
        "https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?w=1200&q=80"
      ],
      about: [
        "https://images.unsplash.com/photo-1478476868527-002ae3f3e159?w=1200&q=80",
        "https://images.unsplash.com/photo-1543342384-1f1350e27861?w=1200&q=80",
        "https://images.unsplash.com/photo-1516733725897-1aa73b87c8e8?w=1200&q=80",
        "https://images.unsplash.com/photo-1604917621956-10dfa7cce2a7?w=1200&q=80"
      ]
    }
  },

  // ============================================
  // 7. SPORTS & OUTDOORS
  // ============================================
  {
    id: "sports-outdoors",
    name: "Sports & Outdoors",
    category: "ecommerce",
    
    topBrands: ["Tracksmith", "Outdoor Voices", "REI", "Patagonia", "Cotopaxi", "Vuori"],
    
    psychology: {
      customerNeeds: [
        "Technical performance details",
        "Durability for intense use",
        "Proper fit for activity type",
        "Weather/condition appropriateness",
        "Community and brand ethos alignment",
        "Sustainability credentials"
      ],
      trustFactors: [
        "Athlete endorsements/testing",
        "Technical specifications",
        "Performance reviews",
        "Warranty and durability guarantees",
        "Brand heritage and expertise",
        "Sustainability commitments"
      ],
      emotionalTriggers: [
        "Achievement and personal bests",
        "Freedom and adventure",
        "Connection with nature",
        "Community belonging",
        "Identity as an active person",
        "Pushing limits and growth"
      ]
    },
    
    sections: [
      {
        id: "hero",
        name: "Hero Banner",
        required: true,
        purpose: "Inspire action with dynamic athletic/outdoor imagery",
        keyElements: ["Action photography", "Aspirational messaging", "Shop collection CTA", "Season/activity focus"]
      },
      {
        id: "shop-by-activity",
        name: "Shop by Activity",
        required: true,
        purpose: "Help customers find gear for their sport",
        keyElements: ["Running, hiking, yoga, etc.", "Activity-specific collections", "Technical gear guides"]
      },
      {
        id: "featured-gear",
        name: "Featured Gear",
        required: true,
        purpose: "Highlight hero products and innovations",
        keyElements: ["Technical features", "Performance benefits", "Color options", "Customer ratings"]
      },
      {
        id: "technical-details",
        name: "Technology & Performance",
        required: true,
        purpose: "Build credibility through technical expertise",
        keyElements: ["Material technology", "Performance testing", "Athlete feedback", "Innovation stories"]
      },
      {
        id: "community",
        name: "Community & Athletes",
        required: true,
        purpose: "Build emotional connection through shared passion",
        keyElements: ["Sponsored athletes", "Community events", "User stories", "Local group rides/runs"]
      },
      {
        id: "sustainability",
        name: "Sustainability",
        required: true,
        purpose: "Address environmental concerns of outdoor enthusiasts",
        keyElements: ["Recycled materials", "Repair programs", "Environmental initiatives", "B Corp status"]
      },
      {
        id: "guides",
        name: "Gear Guides",
        required: false,
        purpose: "Educate and build trust through expertise",
        keyElements: ["Buying guides", "Care instructions", "Activity tips", "Gear checklists"]
      }
    ],
    
    design: {
      colorDescription: "Nature-inspired, bold, and energetic. Often earth tones with vibrant accents.",
      colors: {
        primary: "#1e3a5f",
        secondary: "#4a7c59",
        accent: "#e07b39",
        background: "#f7f5f3"
      },
      typography: "Strong, athletic fonts. Often condensed sans-serifs with character.",
      fonts: {
        heading: "Oswald, Bebas Neue, or Barlow Condensed",
        body: "Source Sans Pro, Roboto, or Open Sans"
      },
      imageStyle: "Dynamic action shots, beautiful outdoor landscapes, authentic athletic moments",
      spacing: "Dynamic and energetic, bold imagery with purposeful whitespace",
      mood: "Adventurous, authentic, performance-driven, community-oriented, sustainable"
    },
    
    copywriting: {
      tone: "Inspiring, authentic, expert but accessible, community-focused, mission-driven",
      exampleHeadlines: [
        "Run Your World",
        "Built for the Long Run",
        "Gear Up, Get Out",
        "Performance Meets Purpose",
        "Made for Movement",
        "Where Will You Go?"
      ],
      exampleCTAs: [
        "Shop the Collection",
        "Find Your Gear",
        "Join the Community",
        "Explore",
        "Gear Up",
        "Start Your Adventure"
      ],
      avoidPhrases: [
        "Extreme",
        "No pain no gain",
        "Beast mode",
        "Crush it",
        "Gymwear",
        "Basic fitness"
      ]
    },
    
    images: {
      hero: [
        "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=1920&q=80",
        "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1920&q=80",
        "https://images.unsplash.com/photo-1461896836934- voices?w=1920&q=80",
        "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=1920&q=80",
        "https://images.unsplash.com/photo-1502904550040-7534597429ae?w=1920&q=80"
      ],
      products: [
        "https://images.unsplash.com/photo-1556906781-9a412961c28c?w=800&q=80",
        "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80",
        "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&q=80",
        "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=800&q=80",
        "https://images.unsplash.com/photo-1578763363228-6e8428de69b2?w=800&q=80"
      ],
      lifestyle: [
        "https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?w=1200&q=80",
        "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=1200&q=80",
        "https://images.unsplash.com/photo-1517931524326-bdd55a541177?w=1200&q=80",
        "https://images.unsplash.com/photo-1549060279-7e168fcee0c2?w=1200&q=80",
        "https://images.unsplash.com/photo-1526676037777-05a232554f77?w=1200&q=80"
      ],
      about: [
        "https://images.unsplash.com/photo-1486218119243-13883505764c?w=1200&q=80",
        "https://images.unsplash.com/photo-1520085601670-ee14aa5fa3e8?w=1200&q=80",
        "https://images.unsplash.com/photo-1527933053326-89d1746b76b9?w=1200&q=80",
        "https://images.unsplash.com/photo-1475274110913-480c45d0e873?w=1200&q=80"
      ]
    }
  },

  // ============================================
  // 8. ELECTRONICS & GADGETS
  // ============================================
  {
    id: "electronics-gadgets",
    name: "Electronics & Gadgets",
    category: "ecommerce",
    
    topBrands: ["Apple", "Nothing", "Teenage Engineering", "Analogue", "Bang & Olufsen", "Sonos"],
    
    psychology: {
      customerNeeds: [
        "Detailed technical specifications",
        "Understand how product fits their ecosystem",
        "See product in use (not just static shots)",
        "Compare models and features",
        "Know about warranty and support",
        "Trust in build quality and longevity"
      ],
      trustFactors: [
        "Technical specifications transparency",
        "Expert and media reviews",
        "Warranty and support details",
        "Build quality and materials info",
        "Company track record",
        "User reviews on performance"
      ],
      emotionalTriggers: [
        "Being on the cutting edge",
        "Design appreciation and aesthetics",
        "Productivity and efficiency",
        "Status and taste signaling",
        "Joy of unboxing/ownership",
        "Simplifying complex technology"
      ]
    },
    
    sections: [
      {
        id: "hero",
        name: "Hero Banner",
        required: true,
        purpose: "Showcase hero product with stunning visuals",
        keyElements: ["Product beauty shot", "Key innovation headline", "Learn more / Buy CTA", "Minimal text"]
      },
      {
        id: "product-showcase",
        name: "Product Deep Dive",
        required: true,
        purpose: "Detailed exploration of features and design",
        keyElements: ["360° views", "Feature callouts", "Technical animations", "Use case scenarios"]
      },
      {
        id: "specifications",
        name: "Technical Specifications",
        required: true,
        purpose: "Satisfy detail-oriented buyers",
        keyElements: ["Full spec sheet", "Comparison tools", "Compatibility info", "What's in the box"]
      },
      {
        id: "design-story",
        name: "Design Philosophy",
        required: true,
        purpose: "Differentiate through design narrative",
        keyElements: ["Design process", "Material choices", "Engineering details", "Designer insights"]
      },
      {
        id: "ecosystem",
        name: "Ecosystem/Compatibility",
        required: false,
        purpose: "Show how product works with other devices",
        keyElements: ["Integration demos", "Compatible products", "Software features"]
      },
      {
        id: "reviews",
        name: "Reviews & Press",
        required: true,
        purpose: "Build credibility through expert validation",
        keyElements: ["Press quotes", "Award badges", "User reviews", "Expert ratings"]
      },
      {
        id: "support",
        name: "Support & Warranty",
        required: true,
        purpose: "Address post-purchase concerns",
        keyElements: ["Warranty details", "Support options", "Documentation", "Community forums"]
      }
    ],
    
    design: {
      colorDescription: "Minimal, premium, and sophisticated. Often monochromatic with product as the color hero.",
      colors: {
        primary: "#000000",
        secondary: "#333333",
        accent: "#0066cc",
        background: "#ffffff"
      },
      typography: "Clean, precise, often custom or distinctive. Apple-inspired clarity.",
      fonts: {
        heading: "SF Pro Display, Söhne, or Untitled Sans",
        body: "SF Pro Text, Inter, or Suisse Int'l"
      },
      imageStyle: "Studio product photography, dramatic lighting, detail macro shots, minimal lifestyle context",
      spacing: "Extremely generous whitespace, letting products breathe, scroll-based reveals",
      mood: "Premium, minimal, innovative, design-forward, confident"
    },
    
    copywriting: {
      tone: "Confident, precise, design-focused, understated, occasionally playful",
      exampleHeadlines: [
        "Designed Different",
        "Pure Sound. Nothing Else.",
        "The Future of [Category]",
        "Precision in Every Detail",
        "Simply Powerful",
        "Meet [Product Name]"
      ],
      exampleCTAs: [
        "Buy",
        "Learn More",
        "Explore",
        "Watch the Film",
        "See It in Action",
        "Compare Models"
      ],
      avoidPhrases: [
        "Revolutionary (overused)",
        "Best in class",
        "Industry-leading",
        "Cutting-edge technology",
        "State of the art",
        "Game-changing"
      ]
    },
    
    images: {
      hero: [
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1920&q=80",
        "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=1920&q=80",
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1920&q=80",
        "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=1920&q=80",
        "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=1920&q=80"
      ],
      products: [
        "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&q=80",
        "https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=800&q=80",
        "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=800&q=80",
        "https://images.unsplash.com/photo-1608156639585-b3a776f1214b?w=800&q=80",
        "https://images.unsplash.com/photo-1524678606370-a47ad25cb82a?w=800&q=80"
      ],
      lifestyle: [
        "https://images.unsplash.com/photo-1558089687-f282ffcbc126?w=1200&q=80",
        "https://images.unsplash.com/photo-1505330622279-bf7d7fc918f4?w=1200&q=80",
        "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=1200&q=80",
        "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=1200&q=80",
        "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=1200&q=80"
      ],
      about: [
        "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&q=80",
        "https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=1200&q=80",
        "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=1200&q=80",
        "https://images.unsplash.com/photo-1461344577544-4e5dc9487184?w=1200&q=80"
      ]
    }
  }
];

// Export individual industries for direct access
export const fashionClothing = ecommerceIndustries.find(i => i.id === "fashion-clothing")!;
export const beautyCosmetics = ecommerceIndustries.find(i => i.id === "beauty-cosmetics")!;
export const homeFurniture = ecommerceIndustries.find(i => i.id === "home-furniture")!;
export const foodBeverageDtc = ecommerceIndustries.find(i => i.id === "food-beverage-dtc")!;
export const petProducts = ecommerceIndustries.find(i => i.id === "pet-products")!;
export const kidsBaby = ecommerceIndustries.find(i => i.id === "kids-baby")!;
export const sportsOutdoors = ecommerceIndustries.find(i => i.id === "sports-outdoors")!;
export const electronicsGadgets = ecommerceIndustries.find(i => i.id === "electronics-gadgets")!;

// Utility function to get industry by ID
export function getEcommerceIndustry(id: string): IndustryIntelligence | undefined {
  return ecommerceIndustries.find(industry => industry.id === id);
}

// Utility function to get all industry IDs
export function getEcommerceIndustryIds(): string[] {
  return ecommerceIndustries.map(industry => industry.id);
}

