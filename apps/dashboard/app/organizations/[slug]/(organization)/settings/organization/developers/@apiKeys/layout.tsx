import * as React from 'react';

import { baseUrl } from '@workspace/routes';
import { AnnotatedSection } from '@workspace/ui/components/annotated';

export default function ApiKeysLayout({
  children
}: React.PropsWithChildren): React.JSX.Element {
  return (
    <AnnotatedSection
      title="API keys"
      description="These keys allow other apps to control resources of your organization. Be careful!"
      docLink={baseUrl.PublicApi}
    >
      {children}
    </AnnotatedSection>
  );
}
