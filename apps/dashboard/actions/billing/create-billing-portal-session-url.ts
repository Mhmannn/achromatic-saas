'use server';

import { BillingProvider } from '@workspace/billing/provider';
import { replaceOrgSlug, routes } from '@workspace/routes';

import { authOrganizationActionClient } from '~/actions/safe-action';
import { createBillingCustomer } from './_create-billing-customer';

export const createBillingPortalSessionUrl = authOrganizationActionClient
  .metadata({ actionName: 'createBillingPortalSessionUrl' })
  .action(async ({ ctx }) => {
    if (!ctx.organization.billingCustomerId) {
      await createBillingCustomer(ctx);
    }

    const session = await BillingProvider.createBillingPortalSession({
      returnUrl: `${replaceOrgSlug(routes.dashboard.organizations.slug.settings.organization.Billing, ctx.organization.slug)}`,
      customerId: ctx.organization.billingCustomerId!
    });

    return { url: session.url };
  });
