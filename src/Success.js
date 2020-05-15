import React, { useEffect } from 'react';

import { useShoppingCart } from 'use-shopping-cart';

const Success = () => {
  const { clearCart } = useShoppingCart();

  useEffect(() => clearCart(), [clearCart]);

  return (
    <main>
      <h1>
        Thanks for your purchase{' '}
        <span role="img" aria-label="heart emoji">
          ❤️
        </span>
      </h1>
    </main>
  );
};

export default Success;
