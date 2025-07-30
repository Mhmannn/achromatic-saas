'use client';

import * as React from 'react';
import Link from 'next/link';
import { ArrowLeftIcon } from 'lucide-react';

import { PricingTable } from '@workspace/billing/components/pricing-table';
import { buttonVariants } from '@workspace/ui/components/button';
import { toast } from '@workspace/ui/components/sonner';
import { cn } from '@workspace/ui/lib/utils';

import { createCheckoutSessionUrl } from '~/actions/billing/create-checkout-session-url';

export type PlanSelectionProps = React.HTMLAttributes<HTMLDivElement> & {
  backLink?: string;
  title: string;
};

export function PlanSelection({
  backLink,
  title,
  className,
  ...other
}: PlanSelectionProps): React.JSX.Element {
  const [pending, setPending] = React.useState<boolean>(false);

  const handleUpgrade = async (productId: string, planId: string) => {
    setPending(true);
    const result = await createCheckoutSessionUrl({
      productId,
      planId
    });
    if (result?.data?.url) {
      window.location.href = result.data.url;
    } else {
      toast.error('Failed to create checkout session. Please try again.');
      setPending(false);
    }
  };
  return (
    <div
      className={cn('container py-12', className)}
      {...other}
    >
      {backLink && (
        <Link
          href={backLink}
          className={cn(buttonVariants({ variant: 'link' }), 'gap-1')}
        >
          <ArrowLeftIcon className="size-4 shrink-0" />
          Back
        </Link>
      )}
      <h1 className="text-center text-2xl">{title}</h1>
      <PricingTable
        pending={pending}
        onUpgrade={handleUpgrade}
        currentProductId="free"
        className="mt-4"
      />
    </div>
  );
}
