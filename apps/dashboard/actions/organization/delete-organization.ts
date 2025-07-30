'use server';

import { revalidateTag } from 'next/cache';

import { isOrganizationOwner } from '@workspace/auth/permissions';
import { BillingProvider } from '@workspace/billing/provider';
import { ForbiddenError } from '@workspace/common/errors';
import { prisma } from '@workspace/database/client';

import { authOrganizationActionClient } from '~/actions/safe-action';
import { Caching, UserCacheKey } from '~/data/caching';

export const deleteOrganization = authOrganizationActionClient
  .metadata({ actionName: 'deleteOrganization' })
  .action(async ({ ctx }) => {
    const currentUserIsOwner = await isOrganizationOwner(
      ctx.session.user.id,
      ctx.organization.id
    );
    if (!currentUserIsOwner) {
      throw new ForbiddenError('Only owners can delete an organization.');
    }

    await prisma.$transaction([
      prisma.membership.deleteMany({
        where: { organizationId: ctx.organization.id }
      }),
      prisma.organization.deleteMany({
        where: { id: ctx.organization.id }
      }),
      prisma.organizationLogo.deleteMany({
        where: { organizationId: ctx.organization.id }
      })
    ]);

    for (const membership of ctx.organization.memberships) {
      revalidateTag(
        Caching.createUserTag(UserCacheKey.Organizations, membership.userId)
      );
      revalidateTag(
        Caching.createUserTag(UserCacheKey.Profile, membership.userId)
      );
    }

    if (ctx.organization.billingCustomerId) {
      for (const subscription of ctx.organization.subscriptions) {
        try {
          await BillingProvider.cancelSubscription({
            subscriptionId: subscription.id
          });
        } catch (e) {
          console.error(e);
        }
      }
      try {
        await BillingProvider.deleteCustomer({
          customerId: ctx.organization.billingCustomerId
        });
      } catch (e) {
        console.error(e);
      }
    }
  });
