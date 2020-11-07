import './App.css';
import CurrencyRow from './components/CurrencyRow';
import React, {useState, useEffect} from 'react';

const currencyConvUrl = 'https://api.exchangeratesapi.io/latest';

function App() {

  const [currency, setCurrency] = useState([]);
  const [fromCurrency, setFromCurrency] = useState(localStorage.getItem('fromCurrency') || "");
  const [toCurrency, setToCurrency] = useState(localStorage.getItem('toCurrency') || "");
  const [exchangeRate, setExchangeRate] = useState();
  const [amount, setAmount] = useState(1);
  const [amountInFrom, setAmountInFrom] = useState(true);

  let fromAmount, toAmount;
  
  if(amountInFrom){
    fromAmount = amount;
    toAmount = fromAmount * exchangeRate;
  }else{
    toAmount = amount;
    fromAmount = toAmount/exchangeRate;
  }

  useEffect(()=>{
    fetch(currencyConvUrl)
    .then(res=>res.json())
    .then(data => {
      const firstCurrency = Object.keys(data.rates)[1];
      setCurrency([data.base, ...Object.keys(data.rates)]);
      setFromCurrency(currency[1]);
      setToCurrency(currency[27]);
      setExchangeRate(data.rates[firstCurrency]);
    })    
  },[])

  useEffect(() => {
    if(fromCurrency != null && toCurrency != null){
      fetch(`${currencyConvUrl}?base=${fromCurrency}&symbols=${toCurrency}`)
      .then(res=>res.json())
      .then(data => setExchangeRate(data.rates[toCurrency]))
    }
      
  }, [fromCurrency,toCurrency])

  useEffect(()=> localStorage.setItem('toCurrency', toCurrency), [toCurrency]);
  useEffect(()=> localStorage.setItem('fromCurrency', fromCurrency), [fromCurrency]);

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
    <CurrencyRow currency = {currency} defaultCurrency={fromCurrency} onCurrencyChange={handleFromCurrencyChange} onChangeAmount={handleFromAmount} amount={fromAmount}></CurrencyRow>
    <div style={{textAlign: 'center'}}>=</div>
    <CurrencyRow currency = {currency} defaultCurrency={toCurrency} onCurrencyChange={handleToCurrencyChange} onChangeAmount={handleToAmount} amount={toAmount}></CurrencyRow>
    </>

  );
}

export default App;
