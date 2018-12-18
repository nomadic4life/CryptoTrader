import React, { Component } from 'react';
import Form from './Components/Form'
import './App.css';
import { connect } from 'react-redux';
import { updateState, updateInputs, fetchPrice } from './actions'


class App extends Component {

  componentDidMount() {
    this.props.fetchPrice()
  }

  handleOnSubmit = ({price, base, quote, totalBaseBalance, totalQuoteBalance}, tradeType) => {

    if(price === 'undefined' || base === 'undefined' || quote === 'undefined') {

      console.log('error')
      // set state to message to indicate didn't update or was an error;

    } else {

      this.props.updateState({
        type: tradeType.pair,
        price:  this.toCryptoValue(price),
        base: this.toCryptoValue(base),
        quote: this.toCryptoValue(quote),
        totalQuoteBalance: this.toCryptoValue(totalQuoteBalance),
        totalBaseBalance: this.toCryptoValue(totalBaseBalance),
      })

    }
    

    this.props.updateInputs({
      price: '',
      base: '',
      quote: '',
      fee: '',
      total: '',
      totalQuoteBalance: '',
      totalBaseBalance: '',
    })
  }

  toCryptoValue = (stringNum) => {

    if(stringNum === undefined) return undefined;

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

    if(num === undefined) return "undefined";
    

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

  usdValue = num => {

  }

  usdString = num => {
    num = num.toString()
    return num.includes('.') 
      ? `$ ${num.split('.')[1].length === 2 
      ? num : `${num}0`}` : `$ ${num}.00`;
  }

  render() {

    return (
      <div className="App">

        <Form 
          handleOnSubmit = {this.handleOnSubmit}
          toCryptoString = {this.toCryptoString}
          toCryptoValue = {this.toCryptoValue}
          toDollarString = {this.usdString}
        />

        {this.props.doge && <h1>Price: {this.toCryptoString(this.props.doge)} BTC</h1>}
        <h1>Quauntity: {this.toCryptoString(this.props.base)} DOGE</h1>
        <h1>Amount: {this.toCryptoString(this.props.quote)} BTC</h1>
        {this.props.btc && <h1>BTC Price: {this.usdString(this.props.btc)} </h1>}

      </div>
    );
  }
}

const mapStatetoProps = state => {
  return {
    // price : state.price.doge,
    base: state.base.DOGE,
    quote: state.quote.BTC,
    doge: state.price.DOGE,
    btc: state.price.BTC,
  }
}

export default connect(mapStatetoProps, {
  updateState,
  updateInputs,
  fetchPrice,
})(App);