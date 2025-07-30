import { deleteCustomer } from './data/delete-customer';
import { deleteSubscription } from './data/delete-subscription';
import { updateOrderStatus } from './data/update-order-status';
import { upsertCustomer } from './data/upsert-customer';
import { upsertOrder } from './data/upsert-order';
import { upsertSubscription } from './data/upsert-subscription';
import { BillingProvider } from './provider';

export async function POST(req: Request): Promise<Response> {
  try {
    const event = await BillingProvider.verifyWebhookSignature(req);
    await BillingProvider.handleWebhookEvent(event, {
      onCheckoutSessionCompleted: async (payload) => {
        if ('orderId' in payload) {
          await upsertOrder(payload);
        } else {
          await upsertSubscription(payload);
        }
      },
      onSubscriptionUpdated: async (subscription) => {
        await upsertSubscription(subscription);
      },
      onSubscriptionDeleted: async (subscriptionId) => {
        await deleteSubscription(subscriptionId);
      },
      onPaymentSucceeded: async (sessionId) => {
        await updateOrderStatus(sessionId, 'succeeded');
      },
      onPaymentFailed: async (sessionId) => {
        await updateOrderStatus(sessionId, 'failed');
      },
      onCustomerCreated: async (customer) => {
        await upsertCustomer(customer);
      },
      onCustomerUpdated: async (customer) => {
        await upsertCustomer(customer);
      },
      onCustomerDeleted: async (customerId) => {
        await deleteCustomer(customerId);
      }
    });
  } catch (err) {
    console.error(err);
    return Response.json(
      { error: 'Webhook error: "Webhook handler failed."' },
      {
        status: 500,
        headers: { 'Cache-Control': 'no-store' }
      }
    );
  }

  return Response.json(
    {
      received: true,
      message: 'Webhook received.',
      headers: { 'Cache-Control': 'no-store' }
    },
    {
      status: 200,
      headers: { 'Cache-Control': 'no-store' }
    }
  );
}
