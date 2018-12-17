import React from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { updateInputs } from '../actions'

const FormContent = styled.div`
  border: 1px solid red;
  display: flex;
  flex-direction: column;

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

  state = {
    btcBalance: '0.10000000',
    btcNewBalance: '',
    dogePrice: '',
    dogeQuantity: '0.00000000',
    btcAmount: '0.00000000',
    fee: '',
    feeRate: 0.002,
    total: '',

    btcPrice: '',
    usdAmount: '',
    btcQuantity: ''
  }

  handleOnChange = e => {

    let alpha = 'abcdefghifklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXZY ;"`~!@#%^&*()_+=-[]{}\\|\'/,';
    for(let char in alpha) {
      if(e.target.value.includes(alpha[char])) return;
    }

    function cryptoValue(num) {
      return Math.round(Number(num) * Math.pow(10,8));
    }


    let a,b,c;
    let d = this.props.btcPrice;
    a = cryptoValue(this.props.price) || 0;
    b = cryptoValue(this.props.quantity) || 0;
    c = cryptoValue(this.props.amount) || 0;
    // e = cryptoValue(this.props.qBalance) || 0;  
    console.log(e.target.value, a)

    if(e.target.name === 'price') {
      a = cryptoValue(e.target.value); 
      c = Math.round(Math.round(a * b) / Math.pow(10,8));  

    } else if(e.target.name === 'quantity') {
      b = cryptoValue(e.target.value);
      c = Math.round(Math.round(a * b) / Math.pow(10,8));

    } else if(e.target.name === 'amount') {
      c = cryptoValue(e.target.value);
      b = Math.round(1/a * c * Math.pow(10,8));

    } else if(e.target.name === 'btcPrice'){
     
      d = e.target.value;
    } else if(e.target.name === 'usdAmount') {

    } else if(e.target.name === 'btcQuantity') {

    }

    let total = Math.round(this.props.feeRate * c + c);

    console.log( total, cryptoFormat(this.props.btcBalance - total));

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

    console.log(this.props.dogeBalance, this.props.qBalance, b, 'cheching balance')


    // this.setState({
    //   dogePrice: cryptoFormat(a),
    //   dogeQuantity: cryptoFormat(b),
    //   btcAmount: cryptoFormat(c),
    //   fee: cryptoFormat(this.state.feeRate * c),
    //   total: cryptoFormat(total),
    //   btcNewBalance: cryptoFormat(cryptoValue(this.state.btcBalance) - total),

    //   btcPrice: d,
    //   [e.target.name]: e.target.value,
    // })

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

    console.log(this.props,'here')

    return (
      <FormContent>

        <h1>is working in Form.js</h1>

        <form 
          autoComplete="off"
          onSubmit = { e => {
          e.preventDefault();
          this.props.handleOnSubmit(this.props.input);
        } }>

          <div className='balance'>
            <label> USD balance: </label>
            <input
              name = {'btcBalance'}
              value = { this.state.usdNewBalance || this.state.usdBalance}
              placeholder = {'$0.00'}
              type = "text"
              readOnly
            />

            <label> BTC balance: </label>
            <input
              name = {'btcBalance'}
              value = { this.props.calculatedBalance || this.props.toCryptoString(this.props.btcBalance) }
              placeholder = {'0.00000001'}
              type = "text"
              readOnly
            />

            <label> DOGE Balance: </label>
            <input
              name = {'dogeBalance'}
              value = { this.props.qBalance || this.props.toCryptoString(this.props.dogeBalance)}
              placeholder = {'0.00000001'}
              type = "text"
              readOnly
            />

            <button type = {'submit'}>submit</button>
          </div>

          <div className='doge-btc'>

            <label> DOGE Price: </label>
            <input
              name = {'price'}
              value = {this.props.price}
              placeholder = {'0.00000000'}
              type = "text"
              onChange = {this.handleOnChange}
            />

            <label> BTC Amount: </label>
            <input
              name = {'amount'}
              value = {this.props.amount}
              placeholder = {'0.00000000'}
              type = "text"
              onChange = {this.handleOnChange}
            />

            <label> DOGE Quantity: </label>
            <input
              name = {'quantity'}
              value = {this.props.quantity}
              placeholder = {'0.00000000'}
              type = "text"
              onChange = {this.handleOnChange}
            />

            <label> Fee Total: </label>
            <input
              name = {'fee'}
              value = {this.props.fee}
              placeholder = {'0.00000001'}
              type = "text"
              readOnly
            />

            <label> BTC Total: </label>
            <input
              name = {'total'}
              value = {this.props.total}
              placeholder = {'0.00000001'}
              type = "text"
              readOnly
            />

          </div>
          
          <div className='btc-usd'>

            <label> BTC Price: </label>
            <input
              name = {'btcPrice'}
              value = {this.state.btcPrice}
              placeholder = {'$0.00'}
              type = "text" 
              onChange = {this.handleOnChange}
            />

            <label> USD Amount: </label>
            <input
              name = {'usdAmount'}
              value = {this.state.usdAmount}
              placeholder = {'$0.00'}
              type = "text"
              onChange = {this.handleOnChange}
            />

            <label> BTC Quantity: </label>
            <input
              name = {'btcQuantity'}
              value = {this.state.btcQuantity}
              placeholder = {'0.00000000'}
              type = "text"
              onChange = {this.handleOnChange}
            />

            <label> Fee USD Total: </label>
            <input
              name = {'usdFee'}
              value = {this.state.usdFee}
              placeholder = {'$0.00'}
              type = "text"
              readOnly
            />

            <label> USD Total: </label>
            <input
              name = {'usdTotal'}
              value = {this.state.usdTotal}
              placeholder = {'$0.00'}
              type = "text"
              readOnly
            />

          </div>

        </form>

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
  })
}

export default connect(mapStateToProps,{updateInputs})(Form);

//  if only a '.' neec check for that condition and return 0.00000000
//  if interger is to big  return the largest interger number or maybe null to prevent errors or floating points