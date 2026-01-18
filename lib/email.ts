// lib/email.ts
// Email notification system using Resend

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM_EMAIL = process.env.FROM_EMAIL || 'Verktorlabs <noreply@verktorlabs.com>';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@verktorlabs.com';
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

type EmailTemplate = {
  to: string;
  subject: string;
  html: string;
};

// Send email via Resend API
export async function sendEmail({ to, subject, html }: EmailTemplate): Promise<boolean> {
  if (!RESEND_API_KEY) {
    console.log('📧 Email would be sent (RESEND_API_KEY not set):');
    console.log(`   To: ${to}`);
    console.log(`   Subject: ${subject}`);
    return true; // Return true for development
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [to],
        subject,
        html,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Email send failed:', error);
      return false;
    }

    console.log(`✅ Email sent to ${to}: ${subject}`);
    return true;
  } catch (error) {
    console.error('Email error:', error);
    return false;
  }
}

// Email wrapper styles
const emailWrapper = (content: string) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verktorlabs</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f5f5f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08);">
          <!-- Header -->
          <tr>
            <td style="background-color: #000000; padding: 30px 40px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 600; letter-spacing: 2px;">VERKTORLABS</h1>
            </td>
          </tr>
          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              ${content}
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background-color: #fafafa; padding: 30px 40px; text-align: center; border-top: 1px solid #eee;">
              <p style="margin: 0 0 10px; color: #888; font-size: 14px;">© 2024 Verktorlabs. All rights reserved.</p>
              <p style="margin: 0; color: #aaa; font-size: 12px;">
                <a href="${APP_URL}" style="color: #888; text-decoration: none;">Visit Website</a> · 
                <a href="mailto:support@verktorlabs.com" style="color: #888; text-decoration: none;">Contact Support</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

// Button component
const button = (text: string, url: string, color: string = '#000000') => `
  <a href="${url}" style="display: inline-block; background-color: ${color}; color: #ffffff; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; margin: 10px 0;">${text}</a>
`;

// ============================================
// EMAIL TEMPLATES
// ============================================

// 1. New Project Created (to Admin)
export async function sendNewProjectEmail(project: {
  id: string;
  business_name: string;
  industry: string;
  plan: string;
  customerName: string;
  customerEmail: string;
}) {
  const content = `
    <h2 style="margin: 0 0 20px; color: #000; font-size: 24px;">🎉 New Project Submitted!</h2>
    <p style="color: #444; font-size: 16px; line-height: 1.6; margin: 0 0 20px;">
      A new project has been submitted and is waiting in the queue.
    </p>
    
    <table style="width: 100%; background: #f8f8f8; border-radius: 12px; padding: 20px; margin: 20px 0;">
      <tr>
        <td style="padding: 8px 0; color: #888; font-size: 14px;">Business Name</td>
        <td style="padding: 8px 0; color: #000; font-size: 14px; font-weight: 600;">${project.business_name}</td>
      </tr>
      <tr>
        <td style="padding: 8px 0; color: #888; font-size: 14px;">Industry</td>
        <td style="padding: 8px 0; color: #000; font-size: 14px;">${project.industry}</td>
      </tr>
      <tr>
        <td style="padding: 8px 0; color: #888; font-size: 14px;">Plan</td>
        <td style="padding: 8px 0; color: #000; font-size: 14px; text-transform: capitalize;">${project.plan}</td>
      </tr>
      <tr>
        <td style="padding: 8px 0; color: #888; font-size: 14px;">Customer</td>
        <td style="padding: 8px 0; color: #000; font-size: 14px;">${project.customerName} (${project.customerEmail})</td>
      </tr>
    </table>
    
    <div style="text-align: center; margin-top: 30px;">
      ${button('View Project', `${APP_URL}/admin/projects/${project.id}`)}
    </div>
  `;

  return sendEmail({
    to: ADMIN_EMAIL,
    subject: `🆕 New Project: ${project.business_name}`,
    html: emailWrapper(content),
  });
}

// 2. Preview Ready (to Customer)
export async function sendPreviewReadyEmail(project: {
  id: string;
  business_name: string;
  customerName: string;
  customerEmail: string;
}) {
  const content = `
    <h2 style="margin: 0 0 20px; color: #000; font-size: 24px;">👁️ Your Website Preview is Ready!</h2>
    <p style="color: #444; font-size: 16px; line-height: 1.6; margin: 0 0 10px;">
      Hi ${project.customerName},
    </p>
    <p style="color: #444; font-size: 16px; line-height: 1.6; margin: 0 0 20px;">
      Great news! The preview for <strong>${project.business_name}</strong> is ready for your review.
    </p>
    
    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 12px; padding: 30px; text-align: center; margin: 20px 0;">
      <p style="color: #fff; font-size: 18px; margin: 0 0 20px;">Take a look at your new website!</p>
      ${button('View Preview', `${APP_URL}/portal/project/${project.id}`, '#ffffff')}
    </div>
    
    <p style="color: #666; font-size: 14px; line-height: 1.6; margin: 20px 0 0;">
      💡 <strong>Tip:</strong> You can request up to 2 free revisions if you'd like any changes.
    </p>
  `;

  return sendEmail({
    to: project.customerEmail,
    subject: `👁️ Your Website Preview is Ready - ${project.business_name}`,
    html: emailWrapper(content),
  });
}

