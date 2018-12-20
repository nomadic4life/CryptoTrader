import React from 'react';
import styled from 'styled-components';
import TradeComponent from './TradeComponent';
import { Route } from 'react-router-dom';
import { connect } from 'react-redux';
import { updateInputs, initiateInputs } from '../actions'
import BalanceContainer from './BalanceContainer';

const FormContent = styled.div`
  border: 1px solid red;
  display: flex;
  // flex-direction: column;

  .balance {
    display: flex;
    flex-direction: column;
  }

  form {
    border: 1px solid green;
    display: flex;
    align-items: flex-start;
    font-size: 20px;

    div {
      display: flex;
      flex-direction: column;
      margin-left: 30px;
    }
  }

  label {
    text-align: left;
  }

  input {
    text-align: right;
    font-size: 18px;
    margin-bottom: 20px;
    padding: 5px;
  }
`;


class Form extends React.Component {

  componentDidUpdate() {
    console.log('did update', this.props.price, this.props.input.transferType, this.props.location.pathname)

    let price = this.props.location.pathname.split('-')[0].split('/')[2].toUpperCase();

    if(this.props.location.pathname === '/trade/btc-usd' && this.props.input.transferType === '' && this.props.price['BTC'] > 0) {
      console.log('yolo')
      this.props.updateInputs({
        price: this.props.price['BTC'],
        quote: '',
        base: '',
        fee: '',
        total: '',
        totalQuoteBalance: '',
        totalBaseBalance: '',
        orderType: 'BUY',
        transferType: 'DEPOSIT',
        pair: 'BTC-USD', 
      })
    } else if(this.props.input.transferType === '') {
      console.log(this.props.price[price], this.props.toCryptoString(this.props.price[price]), price)
      this.props.updateInputs({
        price: this.props.toCryptoString(this.props.price[price]),
        quote: '',
        base: '',
        fee: '',
        total: '',
        totalQuoteBalance: '',
        totalBaseBalance: '',
        orderType: 'BUY',
        transferType: 'TRADE',
        pair: 'BTC-USD',
      })
    }

    

    // if(this.props.input.transferType === '') {
    //   this.handleSelected(props.tradeType)
    // }
  }

