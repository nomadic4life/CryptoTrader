import React, { Component } from 'react';
import Form from './Components/Form'
import './App.css';
import { connect } from 'react-redux';
import { updateState, updateInputs, fetchPrice } from './actions'


class App extends Component {

  state = {
    btc: '',
  }

  componentDidMount() {
    this.props.fetchPrice()
    // axios
    //   .get('https://api.pro.coinbase.com/products/BTC-USD/ticker')
    //   .then( response => this.setState({btc: Number(response.data.price)}))
    //   .catch( err => console.log(err))
  }

  handleOnSubmit = ({price, quantity, amount, balance, qBalance}, tradeType) => {
    const crypto = [price, quantity, amount];  
    console.log(price, quantity, amount)
    
    this.props.updateState({
      type: tradeType.pair,
      price:  this.toCryptoValue(price),
      quantity: this.toCryptoValue(quantity),
      amount: this.toCryptoValue(amount),
      btcBalance: this.toCryptoValue(balance),
      quantityBalance: this.toCryptoValue(qBalance),
    })

    this.props.updateInputs({
      price: '',
      quantity: '',
      amount: '',
      fee: '',
      total: '',
      balance: '',
      qBalance: '',
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

  usdValue = num => {

  }

  usdString = num => {
    num = num.toString()
    return num.includes('.') ? `$ ${num.split('.')[1].length === 2 ? num : `${num}0`}` : `$ ${num}.00`;
  }

  render() {

    console.log(this.state.btc)

    return (
      <div className="App">

        <Form 
          handleOnSubmit = {this.handleOnSubmit}
          toCryptoString = {this.toCryptoString}
        />

        <h1>Price: {this.toCryptoString(this.props.price)} BTC</h1>
        <h1>Quauntity: {this.toCryptoString(this.props.quantity)} DOGE</h1>
        <h1>Amount: {this.toCryptoString(this.props.amount)} BTC</h1>
        {this.props.btc && <h1>BTC Price: {this.usdString(this.props.btc)} </h1>}

      </div>
    );
  }
}

const mapStatetoProps = state => {
  return {
    price : state.price.dogePrice,
    quantity: state.quantity.dogeQuantity,
    amount: state.amount.btcAmount,
    btc: state.price.btcPrice,
  }
}

export default connect(mapStatetoProps, {
  updateState,
  updateInputs,
  fetchPrice,
})(App);