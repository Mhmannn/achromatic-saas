import * as React from 'react';

import { BillingEmailCard } from '~/components/organizations/slug/settings/organization/billing/billing-email-card';
import { getBillingEmail } from '~/data/billing/get-billing-email';

export default async function BillingEmailPage(): Promise<React.JSX.Element> {
  const email = await getBillingEmail();
  return <BillingEmailCard email={email} />;
}
