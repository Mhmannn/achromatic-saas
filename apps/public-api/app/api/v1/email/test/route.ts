// apps/public-api/app/api/v1/email/test/route.ts

import { NextResponse } from 'next/server';
import { Resend } from 'resend';

// Initialise Resend with API key from environment variables
const resend = new Resend(process.env.RESEND_API_KEY);

// POST handler for sending a test email
export async function POST() {
  try {
    // Debug logs for environment values
    console.log("FROM:", process.env.EMAIL_FROM);
    console.log("RESEND_API_KEY:", process.env.RESEND_API_KEY?.slice(0, 6)); // partial for safety

    // Send test email using Resend
    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM || 'onboarding@example.com',
      to: ['mhman@me.com'],
      subject: 'Resend API Test',
      html: '<p>🚀 This is a test email from the public-api route.</p>',
    });

    // If Resend API throws an error, handle it
    if (error) {
      console.error('Resend error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Successful response
    return NextResponse.json({ data });
  } catch (err: unknown) {
    // Type-safe error handling
    const error = err instanceof Error ? err : new Error('Unknown error');
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
