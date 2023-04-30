import React, {useEffect, useState} from 'react';
import {Block} from './Block';
import './index.scss';

function App() {
  const [rates, setRates] = useState([])
  const [fromCurrency, setFromCurrency] = useState('UAH')
  const [toCurrency, setToCurrency] = useState('USD')
  const [fromPrice, setFromPrice] = useState(0)
  const [toPrice, setToPrice] = useState(0)
  const [currentDate, setCurrentDate] = useState('')

  useEffect(() => {
    fetch('https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?json')
      .then((res) => res.json())
      .then((data) => {
        setRates(data)
        setCurrentDate(data[0].exchangedate)

      })
      .catch((error) => {
        console.warn(error);
      })
  }, []);

  const onChangeFromPrice = (value) => {
    setFromPrice(value)
    const currency1 = fromCurrency === 'UAH' ? {rate: 1} : rates.find((currency) => currency.cc === fromCurrency);
    const currency2 = toCurrency === 'UAH' ? {rate: 1} : rates.find((currency) => currency.cc === toCurrency);
    if (currency1 && currency2) {
      const result = (currency1.rate / currency2.rate) * value
      setToPrice(result.toFixed(2))
    }
  }

  const onChangeToPrice = (value) => {
    setToPrice(value)
    const currency1 = fromCurrency === 'UAH' ? {rate: 1} : rates.find((currency) => currency.cc === fromCurrency);
    const currency2 = toCurrency === 'UAH' ? {rate: 1} : rates.find((currency) => currency.cc === toCurrency);

    if (currency1 && currency2) {
      const result = (currency1.rate / currency2.rate) * value
      setFromPrice(result.toFixed(2))
    }
  }

  useEffect(() => {
    onChangeFromPrice(fromPrice);
  }, [toCurrency, fromCurrency]);



  return (
    <>

      <div className="App">
        <div>
          <h1>Current date</h1>
          <p className="currentDate">{currentDate}</p>
        </div>
        <Block
          value={fromPrice}
          currency={fromCurrency}
          onChangeCurrency={setFromCurrency}
          onChangeValue={onChangeFromPrice}
        />
        <Block
          value={toPrice}
          currency={toCurrency}
          onChangeCurrency={setToCurrency}
          onChangeValue={onChangeToPrice}/>
      </div>
    </>
  );
}

export default App;
