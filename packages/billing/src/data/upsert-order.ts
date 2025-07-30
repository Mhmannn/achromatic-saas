import { prisma } from '@workspace/database/client';

import type { UpsertOrder } from '../provider/types';

export async function upsertOrder(order: UpsertOrder): Promise<void> {
  if (!order.organizationId) {
    const organization = await prisma.organization.findFirst({
      where: { billingCustomerId: order.customerId },
      select: { id: true }
    });
    if (!organization) {
      throw new Error(
        `Billing customer not found for customerId: ${order.customerId}`
      );
    }
    order.organizationId = organization.id;
  }

  // Extract common items configuration to reduce duplication
  const itemsConfig = {
    connectOrCreate: order.items.map((item) => ({
      where: { id: item.orderItemId },
      create: {
        id: item.orderItemId,
        quantity: item.quantity,
        productId: item.productId,
        variantId: item.variantId,
        priceAmount: item.priceAmount,
        type: item.type,
        model: item.model
      }
    }))
  };

  await prisma.order.upsert({
    where: { id: order.orderId },
    create: {
      id: order.orderId,
      organizationId: order.organizationId,
      status: order.status,
      provider: order.provider,
      currency: order.currency,
      totalAmount: order.totalAmount,
      items: itemsConfig
    },
    update: {
      status: order.status,
      provider: order.provider,
      currency: order.currency,
      totalAmount: order.totalAmount,
      items: itemsConfig
    },
    select: {
      id: true // SELECT NONE
    }
  });
}
