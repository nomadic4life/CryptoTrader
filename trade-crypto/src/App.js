import React, { Component } from 'react';
import Form from './Components/Form'
import './App.css';
import { connect } from 'react-redux';
import { updateState } from './actions'


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
    // price: {
    //   dogePrice: 0, // doge-btc
    //   btcPrice: 0, // btc-usd
    // },
    // amount: {
    //   btcAmount: 0,
    //   dogeAmount: 0,
    // },
    // quantity: {
    //   btcQuantity: 0,
    //   dogeQuantity: 0,
    // },
    // fee: {
    //   buyBTC: 0.01,
    //   buyDOGE: 0.002,
    // },
    dogePrice: '',
    btcPrice: '',
    dogeQuantity: '',
    quantity: 0, // doge
    price: 0,  // btc
    amount: 0,  // btc
    fee: null,  // btc
    total: null,  // btc
  }

  handleOnSubmit = ({dogePrice, dogeQuantity, btcAmount}) => {
    const crypto = [dogePrice, dogeQuantity, btcAmount];  
    
    this.props.updateState({
      price:  this.toCryptoValue(dogePrice),
      quantity: this.toCryptoValue(dogeQuantity),
      amount: this.toCryptoValue(btcAmount),
    })

    // this.setState({
    //   price:  this.toCryptoValue(dogePrice),
    //   quantity: this.toCryptoValue(dogeQuantity),
    //   amount: this.toCryptoValue(btcAmount),
    // });

  }

  toCryptoValue = (stringNum) => {

    const cryptoFormatting = num => {
      return num.split('.').length > 1 ? num + '0'.repeat(8 - num.split('.')[1].length) : num + '.00000000';
    };
  
    if(typeof stringNum !== 'string') return `${stringNum} is not a string`;
  
    stringNum = cryptoFormatting(stringNum).split('.');
  
    let value = stringNum[0] !== '0'
      ? `${stringNum[0]}${stringNum[1]}` + '0'.repeat(8 - stringNum[1].length )
      : `${stringNum[0]}${stringNum[1]}` + '0'.repeat(8 - stringNum[1].length );
  
    return Number(value);
  }

  toCryptoString = (num) => {

    if(typeof num !== 'number') return `${num} is not a number`;
  
    let value;
    num = Math.round(num);
  
    if(num >= 0) {
  
      num = num.toString();
  
      value = num.length < 8 
        ? '0.' + '0'.repeat(8 - num.length) + num 
        : `${num.slice(0,-8)}.${num.slice(-8)}`;
  
    } else {
  
      num = Math.abs(num).toString();
      
      value = num.length < 8 
        ? '-0.' + '0'.repeat(8 - num.length) + num 
        : `-${num.slice(0,-8)}.${num.slice(-8)}`;
    }
  
    return value;
  }

  render() {

    return (
      <div className="App">

        <Form 
          handleOnSubmit = {this.handleOnSubmit}
        />

        <h1>Price: {this.toCryptoString(this.props.price)} BTC</h1>
        <h1>Quauntity: {this.toCryptoString(this.props.quantity)} DOGE</h1>
        <h1>Amount: {this.toCryptoString(this.props.amount)} BTC</h1>

      </div>
    );
  }
}

const mapStatetoProps = state => {
  return {
    price : state.price.dogePrice,
    quantity: state.quantity.dogeQuantity,
    amount: state.amount.btcAmount,
  }
}

export default connect(mapStatetoProps, {updateState})(App);