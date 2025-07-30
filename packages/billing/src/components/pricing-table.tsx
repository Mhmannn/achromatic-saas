'use client';

import * as React from 'react';

import { cn } from '@workspace/ui/lib/utils';

import { billingConfig, billingConfigDisplayIntervals } from '../config';
import { PriceInterval } from '../schema';
import { PriceIntervalSelector } from './price-interval-selector';
import { PricingCard } from './pricing-card';

export type PricingTableProps = React.HtmlHTMLAttributes<HTMLDivElement> & {
  pending?: boolean;
  onUpgrade?: (productId: string, planId: string) => void;
  currentProductId?: string;
};

export function PricingTable({
  pending,
  onUpgrade,
  currentProductId,
  className,
  ...other
}: PricingTableProps): React.JSX.Element {
  const [selectedInterval, setSelectedInterval] = React.useState<PriceInterval>(
    billingConfigDisplayIntervals[0]
  );
  return (
    <div
      className={cn(
        'flex flex-col overflow-y-auto space-y-8 xl:space-y-12',
        className
      )}
      {...other}
    >
      {billingConfigDisplayIntervals.length > 1 && (
        <PriceIntervalSelector
          interval={selectedInterval}
          onIntervalChange={setSelectedInterval}
        />
      )}
      <div
        className={cn(
          'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full',
          billingConfig.products.length >= 4 && 'xl:grid-cols-4 '
        )}
      >
        {billingConfig.products
          .filter((product) => !product.hidden)
          .map((product) => {
            const plan = product.plans.find((plan) =>
              plan.displayIntervals.includes(selectedInterval)
            );
            if (!plan) {
              return null;
            }
            return (
              <PricingCard
                key={plan.id}
                pending={pending}
                product={product}
                plan={plan}
                selectedInterval={selectedInterval}
                isCurrent={currentProductId === product.id}
                onUpgrade={onUpgrade}
              />
            );
          })}
      </div>
    </div>
  );
}
