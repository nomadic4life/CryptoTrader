import React, { Component } from 'react';
import Form from './Components/Form'
import { toCryptoString, toCryptoValue } from './Components/CryptoHandler'
import './App.css';

String.prototype.toCryptoValue = toCryptoValue;
Number.prototype.toCryptoValue = toCryptoString;

// needed Inputs
// btc price
// doge price
// usd capital
// total trades or days to trade
// trade cycle
// term period || term rate
// recurring capital
// daily trade rate
// randomize true or false // trade cycle // daily trade rate

// minimumTradeRate: 50000,
// tradeMultiplier: 2,
// sellRate: 0.5,
// buyRate: [],
// feeRate: 0.002,

// presistent data
// btc capital balance
// usd value capital balance
// btc balance
// doge balance
// usd balance


class App extends Component {

  state = {
    balance: {
      btcCaptialBalance: 0, // btc capital source from deposits
      usdValueCapitalBalance: 0, // btc capital source in usd value
      btcBalance: 0, // btc balance from sells
      dogeBalance: 0, // doge balance from buys
      usdBalance: 0, // usd balance not needed here for testing might remove
      btcTotalValueBalance: 0, // btc capital source + btc balance total
      usdTotalValueBalance: 0, // btc capital source + btc balance total in usde value
    },
    price: {
      dogePrice: 0, // doge-btc
      btcPrice: 0, // btc-usd
    },
    dogePrice: '',
    btcPrice: null,
    dogeQuantity: null,
    amount: '', // doge
    price: '',  // btc
    sum: '',  // btc
    fee: null,  // btc
    total: null,  // btc
  }

  handleOnSubmit = ({dogePrice, dogeAmount, btcSum}) => {
    const crypto = [dogePrice, dogeAmount, btcSum]
    const cryptoFormatting = num => {
      return num.split('.').length > 1 ? num + '0'.repeat(8 - num.split('.')[1].length) : num + '.00000000';
    }

    const cryptoValue = num => {
      return num.split('.').join('') * Math.pow(10,8);
    }

    for(let i = 0; i < crypto.length; i++) {
      console.log(cryptoValue(crypto[i]));
    }

    let value = crypto.map(num => cryptoValue(num));

    console.log(this.cryptoFormat(value[1]));
    

    this.setState({
      price:  value[0],
      amount: value[1],
      sum: value[2],
    });

  }

  cryptoFormat = num => {

    if(num < 0) {

      num = Math.abs(num)
      num = num.toString();
      return num.length <= 8 
        ? '-0.' + '0'.repeat(8 - num.length) + num
        : `-${num.slice(0,-8)}.${num.slice(-8)}`;

    } else {

      num = num.toString();
      return num.length <= 8 
        ? '0.' + '0'.repeat(8 - num.length) + num 
        : `${num.slice(0,-8)}.${num.slice(-8)}`;

    }
  }

  render() {

    return (
      <div className="App">

        <Form 
          handleOnSubmit = {this.handleOnSubmit} 
        />

        <h1>Price: {String(this.state.price)}</h1>
        <h1>Quauntity: {String(this.state.amount)}</h1>
        <h1>Amount: {String(this.state.sum)}</h1>

      </div>
    );
  }
}

export default App;
