import './App.css';
import CurrencyRow from './components/CurrencyRow';
import React, { useState, useEffect } from 'react';
import usePersistentState from './usePersistentState';
import Loader from 'react-loader-spinner';

const currencyConvUrl = 'https://api.exchangeratesapi.io/latest';

function App() {
  
  const [currencyList, setCurrencyList] = useState([]);
  const [fromCurrency, setFromCurrency] = usePersistentState("fromCurrency", "CAD");
  const [toCurrency, setToCurrency] = usePersistentState("toCurrency", "USD");
  const [exchangeRate, setExchangeRate] = useState(null);
  const [fromAmount, setFromAmount] = useState(0);
  const [toAmount, setToAmount] = useState(0);
  const [amountInFrom, setAmountInFrom] = useState(true);

  useEffect(()=> console.log('I have rerendered'),)

  useEffect(()=>{
    if (amountInFrom) {
      setToAmount(fromAmount*exchangeRate);
    } else {
      setFromAmount(toAmount/exchangeRate);
    }
  }, [fromAmount, toAmount, exchangeRate, amountInFrom])
  

  useEffect(() => {
    fetch(currencyConvUrl)
      .then(res => res.json())
      .then(data => {
        setCurrencyList([data.base, ...Object.keys(data.rates)]);
      })
  }, [])

  useEffect(() => {
    if (fromCurrency === toCurrency) setExchangeRate(1);
    else if (fromCurrency != null && toCurrency != null) {
      fetch(`${currencyConvUrl}?base=${fromCurrency}&symbols=${toCurrency}`)
        .then(res => res.json())
        .then(data => {
          console.log(data.rates);
          setExchangeRate(data.rates[toCurrency])})
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

  return (exchangeRate && currencyList.length >0) ? (
    <>
     
      {exchangeRate && currencyList.length > 0 && <>
      <CurrencyRow currencyList={currencyList} defaultCurrency={fromCurrency} onCurrencyChange={handleFromCurrencyChange} onChangeAmount={handleFromAmount} amount={fromAmount}></CurrencyRow>
      <div style={{ textAlign: 'center' , marginRight: '3em'}}>=</div>
      <CurrencyRow currencyList={currencyList} defaultCurrency={toCurrency} onCurrencyChange={handleToCurrencyChange} onChangeAmount={handleToAmount} amount={toAmount}></CurrencyRow> </> }

    </>

  ) : (<Loader/>);
}

export default App;
