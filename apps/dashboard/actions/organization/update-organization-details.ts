'use server';

import { revalidateTag } from 'next/cache';

import { BillingProvider } from '@workspace/billing/provider';
import { prisma } from '@workspace/database/client';

import { authOrganizationActionClient } from '~/actions/safe-action';
import { Caching, OrganizationCacheKey, UserCacheKey } from '~/data/caching';
import { updateOrganizationDetailsSchema } from '~/schemas/organization/update-organization-details-schema';

export const updateOrganizationDetails = authOrganizationActionClient
  .metadata({ actionName: 'updateOrganizationDetails' })
  .inputSchema(updateOrganizationDetailsSchema)
  .action(async ({ parsedInput, ctx }) => {
    await prisma.organization.update({
      where: { id: ctx.organization.id },
      data: {
        name: parsedInput.name,
        address: parsedInput.address,
        phone: parsedInput.phone,
        email: parsedInput.email,
        website: parsedInput.website
      },
      select: {
        id: true // SELECT NONE
      }
    });

    if (ctx.organization.name !== parsedInput.name) {
      if (ctx.organization.billingCustomerId) {
        try {
          await BillingProvider.updateCustomerName({
            customerId: ctx.organization.billingCustomerId,
            name: parsedInput.name
          });
        } catch (e) {
          console.error(e);
        }
      } else {
        console.warn('Billing customer ID is missing');
      }
    }

    for (const membership of ctx.organization.memberships) {
      revalidateTag(
        Caching.createUserTag(UserCacheKey.Organizations, membership.userId)
      );
    }

    revalidateTag(
      Caching.createOrganizationTag(
        OrganizationCacheKey.OrganizationDetails,
        ctx.organization.id
      )
    );
  });
