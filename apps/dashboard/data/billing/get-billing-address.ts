import 'server-only';

import { getAuthOrganizationContext } from '@workspace/auth/context';
import { prisma } from '@workspace/database/client';

import type { BillingAddressDto } from '~/types/dtos/billing-address-dto';

export async function getBillingAddress(): Promise<BillingAddressDto> {
  const ctx = await getAuthOrganizationContext();
  const organization = await prisma.organization.findFirstOrThrow({
    where: { id: ctx.organization.id },
    select: {
      billingLine1: true,
      billingLine2: true,
      billingCity: true,
      billingPostalCode: true,
      billingState: true,
      billingCountry: true
    }
  });

  const response: BillingAddressDto = {
    line1: organization?.billingLine1 ?? undefined,
    line2: organization?.billingLine2 ?? undefined,
    city: organization?.billingCity ?? undefined,
    postalCode: organization?.billingPostalCode ?? undefined,
    state: organization?.billingState ?? undefined,
    country: organization?.billingCountry ?? undefined
  };

  return response;
}
