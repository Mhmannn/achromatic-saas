import * as React from 'react';

import { InvoicesCard } from '~/components/organizations/slug/settings/organization/billing/invoices-card';
import { getInvoices } from '~/data/billing/get-invoices';

export default async function InvoicesPage(): Promise<React.JSX.Element> {
  const invoices = await getInvoices();
  return <InvoicesCard invoices={invoices} />;
}
