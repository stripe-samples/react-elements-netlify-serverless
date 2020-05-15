import React from 'react';
import CartSummary from './components/CartSummary';
import Products from './components/Products';

import './App.css';

function App() {
  return (
    <main>
      <h1>Buy Our Products!</h1>
      <p>
        {`This demo is in test mode. That means you can check out using any of
        the `}
        <a href="https://stripe.com/docs/testing#cards">test card numbers</a>.
      </p>

      <CartSummary />
      <Products />
    </main>
  );
}

export default App;
