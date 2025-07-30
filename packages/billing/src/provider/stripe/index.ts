import 'server-only';

import { Stripe } from 'stripe';

import { keys } from '../../../keys';
import { billingConfig } from '../../config';
import {
  getPriceModelById,
  getPriceTypeById,
  getPrimaryPrice
} from '../../helpers';
import { PriceModel, PriceType, type Plan } from '../../schema';
import type {
  BillingProvider,
  Invoice,
  ProviderId,
  Session,
  UpsertCustomer,
  UpsertOrder,
  UpsertSubscription
} from '../types';

class StripeBillingProvider implements BillingProvider {
  public readonly providerId: ProviderId = 'stripe';
  private stripe: Stripe | undefined;

  constructor() {
    for (const product of billingConfig.products) {
      for (const plan of product.plans) {
        for (const price of plan.prices) {
          if (price.model === PriceModel.Metered && !price.meter?.id) {
            throw Error("Stripe's new meter API requires a meter ID");
          }
        }
      }
    }
  }

  public getStripe(): Stripe {
    if (!this.stripe) {
      this.stripe = new Stripe(keys().BILLING_STRIPE_SECRET_KEY!, {
        apiVersion: '2025-05-28.basil'
      });
    }
    return this.stripe;
  }

  // -------------------------- Session -------------------------- //

  public async createCheckoutSession(params: {
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
  }): Promise<Session> {
    const customer = params.customerId ?? undefined;
    const primaryPrice = getPrimaryPrice(params.plan);
    const mode: Stripe.Checkout.SessionCreateParams.Mode =
      primaryPrice.type === PriceType.Recurring ? 'subscription' : 'payment';

    const isSubscription = mode === 'subscription';
    const customerCreation =
      isSubscription || customer
        ? ({} as Record<string, string>)
        : { customer_creation: 'always' };

    let trialDays = params.plan.trialDays;
    if (customer) {
      trialDays = undefined;
    }

    const session = await this.getStripe().checkout.sessions.create({
      payment_method_types: ['card'],
      mode,
      allow_promotion_codes: params.enableDiscounts,
      line_items: params.plan.prices.map((price) => {
        if (price.model === PriceModel.Metered) {
          return {
            price: price.id
          };
        }
        return {
          price: price.id,
          quantity:
            params.variantQuantities?.find(
              (variant) => variant.variantId === price.id
            )?.quantity ?? 1
        };
      }),
      client_reference_id: params.organizationId,
      subscription_data: isSubscription
        ? {
            trial_period_days: trialDays,
            metadata: {
              organizationId: params.organizationId,
              ...(params.metadata ?? {})
            }
          }
        : {},
      success_url: `${params.returnUrl}?sessionId={CHECKOUT_SESSION_ID}`,
      cancel_url: `${params.returnUrl}?sessionId={CHECKOUT_SESSION_ID}`,
      ...customerCreation,
      ...(customer ? { customer } : { customer_email: params.customerEmail })
    });

    if (!session || !session.url) {
      throw new Error('Failed to create checkout session');
    }

    return {
      id: session.id,
      url: session.url
    };
  }

  public async createBillingPortalSession(params: {
    returnUrl: string;
    customerId: string;
  }): Promise<Session> {
    const session = await this.getStripe().billingPortal.sessions.create({
      customer: params.customerId,
      return_url: params.returnUrl
    });
    if (!session || !session.url) {
      throw new Error('Failed to create billing portal session');
    }

    return {
      id: session.id,
      url: session.url
    };
  }

  // -------------------------- Subscription -------------------------- //

  public async getSubscriptions(params: {
    customerId: string;
  }): Promise<UpsertSubscription[]> {
    const subscriptions: UpsertSubscription[] = [];
    let hasMore = true;
    let startingAfter: string | undefined = undefined;

    while (hasMore) {
      const response: Stripe.ApiList<Stripe.Subscription> =
        await this.getStripe().subscriptions.list({
          limit: 100,
          starting_after: startingAfter,
          customer: params.customerId
        });

      for (const subscription of response.data) {
        const organizationId = subscription.metadata?.organizationId;
        if (!organizationId) continue;

        const items = subscription.items?.data ?? [];
        const firstItem = items.length > 0 ? items[0] : null;
        const periodStartsAt = firstItem?.current_period_start ?? null;
        const periodEndsAt = firstItem?.current_period_end ?? null;

        const subscriptionPayload = this.buildSubscriptionPayload({
          id: subscription.id,
          organizationId,
          customerId: subscription.customer as string,
          items,
          status: subscription.status,
          currency: subscription.currency,
          cancelAtPeriodEnd: subscription.cancel_at_period_end ?? false,
          periodStartsAt,
          periodEndsAt,
          trialStartsAt: subscription.trial_start ?? null,
          trialEndsAt: subscription.trial_end ?? null
        });

        subscriptions.push(subscriptionPayload);
      }

      hasMore = response.has_more;
      startingAfter = response.data.at(-1)?.id;
    }

    return subscriptions;
  }

