'use client';

import * as React from 'react';
import Link from 'next/link';
import { CheckIcon, ChevronRightIcon } from 'lucide-react';

import { routes } from '@workspace/routes';
import { Badge } from '@workspace/ui/components/badge';
import { Button, buttonVariants } from '@workspace/ui/components/button';
import { cn } from '@workspace/ui/lib/utils';

import { formatCurrency, formatPrice, getPrimaryPrice } from '../helpers';
import {
  Plan,
  Price,
  PriceInterval,
  PriceModel,
  PriceType,
  Product,
  Tier
} from '../schema';

export type PricingCardProps = React.HtmlHTMLAttributes<HTMLDivElement> & {
  pending?: boolean;
  product: Product;
  plan: Plan;
  selectedInterval: PriceInterval;
  isCurrent?: boolean;
  onUpgrade?: (productId: string, planId: string) => void;
};

export function PricingCard({
  pending,
  product,
  plan,
  selectedInterval,
  isCurrent = false,
  onUpgrade,
  className,
  ...other
}: PricingCardProps): React.JSX.Element {
  const primaryPrice = getPrimaryPrice(plan);
  const meteredPrice = plan.prices.find(
    (price) => price.model === PriceModel.Metered || !!price.meter
  );
  return (
    <div
      className={cn(
        'w-full relative flex flex-1 grow flex-col items-stretch justify-between self-stretch rounded-lg border px-6 py-5',
        product.recommended ? 'border-primary' : 'border-border',
        className
      )}
      {...other}
    >
      {product.recommended && (
        <div className="absolute -top-2.5 left-0 flex w-full justify-center">
          <Badge>Recommended</Badge>
        </div>
      )}
      <div className="flex flex-col gap-y-5">
        <ProductDetails
          name={product.name}
          description={product.description}
          trialDays={plan.trialDays}
        />
        {primaryPrice && (
          <PriceInfo
            isEnterprise={product.isEnterprise}
            primaryPrice={primaryPrice}
            selectedInterval={selectedInterval}
          />
        )}
        <CheckoutButton
          product={product}
          plan={plan}
          isCurrent={isCurrent}
          pending={pending}
          onUpgrade={onUpgrade}
        />
        <div className="h-px w-full border border-dashed" />
        <ul className="space-y-2">
          {product.features.map((feature) => (
            <FeatureDisplayItem
              key={feature}
              feature={feature}
            />
          ))}
          {meteredPrice?.meter?.tiers.map((tier, index) => (
            <MeteredTierItem
              key={index}
              tier={tier}
              index={index}
              allTiers={meteredPrice.meter!.tiers}
              currency={meteredPrice.currency}
              unit={meteredPrice.meter!.unit || ''}
            />
          ))}
        </ul>
      </div>
    </div>
  );
}

type ProductDetailsProps = {
  name: string;
  description: string;
  trialDays?: number | null;
};

function ProductDetails({ name, description, trialDays }: ProductDetailsProps) {
  return (
    <>
      <div className="flex flex-col gap-y-1">
        <div className="flex items-center gap-2 justify-between">
          <b className="text-secondary-foreground font-heading text-xl font-medium tracking-tight">
            {name}
          </b>
          {trialDays && (
            <div className="text-xs">
              {trialDays} {trialDays === 1 ? 'day' : 'days'} free trial
            </div>
          )}
        </div>
      </div>
      <p className="text-muted-foreground text-sm">{description}</p>
    </>
  );
}

type PriceInfoProps = {
  isEnterprise?: boolean;
  primaryPrice: Price;
  selectedInterval: PriceInterval;
};

function PriceInfo({
  isEnterprise,
  primaryPrice,
  selectedInterval
}: PriceInfoProps) {
  return (
    <div className="mt-2 flex flex-col">
      <div className="animate-in slide-in-from-left-4 fade-in flex items-end gap-1 duration-500">
        <span className="font-heading flex items-center text-3xl font-medium tracking-tighter">
          {isEnterprise
            ? 'Custom'
            : formatPrice(primaryPrice, selectedInterval)}
        </span>
        {!isEnterprise && (
          <>
            {primaryPrice.type === PriceType.Recurring && (
              <span className="text-muted-foreground text-sm leading-loose">
                / month
              </span>
            )}
            {primaryPrice.model === PriceModel.PerSeat && (
              <span className="text-muted-foreground text-sm leading-loose">
                / seat
              </span>
            )}
          </>
        )}
      </div>
    </div>
  );
}

