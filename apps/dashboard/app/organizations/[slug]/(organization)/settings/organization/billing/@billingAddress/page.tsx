import * as React from 'react';

import { BillingAddressCard } from '~/components/organizations/slug/settings/organization/billing/billing-address-card';
import { getBillingAddress } from '~/data/billing/get-billing-address';

export default async function BillingAddressPage(): Promise<React.JSX.Element> {
  const address = await getBillingAddress();
  return <BillingAddressCard address={address} />;
}
