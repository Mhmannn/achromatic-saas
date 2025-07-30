import 'server-only';

import { getAuthOrganizationContext } from '@workspace/auth/context';
import { prisma } from '@workspace/database/client';

export async function getBillingEmail(): Promise<string> {
  const ctx = await getAuthOrganizationContext();
  const customer = await prisma.organization.findFirstOrThrow({
    where: { id: ctx.organization.id },
    select: { billingEmail: true }
  });

  return customer?.billingEmail ?? '';
}
