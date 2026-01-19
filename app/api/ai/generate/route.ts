// app/api/ai/generate/route.ts
// ULTIMATE AI Website Generation - Million Dollar Websites

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// ============================================================================
// THE MASTER SYSTEM PROMPT - This is the secret sauce
// ============================================================================
const MASTER_SYSTEM_PROMPT = `You are an ELITE website designer who has won every major design award. Your websites are featured on Awwwards, CSS Design Awards, and FWA. Companies pay you $50,000+ per website.

## YOUR DESIGN PHILOSOPHY

You don't just build websites - you create EXPERIENCES that make visitors say "WOW" within the first 2 seconds.

### THE 5 PRINCIPLES OF MILLION-DOLLAR WEBSITES:

**1. THE HERO IS EVERYTHING**
The hero section is 80% of the first impression. It must:
- Have a MASSIVE headline (clamp(48px, 8vw, 96px))
- Use a stunning full-screen background (gradient mesh, image with overlay, or animated gradient)
- Include subtle motion (floating elements, gradient animation, parallax)
- Have ONE clear call-to-action that POPS
- Create immediate emotional impact

**2. VISUAL HIERARCHY THROUGH CONTRAST**
- Use size contrast: Headlines 4-6x bigger than body text
- Use color contrast: One dominant color, one accent that demands attention
- Use space contrast: Generous padding (80-120px sections), tight text groupings
- Use weight contrast: Bold headlines, light body text

**3. MOTION CREATES EMOTION**
- Scroll-triggered animations (elements fade/slide in as you scroll)
- Hover micro-interactions (buttons lift, cards glow, images zoom)
- Subtle background motion (gradient shifts, floating shapes)
- Smooth transitions everywhere (0.3s ease-out is your friend)

**4. IMAGES TELL THE STORY**
- Use REAL-LOOKING images from Unsplash (via picsum.photos or direct unsplash URLs)
- Hero images should be full-width, high-impact
- Product/service images should be large and aspirational
- Team photos should feel professional and approachable
- NEVER use obvious placeholder text on images

**5. DETAILS NOBODY NOTICES (BUT EVERYONE FEELS)**
- Custom selection color matching brand
- Smooth scroll behavior
- Consistent 8px spacing grid
- Subtle text shadows on hero text over images
- Border-radius that matches brand personality (sharp = professional, rounded = friendly)
- Loading states and transitions

## TECHNICAL REQUIREMENTS

You MUST include ALL of these in every website:

### CSS ARCHITECTURE
\`\`\`css
:root {
  --primary: #HEXCODE;
  --primary-dark: #HEXCODE;
  --secondary: #HEXCODE;
  --accent: #HEXCODE;
  --background: #HEXCODE;
  --surface: #HEXCODE;
  --text: #HEXCODE;
  --text-muted: #HEXCODE;
  --gradient: linear-gradient(135deg, var(--primary), var(--secondary));
}

* { margin: 0; padding: 0; box-sizing: border-box; }
html { scroll-behavior: smooth; }
body { font-family: 'CHOSEN_FONT', sans-serif; background: var(--background); color: var(--text); }
\`\`\`

### ANIMATIONS (Required)
\`\`\`css
/* Fade in on scroll */
.reveal {
  opacity: 0;
  transform: translateY(40px);
  transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}
.reveal.active {
  opacity: 1;
  transform: translateY(0);
}

/* Stagger children */
.reveal:nth-child(1) { transition-delay: 0.1s; }
.reveal:nth-child(2) { transition-delay: 0.2s; }
.reveal:nth-child(3) { transition-delay: 0.3s; }

/* Button hover */
.btn {
  transition: all 0.3s ease;
}
.btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 40px rgba(0,0,0,0.2);
}

/* Card hover */
.card {
  transition: all 0.3s ease;
}
.card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 60px rgba(0,0,0,0.15);
}
\`\`\`

### JAVASCRIPT (Required)
\`\`\`javascript
// Intersection Observer for scroll animations
document.addEventListener('DOMContentLoaded', () => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
  
  // Navbar scroll effect
  const nav = document.querySelector('nav');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  });
});
\`\`\`

### IMAGE SOURCES
Use these for REALISTIC images:
- Hero backgrounds: https://images.unsplash.com/photo-[ID]?w=1920&q=80
- Team/People: https://images.unsplash.com/photo-[ID]?w=400&q=80
- Products: https://images.unsplash.com/photo-[ID]?w=600&q=80
- Or use: https://picsum.photos/1920/1080?random=1 (increment number for variety)

## OUTPUT FORMAT

Return ONLY the complete HTML file:
- Start with <!DOCTYPE html>
- End with </html>
- NO explanations, NO markdown code blocks
- ALL CSS in a single <style> tag in <head>
- ALL JavaScript in a single <script> tag before </body>
- Must be 100% complete and functional`;

