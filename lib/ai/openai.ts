// lib/ai/openai.ts
// OpenAI Integration for Image Generation & SEO

import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export type ImageGenerationRequest = {
  prompt: string;
  size?: '1024x1024' | '1792x1024' | '1024x1792';
  style?: 'vivid' | 'natural';
  quality?: 'standard' | 'hd';
};

export type GeneratedImage = {
  url: string;
  revisedPrompt: string;
};

export type SEOContent = {
  title: string;
  description: string;
  keywords: string[];
  ogTitle: string;
  ogDescription: string;
  h1Suggestions: string[];
  contentSuggestions: string[];
};

// Generate image with DALL-E 3
export async function generateImage(request: ImageGenerationRequest): Promise<GeneratedImage> {
  try {
    const response = await openai.images.generate({
      model: 'dall-e-3',
      prompt: request.prompt,
      n: 1,
      size: request.size || '1792x1024',
      style: request.style || 'vivid',
      quality: request.quality || 'standard',
    });

    return {
      url: response.data?.[0]?.url || '',
      revisedPrompt: response.data?.[0]?.revised_prompt || request.prompt,
    };
  } catch (error) {
    console.error('DALL-E API Error:', error);
    throw error;
  }
}

// Generate multiple images for a website
export async function generateWebsiteImages(
  businessName: string,
  industry: string,
  style: string,
  imageTypes: string[]
): Promise<{ type: string; image: GeneratedImage }[]> {
  const results: { type: string; image: GeneratedImage }[] = [];

  // Industry-specific image prompts
  const industryPrompts: Record<string, Record<string, string>> = {
    restaurant: {
      hero: `Professional food photography for ${businessName}, a ${style} restaurant. Beautiful plated dish with perfect lighting, shallow depth of field, warm and inviting atmosphere. No text or logos.`,
      about: `Elegant restaurant interior for ${businessName}, ${style} design aesthetic. Warm lighting, comfortable seating, sophisticated ambiance. No people, no text.`,
      gallery: `Delicious gourmet dish, professional food photography, ${style} presentation, perfect plating, appetizing colors. No text.`,
      team: `Professional chef in modern kitchen, ${style} aesthetic, clean and organized workspace, warm lighting. No text or logos.`,
    },
    'local-services': {
      hero: `Professional ${industry} service in action, ${style} and trustworthy aesthetic. Clean, high-quality, showing expertise. No text or logos.`,
      about: `Professional team at work, ${industry} service company, ${style} aesthetic. Clean uniforms, quality equipment, trustworthy appearance. No text.`,
      gallery: `Completed ${industry} project, before and after quality, ${style} aesthetic, professional results. No text.`,
      team: `Friendly professional service worker, ${style} aesthetic, approachable and trustworthy. No text or logos.`,
    },
    ecommerce: {
      hero: `Premium product showcase for ${businessName}, ${style} e-commerce aesthetic. Clean background, perfect lighting, luxury feel. No text.`,
      about: `Modern warehouse or studio space for ${businessName}, ${style} aesthetic. Clean, organized, professional. No text.`,
      gallery: `Product lifestyle photography, ${style} aesthetic, aspirational setting, premium quality feel. No text.`,
      team: `Modern creative workspace, ${style} aesthetic, stylish and professional environment. No people, no text.`,
    },
    professional: {
      hero: `Modern ${style} office environment for ${businessName}, professional and sophisticated. Clean lines, premium furniture, natural light. No text.`,
      about: `Professional meeting room or office space, ${style} aesthetic. Sophisticated, trustworthy, successful atmosphere. No people, no text.`,
      gallery: `Abstract professional background, ${style} aesthetic. Subtle patterns, premium feel, corporate sophistication. No text.`,
      team: `Professional headshot background, ${style} aesthetic. Clean, neutral, sophisticated. No people, no text.`,
    },
    'health-beauty': {
      hero: `Luxurious spa or salon interior for ${businessName}, ${style} aesthetic. Calming, premium, relaxing atmosphere. Soft lighting. No text.`,
      about: `Beauty treatment room or spa space, ${style} aesthetic. Clean, serene, professional equipment. No people, no text.`,
      gallery: `Beauty products or treatment setup, ${style} aesthetic. Premium, clean, appealing arrangement. No text.`,
      team: `Elegant salon or spa station, ${style} aesthetic. Professional tools, clean workspace, premium feel. No people, no text.`,
    },
    'real-estate': {
      hero: `Stunning luxury home exterior or interior for ${businessName}, ${style} aesthetic. Beautiful architecture, perfect lighting, aspirational. No text.`,
      about: `Beautiful living room or home interior, ${style} aesthetic. Staged perfectly, natural light, premium feel. No text.`,
      gallery: `Luxury property feature - pool, kitchen, or view, ${style} aesthetic. Aspirational, high-end, beautiful. No text.`,
      team: `Professional real estate office, ${style} aesthetic. Modern, sophisticated, trustworthy. No people, no text.`,
    },
    portfolio: {
      hero: `Creative workspace for ${businessName}, ${style} aesthetic. Artistic, inspiring, professional equipment. No text.`,
      about: `Artist or designer studio space, ${style} aesthetic. Creative tools, inspiring environment, professional. No text.`,
      gallery: `Abstract creative background, ${style} aesthetic. Artistic, unique, visually interesting. No text.`,
      team: `Creative professional workspace detail, ${style} aesthetic. Tools of the trade, artistic arrangement. No text.`,
    },
  };

  const normalizedIndustry = industry.toLowerCase().replace(/\s+/g, '-');
  const prompts = industryPrompts[normalizedIndustry] || industryPrompts['local-services'];

  for (const imageType of imageTypes) {
    const prompt = prompts[imageType] || prompts['hero'];
    
    try {
      const image = await generateImage({
        prompt,
        size: imageType === 'hero' ? '1792x1024' : '1024x1024',
        style: style.toLowerCase() === 'bold' ? 'vivid' : 'natural',
        quality: imageType === 'hero' ? 'hd' : 'standard',
      });
      
      results.push({ type: imageType, image });
    } catch (error) {
      console.error(`Failed to generate ${imageType} image:`, error);
    }
  }

  return results;
}

