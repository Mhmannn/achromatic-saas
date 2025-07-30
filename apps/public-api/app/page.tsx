import 'swagger-ui-react/swagger-ui.css';

import * as React from 'react';
import SwaggerUI from 'swagger-ui-react';

import { getApiDocs } from '~/lib/swagger';

export default async function IndexPage(): Promise<React.JSX.Element> {
  const spec = await getApiDocs();
  return (
    <section className="container">
      <SwaggerUI spec={spec} />;
    </section>
  );
}
