import { resend } from './client';

export async function sendTestEmail(to: string) {
  return await resend.emails.send({
    from: 'onboarding@resend.dev',
    to,
    subject: 'Test Email',
    html: `<p>This is a test email sent from Resend via your app.</p>`,
  });
}
