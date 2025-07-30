'use server';

import { revalidateTag } from 'next/cache';

import { prisma } from '@workspace/database/client';

import { authOrganizationActionClient } from '~/actions/safe-action';
import { Caching, OrganizationCacheKey } from '~/data/caching';
import { deleteContactsSchema } from '~/schemas/contacts/delete-contacts-schema';

export const deleteContacts = authOrganizationActionClient
  .metadata({ actionName: 'deleteContacts' })
  .inputSchema(deleteContactsSchema)
  .action(async ({ parsedInput, ctx }) => {
    const contactIdsToDelete = parsedInput.ids;
    const organizationId = ctx.organization.id;

    await prisma.$transaction(async (tx) => {
      await tx.contactImage.deleteMany({
        where: {
          contactId: {
            in: contactIdsToDelete
          }
        }
      });

      await tx.contact.deleteMany({
        where: {
          id: {
            in: contactIdsToDelete
          },
          organizationId: organizationId
        }
      });
    });

    revalidateTag(
      Caching.createOrganizationTag(
        OrganizationCacheKey.Contacts,
        organizationId
      )
    );

    for (const id of parsedInput.ids) {
      revalidateTag(
        Caching.createOrganizationTag(OrganizationCacheKey.Contact, id)
      );
    }

    for (const membership of ctx.organization.memberships) {
      revalidateTag(
        Caching.createOrganizationTag(
          OrganizationCacheKey.Favorites,
          organizationId,
          membership.userId
        )
      );
    }
  });
