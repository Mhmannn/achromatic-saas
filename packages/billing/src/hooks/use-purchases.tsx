import { createPurchasesHelper } from '../helpers';

export function usePurchases(
  organization: Parameters<typeof createPurchasesHelper>[0]
) {
  return createPurchasesHelper(organization);
}