  public async cancelSubscription(params: {
    subscriptionId: string;
    invoiceNow?: boolean;
  }): Promise<void> {
    await this.getStripe().subscriptions.cancel(params.subscriptionId, {
      invoice_now: params.invoiceNow ?? true
    });
  }

  public async updateSubscriptionItemQuantity(params: {
    subscriptionId: string;
    subscriptionItemId: string;
    quantity: number;
  }): Promise<void> {
    await this.getStripe().subscriptions.update(params.subscriptionId, {
      items: [
        {
          id: params.subscriptionItemId,
          quantity: params.quantity
        }
      ]
    });
  }

  // -------------------------- Order -------------------------- //

  public async getOrders(params: {
    customerId: string;
  }): Promise<UpsertOrder[]> {
    const orders: UpsertOrder[] = [];
    let hasMore = true;
    let startingAfter: string | undefined = undefined;

    while (hasMore) {
      const response: Stripe.ApiList<Stripe.Checkout.Session> =
        await this.getStripe().checkout.sessions.list({
          limit: 100,
          starting_after: startingAfter,
          customer: params.customerId,
          status: 'complete'
        });

      for (const session of response.data) {
        if (session.mode !== 'payment') continue;
        const organizationId = session.client_reference_id;
        if (!organizationId) continue;

        const sessionWithLineItems =
          await this.getStripe().checkout.sessions.retrieve(session.id, {
            expand: ['line_items']
          });

        const lineItems = sessionWithLineItems.line_items?.data ?? [];
        const paymentStatus = sessionWithLineItems.payment_status;
        const currency = session.currency as string;

        const orderPayload = this.buildOrderPayload({
          organizationId,
          customerId: params.customerId,
          sessionId: session.id,
          items: lineItems,
          paymentStatus,
          currency,
          totalAmount: sessionWithLineItems.amount_total
        });

        orders.push(orderPayload);
      }

      hasMore = response.has_more;
      startingAfter = response.data.at(-1)?.id;
    }

    return orders;
  }

  // -------------------------- Meter -------------------------- //

  public async reportMeteredUsage(params: {
    customerId: string;
    eventName: string;
    quantity: number;
  }): Promise<void> {
    await this.getStripe().billing.meterEvents.create({
      event_name: params.eventName,
      payload: {
        value: params.quantity.toString(),
        stripe_customer_id: params.customerId
      }
    });
  }

  public async getMeteredUsage(params: {
    meterId: string;
    customerId: string;
    startsAt: Date;
    endsAt: Date;
  }): Promise<number> {
    const summaries = await this.getStripe().billing.meters.listEventSummaries(
      params.meterId,
      {
        customer: params.customerId,
        start_time: Math.floor(params.startsAt.valueOf() / 1000),
        end_time: Math.floor(params.endsAt.valueOf() / 1000)
      }
    );

    return summaries.data.reduce(
      (acc, summary) => acc + Number(summary.aggregated_value),
      0
    );
  }

  // -------------------------- Customer -------------------------- //

  public async *getCustomers(): AsyncGenerator<UpsertCustomer> {
    let hasMore = true;
    let startingAfter: string | undefined = undefined;

    while (hasMore) {
      const response: Stripe.ApiList<Stripe.Customer> =
        await this.getStripe().customers.list({
          limit: 100,
          starting_after: startingAfter
        });

      for (const customer of response.data) {
        const organizationId = customer.metadata?.organizationId;
        if (!organizationId) continue;

        yield this.buildCustomerPayload({
          id: customer.id,
          organizationId,
          email: customer.email,
          address: customer.address
        });
      }

      hasMore = response.has_more;
      startingAfter = response.data.at(-1)?.id;
    }
  }

