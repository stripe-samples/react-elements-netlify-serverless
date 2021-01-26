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

/*
 * Product data can be loaded from anywhere. In this case, we’re loading it from
 * a local JSON file, but this could also come from an async call to your
 * inventory management service, a database query, or some other API call.
 *
 * The important thing is that the product info is loaded from somewhere trusted
 * so you know the pricing information is accurate.
 */

exports.handler = async (event) => {
  try {
    const { cartDetails: cartItems, paymentDetails } = JSON.parse(event.body);

    const line_items = validateCartItems(inventory, cartItems);
    const amount = line_items.reduce(
      (sum, { price_data: { unit_amount }, quantity }) =>
        sum + unit_amount * quantity,
      350 // Shipping fee
    );

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'usd',
      ...paymentDetails,
      // We are using the metadata to track which items were purchased.
      // We can access this meatadata in our webhook handler to then handle
      // the fulfillment process.
      // In a real application you would track this in an order object in your database.
      metadata: {
        items: JSON.stringify(
          Object.keys(cartItems).map((sku) => ({
            sku,
            quantity: cartItems[sku].quantity,
          }))
        ),
      },
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ paymentIntent }),
    };
  } catch (error) {
    console.log({ error });

    return {
      statusCode: 400,
      body: JSON.stringify({ error }),
    };
  }
};
