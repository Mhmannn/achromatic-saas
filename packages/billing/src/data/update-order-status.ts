import { prisma } from '@workspace/database/client';

export async function updateOrderStatus(
  id: string,
  status: 'succeeded' | 'failed'
) {
  await prisma.order.update({
    where: { id },
    data: { status },
    select: {
      id: true // SELECT NONE
    }
  });
}