  public async createCustomer(params: {
    organizationId: string;
    name: string;
    email: string;
  }): Promise<string> {
    const customer = await this.getStripe().customers.create({
      name: params.name,
      email: params.email,
      metadata: {
        organizationId: params.organizationId
      }
    });

    return customer.id;
  }

  public async updateCustomerName(params: {
    customerId: string;
    name: string;
  }): Promise<void> {
    await this.getStripe().customers.update(params.customerId, {
      name: params.name
    });
  }

  public async updateCustomerEmail(params: {
    customerId: string;
    email: string;
  }): Promise<void> {
    await this.getStripe().customers.update(params.customerId, {
      email: params.email
    });
  }

  public async updateCustomerAddress(params: {
    customerId: string;
    address: {
      line1?: string;
      line2?: string;
      city?: string;
      state?: string;
      postalCode?: string;
      country?: string;
    };
  }): Promise<void> {
    await this.getStripe().customers.update(params.customerId, {
      address: {
        line1: params.address.line1,
        line2: params.address.line2,
        country: params.address.country,
        postal_code: params.address.postalCode,
        city: params.address.city,
        state: params.address.state
      }
    });
  }

  public async deleteCustomer(params: { customerId: string }): Promise<void> {
    await this.getStripe().customers.del(params.customerId);
  }

  // -------------------------- Invoice -------------------------- //

  public async getInvoices(params: { customerId: string }): Promise<Invoice[]> {
    const response = await this.getStripe().invoices.list({
      customer: params.customerId
    });

    return response.data.map((invoice) => ({
      id: invoice.id ?? crypto.randomUUID(),
      number: invoice.number ?? undefined,
      url: invoice.invoice_pdf ?? undefined,
      createdAt: new Date(invoice.created * 1000).toISOString(),
      total: invoice.total / 100,
      currency: invoice.currency,
      status: invoice.status ?? undefined
    }));
  }

  // -------------------------- Webhook -------------------------- //

  public async verifyWebhookSignature(request: Request): Promise<Stripe.Event> {
    const body = await request.clone().text();
    const signatureKey = `stripe-signature`;
    const signature = request.headers.get(signatureKey);
    if (!signature) {
      throw new Error('Missing stripe-signature');
    }

    const webhookSecret = keys().BILLING_STRIPE_WEBHOOK_SECRET;
    if (!webhookSecret) {
      throw new Error('Missing stripe webhook secret');
    }

    const event = await this.getStripe().webhooks.constructEventAsync(
      body,
      signature,
      webhookSecret
    );
    if (!event) {
      throw new Error('Invalid signature');
    }

    return event;
  }

  public async handleWebhookEvent(
    event: Stripe.Event,
    params: {
      onCheckoutSessionCompleted: (
        data: UpsertSubscription | UpsertOrder
      ) => Promise<unknown>;
      onSubscriptionUpdated: (
        subscription: UpsertSubscription
      ) => Promise<unknown>;
      onSubscriptionDeleted: (subscriptionId: string) => Promise<unknown>;
      onPaymentSucceeded: (sessionId: string) => Promise<unknown>;
      onPaymentFailed: (sessionId: string) => Promise<unknown>;
      onCustomerCreated: (customer: UpsertCustomer) => Promise<unknown>;
      onCustomerUpdated: (customer: UpsertCustomer) => Promise<unknown>;
      onCustomerDeleted: (customerId: string) => Promise<unknown>;
    }
  ) {
    switch (event.type) {
      case 'checkout.session.completed': {
        return this.handleCheckoutSessionCompleted(
          event,
          params.onCheckoutSessionCompleted
        );
      }
      case 'customer.subscription.updated': {
        return this.handleSubscriptionUpdated(
          event,
          params.onSubscriptionUpdated
        );
      }
      case 'customer.subscription.deleted': {
        return this.handleSubscriptionDeleted(
          event,
          params.onSubscriptionDeleted
        );
      }
      case 'checkout.session.async_payment_failed': {
        return this.handleAsyncPaymentFailed(event, params.onPaymentFailed);
      }
      case 'checkout.session.async_payment_succeeded': {
        return this.handleAsyncPaymentSucceeded(
          event,
          params.onPaymentSucceeded
        );
      }
      case 'customer.created': {
        return this.handleCustomerCreated(event, params.onCustomerCreated);
      }
      case 'customer.updated': {
        return this.handleCustomerUpdated(event, params.onCustomerUpdated);
      }
      case 'customer.deleted': {
        return this.handleCustomerDeleted(event, params.onCustomerDeleted);
      }
      default: {
        console.info(`Unhandled Stripe event: ${event.type}`);
        return;
      }
    }
  }

