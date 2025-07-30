import { createSwaggerSpec } from 'next-swagger-doc';

import { APP_NAME } from '@workspace/common/app';

export const getApiDocs = async () => {
  const spec = createSwaggerSpec({
    apiFolder: 'app',
    definition: {
      openapi: '3.0.0',
      info: {
        title: `${APP_NAME} API Reference`,
        version: '1.0',
        description:
          'Click "Authorize", enter your API key, then select "Organization" to get started with the API.'
      },
      components: {
        securitySchemes: {
          ApiKeyAuth: {
            type: 'apiKey',
            in: 'header',
            name: 'X-API-Key'
          }
        }
      },
      security: [
        {
          ApiKeyAuth: []
        }
      ]
    }
  });
  return spec;
};
