import React, { Component } from 'react';
import Form from './Components/Form'
import './App.css';

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
    const cryptoFormatting = num => {
      return num.split('.').length > 1 ? num + '0'.repeat(8 - num.split('.')[1].length) : num + '.00000000';
    }

    this.setState({
      price:  cryptoFormatting(dogePrice) + ' BTC' ,
      amount: cryptoFormatting(dogeAmount) + ' DOGE',
      sum: cryptoFormatting(btcSum) + ' BTC' ,
    });

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
