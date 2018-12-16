import React from 'react';
import styled from 'styled-components'

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
    let d = this.state.btcPrice;
    a = cryptoValue(this.state.dogePrice);
    b = cryptoValue(this.state.dogeQuantity);
    c = cryptoValue(this.state.btcAmount); 

    if(e.target.name === 'dogePrice') {
      a = cryptoValue(e.target.value); 
      b = cryptoValue(this.state.dogeQuantity); 
      c = Math.round(Math.round(a * b) / Math.pow(10,8));  

    } else if(e.target.name === 'dogeQuantity') {
      a = cryptoValue(this.state.dogePrice);
      b = cryptoValue(e.target.value);
      c = Math.round(Math.round(a * b) / Math.pow(10,8));

    } else if(e.target.name === 'btcAmount') {
      a = cryptoValue(this.state.dogePrice);
      c = cryptoValue(e.target.value);
      b = Math.round(1/a * c * Math.pow(10,8));

    } else if(e.target.name === 'btcPrice'){
     
      d = e.target.value;
    } else if(e.target.name === 'usdAmount') {

    } else if(e.target.name === 'btcQuantity') {

    }

    let total = Math.round(this.state.feeRate * c + c);

    console.log( total, cryptoValue(this.state.btcBalance) - total);

    this.setState({
      dogePrice: cryptoFormat(a),
      dogeQuantity: cryptoFormat(b),
      btcAmount: cryptoFormat(c),
      fee: cryptoFormat(this.state.feeRate * c),
      total: cryptoFormat(total),
      btcNewBalance: cryptoFormat(cryptoValue(this.state.btcBalance) - total),

      btcPrice: d,
      [e.target.name]: e.target.value,
    })

    function cryptoFormat(num) {

      if(typeof num !== 'number') return `${num} is not a number`;
    
      let value;
      num = Math.round(num);
    
      if(num >= 0) {
    
        num = num.toString();
    
        value = num.length < 8 
          ? '0.' + '0'.repeat(8 - num.length) + num 
          : `${num.slice(0,-8)}.${num.slice(-8)}`;
    
      } else {
    
        num = Math.abs(num).toString();
        
        value = num.length < 8 
          ? '-0.' + '0'.repeat(8 - num.length) + num 
          : `-${num.slice(0,-8)}.${num.slice(-8)}`;
      }
    
      return value;

    } // cryptoFormat(num)

  } // handleOnChange(e)

  render() {

    return (
      <FormContent>

        <h1>is working in Form.js</h1>

        <form 
          autoComplete="off"
          onSubmit = { e => {
          e.preventDefault();
          this.props.handleOnSubmit(this.state);
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
              value = { this.state.btcNewBalance || this.state.btcBalance}
              placeholder = {'0.00000001'}
              type = "text"
              readOnly
            />

            <label> DOGE Balance: </label>
            <input
              name = {'dogeBalance'}
              value = { this.state.dogeNewBalance || this.state.dogeBalance}
              placeholder = {'0.00000001'}
              type = "text"
              readOnly
            />

            <button type = {'submit'}>submit</button>
          </div>

          <div className='doge-btc'>

            <label> DOGE Price: </label>
            <input
              name = {'dogePrice'}
              value = {this.state.dogePrice}
              placeholder = {'0.00000001'}
              type = "text"
              onChange = {this.handleOnChange}
            />

            <label> BTC Amount: </label>
            <input
              name = {'btcAmount'}
              value = {this.state.btcAmount}
              placeholder = {'0.00000001'}
              type = "text"
              onChange = {this.handleOnChange}
            />

            <label> DOGE Quantity: </label>
            <input
              name = {'dogeQuantity'}
              value = {this.state.dogeQuantity}
              placeholder = {'0.00000001'}
              type = "text"
              onChange = {this.handleOnChange}
            />

            <label> Fee Total: </label>
            <input
              name = {'fee'}
              value = {this.state.fee}
              placeholder = {'0.00000001'}
              type = "text"
              readOnly
            />

            <label> BTC Total: </label>
            <input
              name = {'total'}
              value = {this.state.total}
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

export default Form;