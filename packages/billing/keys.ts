import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const keys = () =>
  createEnv({
    client: {
      NEXT_PUBLIC_BILLING_PRICE_PRO_MONTH_ID: z.string().optional(),
      NEXT_PUBLIC_BILLING_PRICE_PRO_YEAR_ID: z.string().optional(),
      NEXT_PUBLIC_BILLING_PRICE_LIFETIME_ID: z.string().optional(),
      NEXT_PUBLIC_BILLING_PRICE_ENTERPRISE_MONTH_ID: z.string().optional(),
      NEXT_PUBLIC_BILLING_PRICE_ENTERPRISE_YEAR_ID: z.string().optional()
    },
    server: {
      BILLING_STRIPE_SECRET_KEY: z.string().optional(),
      BILLING_STRIPE_WEBHOOK_SECRET: z.string().optional()
    },
    runtimeEnv: {
      NEXT_PUBLIC_BILLING_PRICE_PRO_MONTH_ID:
        process.env.NEXT_PUBLIC_BILLING_PRICE_PRO_MONTH_ID,
      NEXT_PUBLIC_BILLING_PRICE_PRO_YEAR_ID:
        process.env.NEXT_PUBLIC_BILLING_PRICE_PRO_YEAR_ID,
      NEXT_PUBLIC_BILLING_PRICE_LIFETIME_ID:
        process.env.NEXT_PUBLIC_BILLING_PRICE_LIFETIME_ID,
      NEXT_PUBLIC_BILLING_PRICE_ENTERPRISE_MONTH_ID:
        process.env.NEXT_PUBLIC_BILLING_PRICE_ENTERPRISE_MONTH_ID,
      NEXT_PUBLIC_BILLING_PRICE_ENTERPRISE_YEAR_ID:
        process.env.NEXT_PUBLIC_BILLING_PRICE_ENTERPRISE_YEAR_ID,
      BILLING_STRIPE_SECRET_KEY: process.env.BILLING_STRIPE_SECRET_KEY,
      BILLING_STRIPE_WEBHOOK_SECRET: process.env.BILLING_STRIPE_WEBHOOK_SECRET
    }
  });
