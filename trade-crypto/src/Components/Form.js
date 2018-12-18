import React from 'react';
import styled from 'styled-components';
import TradeComponent from './TradeComponent';
import { Route } from 'react-router-dom';
import { connect } from 'react-redux';
import { updateInputs } from '../actions'

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

    function cryptoValue(num) {
      return Math.round(Number(num) * Math.pow(10,8));
    }

    let a,b,c;
    a = cryptoValue(this.props.price) || 0;
    b = cryptoValue(this.props.base) || 0;
    c = cryptoValue(this.props.quote) || 0;

    if(e.target.name === 'price') {

      a = cryptoValue(e.target.value); 
      c = Math.round(Math.round(a * b) / Math.pow(10,8));  
    } else if(e.target.name === 'base') {

      b = cryptoValue(e.target.value);
      c = Math.round(Math.round(a * b) / Math.pow(10,8));
    } else if(e.target.name === 'quote') {

      c = cryptoValue(e.target.value);
      b = Math.round(1/a * c * Math.pow(10,8));
    }

    let total = Math.round(this.props.feeRate * c + c);
    let fee = this.props.feeRate * c;
    let base = type.base;
    let quote = type.quote;

    this.props.updateInputs({
      price: cryptoFormat(a),
      base: cryptoFormat(b),
      quote: cryptoFormat(c),
      fee: cryptoFormat(fee),
      total: cryptoFormat(total),
      totalQuoteBalance: cryptoFormat(this.props.balance[quote] - total), //
      totalBaseBalance: cryptoFormat(this.props.balance[base] + b), //
      [e.target.name]: e.target.value,
    })

    function cryptoFormat(num) {

      if(typeof num !== 'number') return `${num} is not a number`;
    
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

    } // cryptoFormat(num)

  } // handleOnChange(e)

  render() {

    return (
      <FormContent>    

       

        {this.props.tradeType.map( type => {

          return (
            <Route key = {type.id} path = {`/trade/${type.pair}`} render = { props => {

              return (
                <React.Fragment>

                  <div className='balance'>
        
                    <label> USD balance: </label>
                    <input
                      name = {'usdBalance'}
                      value = { this.props.toDollarString(this.props.balance.USD) }
                      placeholder = {'$0.00'}
                      type = "text"
                      readOnly
                    />

                    <label> BTC balance: </label>
                    <input
                      name = {'btcBalance'}
                      value = { (type.quote === 'BTC' 
                        ? this.props.totalQuoteBalance
                        : this.props.totalBaseBalance) || this.props.toCryptoString(this.props.balance.BTC)}
                      placeholder = {'0.00000000'}
                      type = "text"
                      readOnly
                    />

                    <label> DOGE Balance: </label>
                    <input
                      name = {'dogeBalance'}
                      value = { (type.quote === 'DOGE' 
                      ? this.props.totalQuoteBalance
                      : this.props.totalBaseBalance) || 
                      this.props.toCryptoString(this.props.balance.DOGE)}
                      placeholder = {'0.00000000'}
                      type = "text"
                      readOnly
                    />

                  </div>

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

//  if only a '.' neec check for that condition and return 0.00000000
//  if interger is to big  return the largest interger number or maybe null to prevent errors or floating points