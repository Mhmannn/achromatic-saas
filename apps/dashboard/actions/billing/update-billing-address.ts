'use server';

import { revalidatePath } from 'next/cache';

import { BillingProvider } from '@workspace/billing/provider';
import { prisma } from '@workspace/database/client';
import { replaceOrgSlug, routes } from '@workspace/routes';

import { authOrganizationActionClient } from '~/actions/safe-action';
import { updateBillingAddressSchema } from '~/schemas/billing/update-billing-address-schema';
import { createBillingCustomer } from './_create-billing-customer';

export const updateBillingAddress = authOrganizationActionClient
  .metadata({ actionName: 'updateBillingAddress' })
  .inputSchema(updateBillingAddressSchema)
  .action(async ({ parsedInput, ctx }) => {
    if (!ctx.organization.billingCustomerId) {
      await createBillingCustomer(ctx);
    }

    await BillingProvider.updateCustomerAddress({
      customerId: ctx.organization.billingCustomerId!,
      address: {
        line1: parsedInput.line1,
        line2: parsedInput.line2,
        country: parsedInput.country,
        postalCode: parsedInput.postalCode,
        city: parsedInput.city,
        state: parsedInput.state
      }
    });

    await prisma.organization.update({
      where: { id: ctx.organization.id },
      data: {
        billingLine1: parsedInput.line1,
        billingLine2: parsedInput.line2,
        billingCountry: parsedInput.country,
        billingPostalCode: parsedInput.postalCode,
        billingCity: parsedInput.city,
        billingState: parsedInput.state
      },
      select: {
        id: true // SELECT NONE
      }
    });

    revalidatePath(
      replaceOrgSlug(
        routes.dashboard.organizations.slug.settings.organization.Billing,
        ctx.organization.slug
      )
    );
  });
