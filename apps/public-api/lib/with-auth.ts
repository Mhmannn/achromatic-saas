import { type NextRequest } from 'next/server';

import { verifyApiKey } from '@workspace/api-keys/verify-api-key';

type Handler = (
  req: NextRequest,
  context: {
    params: Promise<Record<string, string | Array<string> | undefined>>;
    organization: { id: string };
  }
) => Promise<Response>;

export function withAuth(handler: Handler): Handler {
  return async (req, ctx) => {
    const apiKey = req.headers.get('X-API-Key');
    const result = await verifyApiKey(apiKey);

    if (!result.success) {
      return new Response(
        JSON.stringify({
          error: 'Unauthorized. API key is missing or invalid.'
        }),
        {
          status: 401,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
    }

    const enrichedCtx = {
      ...ctx,
      organization: { id: result.organizationId }
    };

    return handler(req, enrichedCtx);
  };
}
