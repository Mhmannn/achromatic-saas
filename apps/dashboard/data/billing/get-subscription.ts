import 'server-only';

import { getAuthOrganizationContext } from '@workspace/auth/context';
import { getProductPricePair } from '@workspace/billing/helpers';
import { BillingProvider } from '@workspace/billing/provider';
import { prisma } from '@workspace/database/client';

import type { SubscriptionDto } from '~/types/dtos/subscription-dto';

export async function getSubscription(): Promise<SubscriptionDto | undefined> {
  const ctx = await getAuthOrganizationContext();
  const subscription = await prisma.subscription.findFirst({
    where: { organizationId: ctx.organization.id },
    include: { items: true }
  });

  if (!subscription) {
    return undefined;
  }

  const response: SubscriptionDto = {
    id: subscription.id,
    status: subscription.status,
    active: subscription.active,
    provider: subscription.provider,
    cancelAtPeriodEnd: subscription.cancelAtPeriodEnd,
    currency: subscription.currency,
    periodStartsAt: subscription.periodStartsAt,
    periodEndsAt: subscription.periodEndsAt,
    trialStartsAt: subscription.trialStartsAt ?? undefined,
    trialEndsAt: subscription.trialEndsAt ?? undefined,
    items: subscription.items.map((item) => ({
      id: item.id,
      quantity: item.quantity,
      productId: item.productId,
      variantId: item.variantId,
      priceAmount: item.priceAmount ?? undefined,
      interval: item.interval,
      intervalCount: item.intervalCount,
      type: item.type ?? undefined,
      model: item.model ?? undefined
    }))
  };

  if (ctx.organization.billingCustomerId) {
    for (const item of response.items) {
      const { price } = getProductPricePair(item.variantId);
      if (price && price.meter && price.meter.id) {
        item.meteredUnit = price.meter.unit;
        item.meteredUsage = await BillingProvider.getMeteredUsage({
          meterId: price.meter.id,
          customerId: ctx.organization.billingCustomerId,
          startsAt: subscription.periodStartsAt,
          endsAt: subscription.periodEndsAt
        });
      }
    }
  }

  return response;
}
