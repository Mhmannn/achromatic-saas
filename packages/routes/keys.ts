import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const keys = () =>
  createEnv({
    client: {
      NEXT_PUBLIC_DASHBOARD_URL: z.string().min(1).url(),
      NEXT_PUBLIC_MARKETING_URL: z.string().min(1).url(),
      // It's likely that you don't want to develop a public API when starting out.
      // The URL is optional, to ease deployment in case it's missing.
      NEXT_PUBLIC_PUBLIC_API_URL: z.string().optional().default('#')
    },
    runtimeEnv: {
      NEXT_PUBLIC_DASHBOARD_URL: process.env.NEXT_PUBLIC_DASHBOARD_URL,
      NEXT_PUBLIC_MARKETING_URL: process.env.NEXT_PUBLIC_MARKETING_URL,
      NEXT_PUBLIC_PUBLIC_API_URL: process.env.NEXT_PUBLIC_PUBLIC_API_URL
    }
  });
