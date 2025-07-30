import { prisma } from '@workspace/database/client';

import { BillingProvider } from './provider';
import { PriceModel } from './schema';

export async function countSeats(organizationId: string): Promise<number> {
  return await prisma.membership.count({
    where: { organizationId }
  });
}

export async function adjustSeats(organizationId: string): Promise<void> {
  const subscription = await prisma.subscription.findFirst({
    where: { organizationId },
    select: {
      id: true,
      items: {
        select: {
          id: true,
          model: true
        }
      }
    }
  });
  if (!subscription) {
    return;
  }

  const subscriptionItems = subscription.items.filter(
    (item) => item.model === PriceModel.PerSeat
  );
  if (!subscriptionItems.length) {
    return;
  }

  const quantity = await countSeats(organizationId);
  try {
    const promises = subscriptionItems.map((item) => {
      return BillingProvider.updateSubscriptionItemQuantity({
        subscriptionId: subscription.id,
        subscriptionItemId: item.id,
        quantity
      });
    });
    await Promise.all(promises);
  } catch (error) {
    console.error(
      `Failed to update subscription quantities for organization ${organizationId}:`,
      error
    );
    throw new Error(
      'Failed to update subscription quantities. Please try again later.'
    );
  }
}
