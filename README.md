# Digital Wallet payments with React Stripe Elements and Netlify Functions

Modern browser APIs, like the [Payment Request API](https://developer.mozilla.org/en-US/docs/Web/API/Payment_Request_API), allow you to access payment credentials stored in your customer's digital wallets like Apple Pay, Google Pay, or even Chrome.

Stripe provides a [Payment Request Button Element](https://stripe.com/docs/stripe-js/elements/payment-request-button#react) that securely tokenizes these stored credentials for a convenient checkout experience on mobile devices.

## Demo

- https://react-elements-netlify-serverless.netlify.com
- [Written tutorial](#TBD)
- Live coding session on [learnwithjason.dev](https://www.learnwithjason.dev/add-apple-pay-google-pay-to-jamstack-sites)

<img src="react-elements-netlify-functions-demo.gif" alt="demo gif" align="center">

## Features:

- Implement shopping cart logic via [`use-shopping-cart`](https://use-shopping-cart.netlify.app/).
- Collect payment and address information from customers who use Apple Pay, Google Pay, Microsoft Pay, and the Payment Request API.
- Create Payments in a Netlify Functions.
- Process Stripe webhook events with Netlify Functions to handle fulfillment.

## How to run locally

### Prerequisites

- [Node](https://nodejs.org/en/) >= 10
- [Netlify CLI](https://docs.netlify.com/cli/get-started/#installation)
- [Stripe CLI](https://stripe.com/docs/stripe-cli)

Follow the steps below to run locally.

**1. Clone and configure the sample**

```
git clone https://github.com/stripe-samples/react-elements-netlify-serverless
```

Copy the `.env.example` file into a file named `.env`:

```
cp .env.example .env
```

You will need a Stripe account in order to run the demo. Once you set up your account, go to the Stripe [developer dashboard](https://stripe.com/docs/development#api-keys) to find your API keys.

```
REACT_APP_STRIPE_PUBLISHABLE_KEY=<replace-with-your-publishable-key>
STRIPE_SECRET_KEY=<replace-with-your-secret-key>
```

**2. Run Netlify Functions locally:**

You can run the Netlify Functions locally with Netlify Dev:

```
npm install
netlify dev
```

**3. Test the Payment Request Button:**

To test the Payment Request Button your page must be served via HTTPS. See the full list of requirements in the [docs](https://stripe.com/docs/stripe-js/elements/payment-request-button#react-prerequisites).

**4. [Optional] Run a webhook locally:**

If you want to test the `using-webhooks` integration with a local webhook on your machine, you can use the Stripe CLI to easily spin one up.

Make sure to [install the CLI](https://stripe.com/docs/stripe-cli) and [link your Stripe account](https://stripe.com/docs/stripe-cli#link-account).

In a separate tab run

```
stripe listen --forward-to localhost:8888/.netlify/functions/webhooks
```

Or use the shorthand `npm run webhook`

The CLI will print a webhook secret key to the console. Set `STRIPE_WEBHOOK_SECRET` to this value in your `.env` file.

You should see events logged in the console where the CLI is running.

When you are ready to create a live webhook endpoint, follow our guide in the docs on [configuring a webhook endpoint in the dashboard](https://stripe.com/docs/webhooks/setup#configure-webhook-settings).

### 💫 Deploy with Netlify

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/stripe-samples/react-elements-netlify-serverless)

## Authors

- [jlengstorf](https://twitter.com/jlengstorf)
- [thorsten-stripe](https://twitter.com/thorwebdev)
