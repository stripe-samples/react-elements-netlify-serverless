import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useShoppingCart } from 'use-shopping-cart';

import {
  PaymentRequestButtonElement,
  useStripe,
} from '@stripe/react-stripe-js';

const PaymentRequest = () => {
  const history = useHistory();
  const { totalPrice, cartDetails, cartCount } = useShoppingCart();
  const stripe = useStripe();
  const [paymentRequest, setPaymentRequest] = useState(null);

  const handleButtonClicked = (event) => {
    if (!cartCount) {
      event.preventDefault();
      alert('Cart is empty!');
      return;
    }
    paymentRequest.on('paymentmethod', handlePaymentMethodReceived);
    paymentRequest.on('cancel', () => {
      paymentRequest.off('paymentmethod');
    });
    return;
  };

  const handlePaymentMethodReceived = async (event) => {
    // Send the cart details and payment details to our function.
    const paymentDetails = {
      payment_method: event.paymentMethod.id,
      shipping: {
        name: event.shippingAddress.recipient,
        phone: event.shippingAddress.phone,
        address: {
          line1: event.shippingAddress.addressLine[0],
          city: event.shippingAddress.city,
          postal_code: event.shippingAddress.postalCode,
          state: event.shippingAddress.region,
          country: event.shippingAddress.country,
        },
      },
    };
    const response = await fetch('/.netlify/functions/create-payment-intent', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ cartDetails, paymentDetails }),
    }).then((res) => {
      return res.json();
    });
    if (response.error) {
      // Report to the browser that the payment failed.
      console.log(response.error);
      event.complete('fail');
    } else {
      // Report to the browser that the confirmation was successful, prompting
      // it to close the browser payment method collection interface.
      event.complete('success');
      // Let Stripe.js handle the rest of the payment flow, including 3D Secure if needed.
      const { error, paymentIntent } = await stripe.confirmCardPayment(
        response.paymentIntent.client_secret
      );
      if (error) {
        console.log(error);
        return;
      }
      if (paymentIntent.status === 'succeeded') {
        history.push('/success');
      } else {
        console.warn(
          `Unexpected status: ${paymentIntent.status} for ${paymentIntent}`
        );
      }
    }
  };

  useEffect(() => {
    if (stripe && paymentRequest === null) {
      const pr = stripe.paymentRequest({
        country: 'US',
        currency: 'usd',
        total: {
          label: 'Demo total',
          amount: totalPrice + 350,
          pending: true,
        },
        requestPayerName: true,
        requestPayerEmail: true,
        requestShipping: true,
        shippingOptions: [
          {
            id: 'standard-global',
            label: 'Global shipping',
            detail: 'Handling and delivery fee',
            amount: 350,
          },
        ],
      });
      // Check the availability of the Payment Request API first.
      pr.canMakePayment().then((result) => {
        if (result) {
          setPaymentRequest(pr);
        }
      });
    }
  }, [stripe, paymentRequest, totalPrice]);

  useEffect(() => {
    if (paymentRequest) {
      paymentRequest.update({
        total: {
          label: 'Demo total',
          amount: totalPrice + 350,
          pending: false,
        },
      });
    }
  }, [totalPrice, paymentRequest]);

  if (paymentRequest) {
    return (
      <div className="payment-request-button">
        <PaymentRequestButtonElement
          options={{ paymentRequest }}
          onClick={handleButtonClicked}
        />
        --- OR ---
      </div>
    );
  }

  return '';
};

export default PaymentRequest;
