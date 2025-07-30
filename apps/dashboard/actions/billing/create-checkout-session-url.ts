'use server';

import { z } from 'zod';

import { billingConfig } from '@workspace/billing/config';
import { BillingProvider } from '@workspace/billing/provider';
import { PriceModel } from '@workspace/billing/schema';
import { countSeats } from '@workspace/billing/seats';
import { NotFoundError } from '@workspace/common/errors';
import { replaceOrgSlug, routes } from '@workspace/routes';

import { authOrganizationActionClient } from '~/actions/safe-action';
import { createBillingCustomer } from './_create-billing-customer';

export const createCheckoutSessionUrl = authOrganizationActionClient
  .metadata({ actionName: 'createCheckoutSessionUrl' })
  .inputSchema(
    z.object({
      productId: z.string(),
      planId: z.string()
    })
  )
  .action(async ({ parsedInput, ctx }) => {
    if (!ctx.organization.billingCustomerId) {
      await createBillingCustomer(ctx);
    }

    const product = billingConfig.products.find(
      (p) => p.id === parsedInput.productId
    );
    if (!product) {
      throw new NotFoundError('Product not found');
    }

    const plan = product.plans.find((p) => p.id === parsedInput.planId);
    if (!plan) {
      throw new NotFoundError('Plan not found');
    }

    const variantQuantities: Array<{
      quantity: number;
      variantId: string;
    }> = [];

    for (const price of plan.prices) {
      if (price.model === PriceModel.PerSeat) {
        const quantity = await countSeats(ctx.organization.id);
        const item = {
          quantity,
          variantId: price.id
        };
        variantQuantities.push(item);
      }
    }

    const session = await BillingProvider.createCheckoutSession({
      returnUrl: replaceOrgSlug(
        routes.dashboard.organizations.slug.settings.organization.Billing,
        ctx.organization.slug
      ),
      organizationId: ctx.organization.id,
      plan,
      customerId: ctx.organization.billingCustomerId!,
      customerEmail: ctx.organization.email ?? '',
      enableDiscounts: product.enableDiscounts,
      variantQuantities
    });

    return {
      url: session.url
    };
  });
