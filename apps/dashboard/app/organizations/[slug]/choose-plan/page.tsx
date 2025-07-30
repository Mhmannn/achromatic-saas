import * as React from 'react';
import { redirect } from 'next/navigation';

import { getAuthOrganizationContext } from '@workspace/auth/context';
import { createPurchasesHelper } from '@workspace/billing/helpers';
import { replaceOrgSlug, routes } from '@workspace/routes';

import { PlanSelection } from '~/components/organizations/slug/settings/organization/billing/plan-selection';

export default async function ChoosePlanPage(): Promise<React.JSX.Element> {
  const ctx = await getAuthOrganizationContext();
  const { hasPurchasedProduct } = createPurchasesHelper(ctx.organization);
  if (hasPurchasedProduct()) {
    return redirect(
      replaceOrgSlug(
        routes.dashboard.organizations.slug.settings.organization.Billing,
        ctx.organization.slug
      )
    );
  }
  return (
    <PlanSelection
      title="Choose your plan"
      backLink={routes.dashboard.organizations.Index}
    />
  );
}
