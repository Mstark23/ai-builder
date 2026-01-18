// app/api/ai/images/route.ts
// API Route for DALL-E Image Generation

import { NextRequest, NextResponse } from 'next/server';

// OpenAI API call for image generation
async function generateImage(prompt: string, size: string = '1792x1024'): Promise<string> {
  const response = await fetch('https://api.openai.com/v1/images/generations', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'dall-e-3',
      prompt,
      n: 1,
      size,
      quality: 'standard',
      style: 'natural',
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`DALL-E API error: ${error}`);
  }

  const data = await response.json();
  return data.data[0].url;
}

// Industry-specific image prompts
const IMAGE_PROMPTS: Record<string, Record<string, string>> = {
  restaurant: {
    hero: 'Professional food photography, beautiful gourmet dish with perfect lighting, shallow depth of field, warm restaurant atmosphere, no text or logos, appetizing presentation',
    about: 'Elegant restaurant interior, warm lighting, comfortable seating, sophisticated dining ambiance, no people, no text',
    gallery: 'Delicious gourmet dish closeup, professional food photography, perfect plating, appetizing colors, no text',
    team: 'Professional chef workspace, modern kitchen, clean and organized, warm lighting, no people, no text',
  },
  'local-services': {
    hero: 'Professional service work in progress, clean high-quality photo, showing expertise and craftsmanship, no text or logos',
    about: 'Professional team workspace, clean uniforms, quality equipment, trustworthy appearance, no people, no text',
    gallery: 'Completed professional project result, high quality work, clean presentation, no text',
    team: 'Professional work tools and equipment, organized workspace, clean presentation, no text',
  },
  ecommerce: {
    hero: 'Premium product showcase on clean background, perfect studio lighting, luxury feel, no text',
    about: 'Modern warehouse or studio space, clean and organized, professional environment, no text',
    gallery: 'Product lifestyle photography, aspirational setting, premium quality feel, no text',
    team: 'Modern creative workspace, stylish professional environment, no people, no text',
  },
  professional: {
    hero: 'Modern professional office environment, sophisticated design, clean lines, natural light, no people, no text',
    about: 'Professional meeting room, sophisticated atmosphere, premium furniture, no people, no text',
    gallery: 'Abstract professional background, subtle patterns, premium corporate feel, no text',
    team: 'Professional office detail, modern design elements, clean aesthetic, no people, no text',
  },
  'health-beauty': {
    hero: 'Luxurious spa interior, calming atmosphere, soft lighting, premium feel, no people, no text',
    about: 'Beauty treatment room, serene environment, professional equipment, clean aesthetic, no people, no text',
    gallery: 'Premium beauty products arrangement, elegant presentation, clean background, no text',
    team: 'Elegant salon station, professional tools, premium workspace, no people, no text',
  },
  'real-estate': {
    hero: 'Stunning luxury home interior, beautiful architecture, perfect lighting, aspirational living space, no text',
    about: 'Beautiful modern living room, staged perfectly, natural light, premium feel, no text',
    gallery: 'Luxury property feature, high-end finishes, beautiful design, no text',
    team: 'Modern real estate office, professional environment, sophisticated design, no people, no text',
  },
  portfolio: {
    hero: 'Creative workspace, artistic environment, professional equipment, inspiring atmosphere, no text',
    about: 'Artist studio space, creative tools, inspiring environment, professional setup, no text',
    gallery: 'Abstract creative background, artistic, unique, visually interesting, no text',
    team: 'Creative professional workspace detail, artistic arrangement, inspiring atmosphere, no text',
  },
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      industry, 
      businessName, 
      style, 
      imageType = 'hero',
      customPrompt 
    } = body;

    if (!industry && !customPrompt) {
      return NextResponse.json(
        { error: 'Industry or custom prompt required' },
        { status: 400 }
      );
    }

    // Determine the prompt
    let prompt: string;
    
    if (customPrompt) {
      prompt = customPrompt;
    } else {
      const normalizedIndustry = industry.toLowerCase().replace(/\s+/g, '-');
      const industryPrompts = IMAGE_PROMPTS[normalizedIndustry] || IMAGE_PROMPTS['local-services'];
      const basePrompt = industryPrompts[imageType] || industryPrompts['hero'];
      
      // Enhance prompt with business context
      prompt = `${basePrompt}. Style: ${style || 'modern'} aesthetic${businessName ? `, for a business called "${businessName}"` : ''}. High quality, professional photography.`;
    }

    // Determine size based on image type
    const size = imageType === 'hero' ? '1792x1024' : '1024x1024';

    // Generate the image
    const imageUrl = await generateImage(prompt, size);

    return NextResponse.json({
      success: true,
      imageUrl,
      prompt,
      imageType,
    });

  } catch (error) {
    console.error('Image Generation Error:', error);
    return NextResponse.json(
      { error: 'Failed to generate image', details: String(error) },
      { status: 500 }
    );
  }
}

// Generate multiple images at once
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { industry, businessName, style, imageTypes = ['hero', 'about', 'gallery'] } = body;

    if (!industry) {
      return NextResponse.json({ error: 'Industry required' }, { status: 400 });
    }

    const normalizedIndustry = industry.toLowerCase().replace(/\s+/g, '-');
    const industryPrompts = IMAGE_PROMPTS[normalizedIndustry] || IMAGE_PROMPTS['local-services'];
    
    const results: { type: string; url: string }[] = [];

    for (const imageType of imageTypes) {
      try {
        const basePrompt = industryPrompts[imageType] || industryPrompts['hero'];
        const prompt = `${basePrompt}. Style: ${style || 'modern'} aesthetic${businessName ? `, for "${businessName}"` : ''}. High quality, professional.`;
        
        const size = imageType === 'hero' ? '1792x1024' : '1024x1024';
        const imageUrl = await generateImage(prompt, size);
        
        results.push({ type: imageType, url: imageUrl });
      } catch (err) {
        console.error(`Failed to generate ${imageType} image:`, err);
        results.push({ type: imageType, url: '' });
      }
    }

    return NextResponse.json({
      success: true,
      images: results,
    });

  } catch (error) {
    console.error('Batch Image Generation Error:', error);
    return NextResponse.json(
      { error: 'Failed to generate images', details: String(error) },
      { status: 500 }
    );
  }
}