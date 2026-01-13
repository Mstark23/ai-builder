import { Resend } from "resend";

let resend: Resend | null = null;

function getResend() {
  if (!resend) {
    const apiKey = process.env.RESEND_API_KEY;

    if (!apiKey) {
      throw new Error("RESEND_API_KEY is missing");
    }

    resend = new Resend(apiKey);
  }

  return resend;
}

export async function sendPreviewEmail({
  to,
  previewUrl,
}: {
  to: string;
  previewUrl: string;
}) {
  const resend = getResend();

  await resend.emails.send({
    from: "Vektor <no-reply@yourdomain.com>",
    to,
    subject: "Your website preview is ready",
    html: `
      <p>Your website preview is ready.</p>
      <p><a href="${previewUrl}">Open preview</a></p>
    `,
  });
}
