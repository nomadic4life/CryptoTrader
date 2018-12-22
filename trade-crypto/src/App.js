import React, { Component } from 'react';
import Form from './Components/Form'
import Display from './Components/Display'
import { Route } from 'react-router-dom';
import './App.css';
import { connect } from 'react-redux';
import { updateState, updateInputs, fetchPrice, updateBalance } from './actions';


class App extends Component {

  componentDidMount() {
    this.props.fetchPrice()
  }

  handleOnSubmit = ({price, base, quote, total, totalBaseBalance, totalQuoteBalance}, {pair, orderType, transactionType, base: baseLabel, quote: quoteLabel}) => {
    let toCryptoValue = this.toCryptoValue;

    if((price === 'undefined' || base === 'undefined' || quote === 'undefined') || totalQuoteBalance === '' || totalBaseBalance === '') {

      console.log('error')
      // set state to message to indicate didn't update or was an error;

    } else {

      if(pair === 'BTC-USD') {

        if(orderType === 'BUY') {

          this.props.updateBalance({
            orderType: 'BTC-USD',
            orderType: 'BUY',
            transactionType: 'DEPOSIT',
            quoteLabel: 'USD',
            baseLabel: 'BTC',
            depositQuote: this.props.balance.deposit['USD'] + quote,
            depositBase: this.props.balance.deposit['BTC'] + toCryptoValue(total),
            capitalQuote: this.props.balance.capital['USD'] + quote,
            capitalBase: this.props.balance.capital['BTC'] + toCryptoValue(total),
          });

        } else if(orderType === 'SELL' && this.props.balance.holding['BTC'] >=toCryptoValue(total)) { 

          this.props.updateBalance({
            orderType: 'BTC-USD',
            orderType: 'SELL',
            transactionType: 'WIDTHDRAW',
            quoteLabel: 'USD',
            baseLabel: 'BTC',
            holdingBase: this.props.balance.holding['BTC'] - toCryptoValue(total),
          });
        }

      }else if(pair !== 'BTC-USD') {

        if(orderType === 'BUY' && (this.props.balance.capital[quoteLabel] >= toCryptoValue(total) || this.props.balance.holding[quoteLabel] >= toCryptoValue(total)) ) { 

          console.log('in here testing', this.props.balance.holding[baseLabel] + toCryptoValue(base))

          this.props.updateBalance({
            orderType: pair,
            orderType: 'BUY',
            transactionType: 'TRADE',
            quoteLabel,
            baseLabel,
            holdingQuote: this.props.balance.holding[quoteLabel] - toCryptoValue(total),
            holdingBase: this.props.balance.holding[baseLabel] + toCryptoValue(base),
          });  

        } else if(orderType === 'SELL' &&  this.props.balance.holding[baseLabel] >= toCryptoValue(base)) {  

          this.props.updateBalance({
            orderType: pair,
            orderType: 'SELL',
            transactionType: 'TRADE',
            quoteLabel,
            baseLabel,
            holdingBase: this.props.balance.holding[baseLabel] - toCryptoValue(base),
            holdingQuote: this.props.balance.holding[quoteLabel] + toCryptoValue(total),
          }); 

        }
      }

      // this.props.updateState({
      //   type: pair,
      //   price:  this.toCryptoValue(price),
      //   base: this.toCryptoValue(base),
      //   quote: this.toCryptoValue(quote),
      //   totalQuoteBalance: this.toCryptoValue(totalQuoteBalance),
      //   totalBaseBalance: this.toCryptoValue(totalBaseBalance),
      // })

    }
    

    this.props.updateInputs({
      price: '',
      base: '',
      quote: '',
      fee: '',
      total: '',
      totalQuoteBalance: '',
      totalBaseBalance: '',
      orderType: '',
      transferType: '',
      pair: '',
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

        <Route path='/trade' render={ props => {
          return (
            <Form 
              {...props}
              handleOnSubmit = {this.handleOnSubmit}
              toCryptoString = {this.toCryptoString}
              toCryptoValue = {this.toCryptoValue}
              toDollarString = {this.usdString}
            />
          )
        }} />

        <Display
          btcPrice = {this.usdString(this.props.btc)}
          dogePrice = {this.toCryptoString(this.props.doge)}
        />

        {/* {this.props.doge && <h1>Price: {this.toCryptoString(this.props.doge)} BTC</h1>}
        <h1>Quauntity: {this.toCryptoString(this.props.base)} DOGE</h1>
        <h1>Amount: {this.toCryptoString(this.props.quote)} BTC</h1>
        {this.props.btc && <h1>BTC Price: {this.usdString(this.props.btc)} </h1>} */}

      </div>
    );
  }
}

const mapStatetoProps = state => {
  return {
    price : state.price,
    balance: state.balance,
    base: state.base.DOGE, // not needed just for testing
    quote: state.quote.BTC, // not needed just for testing
    doge: state.price.DOGE, // will not need later on
    btc: state.price.BTC,   // will not need later on
  }
}

export default connect(mapStatetoProps, {
  updateState,
  updateInputs,
  fetchPrice,
  updateBalance,
})(App);