  handleOnChange = (e, type) => {

    console.log(this.props.input.transferType)

    let alpha = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXZY ;:<>?`~!@#%^&*()_+=-[]{}\\|\'/,';
    for(let char in alpha) {
      if(e.target.value.includes(alpha[char])) return;
    }

    // creating constraints for inputs
    // limits decimal input to 8 digits
    if(e === '') console.log('here');
    else if(e.target.value.includes('.')) {
      let demiDigit = e.target.value.split('.')[1];
      let numDigit = e.target.value.split('.')[0];
      if(demiDigit.length > 8) return;
      if(numDigit.length > 8) return;
    } else {
      let numDigit = e.target.value;
      if(numDigit.length > 8) return;
    }

    let a,b,c;
    let inputValue = e.target.value === '.' ? '0.00000000' : e.target.value;
    let total, totalQuote, totalBase, fee, base, quote
    let toCryptoValue = this.props.toCryptoValue;
    let toCryptoString = this.props.toCryptoString;

    a = toCryptoValue(this.props.price) || 0;
    b = toCryptoValue(this.props.base) || 0;
    c = toCryptoValue(this.props.quote) || 0;

    if(type.pair === 'BTC-USD') {
      console.log('here', this.props.price['BTC'])
      a = this.props.price['BTC'];
      c = this.props.base;
    }

    if(e.target.name === 'price') {

      a = toCryptoValue(inputValue); 
      c = Math.round(Math.round(a * b) / Math.pow(10,8));
      c = c > 123456789123456789 ? undefined : c;  
    } else if(e.target.name === 'base') {

      b = toCryptoValue(inputValue);
      c = Math.round(Math.round(a * b) / Math.pow(10,8));
      c = c > 123456789123456789 ? undefined : c; 
    } else if(e.target.name === 'quote') {

      c = type.pair === 'BTC-USD' ? inputValue: toCryptoValue(inputValue);
      b = Math.round(1/a * c * Math.pow(10,8));
      b = b > 123456789123456789 ? undefined : b; 
    }
    let feeRate = this.props.feeRate['cryptopiaFee'];
    console.log(feeRate)
    fee = type.pair === 'BTC-USD' ? feeRate * b : feeRate * c;
    base = type.base;
    quote = type.quote;

    if(type.orderType === 'SELL' && type.pair !== 'BTC-USD'){
      total = Math.round( c - fee );
      totalQuote = this.props.balance[quote] + Math.round( c - fee );
      totalBase = this.props.balance[base] - b;
    } else if(type.pair !== 'BTC-USD') {
      total = Math.round( c + fee );
      totalQuote = this.props.balance[quote] - Math.round( c + fee ) || this.props.balance[quote];
      totalBase = this.props.balance[base] + b || this.props.balance[base];
    }

    console.log(type.orderType, type.pair)
    if(type.orderType === 'SELL' && type.pair === 'BTC-USD'){
      console.log('seeling here')
      total = Math.round( b + fee );
      totalQuote = this.props.balance[quote] + Math.round( b + fee );
      totalBase = this.props.balance[base] - c;
    } else if(type.pair === 'BTC-USD') {
      console.log('buying here')
      total = Math.round( b - fee );
      totalQuote = 0;
      totalBase = this.props.balance['BTC'] + total || this.props.balance['BTC'];
    }

    console.log(a,b,c)

    a = type.pair === 'BTC-USD' ? a : toCryptoString(a);
    b = toCryptoString(b);
    c = type.pair === 'BTC-USD' ? c : toCryptoString(c);
    fee = toCryptoString(fee);
    total = toCryptoString(total);
    totalQuote = toCryptoString(totalQuote);
    totalBase = toCryptoString(totalBase);

    this.props.updateInputs({
      price: a,
      base: b,
      quote: c,
      fee: fee,
      total: total,
      totalQuoteBalance: totalQuote,
      totalBaseBalance: totalBase,
      orderType: type.orderType,
      transferType: type.transferType,
      pair: type.pair,
      [e.target.name]: e.target.value,
    })

  } // handleOnChange(e)

  handleOrderType = (action, type) => {
    
    if(action === 'BUY') {
      action = 'SELL';
    } else if(action === 'SELL') {
      action = 'BUY';
    }

    this.handleOnChange({target: { value: ''}}, {...type, orderType: action})
  }

  handleTransferType = (action, type) => {

    this.handleOnChange({target: { value: ''}}, {...type, transferType: action});
  }

  handleSelected = ({orderType, transferType, pair}) => {
    this.props.initiateInputs({
      orderType,
      transferType,
      pair,
    })
  }

  render() {

    return (
      <FormContent>    

        {this.props.tradeType.map( type => {

          return (
            <Route key = {type.id} path = {`/trade/${type.pair}`} render = { props => {

              return (
                <React.Fragment>

                  <BalanceContainer
                      {...props}
                      {...this.props}
                      type = {type}
                  />
                  
                  <TradeComponent 
                    {...props}
                    {...this.props}
                    label = {{
                      price: type.base,
                      quote: type.quote,
                      base: type.base,
                      total: type.pair === 'BTC-USD' ? 'BTC':type.quote,
                    }}
                    tradeType = {{
                      pair: type.pair,
                      quote: type.quote,
                      base: type.base,
                      orderType: this.props.input.orderType || 'BUY',
                      transferType: this.props.input.transferType || (type.pair === 'BTC-USD' ? 'DEPOSIT' : 'TRADE'),
                    }}
                    handleOnChange = { this.handleOnChange }
                    handleOrderType = { this.handleOrderType }
                    handleTransferType = { this.handleTransferType }
                    handleSelected = { this.handleSelected }
                  />
                </React.Fragment>
              )
            }} />
          )
        })}

      </FormContent>
    ) 
  }
}

const mapStateToProps = state => {
  return ({

    // -- inputs -- //
    input: state.inputs, // not working atm

    price: state.inputs.price,
    quote: state.inputs.quote,
    base: state.inputs.base,

    fee: state.inputs.fee,
    total: state.inputs.total,
    totalQuoteBalance: state.inputs.totalQuoteBalance,
    totalBaseBalance: state.inputs.totalBaseBalance,
    orderType: state.inputs.orderType,
    transferType: state.inputs.transferType,
    pair: state.inputs.pair,
    // -- inputs -- //

    price: state.price,
    balance: state.balance.holding,

    feeRate: state.mensurativeComputation.feeRate,
    tradeType: state.tradingPairs,
  })
}

export default connect(mapStateToProps,{
  updateInputs,
  initiateInputs
})(Form);