import React from 'react';
import styled from 'styled-components'

const FormContent = styled.div`
  border: 1px solid red;
  display: flex;
  flex-direction: column;

  form {
    border: 1px solid green;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    font-size: 20px;
  }

  input {
    text-align: right;
    margin-bottom: 20px;
  }
`;


class Form extends React.Component {

  state = {
    btcBalance: '0.10000000',
    btcNewBalance: '',
    dogePrice: '',
    dogeAmount: '0.00000000',
    btcSum: '0.00000000',
    fee: '',
    feeRate: 0.002,
    total: '',

    btcPrice: '',
    usdAmount: '',
    btcQuantity: ''
  }

  handleOnChange = e => {

    function cryptoValue(num) {
      return Math.round(Number(num) * Math.pow(10,8));
    }

    let a,b,c;
    let d = this.state.btcPrice;
    a = cryptoValue(this.state.dogePrice);
    b = cryptoValue(this.state.dogeAmount);
    c = cryptoValue(this.state.btcSum); 

    if(e.target.name === 'dogePrice') {
      a = cryptoValue(e.target.value); 
      b = cryptoValue(this.state.dogeAmount); 
      c = Math.round(Math.round(a * b) / Math.pow(10,8));  

    } else if(e.target.name === 'dogeAmount') {
      a = cryptoValue(this.state.dogePrice);
      b = cryptoValue(e.target.value);
      c = Math.round(Math.round(a * b) / Math.pow(10,8));

    } else if(e.target.name === 'btcSum') {
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



    //console.log(e.target.name === 'btcPrice' ? ` $${e.target.value}`: e.target.value,)

    this.setState({
      dogePrice: cryptoFormat(a),
      dogeAmount: cryptoFormat(b),
      btcSum: cryptoFormat(c),
      fee: cryptoFormat(this.state.feeRate * c),
      total: cryptoFormat(total),
      btcNewBalance: cryptoFormat(cryptoValue(this.state.btcBalance) - total),
      
      btcPrice: d,
      [e.target.name]: e.target.value,
    })

    function cryptoFormat(num) {
        

      if(num < 0) {

        num = Math.abs(num)
        num = num.toString();
        return num.length <= 8 
          ? '-0.' + '0'.repeat(8 - num.length) + num
          : `-${num.slice(0,-8)}.${num.slice(-8)}`;

      } else {

        num = num.toString();
        return num.length <= 8 
          ? '0.' + '0'.repeat(8 - num.length) + num 
          : `${num.slice(0,-8)}.${num.slice(-8)}`;

      }

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

           <label> BTC balance: </label>
          <input
            name = {'btcBalance'}
            value = { this.state.btcNewBalance || this.state.btcBalance}
            placeholder = {'0.00000001'}
            type = "text"
            readOnly
          />

          <label> DOGE Price: </label>
          <input
            name = {'dogePrice'}
            value = {this.state.dogePrice}
            placeholder = {'0.00000001'}
            type = "text"
            onChange = {this.handleOnChange}
          />

          <label> DOGE Amount: </label>
          <input
            name = {'dogeAmount'}
            value = {this.state.dogeAmount}
            placeholder = {'0.00000001'}
            type = "text"
            onChange = {this.handleOnChange}
          />

          <label> BTC Total: </label>
          <input
            name = {'btcSum'}
            value = {this.state.btcSum}
            placeholder = {'0.00000001'}
            type = "text"
            onChange = {this.handleOnChange}
          />

          <label> Fee: </label>
          <input
            name = {'fee'}
            value = {this.state.fee}
            placeholder = {'0.00000001'}
            type = "text"
            readOnly
          />

          <label> Total: </label>
          <input
            name = {'total'}
            value = {this.state.total}
            placeholder = {'0.00000001'}
            type = "text"
            readOnly
          />

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

          <button type = {'submit'}>submit</button>

        </form>

      </FormContent>
    ) 
  }
}

export default Form;