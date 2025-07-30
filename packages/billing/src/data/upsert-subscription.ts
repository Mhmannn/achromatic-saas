import { prisma } from '@workspace/database/client';

import type { UpsertSubscription } from '../provider/types';

export async function upsertSubscription(
  subscription: UpsertSubscription
): Promise<void> {
  if (!subscription.organizationId) {
    const organization = await prisma.organization.findFirst({
      where: { billingCustomerId: subscription.customerId },
      select: {
        id: true
      }
    });
    if (!organization) {
      throw new Error('Billing customer not found');
    }
    subscription.organizationId = organization.id;
  }

  await prisma.subscription.upsert({
    where: { id: subscription.subscriptionId },
    create: {
      id: subscription.subscriptionId,
      organizationId: subscription.organizationId,
      status: subscription.status,
      active: subscription.active,
      provider: subscription.provider,
      cancelAtPeriodEnd: subscription.cancelAtPeriodEnd,
      currency: subscription.currency,
      periodStartsAt: subscription.periodStartsAt,
      periodEndsAt: subscription.periodEndsAt,
      trialEndsAt: subscription.trialEndsAt,
      trialStartsAt: subscription.trialStartsAt,
      items: {
        connectOrCreate: subscription.items.map((item) => ({
          where: { id: item.subscriptionItemId },
          create: {
            id: item.subscriptionItemId,
            quantity: item.quantity,
            productId: item.productId,
            variantId: item.variantId,
            priceAmount: item.priceAmount,
            interval: item.interval,
            intervalCount: item.intervalCount,
            type: item.type,
            model: item.model
          }
        }))
      }
    },
    update: {
      status: subscription.status,
      active: subscription.active,
      provider: subscription.provider,
      cancelAtPeriodEnd: subscription.cancelAtPeriodEnd,
      currency: subscription.currency,
      periodStartsAt: subscription.periodStartsAt,
      periodEndsAt: subscription.periodEndsAt,
      trialEndsAt: subscription.trialEndsAt,
      trialStartsAt: subscription.trialStartsAt,
      items: {
        connectOrCreate: subscription.items.map((item) => ({
          where: { id: item.subscriptionItemId },
          create: {
            id: item.subscriptionItemId,
            quantity: item.quantity,
            productId: item.productId,
            variantId: item.variantId,
            priceAmount: item.priceAmount,
            interval: item.interval,
            intervalCount: item.intervalCount,
            type: item.type,
            model: item.model
          }
        }))
      }
    },
    select: {
      id: true // SELECT NONE
    }
  });
}
