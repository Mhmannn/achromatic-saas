import { NextResponse } from 'next/server';
import { sendTestEmail } from '@workspace/email/src/sendTestEmail';

export async function GET() {
  try {
    const to = process.env.TEST_EMAIL_TO ?? 'mhman@me.com'; // fallback
    const result = await sendTestEmail(to);
    return NextResponse.json({ success: true, result });
  } catch (error) {
    console.error('Error sending test email:', error);
    return NextResponse.json({ success: false, error });
  }
}

