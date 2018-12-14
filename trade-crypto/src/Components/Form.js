import React from 'react';

class Form extends React.Component {

  state = {
    dogePrice: '0.00000000',
    dogeAmount: '0.00000000',
    btcSum: '0.00000000',

  }

  handleOnChange = e => {

    let a,b,c;

    if(e.target.name === 'dogePrice') {
      a = Number(e.target.value); 
      b = Number(this.state.dogeAmount); 
      c = a * b;
    } else if(e.target.name === 'dogeAmount') {
      a = Number(this.state.dogePrice);
      b = Number(e.target.value); 
      c = a * b;
    } else if(e.target.name === 'btcSum') {
      a = Number(this.state.dogePrice); 
      c = Number(e.target.value); 
      b = 1/a * c;
    }

    this.setState({
      dogePrice: a,
      dogeAmount: b,
      btcSum: c,
    })
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
            type = "number"
            onChange = {this.handleOnChange}
          />

          <label> DOGE Amount: </label>
          <input
            name = {'dogeAmount'}
            value = {this.state.dogeAmount}
            placeholder = {'0.00000001'}
            type = "number"
            onChange = {this.handleOnChange}
          />

          <label> BTC Total: </label>
          <input
            name = {'btcSum'}
            value = {this.state.btcSum}
            placeholder = {'0.00000001'}
            type = "number"
            onChange = {this.handleOnChange}
          />

          <button type = {'submit'}>submit</button>

        </form>
      </div>
    ) 
  }
}

export default Form;