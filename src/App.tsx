import React, { useState } from 'react';
import { Buffer } from 'buffer';
import axios from 'axios';
import Grid from '@mui/material/Grid';
import LoadingButton from '@mui/lab/LoadingButton';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';

const generateRefNum = (length: number): string => {
  let result = '';
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

const App = () => {
  const [paymentLink, setPaymentLink] = useState<string | undefined>(undefined);
  const [productName, setProductName] = useState<string>('');
  const [productCode, setProductCode] = useState<string>('');
  const [productDescription, setProductDescription] = useState<string>('');
  const [productPrice, setProductPrice] = useState<string>('');
  const [productQuantity, setProductQuantity] = useState<number>(1);
  const [currency, setCurrency] = useState<string>('PHP');
  const [error, setError] = useState<string | undefined>(undefined);
  const [isRequestOngoing, setIsRequestOngoing] = useState<boolean>(false);

  const createPaymentLink = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsRequestOngoing(true);
    setPaymentLink(undefined);

    const reqPayload = {
      totalAmount: {
        currency: currency,
        value: Number(productPrice) * productQuantity,
      },
      // * You MUST change these hard-coded values
      buyer: {
        firstName: 'Gilbert',
        lastName: 'Flores',
        contact: {
          phone: '09472129827',
          email: 'gilbert.flores@gmail.com',
        },
        shippingAddress: {
          line1: 'Aurora Shopping Arcade 1100',
          city: 'Quezon',
          state: 'Quezon',
          postalCode: '4102',
          alphaCountryCode: 'PHL',
        },
      },
      items: [
        {
          name: productName,
          code: productCode,
          description: productDescription,
          quantity: productQuantity.toString(),
          amount: {
            value: productPrice,
          },
        },
      ],
      // * You MUST change these hard-coded values
      redirectUrls: {
        success: `https://merchant.com/transaction/success`,
        failure: `https://merchant.com/transaction/failed`,
      },
      // * You can change how you generate RRNs
      requestReferenceNumber: generateRefNum(36),
    };

    // ! Do not share your secret authentication credentials in any publicly accessible areas such as Github,client-side code, and so forth.
    const activationCode = process.env.REACT_APP_ACTIVATION_CODE;
    const authPass = process.env.REACT_APP_AUTH_PASS;
    const merchantCredentials = activationCode + ':' + authPass;

    const base64MerchantCredentials =
      Buffer.from(merchantCredentials).toString('base64');
    const reqConfig = {
      headers: { Authorization: `Basic ${base64MerchantCredentials}` },
    };
    const sbxCheckoutApiUrl = process.env.REACT_APP_XPAY_CHECKOUT_API_URL || '';
    axios
      .post(sbxCheckoutApiUrl, reqPayload, reqConfig)
      .then((res) => {
        const { data } = res;
        const { redirectUrl } = data;
        setPaymentLink(redirectUrl);
      })
      .catch((err) => {
        const defaultErrMsg = 'Something went wrong.';
        const defaultErrCode = '00000080';
        if (axios.isAxiosError(err)) {
          const errMessage =
            // @ts-ignore
            err?.response?.data?.error || defaultErrMsg;
          const errCode =
            // @ts-ignore
            err?.response?.data?.code || defaultErrCode;
          setError(`[${errCode}] ${errMessage}`);
        } else {
          setError(`[${defaultErrCode}] ${defaultErrMsg}`);
        }
      })
      .finally(() => {
        setProductName('');
        setProductCode('');

        setProductDescription('');
        setProductPrice('');
        setProductQuantity(1);
        setCurrency('PHP');

        setIsRequestOngoing(false);
      });
  };

  return (
    <Container maxWidth='md'>
      <h1>Create a Payment Link</h1>
      <p>
        With Payment Links, you can use XPay&apos;s payment page to sell a
        product, and share a link to it with your customers. You can share the
        link as many times as you want on social media, in emails, or any other
        channel.
      </p>

      <br />

      <form onSubmit={createPaymentLink}>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <TextField
              label='Product Name'
              variant='outlined'
              name='productName'
              value={productName}
              InputProps={{
                inputProps: {
                  maxLength: 1000,
                },
              }}
              onChange={(e) => setProductName(e.target.value)}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label='Product Code'
              variant='outlined'
              name='productCode'
              value={productCode}
              InputProps={{
                inputProps: {
                  maxLength: 100,
                },
              }}
              onChange={(e) => setProductCode(e.target.value)}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label='Product Description'
              rows={6}
              name='productDescription'
              value={productDescription}
              InputProps={{
                inputProps: {
                  maxLength: 120,
                },
              }}
              onChange={(e) => setProductDescription(e.target.value)}
              fullWidth
              multiline
              required
            />
          </Grid>
          <Grid item xs={6}>
            <Grid container spacing={2}>
              <Grid item md={3}>
                <FormControl>
                  <InputLabel id='currency-select-label'>Currency</InputLabel>
                  <Select
                    labelId='currency-select-label'
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    label='Currency'
                  >
                    <MenuItem value='PHP'>PHP</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item md={9}>
                <TextField
                  label='Price'
                  type='number'
                  name='productPrice'
                  value={productPrice}
                  onChange={(e) => setProductPrice(e.target.value)}
                  InputProps={{
                    inputProps: {
                      min: 1,
                      step: 'any',
                    },
                  }}
                  fullWidth
                  required
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={6}>
            <TextField
              label='Quantity'
              type='number'
              name='productQuantity'
              value={productQuantity}
              onChange={(e) => setProductQuantity(Number(e.target.value))}
              InputProps={{
                inputProps: {
                  min: 1,
                },
              }}
              fullWidth
              required
            />
          </Grid>
        </Grid>

        <br />
        <br />

        <LoadingButton
          variant='contained'
          type='submit'
          color='success'
          loading={isRequestOngoing}
        >
          Create Payment Link
        </LoadingButton>
      </form>

      <br />

      <Box>
        {paymentLink && (
          <Alert severity='info'>
            Payment Link:&nbsp;
            <a href={paymentLink} target='_blank' rel='noreferrer'>
              {paymentLink}
            </a>
          </Alert>
        )}

        {error && <Alert severity='error'>{error}</Alert>}
      </Box>
    </Container>
  );
};

export default App;
