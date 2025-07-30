import { keys } from '../keys';
import {
  createBillingConfig,
  PriceInterval,
  PriceModel,
  PriceType
} from './schema';

enum Feature {
  AICustomerScoring = 'AI Contact Scoring',
  SmartEmailAnalysis = 'Smart Email Analysis',
  LeadPredictions = 'Lead Predictions',
  SentimentAnalysis = 'Sentiment Analysis',
  DataStorage = 'Data Storage',
  ExtendedSupport = 'Extended Support'
}

const currency = 'USD';

export const billingConfig = createBillingConfig({
  products: [
    {
      id: 'free',
      name: 'Free',
      description: 'Start for free.',
      label: 'Get started',
      isFree: true,
      features: [Feature.AICustomerScoring, Feature.SmartEmailAnalysis],
      // Even if it is free, keep the plans and prices to display the interval and currency correctly
      plans: [
        {
          id: 'plan-free-month',
          displayIntervals: [PriceInterval.Month],
          prices: [
            {
              id: 'price-free-month-id', // a placebo ID is fine here
              type: PriceType.Recurring,
              model: PriceModel.Flat,
              interval: PriceInterval.Month,
              cost: 0,
              currency
            }
          ]
        },
        {
          id: 'plan-free-year',
          displayIntervals: [PriceInterval.Year],
          prices: [
            {
              id: 'price-free-year-id', // a placebo ID is fine here
              interval: PriceInterval.Year,
              type: PriceType.Recurring,
              model: PriceModel.Flat,
              cost: 0,
              currency
            }
          ]
        }
      ]
    },
    {
      id: 'pro',
      name: 'Pro',
      description: 'Best for most teams.',
      label: 'Get started',
      recommended: true,
      features: [
        Feature.AICustomerScoring,
        Feature.SmartEmailAnalysis,
        Feature.SentimentAnalysis,
        Feature.LeadPredictions
      ],
      plans: [
        {
          id: 'plan-pro-month',
          displayIntervals: [PriceInterval.Month],
          trialDays: 7,
          prices: [
            {
              id:
                keys().NEXT_PUBLIC_BILLING_PRICE_PRO_MONTH_ID ||
                'price-pro-month-id', // keep for marketing pages, so you only need to specify id in dashboard
              interval: PriceInterval.Month,
              type: PriceType.Recurring,
              model: PriceModel.Flat,
              cost: 24,
              currency
            }
          ]
        },
        {
          id: 'plan-pro-year',
          displayIntervals: [PriceInterval.Year],
          trialDays: 7,
          prices: [
            {
              id:
                keys().NEXT_PUBLIC_BILLING_PRICE_PRO_YEAR_ID ||
                'price-pro-year-id', // keep for marketing pages, so you only need to specify id in dashboard
              interval: PriceInterval.Year,
              type: PriceType.Recurring,
              model: PriceModel.Flat,
              cost: 199,
              currency
            }
          ]
        }
      ]
    },
    {
      id: 'lifetime',
      name: 'Lifetime',
      description: 'Buy once. Use forever.',
      label: 'Get started',
      features: [
        Feature.AICustomerScoring,
        Feature.SmartEmailAnalysis,
        Feature.SentimentAnalysis,
        Feature.LeadPredictions
      ],
      plans: [
        {
          id: 'lifetime',
          displayIntervals: [PriceInterval.Month, PriceInterval.Year],
          prices: [
            {
              id:
                keys().NEXT_PUBLIC_BILLING_PRICE_LIFETIME_ID ||
                'price-lifetime-id', // keep for marketing pages, so you only need to specify id in dashboard
              type: PriceType.OneTime,
              model: PriceModel.Flat, // only flat is supported for PriceType.OneTime
              interval: undefined,
              cost: 699,
              currency
            }
          ]
        }
      ]
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      description: 'Best for tailored requirements.',
      label: 'Contact us',
      isEnterprise: true,
      features: [
        Feature.AICustomerScoring,
        Feature.SmartEmailAnalysis,
        Feature.SentimentAnalysis,
        Feature.LeadPredictions,
        Feature.DataStorage,
        Feature.ExtendedSupport
      ],
      // The idea is to keep the product and prices and use an admin panel to update the customer to enterprise.
      // For enterprise you can have multiple products, you just need to set hidden: true on the other enterprise products.
      plans: [
        {
          id: 'plan-enterprise-month',
          displayIntervals: [PriceInterval.Month],
          prices: [
            {
              id:
                keys().NEXT_PUBLIC_BILLING_PRICE_ENTERPRISE_MONTH_ID ||
                'price-enterprise-month-id', // keep for marketing pages, so you only need to specify id in dashboard
              interval: PriceInterval.Month,
              type: PriceType.Recurring,
              model: PriceModel.Flat,
              cost: 39,
              currency
            }
          ]
        },
        {
          id: 'plan-enterprise-year',
          displayIntervals: [PriceInterval.Year],
          prices: [
            {
              id:
                keys().NEXT_PUBLIC_BILLING_PRICE_ENTERPRISE_YEAR_ID ||
                'price-enterprise-year-id', // keep for marketing pages, so you only need to specify id in dashboard
              interval: PriceInterval.Year,
              type: PriceType.Recurring,
              model: PriceModel.Flat,
              cost: 399,
              currency
            }
          ]
        }
      ]
    }
  ]
});

export const billingConfigDisplayIntervals = Array.from(
  new Set(
    billingConfig.products
      .filter((product) => !product.hidden)
      .flatMap((product) =>
        product.plans.flatMap((plan) => plan.displayIntervals)
      )
      .filter(Boolean)
  )
) as PriceInterval[];
