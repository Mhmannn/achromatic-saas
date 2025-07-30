import 'server-only';

import { getAuthOrganizationContext } from '@workspace/auth/context';
import { prisma } from '@workspace/database/client';

import type { OrderDto } from '~/types/dtos/order-dto';

export async function getOrder(): Promise<OrderDto | undefined> {
  const ctx = await getAuthOrganizationContext();
  const order = await prisma.order.findFirst({
    where: { organizationId: ctx.organization.id },
    include: { items: true }
  });

  if (!order) {
    return undefined;
  }

  const response: OrderDto = {
    id: order.id,
    status: order.status,
    provider: order.provider,
    currency: order.currency,
    items: order.items.map((item) => ({
      id: item.id,
      quantity: item.quantity,
      productId: item.productId,
      variantId: item.variantId,
      priceAmount: item.priceAmount ?? undefined,
      type: item.type ?? undefined,
      model: item.model ?? undefined
    }))
  };

  return response;
}
