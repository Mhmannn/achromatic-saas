'use client';

import * as React from 'react';

import { PricingTable } from '@workspace/billing/components/pricing-table';
import { APP_NAME } from '@workspace/common/app';

import { GridSection } from '~/components/fragments/grid-section';
import { SiteHeading } from '~/components/fragments/site-heading';

export function PricingHero(): React.JSX.Element {
  return (
    <GridSection>
      <div className="container space-y-12 py-20">
        <SiteHeading
          badge="Pricing"
          title="Plans for your business"
          description={`From early-stage startups to growing enterprises, ${APP_NAME} has you covered.`}
        />
        <PricingTable />
      </div>
    </GridSection>
  );
}
