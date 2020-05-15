import React, { useState } from 'react';

import { useShoppingCart, formatCurrencyString } from 'use-shopping-cart';
import PaymentRequest from '../components/PaymentRequest';

const CartSummary = () => {
  const [loading, setLoading] = useState(false);
  const {
    totalPrice,
    formattedTotalPrice,
    cartCount,
    clearCart,
    cartDetails,
    redirectToCheckout,
  } = useShoppingCart();

  const handleCheckout = async (event) => {
    event.preventDefault();
    setLoading(true);

    const { sessionId } = await fetch(
      '/.netlify/functions/create-checkout-session',
      {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cartDetails),
      }
    )
      .then((res) => {
        return res.json();
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });

    redirectToCheckout({ sessionId });
  };

  return (
    <div>
      <h2>Cart summary</h2>
      {/* This is where we'll render our cart */}
      <p>Number of Items: {cartCount}</p>
      <p>Subtotal: {formattedTotalPrice}</p>
      <p>Shipping: {formatCurrencyString({ value: 350, currency: 'USD' })}</p>
      <p>
        Total:{' '}
        {formatCurrencyString({
          value: totalPrice + 350,
          currency: 'USD',
        })}
      </p>

      <PaymentRequest />
      {/* Redirects the user to Stripe */}
      <button disabled={!cartCount || loading} onClick={handleCheckout}>
        Checkout
      </button>
      <button onClick={clearCart}>Clear Cart</button>
    </div>
  );
};

export default CartSummary;
