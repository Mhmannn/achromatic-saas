import { prisma } from '@workspace/database/client';

import type { UpsertCustomer } from '../provider/types';

// We keep the billing customer in the organization.
// Upsert means we just update the properties.

export async function upsertCustomer(customer: UpsertCustomer): Promise<void> {
  if (!customer.organizationId) {
    const organization = await prisma.organization.findFirst({
      where: { billingCustomerId: customer.customerId },
      select: {
        id: true
      }
    });
    if (!organization) {
      throw new Error('Billing customer not found');
    }
    customer.organizationId = organization.id;
  }

  await prisma.organization.updateMany({
    where: { id: customer.organizationId },
    data: {
      billingCustomerId: customer.customerId,
      billingEmail: customer.email,
      billingLine1: customer.line1,
      billingLine2: customer.line2,
      billingCity: customer.city,
      billingPostalCode: customer.postalCode,
      billingCountry: customer.country,
      billingState: customer.state
    }
  });
}