// ============================================================================
// INDUSTRY-SPECIFIC CREATIVE BRIEFS
// ============================================================================
const INDUSTRY_BRIEFS: Record<string, string> = {
  'restaurant': `
## 🍽️ RESTAURANT WEBSITE BRIEF

**THE FEELING:** Walking into a restaurant where you KNOW the food will be incredible. Warmth, appetite, anticipation.

**HERO APPROACH:**
- Full-screen food photography or restaurant interior
- Dark overlay (rgba(0,0,0,0.4)) to make text pop
- Elegant serif font for restaurant name
- "Reserve a Table" button with warm glow effect

**COLOR PALETTE:**
- Rich burgundy, deep orange, warm gold
- Cream backgrounds, dark text
- Accent: Warm amber or gold

**REQUIRED SECTIONS:**
1. Hero - Stunning food/interior shot with reservation CTA
2. Story - "Our Story" with atmospheric photo
3. Menu Highlights - 3-4 signature dishes with photos (NOT full menu)
4. Gallery - 6-8 beautiful food/ambiance photos in grid
5. Reviews - 3 customer testimonials with stars
6. Location - Map embed + hours + contact
7. Footer - Social links, newsletter, reservation button

**IMAGES TO USE:**
- Hero: https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1920&q=80 (restaurant interior)
- Food 1: https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80 (plated dish)
- Food 2: https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80 (dining)
- Food 3: https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?w=800&q=80 (food)
- Interior: https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80 (restaurant)

**FONTS:** Playfair Display (headlines), Lato (body)`,

  'local-services': `
## 🔧 LOCAL SERVICES WEBSITE BRIEF

**THE FEELING:** Relief. "Finally, a professional I can TRUST." Competence meets approachability.

**HERO APPROACH:**
- Split layout: Bold headline left, team/work photo right
- Trust badges floating (Licensed, Insured, 5-Star Rated)
- "Get Free Quote" button in accent color
- Maybe subtle pattern or gradient background

**COLOR PALETTE:**
- Professional blue or trustworthy green as primary
- White/light gray backgrounds
- Orange or yellow accent for CTAs (creates urgency)

**REQUIRED SECTIONS:**
1. Hero - Value proposition + trust badges + CTA
2. Services - Grid of 4-6 services with icons
3. Why Us - 3-4 differentiators with checkmarks
4. Work Gallery - Before/After or project photos
5. Reviews - 3 testimonials with photos and stars
6. Service Areas - Map or list of areas served
7. Contact - Form + phone number (make phone HUGE on mobile)
8. Footer - License numbers, guarantees

**IMAGES TO USE:**
- Hero: https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=1920&q=80 (professional at work)
- Team: https://images.unsplash.com/photo-1560250097-0b93528c311a?w=600&q=80 (professional portrait)
- Work 1: https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&q=80 (service work)
- Work 2: https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80 (completed project)

**FONTS:** Poppins or Montserrat (headlines), Inter (body)`,

  'professional': `
## 💼 PROFESSIONAL SERVICES BRIEF (Law, Consulting, Finance)

**THE FEELING:** "These are EXPERTS. I'm in good hands." Confidence, authority, success.

**HERO APPROACH:**
- Sophisticated gradient or abstract background
- OR professional team photo with overlay
- Headline focuses on OUTCOMES, not services
- "Schedule Consultation" CTA

**COLOR PALETTE:**
- Navy blue, charcoal, or deep slate as primary
- Gold, amber, or warm accent for prestige
- Lots of white space

**REQUIRED SECTIONS:**
1. Hero - Outcome-focused headline + consultation CTA
2. Services - Clean list with descriptions
3. About - Firm story + credentials
4. Team - Professional headshots with titles
5. Results/Case Studies - Numbers and outcomes
6. Testimonials - Client quotes with company names
7. Contact - Multiple contact methods

**IMAGES TO USE:**
- Hero: https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1920&q=80 (modern building)
- Team 1: https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80 (professional woman)
- Team 2: https://images.unsplash.com/photo-1556157382-97edd2f9e5ee?w=400&q=80 (professional man)
- Office: https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80 (modern office)

**FONTS:** Inter or Source Sans Pro (clean), Libre Baskerville (elegant headlines)`,

  'health-beauty': `
## 💆 HEALTH & BEAUTY / SPA BRIEF

**THE FEELING:** Instant calm. A visual deep breath. "I DESERVE this."

**HERO APPROACH:**
- Soft, dreamy imagery with light overlay
- Elegant script or serif font
- Muted, calming color palette
- "Book Your Experience" CTA

**COLOR PALETTE:**
- Soft sage green, blush pink, or calming teal
- Cream, warm white backgrounds
- Gold accents for luxury

**REQUIRED SECTIONS:**
1. Hero - Serene imagery with booking CTA
2. Services - Treatments with poetic descriptions
3. About/Philosophy - Why this spa is different
4. Team - Therapists/stylists with warm photos
5. Gallery - Space and treatment photos
6. Pricing - Clear packages
7. Booking CTA - Final push to book
8. Contact - Location, hours, contact

**IMAGES TO USE:**
- Hero: https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=1920&q=80 (spa)
- Treatment 1: https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&q=80 (massage)
- Treatment 2: https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&q=80 (facial)
- Interior: https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?w=800&q=80 (spa interior)

**FONTS:** Cormorant Garamond (elegant headlines), Quicksand (soft body)`,

  'real-estate': `
## 🏠 REAL ESTATE BRIEF

**THE FEELING:** "This is THE ONE." Aspiration meets attainability. Dream home energy.

**HERO APPROACH:**
- Stunning property photo, full-width
- Search box overlay OR agent value proposition
- "Find Your Dream Home" headline

**COLOR PALETTE:**
- Navy or charcoal for trust
- Gold or warm accents for luxury
- Clean whites for space

**REQUIRED SECTIONS:**
1. Hero - Property image with search/CTA
2. Featured Listings - 3-4 property cards with photos
3. Agent Profile - Photo, bio, credentials
4. Why Work With Us - Differentiators
5. Testimonials - Happy homeowners
6. Areas Served - Neighborhoods
7. Contact - Multiple contact methods

**IMAGES TO USE:**
- Hero: https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920&q=80 (luxury home)
- Property 1: https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80 (home exterior)
- Property 2: https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80 (interior)
- Agent: https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&q=80 (professional)

**FONTS:** Poppins (modern headlines), Inter (body)`,

  'ecommerce': `
## 🛒 E-COMMERCE BRIEF

**THE FEELING:** "I NEED this." Desire, discovery, trust.

**HERO APPROACH:**
- Large product shot or lifestyle imagery
- Bold brand statement
- "Shop Now" CTA that's unmissable

**COLOR PALETTE:**
- Minimal: black, white, one accent
- Let products be the color

**REQUIRED SECTIONS:**
1. Hero - Flagship product/collection
2. Featured Products - 4-6 products in grid
3. Categories - Visual category blocks
4. Brand Story - Why this brand exists
5. Reviews - Social proof
6. Newsletter - Email signup with incentive
7. Trust Badges - Shipping, returns, secure checkout

**IMAGES TO USE:**
- Hero: https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1920&q=80 (store)
- Product 1: https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80 (product)
- Product 2: https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80 (headphones)
- Product 3: https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=600&q=80 (camera)

**FONTS:** Space Grotesk (modern), DM Sans (clean body)`,

  'portfolio': `
## 🎨 PORTFOLIO BRIEF

**THE FEELING:** "WOW, I need to hire this person." Creative confidence.

**HERO APPROACH:**
- Bold, oversized name/title
- Minimal everything else
- Maybe subtle animation
- Let work speak for itself

**COLOR PALETTE:**
- Could be dark mode (premium feel)
- High contrast
- One accent color for personality

**REQUIRED SECTIONS:**
1. Hero - Name, title, one-liner
2. Selected Work - Project grid with hover effects
3. About - Personal story with personality
4. Services - What you offer
5. Testimonials - Client quotes
6. Contact - Easy to reach out

**IMAGES TO USE:**
- Project 1: https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80 (design work)
- Project 2: https://images.unsplash.com/photo-1522542550221-31fd8575f4a7?w=800&q=80 (creative work)
- Project 3: https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=800&q=80 (branding)

**FONTS:** Space Grotesk or Clash Display (bold), Inter (body)`,

  'banking': `
## 🏦 BANKING / FINTECH BRIEF

**THE FEELING:** "My money is SAFE and working for me." Modern trust.

**HERO APPROACH:**
- Clean gradient or abstract shapes
- App mockup or card floating
- Security + innovation message
- "Get Started" CTA

**COLOR PALETTE:**
- Deep blue or purple (trust + innovation)
- Teal or green accents (growth)
- Clean whites

**REQUIRED SECTIONS:**
1. Hero - Value prop + app showcase
2. Features - Product benefits with icons
3. Security - Trust and safety section
4. How It Works - 3-4 simple steps
5. App Showcase - Device mockups
6. Testimonials - User quotes
7. FAQ - Common questions
8. CTA - Final signup push

**IMAGES TO USE:**
- Hero: Use CSS gradient + floating card/phone mockup design
- App: https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&q=80 (finance)
- People: https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&q=80 (professional)

**FONTS:** Inter (clean), JetBrains Mono (numbers)`,

  'fitness': `
## 💪 FITNESS / GYM BRIEF

**THE FEELING:** "This is where I become my BEST self." Energy, motivation, results.

**HERO APPROACH:**
- High-energy workout imagery
- Bold, motivational headline
- "Start Your Journey" CTA
- Maybe dark with neon accents

**COLOR PALETTE:**
- Dark backgrounds (intensity)
- Neon accent (energy): electric blue, lime, orange
- High contrast

**REQUIRED SECTIONS:**
1. Hero - Action shot with bold CTA
2. Programs - Class types or training programs
3. Results - Transformations, testimonials
4. Trainers - Team with credentials
5. Facility - Gym photos
6. Pricing - Membership options
7. CTA - Free trial or consultation

**IMAGES TO USE:**
- Hero: https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1920&q=80 (gym)
- Training 1: https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&q=80 (workout)
- Training 2: https://images.unsplash.com/photo-1581009146145-b5ef050c149a?w=800&q=80 (training)
- Trainer: https://images.unsplash.com/photo-1567013127542-490d757e51fc?w=600&q=80 (trainer)

**FONTS:** Bebas Neue (bold headlines), Inter (body)`,

  'education': `
## 📚 EDUCATION / COACHING BRIEF

**THE FEELING:** "This will TRANSFORM my life/career." Hope, expertise, results.

**HERO APPROACH:**
- Inspiring imagery or instructor photo
- Transformation-focused headline
- "Enroll Now" or "Start Learning" CTA

**COLOR PALETTE:**
- Trustworthy blue or inspiring purple
- Warm accents for approachability
- Clean, focused design

**REQUIRED SECTIONS:**
1. Hero - Transformation promise
2. Courses/Programs - What's offered
3. Instructor - Credentials, story
4. Results - Student success stories
5. Curriculum - What they'll learn
6. Testimonials - Student quotes
7. Pricing - Clear options
8. FAQ - Common questions

**IMAGES TO USE:**
- Hero: https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=1920&q=80 (learning)
- Instructor: https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&q=80 (professional)
- Students: https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80 (group learning)

**FONTS:** Poppins (friendly headlines), Inter (readable body)`,

  'medical': `
## ⚕️ MEDICAL / HEALTHCARE BRIEF

**THE FEELING:** "I'm in EXPERT, caring hands." Trust, competence, compassion.

**HERO APPROACH:**
- Clean, calming imagery
- Reassuring headline
- "Book Appointment" CTA
- Trust signals visible

**COLOR PALETTE:**
- Calming blue or teal
- Clean whites
- Warm accent for approachability

**REQUIRED SECTIONS:**
1. Hero - Reassuring message + booking CTA
2. Services - Medical services offered
3. Doctors - Team with credentials
4. Why Us - Differentiators
5. Patient Stories - Testimonials
6. Insurance - Accepted plans
7. Location - Office info + map
8. Contact - Easy appointment booking

**IMAGES TO USE:**
- Hero: https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1920&q=80 (medical)
- Doctor 1: https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=600&q=80 (female doctor)
- Doctor 2: https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=600&q=80 (male doctor)
- Office: https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=800&q=80 (clinic)

**FONTS:** Inter (professional), Source Sans Pro (readable)`,

  'tech-startup': `
## 🚀 TECH STARTUP / SAAS BRIEF

**THE FEELING:** "This will SOLVE my problem." Innovation, simplicity, results.

**HERO APPROACH:**
- Product screenshot or abstract gradient
- Clear value proposition
- "Get Started Free" or "Request Demo" CTA
- Social proof (logos, user count)

**COLOR PALETTE:**
- Modern: purple/blue gradients
- Or minimal black/white with one accent
- Dark mode optional

**REQUIRED SECTIONS:**
1. Hero - Product + value prop + CTA
2. Logos - Companies that trust you
3. Features - Key benefits with visuals
4. How It Works - Simple steps
5. Pricing - Clear tiers
6. Testimonials - User quotes
7. FAQ - Common questions
8. CTA - Final conversion push

**IMAGES TO USE:**
- Hero: Create with CSS gradients + floating UI elements
- Dashboard: https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80 (dashboard)
- Team: https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80 (startup team)

**FONTS:** Inter (clean tech), Space Grotesk (modern headlines)`,

  'construction': `
## 🏗️ CONSTRUCTION BRIEF

**THE FEELING:** "These are PROS who deliver." Strength, reliability, quality.

**HERO APPROACH:**
- Project photo or team at work
- Bold, confident headline
- "Get Free Estimate" CTA

**COLOR PALETTE:**
- Strong: orange, yellow, or blue
- Grays and blacks for professionalism
- White space for clarity

**REQUIRED SECTIONS:**
1. Hero - Project/team photo + CTA
2. Services - What you build
3. Projects - Portfolio gallery
4. About - Experience, story
5. Process - How you work
6. Testimonials - Client reviews
7. Contact - Quote form

**IMAGES TO USE:**
- Hero: https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1920&q=80 (construction)
- Project 1: https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80 (building)
- Project 2: https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&q=80 (architecture)
- Team: https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&q=80 (workers)

**FONTS:** Poppins (strong headlines), Inter (body)`,

  'nonprofit': `
## ❤️ NONPROFIT BRIEF

**THE FEELING:** "I can make a DIFFERENCE." Purpose, impact, community.

**HERO APPROACH:**
- Emotional, impactful imagery
- Mission-focused headline
- "Donate Now" or "Join Us" CTA

**COLOR PALETTE:**
- Warm, hopeful colors
- Could be cause-specific
- Accessible and inclusive

**REQUIRED SECTIONS:**
1. Hero - Mission + emotional image + CTA
2. Impact - Numbers, what you've achieved
3. About - Story, mission, vision
4. Programs - What you do
5. Stories - Beneficiary testimonials
6. Ways to Help - Donate, volunteer
7. Team - Leadership
8. Contact - Get involved

**IMAGES TO USE:**
- Hero: https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=1920&q=80 (helping)
- Impact: https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=800&q=80 (community)
- Volunteers: https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=800&q=80 (volunteers)

**FONTS:** Poppins (warm headlines), Inter (accessible body)`,

  'automotive': `
## 🚗 AUTOMOTIVE BRIEF

**THE FEELING:** "These are the car EXPERTS." Trust, expertise, fair dealing.

**HERO APPROACH:**
- Showroom or featured vehicle
- Bold headline
- "Browse Inventory" or "Get Quote" CTA

**COLOR PALETTE:**
- Red, black for excitement
- Or blue for trust
- Metallic accents

**REQUIRED SECTIONS:**
1. Hero - Featured vehicle/showroom
2. Inventory - Vehicle showcase
3. Services - What you offer
4. About - Dealership story
5. Reviews - Customer testimonials
6. Financing - Options available
7. Contact - Location, hours

**IMAGES TO USE:**
- Hero: https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1920&q=80 (car)
- Car 1: https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800&q=80 (vehicle)
- Car 2: https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80 (luxury car)
- Showroom: https://images.unsplash.com/photo-1562141961-b5d1f8ff3dcc?w=800&q=80 (dealership)

**FONTS:** Poppins (bold), Inter (clean body)`
};

