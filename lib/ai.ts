import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function generateWebsiteHTML(input: {
  businessName: string;
  industry: string;
  style: string;
}) {
  const prompt = `
Generate a COMPLETE HTML website.
Return ONLY raw HTML.
No markdown.
No explanations.

Business: ${input.businessName}
Industry: ${input.industry}
Style: ${input.style}

Include:
- Hero section
- Services
- About
- CTA
- Footer
`;

  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.7,
  });

  return response.choices[0].message.content || '';
}
