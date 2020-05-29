/*
 * This function implements a Stripe webhook handler to handle
 * fulfillment for our successful payments.
 *
 * @see https://stripe.com/docs/payments/handling-payment-events
 */
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2020-03-02',
  maxNetworkRetries: 2,
});

exports.handler = async ({ body, headers }) => {
  try {
    const event = stripe.webhooks.constructEvent(
      body,
      headers['stripe-signature'],
      process.env.STRIPE_WEBHOOK_SECRET
    );

    if (event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object;
      const items = JSON.parse(paymentIntent.metadata.items);
      const shippingDetails = paymentIntent.shipping;
      const paymentMethod =
        paymentIntent.charges.data[0].payment_method_details;
      if (paymentMethod.card && paymentMethod.card.wallet) {
        console.log(`📱 Digital wallet: ${paymentMethod.card.wallet.type}`);
      }

      // Here make an API call / send an email to your fulfillment provider.
      const purchase = { items, shippingDetails };
      console.log(`📦 Fulfill purchase:`, JSON.stringify(purchase, null, 2));
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ received: true }),
    };
  } catch (err) {
    console.log(`Stripe webhook failed with ${err}`);

    return {
      statusCode: 400,
      body: `Webhook Error: ${err.message}`,
    };
  }
};
