import { createEnv } from '@t3-oss/env-nextjs';

import { keys as analytics } from '@workspace/analytics/keys';
import { keys as routes } from '@workspace/routes/keys';

export const env = createEnv({
  extends: [analytics(), routes()],
  server: {},
  client: {},
  runtimeEnv: {}
});
