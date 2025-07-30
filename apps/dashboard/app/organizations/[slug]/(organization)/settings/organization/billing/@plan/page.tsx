import * as React from 'react';

import { PlanDetails } from '~/components/organizations/slug/settings/organization/billing/plan-details';
import { getOrder } from '~/data/billing/get-order';
import { getSubscription } from '~/data/billing/get-subscription';

export default async function PlanPage(): Promise<React.JSX.Element> {
  const subscription = await getSubscription();
  const order = await getOrder();
  return (
    <PlanDetails
      subscription={subscription}
      order={order}
    />
  );
}
