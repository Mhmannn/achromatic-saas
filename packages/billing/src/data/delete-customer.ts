import { prisma } from '@workspace/database/client';

// We keep the billing customer in the organization.
// Deleting means we just null the information.

export async function deleteCustomer(customerId: string): Promise<void> {
  if (customerId) {
    await prisma.organization.updateMany({
      where: { billingCustomerId: customerId },
      data: {
        billingCustomerId: null,
        billingEmail: null,
        billingLine1: null,
        billingLine2: null,
        billingCity: null,
        billingPostalCode: null,
        billingCountry: null,
        billingState: null
      }
    });
  }
}
