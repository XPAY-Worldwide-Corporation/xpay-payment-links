
# XPay Payment Links

With Payment Links, you can use XPay&apos;s payment page to sell a product, and share a link to it with your customers. You can share the link as many times as you want on social media, in emails, or any other channel.

This Payment Links sample is created with ReactJS and TypeScript

## Installation

1. Go to the project's directory
```bash
  cd xpay-payment-links
```

2. Install the project's dependencies
```bash
  npm i
```

3. Add environment variables to your `.env` file
- For more information, see [Adding Custom Environment Variables](https://create-react-app.dev/docs/adding-custom-environment-variables/) guide by ReactJS

```bash
  REACT_APP_ACTIVATION_CODE=''
  REACT_APP_AUTH_PASS=''
  REACT_APP_XPAY_CHECKOUT_API_URL=''
```

> Activation Code and Auth Pass are provided by XPay.
> For Checkout API URL, please refer to the Checkout API documentation provided.

4. Run the development build
```bash
  npm run start
```

A new browser window will pop up with the ReactJS application. If not, open your browser and type [http://localhost:3000](http://localhost:3000) in the address bar.

To run a production build
```bash
  npm run build

  npm install -g serve
  serve -s build
```

## Notes

By default, ReactJS applications run on port 3000.

If you want it to run on a different port, add a `PORT` variable to your `.env` file

```bash
  PORT=3005
```

You can now access the ReactJS application via [http://localhost:3005](http://localhost:3005)
