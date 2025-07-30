import { createEnv } from '@t3-oss/env-nextjs';

import { keys as analytics } from '@workspace/analytics/keys';
import { keys as auth } from '@workspace/auth/keys';
import { keys as billing } from '@workspace/billing/keys';
import { keys as database } from '@workspace/database/keys';
import { keys as email } from '@workspace/email/keys';
import { keys as monitoring } from '@workspace/monitoring/keys';
import { keys as routes } from '@workspace/routes/keys';

export const env = createEnv({
  extends: [
    analytics(),
    auth(),
    billing(),
    database(),
    email(),
    monitoring(),
    routes()
  ],
  server: {},
  client: {},
  runtimeEnv: {}
});
