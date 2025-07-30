import 'server-only';

import { getAuthOrganizationContext } from '@workspace/auth/context';
import { BillingProvider } from '@workspace/billing/provider';

import type { InvoiceDto } from '~/types/dtos/invoice-dto';

export async function getInvoices(): Promise<InvoiceDto[]> {
  const ctx = await getAuthOrganizationContext();
  if (!ctx.organization.billingCustomerId) {
    return [];
  }

  const invoices = await BillingProvider.getInvoices({
    customerId: ctx.organization.billingCustomerId
  });

  const response: InvoiceDto[] = invoices.map((invoice) => ({
    id: invoice.id ?? crypto.randomUUID(),
    number: invoice.number,
    url: invoice.url,
    date: invoice.createdAt,
    amount: invoice.total,
    currency: invoice.currency,
    status: invoice.status
  }));

  return response;
}