// 3. Revision Requested (to Admin)
export async function sendRevisionRequestEmail(project: {
  id: string;
  business_name: string;
  customerName: string;
  feedback: string;
  revisionCount: number;
}) {
  const content = `
    <h2 style="margin: 0 0 20px; color: #000; font-size: 24px;">✏️ Revision Requested</h2>
    <p style="color: #444; font-size: 16px; line-height: 1.6; margin: 0 0 20px;">
      ${project.customerName} has requested changes to their project.
    </p>
    
    <table style="width: 100%; background: #f8f8f8; border-radius: 12px; padding: 20px; margin: 20px 0;">
      <tr>
        <td style="padding: 8px 0; color: #888; font-size: 14px;">Project</td>
        <td style="padding: 8px 0; color: #000; font-size: 14px; font-weight: 600;">${project.business_name}</td>
      </tr>
      <tr>
        <td style="padding: 8px 0; color: #888; font-size: 14px;">Revision #</td>
        <td style="padding: 8px 0; color: #000; font-size: 14px;">${project.revisionCount}</td>
      </tr>
    </table>
    
    <div style="background: #fff3cd; border-left: 4px solid #ffc107; padding: 20px; border-radius: 0 8px 8px 0; margin: 20px 0;">
      <p style="margin: 0 0 10px; color: #856404; font-weight: 600; font-size: 14px;">Customer Feedback:</p>
      <p style="margin: 0; color: #856404; font-size: 14px; line-height: 1.6;">${project.feedback}</p>
    </div>
    
    <div style="text-align: center; margin-top: 30px;">
      ${button('Apply Revisions with AI', `${APP_URL}/admin/projects/${project.id}/generate`)}
    </div>
  `;

  return sendEmail({
    to: ADMIN_EMAIL,
    subject: `✏️ Revision Request: ${project.business_name}`,
    html: emailWrapper(content),
  });
}

// 4. Payment Confirmed (to Customer)
export async function sendPaymentConfirmedEmail(project: {
  id: string;
  business_name: string;
  plan: string;
  amount: number;
  customerName: string;
  customerEmail: string;
}) {
  const content = `
    <h2 style="margin: 0 0 20px; color: #000; font-size: 24px;">🎉 Payment Confirmed!</h2>
    <p style="color: #444; font-size: 16px; line-height: 1.6; margin: 0 0 10px;">
      Hi ${project.customerName},
    </p>
    <p style="color: #444; font-size: 16px; line-height: 1.6; margin: 0 0 20px;">
      Thank you for your payment! Your website for <strong>${project.business_name}</strong> is now being prepared for delivery.
    </p>
    
    <div style="background: #d4edda; border-radius: 12px; padding: 25px; text-align: center; margin: 20px 0;">
      <p style="color: #155724; font-size: 14px; margin: 0 0 5px;">Amount Paid</p>
      <p style="color: #155724; font-size: 36px; font-weight: 700; margin: 0;">$${project.amount}</p>
      <p style="color: #155724; font-size: 14px; margin: 10px 0 0; text-transform: capitalize;">${project.plan} Plan</p>
    </div>
    
    <table style="width: 100%; background: #f8f8f8; border-radius: 12px; padding: 20px; margin: 20px 0;">
      <tr>
        <td style="padding: 8px 0; color: #888; font-size: 14px;">Project</td>
        <td style="padding: 8px 0; color: #000; font-size: 14px; font-weight: 600;">${project.business_name}</td>
      </tr>
      <tr>
        <td style="padding: 8px 0; color: #888; font-size: 14px;">Status</td>
        <td style="padding: 8px 0; color: #28a745; font-size: 14px; font-weight: 600;">✓ Paid</td>
      </tr>
    </table>
    
    <p style="color: #666; font-size: 14px; line-height: 1.6; margin: 20px 0;">
      <strong>What's next?</strong><br>
      Our team will prepare your website files and deliver them shortly. You'll receive another email when your website is ready for download.
    </p>
    
    <div style="text-align: center; margin-top: 30px;">
      ${button('View Your Website', `${APP_URL}/portal/project/${project.id}`)}
    </div>
  `;

  return sendEmail({
    to: project.customerEmail,
    subject: `🎉 Payment Confirmed - ${project.business_name}`,
    html: emailWrapper(content),
  });
}