// Default brief for unknown industries
const DEFAULT_BRIEF = `
## ✨ CUSTOM WEBSITE BRIEF

**THE FEELING:** Professional, trustworthy, memorable.

**HERO APPROACH:**
- Full-width impactful section
- Clear value proposition
- Strong call-to-action

**COLOR PALETTE:**
- Professional primary color
- Contrasting accent for CTAs
- Clean backgrounds

**REQUIRED SECTIONS:**
1. Hero - Value prop + CTA
2. About - Company story
3. Services - What you offer
4. Why Us - Differentiators
5. Testimonials - Social proof
6. Contact - Get in touch

**IMAGES TO USE:**
- Hero: https://images.unsplash.com/photo-1497366216548-37526070297c?w=1920&q=80 (office)
- Team: https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80 (team)

**FONTS:** Inter (versatile), Poppins (headlines)`;

// ============================================================================
// STYLE MODIFIERS
// ============================================================================
const STYLE_MODIFIERS: Record<string, string> = {
  'modern': `
**STYLE: MODERN**
- Clean geometric shapes
- Bold sans-serif typography
- Strategic whitespace
- Subtle gradients
- Card-based layouts
- Smooth micro-interactions`,

  'elegant': `
**STYLE: ELEGANT**
- Refined serif typography
- Generous whitespace
- Muted, sophisticated palette
- Gold or champagne accents
- Thin lines and borders
- Subtle, graceful animations`,

  'bold': `
**STYLE: BOLD**
- Oversized typography (go BIG)
- High contrast colors
- Strong geometric shapes
- Dynamic animations
- Thick borders, heavy shadows
- Maximum visual impact`,

  'minimal': `
**STYLE: MINIMAL**
- Maximum whitespace
- 2-3 colors maximum
- Typography-focused
- Essential elements only
- Barely-there animations
- Every element must earn its place`,

  'playful': `
**STYLE: PLAYFUL**
- Rounded corners everywhere
- Bright, cheerful colors
- Bouncy animations
- Illustrated elements
- Casual, friendly fonts
- Fun hover effects`,

  'corporate': `
**STYLE: CORPORATE**
- Professional and structured
- Traditional grid layouts
- Conservative colors (blue, gray)
- Clear hierarchy
- Polished but not flashy
- Trust-building elements`,

  'dark': `
**STYLE: DARK PREMIUM**
- Dark backgrounds (#0a0a0a to #1a1a1a)
- Light text with subtle shadows
- Glowing accent colors
- Gradient borders
- Glassmorphism effects
- Subtle grain texture overlay`
};

