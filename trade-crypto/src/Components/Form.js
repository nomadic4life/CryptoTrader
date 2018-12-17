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

  handleOnChange = e => {

    let alpha = 'abcdefghifklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXZY ;"`~!@#%^&*()_+=-[]{}\\|\'/,';
    for(let char in alpha) {
      if(e.target.value.includes(alpha[char])) return;
    }

    function cryptoValue(num) {
      return Math.round(Number(num) * Math.pow(10,8));
    }

    let a,b,c;
    a = cryptoValue(this.props.price) || 0;
    b = cryptoValue(this.props.quantity) || 0;
    c = cryptoValue(this.props.amount) || 0;

    if(e.target.name === 'price') {

      a = cryptoValue(e.target.value); 
      c = Math.round(Math.round(a * b) / Math.pow(10,8));  
    } else if(e.target.name === 'quantity') {

      b = cryptoValue(e.target.value);
      c = Math.round(Math.round(a * b) / Math.pow(10,8));
    } else if(e.target.name === 'amount') {

      c = cryptoValue(e.target.value);
      b = Math.round(1/a * c * Math.pow(10,8));
    }

    let total = Math.round(this.props.feeRate * c + c);

    this.props.updateInputs({
      price: cryptoFormat(a),
      quantity: cryptoFormat(b),
      amount: cryptoFormat(c),
      fee: cryptoFormat(this.props.feeRate * c),
      total: cryptoFormat(total),
      balance: cryptoFormat(this.props.btcBalance - total),
      qBalance: cryptoFormat(this.props.dogeBalance + b),
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

        <div className='balance'>
        
          <label> USD balance: </label>
          <input
            name = {'usdBalance'}
            value = { 'currently no state'}
            placeholder = {'$0.00'}
            type = "text"
            readOnly
          />

          <label> BTC balance: </label>
          <input
            name = {'btcBalance'}
            value = { this.props.calculatedBalance || this.props.toCryptoString(this.props.btcBalance) }
            placeholder = {'0.00000000'}
            type = "text"
            readOnly
          />

          <label> DOGE Balance: </label>
          <input
            name = {'dogeBalance'}
            value = { this.props.qBalance || this.props.toCryptoString(this.props.dogeBalance)}
            placeholder = {'0.00000000'}
            type = "text"
            readOnly
          />

        </div>

        {this.props.tradeType.map( type => {

          return (
            <Route key = {type.id} path = {`/trade/${type.pair}`} render = { props => {

              return (
                <TradeComponent 
                  {...props}
                  {...this.props}
                  label = {{
                    price: type.quantity,
                    amount: type.amount,
                    quantity: type.quantity,
                    total: type.amount,
                  }}
                  tradeType = {{
                    pair: type.pair,
                    amount: type.amount,
                    quantity: type.quantity,
                  }}
                  handleOnChange = {this.handleOnChange}
                />
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
    price: state.inputs.price,
    amount: state.inputs.amount,
    quantity: state.inputs.quantity,
    qBalance: state.inputs.qBalance,
    btcBalance: state.balance.btcBalance,
    dogeBalance: state.balance.dogeBalance,
    calculatedBalance: state.inputs.balance,
    dogeBalance: state.balance.dogeBalance,
    usdBalance: state.balance.usdBalance,
    feeRate: state.fee.buyDOGE,
    fee: state.inputs.fee,
    total: state.inputs.total,
    input: state.inputs,
    tradeType: state.tradingPairs
  })
}

export default connect(mapStateToProps,{updateInputs})(Form);

//  if only a '.' neec check for that condition and return 0.00000000
//  if interger is to big  return the largest interger number or maybe null to prevent errors or floating points