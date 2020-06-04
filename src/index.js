import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import './index.css';
import App from './App';
import Success from './Success';
import * as serviceWorker from './serviceWorker';

import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { CartProvider } from 'use-shopping-cart';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

ReactDOM.render(
  <Elements stripe={stripePromise}>
    <CartProvider mode="checkout-session" stripe={stripePromise} currency="USD">
      <Router>
        <header>
          <Link to="/">Serverless Shopping Cart & Mobile Payments</Link>
        </header>

        <Switch>
          <Route path="/success">
            <Success />
          </Route>
          <Route path="/">
            <App />
          </Route>
        </Switch>
      </Router>
      <footer>
        <p>
          Based on an{' '}
          <a href="https://www.learnwithjason.dev/add-apple-pay-google-pay-to-jamstack-sites">
            episode of <em>Learn With Jason</em>
          </a>
          {' · '}<a href="https://www.netlify.com/blog/2020/05/21/learn-to-add-apple-pay-and-google-pay-to-react-websites/">read the tutorial</a>
          {' · '}<a href="https://github.com/stripe-samples/react-elements-netlify-serverless">
            source code
          </a>
        </p>
      </footer>
    </CartProvider>
  </Elements>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
