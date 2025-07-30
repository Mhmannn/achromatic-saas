'use server';

import { revalidatePath } from 'next/cache';

import { BillingProvider } from '@workspace/billing/provider';
import { prisma } from '@workspace/database/client';
import { replaceOrgSlug, routes } from '@workspace/routes';

import { authOrganizationActionClient } from '~/actions/safe-action';
import { updateBillingEmailSchema } from '~/schemas/billing/update-billing-email-schema';
import { createBillingCustomer } from './_create-billing-customer';

export const updateBillingEmail = authOrganizationActionClient
  .metadata({ actionName: 'updateBillingEmail' })
  .inputSchema(updateBillingEmailSchema)
  .action(async ({ parsedInput, ctx }) => {
    if (!ctx.organization.billingCustomerId) {
      await createBillingCustomer(ctx);
    }

    await BillingProvider.updateCustomerEmail({
      customerId: ctx.organization.billingCustomerId!,
      email: parsedInput.email!
    });

    await prisma.organization.update({
      where: { id: ctx.organization.id },
      data: { billingEmail: parsedInput.email },
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