// 5. Payment Received (to Admin)
export async function sendPaymentReceivedAdminEmail(project: {
  id: string;
  business_name: string;
  plan: string;
  amount: number;
  customerName: string;
  customerEmail: string;
}) {
  const content = `
    <h2 style="margin: 0 0 20px; color: #000; font-size: 24px;">💰 Payment Received!</h2>
    <p style="color: #444; font-size: 16px; line-height: 1.6; margin: 0 0 20px;">
      Great news! A payment has been received.
    </p>
    
    <div style="background: #d4edda; border-radius: 12px; padding: 25px; text-align: center; margin: 20px 0;">
      <p style="color: #155724; font-size: 36px; font-weight: 700; margin: 0;">+$${project.amount}</p>
    </div>
    
    <table style="width: 100%; background: #f8f8f8; border-radius: 12px; padding: 20px; margin: 20px 0;">
      <tr>
        <td style="padding: 8px 0; color: #888; font-size: 14px;">Project</td>
        <td style="padding: 8px 0; color: #000; font-size: 14px; font-weight: 600;">${project.business_name}</td>
      </tr>
      <tr>
        <td style="padding: 8px 0; color: #888; font-size: 14px;">Plan</td>
        <td style="padding: 8px 0; color: #000; font-size: 14px; text-transform: capitalize;">${project.plan}</td>
      </tr>
      <tr>
        <td style="padding: 8px 0; color: #888; font-size: 14px;">Customer</td>
        <td style="padding: 8px 0; color: #000; font-size: 14px;">${project.customerName}</td>
      </tr>
      <tr>
        <td style="padding: 8px 0; color: #888; font-size: 14px;">Email</td>
        <td style="padding: 8px 0; color: #000; font-size: 14px;">${project.customerEmail}</td>
      </tr>
    </table>
    
    <div style="text-align: center; margin-top: 30px;">
      ${button('View Project', `${APP_URL}/admin/projects/${project.id}`)}
    </div>
  `;

  return sendEmail({
    to: ADMIN_EMAIL,
    subject: `💰 Payment Received: $${project.amount} - ${project.business_name}`,
    html: emailWrapper(content),
  });
}

// 6. Project Delivered (to Customer)
export async function sendProjectDeliveredEmail(project: {
  id: string;
  business_name: string;
  customerName: string;
  customerEmail: string;
  downloadUrl?: string;
}) {
  const content = `
    <h2 style="margin: 0 0 20px; color: #000; font-size: 24px;">🚀 Your Website is Ready!</h2>
    <p style="color: #444; font-size: 16px; line-height: 1.6; margin: 0 0 10px;">
      Hi ${project.customerName},
    </p>
    <p style="color: #444; font-size: 16px; line-height: 1.6; margin: 0 0 20px;">
      Congratulations! Your website for <strong>${project.business_name}</strong> has been completed and is ready for you.
    </p>
    
    <div style="background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%); border-radius: 12px; padding: 30px; text-align: center; margin: 20px 0;">
      <p style="color: #fff; font-size: 48px; margin: 0 0 10px;">🎉</p>
      <p style="color: #fff; font-size: 20px; font-weight: 600; margin: 0;">Project Delivered!</p>
    </div>
    
    <p style="color: #666; font-size: 14px; line-height: 1.6; margin: 20px 0;">
      <strong>What's included:</strong>
    </p>
    <ul style="color: #666; font-size: 14px; line-height: 1.8; margin: 0 0 20px; padding-left: 20px;">
      <li>Complete website files (HTML, CSS, JS)</li>
      <li>All images and assets</li>
      <li>Mobile-responsive design</li>
      <li>SEO-optimized structure</li>
    </ul>
    
    <div style="text-align: center; margin-top: 30px;">
      ${button('Access Your Website', `${APP_URL}/portal/project/${project.id}`)}
    </div>
    
    <p style="color: #888; font-size: 13px; line-height: 1.6; margin: 30px 0 0; text-align: center;">
      Thank you for choosing Verktorlabs! If you need any help, feel free to reach out.
    </p>
  `;

  return sendEmail({
    to: project.customerEmail,
    subject: `🚀 Your Website is Ready - ${project.business_name}`,
    html: emailWrapper(content),
  });
}

// Export all functions
export default {
  sendEmail,
  sendNewProjectEmail,
  sendPreviewReadyEmail,
  sendRevisionRequestEmail,
  sendPaymentConfirmedEmail,
  sendPaymentReceivedAdminEmail,
  sendProjectDeliveredEmail,
};