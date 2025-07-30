'use client';

import * as React from 'react';
import NiceModal from '@ebay/nice-modal-react';
import { differenceInDays, format, formatDate } from 'date-fns';

import { getProductPricePair } from '@workspace/billing/helpers';
import { PriceModel } from '@workspace/billing/schema';
import {
  Alert,
  AlertDescription,
  AlertTitle
} from '@workspace/ui/components/alert';
import { Button } from '@workspace/ui/components/button';
import { toast } from '@workspace/ui/components/sonner';

import { createBillingPortalSessionUrl } from '~/actions/billing/create-billing-portal-session-url';
import { UpgradePlanDialog } from '~/components/organizations/slug/settings/organization/billing/upgrade-plan-dialog';
import type { OrderDto } from '~/types/dtos/order-dto';
import type { SubscriptionDto } from '~/types/dtos/subscription-dto';

export type PlanDetailsProps = {
  subscription?: SubscriptionDto;
  order?: OrderDto;
};

export function PlanDetails({ subscription, order }: PlanDetailsProps) {
  return (
    <div>
      <p className="text-sm text-muted-foreground">
        This organization is currently on the plan:
      </p>
      <div className="space-y-4 pt-4 text-sm">
        {subscription ? (
          <SubscriptionInfo subscription={subscription} />
        ) : order ? (
          <OrderInfo order={order} />
        ) : (
          <NoPlan />
        )}
      </div>
    </div>
  );
}

type SubscriptionInfoProps = {
  subscription: SubscriptionDto;
};

function SubscriptionInfo({
  subscription
}: SubscriptionInfoProps): React.JSX.Element {
  const [pending, setPending] = React.useState<boolean>(false);
  const lineItems = subscription.items;
  if (!lineItems || lineItems.length === 0) {
    throw new Error('No line items found in subscription');
  }

  const primaryLineItem =
    lineItems.find((item) => item.model === PriceModel.Flat) ||
    lineItems.find((item) => item.model === PriceModel.PerSeat) ||
    lineItems[0];

  const { product, price } = getProductPricePair(primaryLineItem.variantId);
  if (!product || !price) {
    throw new Error(
      'Product or price not found. Did you forget to add it to the billing config?'
    );
  }

  const billingCycleStart = subscription.periodStartsAt;
  const billingCycleEnd = subscription.periodEndsAt;
  const daysToCycleEnd = billingCycleEnd
    ? differenceInDays(billingCycleEnd, new Date())
    : 0;
  const daysWithinCycle =
    billingCycleEnd && billingCycleStart
      ? differenceInDays(billingCycleEnd, billingCycleStart)
      : 0;

  const handleBillingPortalRedirect = async (): Promise<void> => {
    setPending(true);
    try {
      const result = await createBillingPortalSessionUrl();
      if (result?.data?.url) {
        window.location.href = result.data.url;
      } else {
        toast.error(
          'Failed to create billing portal session. Please try again.'
        );
      }
    } catch {
      setPending(false);
    }
  };
  return (
    <>
      <div className="space-x-2 text-2xl">
        <span>{product.name}</span>
        <span className="text-xs capitalize">
          {subscription.status === 'active' && subscription.cancelAtPeriodEnd
            ? '(Canceled)'
            : `(${subscription.status})`}
        </span>
      </div>
      {subscription.status === 'trialing' && (
        <div className="flex flex-col gap-y-1">
          <span className="font-semibold">Your trial ends on</span>
          <div className="text-muted-foreground">
            {subscription.trialEndsAt
              ? formatDate(subscription.trialEndsAt, 'P')
              : ''}
          </div>
        </div>
      )}
      {subscription.cancelAtPeriodEnd && (
        <Alert variant="warning">
          <AlertTitle>Subscription canceled</AlertTitle>
          <AlertDescription className="inline">
            Your subscription will be canceled at the end of the billing cycle.
          </AlertDescription>
        </Alert>
      )}
      <div>
        <div className="flex justify-between space-x-8 pb-1 align-baseline">
          <p className="capitalize-sentence max-w-[75%] truncate text-xs text-foreground">
            {`Current billing cycle (${format(subscription.periodStartsAt, 'MMM dd')} - ${format(subscription.periodEndsAt, 'MMM dd')})`}
          </p>
          <p className="text-xs text-muted-foreground">{`${daysToCycleEnd} days remaining`}</p>
        </div>
        <div className="relative h-1 w-full overflow-hidden rounded-sm bg-muted p-0">
          <div
            className="absolute inset-x-0 bottom-0 h-1 rounded-sm bg-foreground transition-all"
            style={{
              width: `${Number(((daysWithinCycle - daysToCycleEnd) / daysWithinCycle) * 100)}%`
            }}
          />
        </div>
      </div>
      {subscription.items
        .filter((item) => item.model === PriceModel.Metered)
        .map((item) => (
          <div key={item.id}>
            <div className="capitalize">{item.meteredUnit}</div>
            <div>{item.meteredUsage}</div>
          </div>
        ))}
      <div>
        <Button
          type="button"
          variant="outline"
          disabled={pending}
          loading={pending}
          onClick={handleBillingPortalRedirect}
        >
          Change plan
        </Button>
      </div>
    </>
  );
}

type OrderInfoProps = {
  order: OrderDto;
};

function OrderInfo({ order }: OrderInfoProps): React.JSX.Element {
  const [pending, setPending] = React.useState<boolean>(false);
  const lineItems = order.items;
  if (!lineItems || lineItems.length === 0) {
    throw new Error('No line items found in order');
  }

  const primaryLineItem =
    lineItems.find((item) => item.model === PriceModel.Flat) ||
    lineItems.find((item) => item.model === PriceModel.PerSeat) ||
    lineItems[0];

  if (!primaryLineItem) {
    throw new Error('No valid line item found in order');
  }

  const { product, price } = getProductPricePair(primaryLineItem.variantId);
  if (!product || !price) {
    throw new Error(
      'Product or price not found. Did you forget to add it to the billing config?'
    );
  }

  const handleBillingPortalRedirect = async (): Promise<void> => {
    setPending(true);
    try {
      const result = await createBillingPortalSessionUrl();
      if (result?.data?.url) {
        window.location.href = result.data.url;
      } else {
        toast.error(
          'Failed to create billing portal session. Please try again.'
        );
      }
    } catch {
      setPending(false);
    }
  };
  return (
    <>
      <div className="space-x-2 text-2xl">
        <span>{product.name}</span>
        <span className="text-xs capitalize">{`(${order.status})`}</span>
      </div>
      <div>
        <Button
          type="button"
          variant="outline"
          disabled={pending}
          loading={pending}
          onClick={handleBillingPortalRedirect}
        >
          Change plan
        </Button>
      </div>
    </>
  );
}

function NoPlan(): React.JSX.Element {
  const handleOpenUpgradePlanDialog = (): void => {
    NiceModal.show(UpgradePlanDialog);
  };
  return (
    <>
      <div className="space-x-2 text-2xl">Free</div>
      <div>
        <Button
          type="button"
          variant="outline"
          onClick={handleOpenUpgradePlanDialog}
        >
          Upgrade plan
        </Button>
      </div>
    </>
  );
}
