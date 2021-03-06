import './CurrencyConverter.css';
import CurrencyRow from './components/CurrencyRow';
import React, { useState, useEffect } from 'react';
import usePersistentState from './usePersistentState';
import Loader from 'react-loader-spinner';

const currencyConvUrl = 'https://api.exchangeratesapi.io/latest';

function CurrencyConverter() {

  const [currencyList, setCurrencyList] = useState([]);
  const [fromCurrency, setFromCurrency] = usePersistentState("fromCurrency", "CAD");
  const [toCurrency, setToCurrency] = usePersistentState("toCurrency", "USD");
  const [exchangeRate, setExchangeRate] = useState(null);
  const [fromAmount, setFromAmount] = usePersistentState("fromAmount", "1");
  const [toAmount, setToAmount] = useState(null);
  const [amountInFrom, setAmountInFrom] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (amountInFrom) {
      setToAmount(fromAmount * exchangeRate);
    } else {
      setFromAmount(toAmount / exchangeRate);
    }
  }, [fromAmount, toAmount, exchangeRate, amountInFrom])


  useEffect(() => {

    setTimeout(() =>
      fetch(currencyConvUrl)
        .then(res => res.json())
        .then(data => {
          setCurrencyList([data.base, ...Object.keys(data.rates)]);
          setIsLoading(false);
        }), 1000)

  }, [])

  useEffect(() => {
    if (fromCurrency === toCurrency) setExchangeRate(1);
    else if (fromCurrency != null && toCurrency != null) {
      fetch(`${currencyConvUrl}?base=${fromCurrency}&symbols=${toCurrency}`)
        .then(res => res.json())
        .then(data => {
          setExchangeRate(data.rates[toCurrency])
        })
    }

  }, [fromCurrency, toCurrency])

  const handleFromCurrencyChange = e => setFromCurrency(e.target.value);

  const handleToCurrencyChange = e => setToCurrency(e.target.value);

  const handleFromAmount = e => {
    setFromAmount(e.target.value);
    setAmountInFrom(true);
  }

  const handleToAmount = e => {
    setToAmount(e.target.value);
    setAmountInFrom(false);
  }

  return (!isLoading) ? (
    <>


      <CurrencyRow currencyList={currencyList} defaultCurrency={fromCurrency} onCurrencyChange={handleFromCurrencyChange} onChangeAmount={handleFromAmount} amount={fromAmount}></CurrencyRow>
      <div style={{ textAlign: 'center', fontSize: '5em', color: "white" }}>=</div>
      <CurrencyRow currencyList={currencyList} defaultCurrency={toCurrency} onCurrencyChange={handleToCurrencyChange} onChangeAmount={handleToAmount} amount={toAmount}></CurrencyRow>

    </>

  ) : (<Loader style={{ textAlign: 'center' }} />);
}

export default CurrencyConverter;
