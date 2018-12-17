import React, { Component } from 'react';
import Form from './Components/Form'
import './App.css';
import { connect } from 'react-redux';
import { updateState } from './actions'


class App extends Component {

  state = {
    dogePrice: '',
    btcPrice: '',
    dogeQuantity: '',
    quantity: 0, // doge
    price: 0,  // btc
    amount: 0,  // btc
    fee: null,  // btc
    total: null,  // btc
  }

  handleOnSubmit = ({price, quantity, amount, balance, qBalance}) => {
    const crypto = [price, quantity, amount];  
    console.log(price, quantity, amount)
    
    this.props.updateState({
      price:  this.toCryptoValue(price),
      quantity: this.toCryptoValue(quantity),
      amount: this.toCryptoValue(amount),
      btcBalance: this.toCryptoValue(balance),
      quantityBalance: this.toCryptoValue(qBalance),
      // resetPrice: '',
      // resetQuantity: '',
      // resetAmount: '',
      // resetFee: '',
      // resetTotal: '',
      // resetBalance: '',
    })

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

    // if(typeof num === 'string' && num === '') num = this.toCryptoValue(num || '0.00000000');

    // if(typeof num !== 'number') return `${num} is not a number`;
  
    let value;
    num = Math.round(num);
  
    if(num >= 0) {
  
      num = num.toString();
  
      value = num.length <= 8 
        ? '0.' + '0'.repeat(8 - num.length) + num 
        : `${num.slice(0,-8)}.${num.slice(-8)}`;
  
    } else {
  
      num = Math.abs(num).toString();
      
      value = num.length <= 8 
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
          toCryptoString = {this.toCryptoString}
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