  private async handleCheckoutSessionCompleted(
    event: Stripe.CheckoutSessionCompletedEvent,
    onCheckoutCompletedCallback: (
      data: UpsertSubscription | UpsertOrder
    ) => Promise<unknown>
  ) {
    const session = event.data.object;
    const isSubscription = session.mode === 'subscription';

    const organizationId = session.client_reference_id!;
    const customerId = session.customer as string;
    if (isSubscription) {
      const subscriptionId = session.subscription as string;
      const subscription =
        await this.getStripe().subscriptions.retrieve(subscriptionId);
      const hasItems =
        Array.isArray(subscription.items?.data) &&
        subscription.items.data.length > 0;
      const firstItem = hasItems ? subscription.items.data[0] : null;
      const periodStartsAt = firstItem?.current_period_start ?? null;
      const periodEndsAt = firstItem?.current_period_end ?? null;

      const payload = this.buildSubscriptionPayload({
        organizationId,
        customerId,
        id: subscription.id,
        items: subscription.items.data,
        status: subscription.status,
        currency: subscription.currency,
        periodStartsAt,
        periodEndsAt,
        cancelAtPeriodEnd: subscription.cancel_at_period_end,
        trialStartsAt: subscription.trial_start,
        trialEndsAt: subscription.trial_end
      });

      return onCheckoutCompletedCallback(payload);
    } else {
      const sessionId = event.data.object.id;
      const sessionWithLineItems =
        await this.getStripe().checkout.sessions.retrieve(
          event.data.object.id,
          {
            expand: ['line_items']
          }
        );

      const lineItems = sessionWithLineItems.line_items?.data ?? [];
      const paymentStatus = sessionWithLineItems.payment_status;
      const currency = event.data.object.currency as string;

      const payload = this.buildOrderPayload({
        organizationId,
        customerId,
        sessionId,
        items: lineItems,
        paymentStatus,
        currency,
        totalAmount: sessionWithLineItems.amount_total
      });

      return onCheckoutCompletedCallback(payload);
    }
  }

  private handleSubscriptionUpdated(
    event: Stripe.CustomerSubscriptionUpdatedEvent,
    onSubscriptionUpdatedCallback: (
      subscription: UpsertSubscription
    ) => Promise<unknown>
  ) {
    const subscription = event.data.object;
    const items = subscription.items?.data ?? [];
    const firstItem = items.length > 0 ? subscription.items.data[0] : null;
    const periodStartsAt = firstItem?.current_period_start ?? null;
    const periodEndsAt = firstItem?.current_period_end ?? null;

    const payload = this.buildSubscriptionPayload({
      customerId: subscription.customer as string,
      id: subscription.id,
      organizationId: subscription.metadata.organizationId,
      items: subscription.items?.data ?? [],
      status: subscription.status,
      currency: subscription.currency,
      periodStartsAt,
      periodEndsAt,
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
      trialStartsAt: subscription.trial_start,
      trialEndsAt: subscription.trial_end
    });

    return onSubscriptionUpdatedCallback(payload);
  }

  private handleSubscriptionDeleted(
    event: Stripe.CustomerSubscriptionDeletedEvent,
    onSubscriptionDeletedCallback: (subscriptionId: string) => Promise<unknown>
  ) {
    return onSubscriptionDeletedCallback(event.data.object.id);
  }

  private handleAsyncPaymentFailed(
    event: Stripe.CheckoutSessionAsyncPaymentFailedEvent,
    onPaymentFailed: (sessionId: string) => Promise<unknown>
  ) {
    const sessionId = event.data.object.id;
    return onPaymentFailed(sessionId);
  }

  private handleAsyncPaymentSucceeded(
    event: Stripe.CheckoutSessionAsyncPaymentSucceededEvent,
    onPaymentSucceeded: (sessionId: string) => Promise<unknown>
  ) {
    const sessionId = event.data.object.id;
    return onPaymentSucceeded(sessionId);
  }

  private async handleCustomerCreated(
    event: Stripe.CustomerCreatedEvent,
    onCustomerCreated: (data: UpsertCustomer) => Promise<unknown>
  ) {
    const customer = event.data.object;
    const payload = this.buildCustomerPayload({
      id: customer.id,
      organizationId: customer.metadata.organizationId,
      email: customer.email,
      address: customer.address
    });

    return onCustomerCreated(payload);
  }

