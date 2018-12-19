import React from 'react';
import styled from 'styled-components';
import TradeComponent from './TradeComponent';
import { Route } from 'react-router-dom';
import { connect } from 'react-redux';
import { updateInputs } from '../actions'
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

  handleOnChange = (e, type) => {

    let alpha = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXZY ;:<>?`~!@#%^&*()_+=-[]{}\\|\'/,';
    for(let char in alpha) {
      if(e.target.value.includes(alpha[char])) return;
    }

    // creating constraints for inputs
    // limits decimal input to 8 digits
    if(e.target.value.includes('.')) {
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

    if(e.target.name === 'price') {

      a = toCryptoValue(inputValue); 
      c = Math.round(Math.round(a * b) / Math.pow(10,8));
      c = c > 123456789123456789 ? undefined : c;  
    } else if(e.target.name === 'base') {

      b = toCryptoValue(inputValue);
      c = Math.round(Math.round(a * b) / Math.pow(10,8));
      c = c > 123456789123456789 ? undefined : c; 
    } else if(e.target.name === 'quote') {

      c = toCryptoValue(inputValue);
      b = Math.round(1/a * c * Math.pow(10,8));
      b = b > 123456789123456789 ? undefined : b; 
    }

    fee = this.props.feeRate * c;
    base = type.base;
    quote = type.quote;

    if(type.isSelling){
      total = Math.round( c - fee );
      totalQuote = this.props.balance[quote] + Math.round( c - fee );
      totalBase = this.props.balance[base] - b;
    } else {
      total = Math.round( c + fee );
      totalQuote = this.props.balance[quote] - Math.round( c + fee ) || this.props.balance[quote];
      totalBase = this.props.balance[base] + b || this.props.balance[base];
    }

    console.log(this.props.balance[base], this.props.balance[quote])

    this.props.updateInputs({
      price: toCryptoString(a),
      base: toCryptoString(b),
      quote: toCryptoString(c),
      fee: toCryptoString(fee),
      total: toCryptoString(total),
      totalQuoteBalance: toCryptoString(totalQuote), //
      totalBaseBalance: toCryptoString(totalBase), //
      [e.target.name]: e.target.value,
    })

  } // handleOnChange(e)

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
                      total: type.quote,
                    }}
                    tradeType = {{
                      pair: type.pair,
                      quote: type.quote,
                      base: type.base,
                      isSelling: type.isSelling,
                    }}
                    handleOnChange = { e => this.handleOnChange( e, type)}
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
    input: state.inputs,

    price: state.inputs.price,
    quote: state.inputs.quote,
    base: state.inputs.base,

    fee: state.inputs.fee,
    total: state.inputs.total,
    totalQuoteBalance: state.inputs.totalQuoteBalance,
    totalBaseBalance: state.inputs.totalBaseBalance,

    balance: state.balance.holding,

    feeRate: state.fee.cryptopiaFee,
    tradeType: state.tradingPairs,
  })
}

export default connect(mapStateToProps,{updateInputs})(Form);