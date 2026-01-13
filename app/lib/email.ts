import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

type SendPreviewEmailParams = {
  to: string;
  projectId: string;
  previewUrl: string;
};

export async function sendPreviewEmail({
  to,
  projectId,
  previewUrl,
}: SendPreviewEmailParams) {
  if (!process.env.RESEND_API_KEY) {
    throw new Error("Missing RESEND_API_KEY");
  }

  await resend.emails.send({
    from: "AI Builder <onboarding@resend.dev>",
    to,
    subject: "Your website preview is ready 🚀",
    html: `
      <h2>Your website preview is ready</h2>
      <p>Your project <strong>${projectId}</strong> is now in progress.</p>
      <p>Preview your website:</p>
      <p><a href="${previewUrl}" target="_blank">${previewUrl}</a></p>
      <p>We’ll notify you once it’s fully delivered.</p>
    `,
  });
}

type SendDeliveredEmailParams = {
  to: string;
  projectId: string;
  previewUrl: string;
};

export async function sendDeliveredEmail({
  to,
  projectId,
  previewUrl,
}: SendDeliveredEmailParams) {
  if (!process.env.RESEND_API_KEY) {
    throw new Error("Missing RESEND_API_KEY");
  }

  await resend.emails.send({
    from: "AI Builder <onboarding@resend.dev>",
    to,
    subject: "Your website is delivered 🎉",
    html: `
      <h2>Your website is delivered</h2>
      <p>Your project <strong>${projectId}</strong> has been completed.</p>
      <p>Final preview:</p>
      <p><a href="${previewUrl}" target="_blank">${previewUrl}</a></p>
      <p>This preview is now locked as final.</p>
      <p>Thank you for using AI Builder.</p>
    `,
  });
}