type CheckoutButtonProps = {
  product: Product;
  plan: Plan;
  isCurrent: boolean;
  pending?: boolean;
  onUpgrade?: (productId: string, planId: string) => void;
};

function CheckoutButton({
  product,
  plan,
  isCurrent,
  pending,
  onUpgrade
}: CheckoutButtonProps) {
  const commonClasses =
    'group h-10 w-full rounded-xl text-sm font-medium shadow-none transition-colors duration-200';
  const buttonLabel = isCurrent
    ? 'Current Plan'
    : plan.trialDays && onUpgrade
      ? 'Start Trial'
      : product.label;

  if (onUpgrade) {
    return (
      <Button
        variant={product.recommended ? 'default' : 'outline'}
        className={commonClasses}
        disabled={isCurrent || pending}
        onClick={() => onUpgrade(product.id, plan.id)}
      >
        {buttonLabel}
        {!isCurrent && (
          <ChevronRightIcon className="ml-1 size-4 transition-transform group-hover:translate-x-0.5" />
        )}
      </Button>
    );
  }

  return (
    <Link
      href={
        product.isEnterprise
          ? routes.marketing.Contact
          : routes.dashboard.auth.SignUp
      }
      className={cn(
        buttonVariants({
          variant: product.recommended ? 'default' : 'outline'
        }),
        commonClasses
      )}
    >
      {isCurrent ? 'Current Plan' : product.label}
      {!isCurrent && (
        <ChevronRightIcon className="ml-1 size-4 transition-transform group-hover:translate-x-0.5" />
      )}
    </Link>
  );
}

type FeatureDisplayItemProps = {
  feature: string;
};

function FeatureDisplayItem({ feature }: FeatureDisplayItemProps) {
  return (
    <li className="flex items-start">
      <div className="bg-muted rounded-full w-5 h-5 flex items-center justify-center shadow-xs">
        <CheckIcon className="w-3 h-3 text-muted-foreground" />
      </div>
      <div className="ml-3 text-sm">{feature}</div>
    </li>
  );
}

type MeteredTierItemProps = {
  tier: Tier;
  index: number;
  allTiers: Tier[];
  currency: string;
  unit: string;
};

function MeteredTierItem({
  tier,
  index,
  allTiers,
  currency,
  unit
}: MeteredTierItemProps) {
  const tiersLength = allTiers.length;
  const previousTier = allTiers[index - 1];
  const isLastTier = tier.upTo === Infinity;
  const previousTierFrom =
    previousTier?.upTo === Infinity
      ? 'unlimited'
      : previousTier === undefined
        ? 0
        : (previousTier.upTo || 0) + 1;
  const upTo = tier.upTo;
  const isIncluded = tier.cost === 0;

  return (
    <li className="flex items-start">
      <div className="bg-muted rounded-full w-5 h-5 flex items-center justify-center shadow-xs">
        <CheckIcon className="w-3 h-3 text-muted-foreground" />
      </div>
      <div className="ml-3 text-sm">
        {isLastTier ? (
          <>
            <span>{formatCurrency(tier.cost, currency.toLowerCase())}</span>
            {tiersLength > 1 && (
              <span>
                {' '}
                above {(previousTierFrom as number) - 1} {unit}
              </span>
            )}
            {tiersLength === 1 && <span> for every {unit}</span>}
          </>
        ) : (
          <>
            {isIncluded ? (
              <span>
                {upTo} {unit} / month
              </span>
            ) : (
              <>
                <span>{formatCurrency(tier.cost, currency.toLowerCase())}</span>
                <span>
                  {' '}
                  for each {unit} for the next {upTo} {unit}
                </span>
              </>
            )}
          </>
        )}
      </div>
    </li>
  );
}
