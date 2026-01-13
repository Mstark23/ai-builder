import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

type GenerateWebsiteParams = {
  projectId: string;
};

export async function generateWebsiteHTML({
  projectId,
}: GenerateWebsiteParams): Promise<string> {
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error("Missing ANTHROPIC_API_KEY");
  }

  const prompt = `
You are an expert web designer.

Generate a clean, modern, professional one-page website in pure HTML + CSS.

Rules:
- Return ONLY valid HTML
- Use inline <style>
- Modern SaaS look
- Sections: Hero, About, Services, Contact
- Mobile responsive
- No external assets
- Project ID: ${projectId}
`;

  const response = await anthropic.messages.create({
    model: "claude-3-5-sonnet-20240620",
    max_tokens: 4000,
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
  });

  // ✅ Correct, type-safe extraction
  const html = response.content
    .filter((block) => block.type === "text")
    .map((block) => block.text)
    .join("");

  if (!html) {
    throw new Error("Claude returned empty HTML");
  }

  return html;
}
