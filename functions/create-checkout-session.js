/*
 * This function creates a Stripe Checkout session and returns the session ID
 * for use with Stripe.js (specifically the redirectToCheckout method).
 *
 * @see https://stripe.com/docs/payments/checkout/one-time
 */

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2020-03-02',
  maxNetworkRetries: 2,
});
const validateCartItems = require('use-shopping-cart/src/serverUtil')
  .validateCartItems;

/*
 * Product data can be loaded from anywhere. In this case, we’re loading it from
 * a local JSON file, but this could also come from an async call to your
 * inventory management service, a database query, or some other API call.
 *
 * The important thing is that the product info is loaded from somewhere trusted
 * so you know the pricing information is accurate.
 */
const inventory = require('./data/products.json');

exports.handler = async (event) => {
  try {
    const cartItems = JSON.parse(event.body);

    const line_items = validateCartItems(inventory, cartItems);

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      billing_address_collection: 'auto',
      shipping_address_collection: {
        allowed_countries: ['US', 'CA'],
      },

      /*
       * This env var is set by Netlify and inserts the live site URL. If you want
       * to use a different URL, you can hard-code it here or check out the
       * other environment variables Netlify exposes:
       * https://docs.netlify.com/configure-builds/environment-variables/
       */
      success_url: `${process.env.URL}/success`,
      cancel_url: process.env.URL,
      line_items: [
        ...line_items,
        {
          price_data: {
            unit_amount: 350,
            currency: 'USD',
            product_data: {
              name: 'Shipping fee',
              description: 'Handling and shipping fee for global delivery',
            },
          },
          quantity: 1,
        },
      ],
      // We are using the metadata to track which items were purchased.
      // We can access this meatadata in our webhook handler to then handle
      // the fulfillment process.
      // In a real application you would track this in an order object in your database.
      payment_intent_data: {
        metadata: {
          items: JSON.stringify(
            Object.keys(cartItems).map((sku) => ({
              sku,
              quantity: cartItems[sku].quantity,
            }))
          ),
        },
      },
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ sessionId: session.id }),
    };
  } catch (error) {
    console.log({ error });

    return {
      statusCode: 400,
      body: JSON.stringify(error),
    };
  }
};