// Generate logo concept
export async function generateLogo(
  businessName: string,
  industry: string,
  style: string
): Promise<GeneratedImage> {
  const prompt = `Minimalist, professional logo design for "${businessName}", a ${industry} business. ${style} aesthetic. 
  Simple, memorable, scalable. Single icon or lettermark. 
  Clean white background, vector-style illustration. 
  No text, no words, just the symbol/icon.
  Modern, professional, timeless design.`;

  return generateImage({
    prompt,
    size: '1024x1024',
    style: 'natural',
    quality: 'hd',
  });
}

// Generate SEO content
export async function generateSEO(
  businessName: string,
  industry: string,
  description: string,
  location?: string
): Promise<SEOContent> {
  const prompt = `Generate SEO content for this business:
  
Business Name: ${businessName}
Industry: ${industry}
Description: ${description}
${location ? `Location: ${location}` : ''}

Return a JSON object with:
{
  "title": "SEO-optimized page title (50-60 chars)",
  "description": "Meta description (150-160 chars)",
  "keywords": ["keyword1", "keyword2", ...] (10-15 relevant keywords),
  "ogTitle": "Open Graph title for social sharing",
  "ogDescription": "Open Graph description for social sharing",
  "h1Suggestions": ["H1 option 1", "H1 option 2", "H1 option 3"],
  "contentSuggestions": ["Content idea 1", "Content idea 2", "Content idea 3"]
}

Return ONLY the JSON, no other text.`;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      response_format: { type: 'json_object' },
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No content in response');
    }

    return JSON.parse(content) as SEOContent;
  } catch (error) {
    console.error('OpenAI SEO Error:', error);
    
    // Return fallback SEO content
    return {
      title: `${businessName} - ${industry} Services`,
      description: description.slice(0, 160),
      keywords: [industry, businessName.toLowerCase(), 'services', 'professional'],
      ogTitle: `${businessName} | ${industry}`,
      ogDescription: description.slice(0, 200),
      h1Suggestions: [businessName, `Welcome to ${businessName}`, `${industry} Excellence`],
      contentSuggestions: ['About our services', 'Why choose us', 'Contact us today'],
    };
  }
}

