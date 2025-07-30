import { getAuthOrganizationContext } from '@workspace/auth/context';
import { BillingProvider } from '@workspace/billing/provider';
import { prisma } from '@workspace/database/client';

export async function createBillingCustomer(
  ctx: Awaited<ReturnType<typeof getAuthOrganizationContext>>
) {
  const billingCustomerId = await BillingProvider.createCustomer({
    organizationId: ctx.organization.id,
    name: ctx.organization.name,
    email: ctx.organization.email || ctx.session.user.email
  });

  await prisma.organization.update({
    where: { id: ctx.organization.id },
    data: { billingCustomerId }
  });

  ctx.organization.billingCustomerId = billingCustomerId;
}
