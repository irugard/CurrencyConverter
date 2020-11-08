import './App.css';
import CurrencyRow from './components/CurrencyRow';
import React, { useState, useEffect } from 'react';
import usePersistentState from './usePersistentState';

const currencyConvUrl = 'https://api.exchangeratesapi.io/latest';

function App() {

  const [currency, setCurrency] = useState([]);
  const [fromCurrency, setFromCurrency] = useState();
  const [toCurrency, setToCurrency] = useState();
  // const [fromCurrency, setFromCurrency] = usePersistentState("fromCurrency", "CAD");
  // const [toCurrency, setToCurrency] = usePersistentState("toCurrency", "USD");
  const [exchangeRate, setExchangeRate] = useState();
  const [amount, setAmount] = useState(1);
  const [amountInFrom, setAmountInFrom] = useState(true);

  const [name, setName] = usePersistentState('name', 'Bob');

  let fromAmount, toAmount;

  if (amountInFrom) {
    fromAmount = amount;
    toAmount = fromAmount * exchangeRate;
  } else {
    toAmount = amount;
    fromAmount = toAmount / exchangeRate;
  }

  useEffect(() => {
    fetch(currencyConvUrl)
      .then(res => res.json())
      .then(data => {
        const firstCurrency = Object.keys(data.rates)[1];
        setCurrency([data.base, ...Object.keys(data.rates)]);
        setFromCurrency(currency[1]);
        setToCurrency(currency[27]);
        setExchangeRate(data.rates[firstCurrency]);
      })
  }, [])

  useEffect(() => {
    if (fromCurrency === toCurrency) setExchangeRate(1);
    else if (fromCurrency != null && toCurrency != null) {
      fetch(`${currencyConvUrl}?base=${fromCurrency}&symbols=${toCurrency}`)
        .then(res => res.json())
        .then(data => setExchangeRate(data.rates[toCurrency]))
    }

  }, [fromCurrency, toCurrency])

  const handleFromCurrencyChange = e => setFromCurrency(e.target.value);

  const handleToCurrencyChange = e => setToCurrency(e.target.value);

  const handleFromAmount = e => {
    setAmount(e.target.value);
    setAmountInFrom(true);
  }

  const handleToAmount = e => {
    setAmount(e.target.value);
    setAmountInFrom(false);
  }

  return (
    <>
      <input type='text' value={name} onChange={e => setName(e.target.value)} />
      <CurrencyRow currency={currency} defaultCurrency={fromCurrency} onCurrencyChange={handleFromCurrencyChange} onChangeAmount={handleFromAmount} amount={fromAmount}></CurrencyRow>
      <div style={{ textAlign: 'center' }}>=</div>
      <CurrencyRow currency={currency} defaultCurrency={toCurrency} onCurrencyChange={handleToCurrencyChange} onChangeAmount={handleToAmount} amount={toAmount}></CurrencyRow>
    </>

  );
}

export default App;