// ============================================================================
// COLOR PALETTE CONFIGURATIONS
// ============================================================================
const COLOR_PALETTES: Record<string, { primary: string; secondary: string; accent: string; background: string; surface: string; text: string; textMuted: string }> = {
  'auto': { primary: '#6366F1', secondary: '#8B5CF6', accent: '#F59E0B', background: '#FFFFFF', surface: '#F8FAFC', text: '#0F172A', textMuted: '#64748B' },
  'blue': { primary: '#1E40AF', secondary: '#3B82F6', accent: '#F59E0B', background: '#FFFFFF', surface: '#F0F9FF', text: '#0F172A', textMuted: '#64748B' },
  'green': { primary: '#166534', secondary: '#22C55E', accent: '#F59E0B', background: '#FFFFFF', surface: '#F0FDF4', text: '#0F172A', textMuted: '#64748B' },
  'red': { primary: '#991B1B', secondary: '#EF4444', accent: '#F59E0B', background: '#FFFFFF', surface: '#FEF2F2', text: '#0F172A', textMuted: '#64748B' },
  'purple': { primary: '#6B21A8', secondary: '#A855F7', accent: '#F59E0B', background: '#FFFFFF', surface: '#FAF5FF', text: '#0F172A', textMuted: '#64748B' },
  'orange': { primary: '#C2410C', secondary: '#F97316', accent: '#6366F1', background: '#FFFFFF', surface: '#FFF7ED', text: '#0F172A', textMuted: '#64748B' },
  'neutral': { primary: '#1F2937', secondary: '#4B5563', accent: '#6366F1', background: '#FFFFFF', surface: '#F9FAFB', text: '#0F172A', textMuted: '#64748B' },
  'gold': { primary: '#92400E', secondary: '#D97706', accent: '#1E40AF', background: '#FFFFFF', surface: '#FFFBEB', text: '#0F172A', textMuted: '#64748B' }
};

