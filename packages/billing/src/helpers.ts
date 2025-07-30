import { billingConfig } from './config';
import {
  PriceInterval,
  PriceModel,
  PriceType,
  type Plan,
  type Price
} from './schema';

export function formatCurrency(cost: number, currency?: string): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2
  }).format(cost);
}

export function formatPrice(price: Price, displayInterval: string): string {
  if (price.meter) {
    return 'Price Varies';
  }

  const cost =
    price.type === PriceType.Recurring && displayInterval === PriceInterval.Year
      ? Number(price.cost / 12)
      : price.cost;

  return formatCurrency(cost, price.currency.toLowerCase());
}

export function getProductPricePair(priceId: string) {
  for (const product of billingConfig.products) {
    for (const plan of product.plans) {
      for (const price of plan.prices)
        if (price.id === priceId) {
          return { product, price };
        }
    }
  }

  throw new Error('Price not found');
}

export function getPriceTypeById(priceId: string) {
  for (const product of billingConfig.products) {
    for (const plan of product.plans) {
      for (const price of plan.prices)
        if (price.id === priceId) {
          return price.type;
        }
    }
  }

  throw new Error(`Price with ID ${priceId} not found`);
}

export function getPriceModelById(priceId: string) {
  for (const product of billingConfig.products) {
    for (const plan of product.plans) {
      for (const price of plan.prices)
        if (price.id === priceId) {
          return price.model;
        }
    }
  }

  throw new Error(`Price with ID ${priceId} not found`);
}

export function getPrimaryPrice(plan: Plan) {
  return (
    plan.prices.find((price) => price.model === PriceModel.Flat) ||
    plan.prices.find((price) => price.model === PriceModel.PerSeat) ||
    plan.prices[0]
  );
}

export function createPurchasesHelper(organization: {
  subscriptions: {
    active: boolean;
    items: {
      variantId: string;
    }[];
  }[];
  orders: {
    items: {
      variantId: string;
    }[];
  }[];
}) {
  const hasPurchasedProduct = (productId?: string | string[]) => {
    const productIds = productId
      ? Array.isArray(productId)
        ? productId
        : [productId]
      : billingConfig.products.map((product) => product.id);

    const priceIds = billingConfig.products
      .filter((product) => productIds.includes(product.id))
      .flatMap((product) =>
        product.plans.flatMap((plan) => plan.prices.map((p) => p.id))
      );

    const matchSubscription = organization.subscriptions
      .filter((sub) => sub.active)
      .flatMap((sub) => sub.items)
      .some((item) => priceIds.includes(item.variantId));

    const matchOrder = organization.orders
      .flatMap((order) => order.items)
      .some((item) => priceIds.includes(item.variantId));

    return matchSubscription || matchOrder;
  };

  const purchasedProducts = billingConfig.products.filter((product) =>
    hasPurchasedProduct(product.id)
  );

  return {
    purchasedProducts,
    hasPurchasedProduct
  };
}
