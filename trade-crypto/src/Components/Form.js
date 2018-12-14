import React from 'react';

class Form extends React.Component {

  state = {
    dogePrice: '',
    dogeAmount: '0.00000000',
    btcSum: '0.00000000',

  }

  handleOnChange = e => {

    let a,b,c;

    if(e.target.name === 'dogePrice') {
      a = Math.round(Number(e.target.value) * Math.pow(10,8)); 
      b = Math.round(Number(this.state.dogeAmount) * Math.pow(10,8)); 
      c = Math.round(Math.round(a * b) / Math.pow(10,8));
      console.log(c)
    } else if(e.target.name === 'dogeAmount') {
      a = Math.round(Number(this.state.dogePrice) * Math.pow(10,8));
      b = Math.round(Number(e.target.value) * Math.pow(10,8));
      c = Math.round(Math.round(a * b) / Math.pow(10,8));
      console.log(c / Math.pow(10,8), a * b, 'c')
    } else if(e.target.name === 'btcSum') {
      a = Math.round(Number(this.state.dogePrice) * Math.pow(10,8));
      c = Math.round(Number(e.target.value) * Math.pow(10,8));
      b = Math.round(1/a * c * Math.pow(10,8));
    }

    this.setState({
      dogePrice: cryptoFormat(a),
      dogeAmount: cryptoFormat(b),
      btcSum: cryptoFormat(c),
    })

    console.log(Number(e.target.value) * Math.pow(10,8))

    this.setState({
      [e.target.name]: e.target.value
    })

    function cryptoFormat(num) {
        

      if(num < 0) {
        num = Math.abs(num)
        num = num.toString();
        return num.length <= 8 
          ? '-0.' + '0'.repeat(8 - num.length) + num
          : `${num.slice(0,-8)}.${num.slice(-8)}`;
      }

      num = num.toString();
      return num.length <= 8 
        ? '0.' + '0'.repeat(8 - num.length) + num 
        : `${num.slice(0,-8)}.${num.slice(-8)}`;
    }
  }

  render() {

    return (
      <div>

        <h1>is working in Form.js</h1>

        <form onSubmit = { e => {
          e.preventDefault();
          this.props.handleOnSubmit(this.state);
        } }>

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

          <button type = {'submit'}>submit</button>

        </form>
      </div>
    ) 
  }
}

export default Form;