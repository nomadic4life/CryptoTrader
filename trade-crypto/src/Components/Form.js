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
    // considering to refactor
    console.log('did update', this.props.price, this.props.input.transactionType, this.props.location.pathname)

    let price = this.props.location.pathname.split('-')[0].split('/')[2].toUpperCase();

    if(this.props.location.pathname === '/trade/btc-usd' && this.props.input.transactionType === '' && this.props.price['BTC'] > 0) {
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
        transactionType: 'DEPOSIT',
        pair: 'BTC-USD', 
      })
    } else if(this.props.input.transactionType === '' && this.props.location.pathname !== '/trade/btc-usd') {
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
        transactionType: 'TRADE',
        pair: 'BTC-USD',
      })
    }

    

    // if(this.props.input.transactionType === '') {
    //   this.handleSelected(props.tradeType)
    // }
  }

  handleOnChange = (e, type) => {

    // initialize variables
    let a, b, c, total, totalQuote, totalBase, fee, {base, quote} = type , inputValue, feeRate, orderType,
    toCryptoValue = this.props.toCryptoValue,
    toCryptoString = this.props.toCryptoString,
    alphabet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXZY ;:<>?`~!@#%^&*()_+=-[]{}\\|\'/,';

    // varify input is a number
    // input is not read if not a number
    for(let char in alphabet) {
      if(e.target.value.includes(alphabet[char])) return;
    };

    // varify input is within specified size
    if( e.target.value.includes('.') && e.target.value !== '' ) {

      let demiDigit = e.target.value.split('.')[1],
      numDigit = e.target.value.split('.')[0];
      
      // constraint input to 8 digits after decimal
      if(demiDigit.length > 8) return;

      // constraint input to 8 digits before dcimal
      if(numDigit.length > 8) return;

    } else if( e.target.value !== '' ) {

      let numDigit = e.target.value;

      // constraint input to 8 digits before dcimal
      if(numDigit.length > 8) return;
    };

    // inputs varified intiate varible values


    // varify pair
    if( type.pair === '') return;

    // deposit or widthdraw bitcoin
    else if( type.pair === 'BTC-USD' ) {

      // initiate values
        // USD value
      a = this.props.input.price || 0;

        // BTC value
      b = toCryptoValue(this.props.base) || 0;

        // USD value
      c = this.props.quote || 0;

        // USD or BTC value
      inputValue = e.target.value === '.' 
      ? type.quote === 'USD' ? 0.00 : '0.00000000' : e.target.value;

      // calculate quoteAmount and baseAmount
      if(e.target.name === 'price') {

        // user input to usd value
        a = inputValue; 

        // calculate base amount usd value
        c = Math.round(Math.round(a * b) / Math.pow(10,6)) / Math.pow(10,2);

        // undefined if base amount to large
        c = c > 123456789123456789 ? undefined : c;  
      } else if(e.target.name === 'base') {

        // user input to crypto value
        b = toCryptoValue(inputValue);

        // calculate base ammount usd value
        c = Math.round(Math.round(a * b) / Math.pow(10,6)) / Math.pow(10,2);

        // undefined if base amount to large
        c = c > 123456789123456789 ? undefined : c; 
      } else if(e.target.name === 'quote') {

        // user input to usd value
        c = inputValue;

        // calculate quote amount crypto value
        b = Math.round(1/a * c * Math.pow(10,8));

        // undefined if quote amount to large
        b = b > 123456789123456789 ? undefined : b; 
      }

      // calculate fee Amount btc value
      feeRate = this.props.feeRate['cryptopiaFee'];
      fee = feeRate * b;
      
      // buy bitcoin // not sure if this is correct
      if( type.transactionType === 'DEPOSIT') {

        // add to balance.deposit and add to balance.capital
        total = Math.round( b - fee );

        // add to usd balance.deposit
        totalBase = c;


      // sell bitcoin // not sure if this is correct
      } else if( type.transactionType === 'WIDTHDRAW') {

        // subtract from btc balance.holding
        total = Math.round( b + fee );

      } else {
        return;
      }

      // assigning correct format and usd format on price and quote
      a = a;
      b = toCryptoString(b);
      c = c;
      fee = toCryptoString(fee);
      total = toCryptoString(total);
      totalQuote = c;
      totalBase = toCryptoString(total); // might be empty string and total will be used  to apply to to btc holding and deposit
      orderType = type.transactionType === 'DEPOSIT' ? 'BUY' : 'SELL';

    } else if( type .pair !== 'BTC-USD' ) {

      // initiate values
        // crypto value
      a = toCryptoValue(this.props.input.price) || 0;

        // crypto value
      b = toCryptoValue(this.props.base) || 0;

        // crypto value
      c = toCryptoValue(this.props.quote) || 0;

        // crypto value
      inputValue = e.target.value === '.' ? '0.00000000' : e.target.value;

      
      // varify to trade only 
      if( type.transactionType === 'TRADE' ) {

        // calculate quoteAmount and baseAmount
        if(e.target.name === 'price') {
  
          // user input to crypto value
          a = toCryptoValue(inputValue); 
  
          // calculate base crypto value
          c = Math.round(Math.round(a * b) / Math.pow(10,8));
  
          // undefined if base amount to large
          c = c > 123456789123456789 ? undefined : c;  
        } else if(e.target.name === 'base') {
  
          // user input to crypto value
          b = toCryptoValue(inputValue);
          
          // calculate base crypto value
          c = Math.round(Math.round(a * b) / Math.pow(10,8));
  
          // undefined if base amount to large
          c = c > 123456789123456789 ? undefined : c; 
        } else if(e.target.name === 'quote') {
  
          // user input to crypto value
          c = toCryptoValue(inputValue);
          
          // calculate quote crypto value
          b = Math.round(1/a * c * Math.pow(10,8));
  
          // undefined if quote amount to large
          b = b > 123456789123456789 ? undefined : b; 
        }
  
        // calculate fee Amount crypto value
        feeRate = this.props.feeRate['cryptopiaFee'];
        fee = feeRate * c;

        // buy crypto asset // calculate total, quote balance, and base balance
        if( type.orderType === 'BUY' ) {

          // applied fee total of base
          total = Math.round( c + fee );

          // subtracted preview of balance.holding quote
          totalQuote = this.props.balance[quote] - total || this.props.balance[quote];

          // added preview of balance.holding base
          totalBase = this.props.balance[base] + b || this.props.balance[base];

        // sell crypto asset
        } else if( type.orderType === 'SELL') {

          // applied fee total of base
          total = Math.round( c - fee );

          // subtracted preview of balance.holding base
          totalBase = this.props.balance[base] - b;  
          
          // added preview of balance.holding quote
          totalQuote = this.props.balance[quote] + Math.round( c - fee );
        }

        // assigning correct format
        a = toCryptoString(a);
        b = toCryptoString(b);
        c = toCryptoString(c);
        fee = toCryptoString(fee);
        total = toCryptoString(total);
        totalQuote = toCryptoString(totalQuote);
        totalBase = toCryptoString(totalBase);
        orderType = type.orderType;

      } else {
        return;
      }

    }

    // update inputs
    this.props.updateInputs({
      price: a,
      base: b,
      quote: c,
      fee: fee,
      total: total,
      totalQuoteBalance: totalQuote,
      totalBaseBalance: totalBase,
      orderType: orderType,
      transactionType: type.transactionType,
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

  handletransactionType = (action, type) => {

    this.handleOnChange({target: { value: ''}}, {...type, transactionType: action});
  }

  handleSelected = ({orderType, transactionType, pair}) => {
    this.props.initiateInputs({
      orderType,
      transactionType,
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
                      transactionType: this.props.input.transactionType || (type.pair === 'BTC-USD' ? 'DEPOSIT' : 'TRADE'),
                    }}
                    handleOnChange = { this.handleOnChange }
                    handleOrderType = { this.handleOrderType }
                    handletransactionType = { this.handletransactionType }
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
    transactionType: state.inputs.transactionType,
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