// ============================================================================
// MAIN API HANDLER
// ============================================================================
async function callClaude(systemPrompt: string, userPrompt: string): Promise<string> {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY!,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 16000,
      temperature: 0.8,
      system: systemPrompt,
      messages: [{ role: 'user', content: userPrompt }],
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Claude API error: ${error}`);
  }

  const data = await response.json();
  return data.content[0].text;
}

function cleanHtmlResponse(response: string): string {
  let html = response.trim();
  
  // Remove markdown code blocks
  html = html.replace(/^```html\s*\n?/i, '').replace(/\n?```\s*$/i, '');
  html = html.replace(/^```\s*\n?/, '').replace(/\n?```\s*$/, '');
  
  // Find DOCTYPE
  const doctypeIndex = html.toLowerCase().indexOf('<!doctype');
  if (doctypeIndex > 0) {
    html = html.substring(doctypeIndex);
  }
  
  // Find closing html tag
  const htmlEndIndex = html.toLowerCase().lastIndexOf('</html>');
  if (htmlEndIndex > 0) {
    html = html.substring(0, htmlEndIndex + 7);
  }
  
  return html;
}

async function generateWebsite(project: any): Promise<string> {
  const industry = (project.industry || 'other').toLowerCase().replace(/\s+/g, '-');
  const style = (project.style || 'modern').toLowerCase();
  const colorPref = project.color_preference || 'auto';
  
  // Get configurations
  const industryBrief = INDUSTRY_BRIEFS[industry] || DEFAULT_BRIEF;
  const styleModifier = STYLE_MODIFIERS[style] || STYLE_MODIFIERS['modern'];
  const colors = COLOR_PALETTES[colorPref] || COLOR_PALETTES['auto'];
  
  // Build mood description
  const moodTags = project.mood_tags || [];
  const moodDescription = moodTags.length > 0 
    ? `The website should feel: ${moodTags.join(', ')}.`
    : '';

  const userPrompt = `
# CREATE A MILLION-DOLLAR WEBSITE

## CLIENT INFORMATION
- **Business Name:** ${project.business_name}
- **Industry:** ${project.industry}
- **Description:** ${project.description || 'A professional business'}
- **Website Goal:** ${project.website_goal || 'Generate leads and build trust'}
- **Target Customer:** ${project.target_customer || 'Professionals seeking quality services'}
- **Unique Value:** ${project.unique_value || 'Quality, reliability, and excellent service'}
- **Contact Email:** ${project.contact_email || 'contact@example.com'}
- **Contact Phone:** ${project.contact_phone || '(555) 123-4567'}
- **Address:** ${project.address || 'City, State'}
${project.inspirations ? `- **Design Inspirations:** ${project.inspirations}` : ''}
${moodDescription}

## FEATURES TO INCLUDE
${(project.features || ['Contact Form', 'Testimonials', 'About Section']).map((f: string) => `- ${f}`).join('\n')}

${industryBrief}

${styleModifier}

## COLOR PALETTE TO USE
\`\`\`css
:root {
  --primary: ${colors.primary};
  --primary-dark: ${colors.primary}dd;
  --secondary: ${colors.secondary};
  --accent: ${colors.accent};
  --background: ${colors.background};
  --surface: ${colors.surface};
  --text: ${colors.text};
  --text-muted: ${colors.textMuted};
}
\`\`\`

## CRITICAL REQUIREMENTS

1. **HERO MUST BE STUNNING** - Full viewport height, impactful imagery from the URLs provided, massive headline
2. **USE REAL IMAGES** - From the Unsplash URLs provided in the brief above, NOT placeholder.com
3. **INCLUDE ALL ANIMATIONS** - Scroll reveals (.reveal class), hover effects, smooth transitions
4. **MOBILE RESPONSIVE** - Must look perfect on all devices
5. **COMPLETE WEBSITE** - All sections from the brief, working smooth-scroll navigation, full footer

## GENERATE NOW

Create a website so beautiful that the client will want to pay immediately. This should look like a $50,000 custom website.

Output ONLY the complete HTML. Start with <!DOCTYPE html>, end with </html>. No explanations.`;

  const response = await callClaude(MASTER_SYSTEM_PROMPT, userPrompt);
  return cleanHtmlResponse(response);
}