  private async handleCustomerUpdated(
    event: Stripe.CustomerUpdatedEvent,
    onCustomerUpdated: (data: UpsertCustomer) => Promise<unknown>
  ) {
    const customer = event.data.object;
    const payload = this.buildCustomerPayload({
      id: customer.id,
      organizationId: customer.metadata.organizationId,
      email: customer.email,
      address: customer.address
    });

    return onCustomerUpdated(payload);
  }

  private async handleCustomerDeleted(
    event: Stripe.CustomerDeletedEvent,
    onCustomerDeleted: (id: string) => Promise<unknown>
  ) {
    return onCustomerDeleted(event.data.object.id);
  }

  // -------------------------- Helper -------------------------- //

  private buildSubscriptionPayload<
    SubscriptionItem extends {
      id: string;
      quantity?: number;
      price?: Stripe.Price;
    }
  >(params: {
    id: string;
    organizationId: string;
    customerId: string;
    items: SubscriptionItem[];
    status: Stripe.Subscription.Status;
    currency: string;
    cancelAtPeriodEnd: boolean;
    periodStartsAt: number | null;
    periodEndsAt: number | null;
    trialStartsAt: number | null;
    trialEndsAt: number | null;
  }): UpsertSubscription {
    return {
      subscriptionId: params.id,
      organizationId: params.organizationId,
      customerId: params.customerId,
      provider: this.providerId,
      status: params.status,
      active: params.status === 'active' || params.status === 'trialing',
      currency: params.currency,
      cancelAtPeriodEnd: params.cancelAtPeriodEnd ?? false,
      periodStartsAt: this.formatStripeDate(params.periodStartsAt) as string,
      periodEndsAt: this.formatStripeDate(params.periodEndsAt) as string,
      trialStartsAt: this.formatStripeDate(params.trialStartsAt),
      trialEndsAt: this.formatStripeDate(params.trialEndsAt),
      items: params.items.map((item) => ({
        subscriptionItemId: item.id,
        quantity: item.quantity ?? 1,
        subscriptionId: params.id,
        productId: item.price?.product as string,
        variantId: item.price?.id as string,
        priceAmount: item.price?.unit_amount,
        interval: item.price?.recurring?.interval as string,
        intervalCount: item.price?.recurring?.interval_count as number,
        type: getPriceTypeById(item.price?.id as string),
        model: getPriceModelById(item.price?.id as string)
      }))
    };
  }

  private buildOrderPayload<
    LineItem extends {
      id: string;
      quantity?: number | null;
      price?: Stripe.Price | null;
    }
  >(params: {
    organizationId: string;
    customerId: string;
    sessionId: string;
    items: LineItem[];
    paymentStatus: Stripe.Checkout.Session.PaymentStatus;
    currency: string;
    totalAmount: number | null;
  }): UpsertOrder {
    const status = params.paymentStatus === 'unpaid' ? 'pending' : 'succeeded';

    return {
      orderId: params.sessionId,
      organizationId: params.organizationId,
      customerId: params.customerId,
      provider: this.providerId,
      status,
      currency: params.currency,
      totalAmount: params.totalAmount ?? 0,
      items: params.items.map((item) => ({
        orderItemId: item.id,
        productId: item.price?.product as string,
        variantId: item.price?.id as string,
        priceAmount: item.price?.unit_amount ?? 0,
        quantity: item.quantity ?? 1,
        type: getPriceTypeById(item.price?.id as string),
        model: getPriceModelById(item.price?.id as string)
      }))
    };
  }

  private buildCustomerPayload(params: {
    id: string;
    organizationId: string;
    email: string | null;
    address?: {
      line1?: string | null;
      line2?: string | null;
      city?: string | null;
      postal_code?: string | null;
      country?: string | null;
      state?: string | null;
    } | null;
  }): UpsertCustomer {
    return {
      customerId: params.id,
      organizationId: params.organizationId,
      provider: this.providerId,
      email: params.email ?? '',
      line1: params.address?.line1 ?? '',
      line2: params.address?.line2 ?? '',
      city: params.address?.city ?? '',
      postalCode: params.address?.postal_code ?? '',
      country: params.address?.country ?? '',
      state: params.address?.state ?? ''
    };
  }

  private formatStripeDate(date: number | null) {
    return date ? new Date(date * 1000).toISOString() : undefined;
  }
}

export default new StripeBillingProvider();
