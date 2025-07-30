import { prisma } from '@workspace/database/client';

import { withAuth } from '~/lib/with-auth';

/**
 * @swagger
 * /organization:
 *   get:
 *     summary: Get organization details
 *     description: Returns the organization associated with the API key.
 *     tags:
 *       - Organization
 *     security:
 *       - ApiKeyAuth: []
 *     responses:
 *       200:
 *         description: Organization details retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 name:
 *                   type: string
 *                   example: "Acme Corp"
 *                 address:
 *                   type: string
 *                   example: "123 Business Street"
 *                 phone:
 *                   type: string
 *                   example: "+1-234-567-890"
 *                 email:
 *                   type: string
 *                   format: email
 *                   example: "contact@acme.com"
 *                 website:
 *                   type: string
 *                   format: uri
 *                   example: "https://acme.com"
 *       401:
 *         description: Unauthorized. API key is missing or invalid.
 *       404:
 *         description: Organization not found.
 */
export const GET = withAuth(async function (_req, ctx) {
  const organization = await prisma.organization.findFirst({
    where: { id: ctx.organization.id },
    select: {
      name: true,
      address: true,
      phone: true,
      email: true,
      website: true
    }
  });

  if (!organization) {
    return new Response(JSON.stringify({ error: 'Organization not found' }), {
      status: 404,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  return new Response(JSON.stringify(organization), {
    status: 200,
    headers: {
      'Content-Type': 'application/json'
    }
  });
});