async function reviseWebsite(currentHtml: string, feedback: string, project: any): Promise<string> {
  const systemPrompt = `You are an elite web designer making revisions. Maintain premium quality while implementing all requested changes. Keep all animations and responsive behavior. Output ONLY complete HTML.`;

  const userPrompt = `
## REVISION REQUEST

**Client:** ${project.business_name}
**Feedback:** ${feedback}

Apply these changes while maintaining the million-dollar quality.

**Current Website:**
${currentHtml}

Output the COMPLETE revised HTML. Start with <!DOCTYPE html>, end with </html>.`;

  const response = await callClaude(systemPrompt, userPrompt);
  return cleanHtmlResponse(response);
}

async function quickEdit(currentHtml: string, instruction: string): Promise<string> {
  const systemPrompt = `Make this specific edit while preserving everything else. Output ONLY complete HTML.`;

  const userPrompt = `
**Edit:** ${instruction}

**Current HTML:**
${currentHtml}

Output COMPLETE updated HTML. Start with <!DOCTYPE html>, end with </html>.`;

  const response = await callClaude(systemPrompt, userPrompt);
  return cleanHtmlResponse(response);
}

// ============================================================================
// API ROUTE HANDLER
// ============================================================================
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { projectId, action } = body;

    if (!projectId) {
      return NextResponse.json({ error: 'Project ID required' }, { status: 400 });
    }

    const { data: project, error: projectError } = await supabase
      .from('projects')
      .select('*, customers(name, email, phone, business_name)')
      .eq('id', projectId)
      .single();

    if (projectError || !project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    if (action === 'generate') {
      const html = await generateWebsite(project);
      
      await supabase
        .from('projects')
        .update({ 
          generated_html: html,
          status: 'PREVIEW_READY',
        })
        .eq('id', projectId);

      return NextResponse.json({ success: true, html, message: 'Website generated successfully' });
    }

    if (action === 'revise') {
      const { feedback, currentHtml } = body;
      
      if (!feedback) {
        return NextResponse.json({ error: 'Feedback required' }, { status: 400 });
      }

      const html = await reviseWebsite(currentHtml || project.generated_html, feedback, project);
      
      await supabase
        .from('projects')
        .update({ 
          generated_html: html,
          revision_count: (project.revision_count || 0) + 1,
        })
        .eq('id', projectId);

      return NextResponse.json({ success: true, html, message: 'Revisions applied' });
    }

    if (action === 'quick-edit') {
      const { instruction, currentHtml } = body;
      
      if (!instruction) {
        return NextResponse.json({ error: 'Instruction required' }, { status: 400 });
      }

      const html = await quickEdit(currentHtml || project.generated_html, instruction);
      
      await supabase
        .from('projects')
        .update({ generated_html: html })
        .eq('id', projectId);

      return NextResponse.json({ success: true, html, message: 'Edit applied' });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });

  } catch (error) {
    console.error('AI Generation Error:', error);
    return NextResponse.json(
      { error: 'Failed to process request', details: String(error) },
      { status: 500 }
    );
  }
}
