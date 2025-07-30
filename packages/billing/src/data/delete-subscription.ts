import { prisma } from '@workspace/database/client';

export async function deleteSubscription(
  subscriptionId: string
): Promise<void> {
  await prisma.subscription.delete({
    where: { id: subscriptionId },
    select: {
      id: true // SELECT NONE
    }
  });
}
