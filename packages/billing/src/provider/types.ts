import { PriceModel, PriceType, type Plan } from '../schema';

// Only Stripe is supported since it is feature-complete
// If another provider like Polar reaches the same features, we can add it here.
export type ProviderId = 'stripe';

export type BillingProvider = {
  providerId: ProviderId;

  // -------------------------- Session -------------------------- //

  createCheckoutSession(params: {
    returnUrl: string;
    organizationId: string;
    plan: Plan;
    customerId?: string;
    customerEmail?: string;
    enableDiscounts?: boolean;
    variantQuantities?: {
      variantId: string;
      quantity: number;
    }[];
    metadata?: Record<string, string>;
  }): Promise<Session>;

  createBillingPortalSession(params: {
    returnUrl: string;
    customerId: string;
  }): Promise<Session>;

  // -------------------------- Subscription -------------------------- //

  getSubscriptions(params: {
    customerId: string;
  }): Promise<UpsertSubscription[]>;

  cancelSubscription(params: {
    subscriptionId: string;
    invoiceNow?: boolean;
  }): Promise<void>;

  updateSubscriptionItemQuantity(params: {
    subscriptionId: string;
    subscriptionItemId: string;
    quantity: number;
  }): Promise<void>;

  // -------------------------- Order -------------------------- //

  getOrders(params: { customerId: string }): Promise<UpsertOrder[]>;

  // -------------------------- Meter -------------------------- //

  reportMeteredUsage(params: {
    customerId: string;
    eventName: string;
    quantity: number;
  }): Promise<void>;

  getMeteredUsage(params: {
    meterId: string;
    customerId: string;
    startsAt: Date;
    endsAt: Date;
  }): Promise<number>;

  // -------------------------- Customer -------------------------- //

  getCustomers(): AsyncGenerator<UpsertCustomer>;

  createCustomer(params: {
    organizationId: string;
    name: string;
    email: string;
  }): Promise<string>;

  updateCustomerName(params: {
    customerId: string;
    name: string;
  }): Promise<void>;

  updateCustomerEmail(params: {
    customerId: string;
    email: string;
  }): Promise<void>;

  updateCustomerAddress(params: {
    customerId: string;
    address: {
      line1?: string;
      line2?: string;
      city?: string;
      state?: string;
      postalCode?: string;
      country?: string;
    };
  }): Promise<void>;

  deleteCustomer(params: { customerId: string }): Promise<void>;

  // -------------------------- Invoice -------------------------- //

  getInvoices(params: { customerId: string }): Promise<Invoice[]>;

  // -------------------------- Webhook -------------------------- //

  verifyWebhookSignature(request: Request): Promise<unknown>;

  handleWebhookEvent(
    event: unknown,
    params: {
      // Subscriptions and One-time payments
      onCheckoutSessionCompleted: (
        data: UpsertSubscription | UpsertOrder
      ) => Promise<unknown>;

      // Subscriptions
      onSubscriptionUpdated: (
        subscription: UpsertSubscription
      ) => Promise<unknown>;
      onSubscriptionDeleted: (subscriptionId: string) => Promise<unknown>;

      // One-time payments
      onPaymentSucceeded: (sessionId: string) => Promise<unknown>;
      onPaymentFailed: (sessionId: string) => Promise<unknown>;

      // Customer
      onCustomerCreated: (customer: UpsertCustomer) => Promise<unknown>;
      onCustomerUpdated: (customer: UpsertCustomer) => Promise<unknown>;
      onCustomerDeleted: (customerId: string) => Promise<unknown>;
    }
  ): Promise<unknown>;
};

export type Session = {
  id: string;
  url: string;
};

export type Invoice = {
  id: string;
  number?: string;
  url?: string;
  createdAt?: string;
  total?: number;
  currency?: string;
  status?: string;
};

export type UpsertSubscription = {
  subscriptionId: string;
  organizationId?: string;
  customerId: string;
  active: boolean;
  status: string;
  provider: ProviderId;
  cancelAtPeriodEnd: boolean;
  currency: string;
  periodStartsAt: string;
  periodEndsAt: string;
  trialStartsAt?: string;
  trialEndsAt?: string;
  items: UpsertSubscriptionItem[];
};

export type UpsertSubscriptionItem = {
  subscriptionItemId: string;
  quantity: number;
  subscriptionId: string;
  productId: string;
  variantId: string;
  priceAmount: number | null | undefined;
  interval: string;
  intervalCount: number;
  type: PriceType.Recurring | PriceType.OneTime | undefined;
  model: PriceModel.Flat | PriceModel.PerSeat | PriceModel.Metered | undefined;
};

export type UpsertCustomer = {
  customerId: string;
  organizationId?: string;
  provider: ProviderId;
  email: string;
  line1: string;
  line2: string;
  city: string;
  postalCode: string;
  country: string;
  state: string;
};

export type UpsertOrder = {
  orderId: string;
  organizationId?: string;
  customerId: string;
  status: string;
  provider: ProviderId;
  totalAmount: number;
  currency: string;
  items: UpsertOrderItem[];
};

export type UpsertOrderItem = {
  orderItemId: string;
  productId: string;
  variantId: string;
  priceAmount: number | null | undefined;
  quantity: number;
  type: PriceType.Recurring | PriceType.OneTime | undefined;
  model: PriceModel.Flat | PriceModel.PerSeat | PriceModel.Metered | undefined;
};