// Quick content generation
export async function generateContent(
  type: 'tagline' | 'about' | 'services' | 'cta',
  businessName: string,
  industry: string,
  style: string
): Promise<string> {
  const prompts: Record<string, string> = {
    tagline: `Write a short, catchy tagline (max 8 words) for ${businessName}, a ${style} ${industry} business.`,
    about: `Write a 2-3 sentence about section for ${businessName}, a ${style} ${industry} business. Professional but approachable tone.`,
    services: `List 4-6 services offered by ${businessName}, a ${industry} business. Just the service names, one per line.`,
    cta: `Write a compelling call-to-action button text (2-4 words) for ${businessName}, a ${industry} business.`,
  };

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'user',
          content: prompts[type] + ' Return only the text, no quotes or explanations.',
        },
      ],
      max_tokens: 200,
    });

    return response.choices[0]?.message?.content?.trim() || '';
  } catch (error) {
    console.error('OpenAI Content Error:', error);
    return '';
  }
}

// Analyze customer feedback for revision
export async function analyzeFeedback(feedback: string): Promise<{
  changes: string[];
  priority: 'low' | 'medium' | 'high';
  sentiment: 'positive' | 'neutral' | 'negative';
  clarificationNeeded: boolean;
  suggestedQuestions: string[];
}> {
  const prompt = `Analyze this customer feedback about their website:

"${feedback}"

Return a JSON object:
{
  "changes": ["specific change 1", "specific change 2", ...],
  "priority": "low" | "medium" | "high",
  "sentiment": "positive" | "neutral" | "negative",
  "clarificationNeeded": true/false,
  "suggestedQuestions": ["question if clarification needed"]
}

Return ONLY the JSON.`;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      response_format: { type: 'json_object' },
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No content in response');
    }

    return JSON.parse(content);
  } catch (error) {
    console.error('OpenAI Feedback Analysis Error:', error);
    
    return {
      changes: [feedback],
      priority: 'medium',
      sentiment: 'neutral',
      clarificationNeeded: false,
      suggestedQuestions: [],
    };
  }
}

// Generate customer response
export async function generateResponse(
  context: 'status_update' | 'revision_complete' | 'clarification' | 'delivery',
  projectName: string,
  customerName: string,
  additionalInfo?: string
): Promise<string> {
  const templates: Record<string, string> = {
    status_update: `Write a brief, friendly status update email for ${customerName} about their project "${projectName}". Let them know it's in progress. ${additionalInfo || ''}`,
    revision_complete: `Write a brief email to ${customerName} letting them know the revisions for "${projectName}" are complete and ready for review. ${additionalInfo || ''}`,
    clarification: `Write a polite email to ${customerName} asking for clarification about their project "${projectName}". Question: ${additionalInfo}`,
    delivery: `Write a congratulatory email to ${customerName} about the delivery of their completed website "${projectName}". Include next steps. ${additionalInfo || ''}`,
  };

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You write professional but friendly business emails. Keep them concise (3-4 sentences max). Sign off as "The Verktorlabs Team".',
        },
        {
          role: 'user',
          content: templates[context],
        },
      ],
      max_tokens: 300,
    });

    return response.choices[0]?.message?.content?.trim() || '';
  } catch (error) {
    console.error('OpenAI Response Generation Error:', error);
    return '';
  }
}

export default {
  generateImage,
  generateWebsiteImages,
  generateLogo,
  generateSEO,
  generateContent,
  analyzeFeedback,
  generateResponse,
};
