import { useEffect, useRef, useState } from 'react'
import './App.css';
import CurrencyRow from './CurrencyRow';

const DEFAULT_BASE_CURRENCY = "EUR";
const DEFAULT_TARGET_CURRENCY = "USD"
const CURRENCY_API_URL = "https://open.er-api.com/v6/latest/";

export default function App() {
  const [currencyOptions, setCurrencyOptions] = useState([])
  const [fromCurr, setFromCurr] = useState()
  const [toCurr, setToCurr] = useState()
  const [exchangeRate, setExchangeRate] = useState()
  const [amount, setAmount] = useState(1)
  const [amountChangedFromCurr, setAmountChangedFromCurr] = useState(true)
  const [ratesList, setRatesList] = useState()

  let toAmount, fromAmount;

  function handleFromAmountChange(e) {
    let val = Math.max(e.target.value, 0);
    setAmount(val);
    setAmountChangedFromCurr(true);
  }

  function handleToAmountChange(e) {
    let val = Math.max(e.target.value, 0);
    setAmount(val);
    setAmountChangedFromCurr(false);
  }

  useEffect(() => {
    const fetchRates = async () => {
      await fetchBaseRates(DEFAULT_BASE_CURRENCY, DEFAULT_TARGET_CURRENCY);
    }
    fetchRates();
  
  }, [])

  useEffect(() => {
    if (fromCurr) {
      fetchBaseRates(fromCurr, toCurr);
    }
  }, [fromCurr])

  useEffect(() => {
    if (toCurr) {
      setExchangeRate(ratesList[toCurr]);
    }
  }, [toCurr])

  async function fetchBaseRates(fromCurr, targetCurr) {
    const res = await fetch(CURRENCY_API_URL + fromCurr);
    const data = await res.json();
    setRatesList({...data.rates});
    setCurrencyOptions([...Object.keys(data.rates)]);
    setFromCurr(fromCurr);
    setToCurr(targetCurr);
    setExchangeRate(data.rates[targetCurr]);
  }
  
  if (amountChangedFromCurr) {
    fromAmount = amount;
    toAmount = formatAmount(fromAmount * exchangeRate);
  } else {
    toAmount = amount;
    fromAmount = formatAmount(toAmount / exchangeRate);
  }

  function formatAmount(val) {
    return Math.round(val * 100) / 100;
  }

  console.log("data", { fromCurr, toCurr, exchangeRate });

  return (
    <>
      <h1>Convert</h1>
      <CurrencyRow 
        options={currencyOptions} 
        selected={fromCurr} 
        onChangeCurr={e => setFromCurr(e.target.value)}
        amount={fromAmount}
        onChangeAmount={handleFromAmountChange}
      />
      <div className="equals">⇅</div>
      <CurrencyRow 
        options={currencyOptions} 
        selected={toCurr} 
        onChangeCurr={e => setToCurr(e.target.value)} 
        amount={toAmount}
        onChangeAmount={handleToAmountChange}
      />
    </>
  )
}


